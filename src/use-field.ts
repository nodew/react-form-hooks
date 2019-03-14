import {
    useContext,
    useEffect,
    // useState,
    useMemo,
    useReducer,
    useCallback
} from "react";
import get from "lodash/get";
import { FormContext } from "./context";
import { validate } from "./utils";
import {
    IFieldOption,
    IFieldProps,
    IValidateError,
    IValidateInnerFn
} from "./type";

type IFieldState = {
    value: any;
    isValid: boolean;
    isPristine: boolean;
    options: IFieldOption;
    validateError: IValidateError;
};

enum FieldAction {
    ON_FIELD_CHANGE,
    SET_VALIDATE_RESULT,
    CLEAR_VALIDATE_ERROR
}

type IAction = {
    type: FieldAction;
    payload?: any;
};

const initialFieldState: IFieldState = {
    value: undefined,
    isValid: true,
    isPristine: true,
    options: {},
    validateError: null
};

const reducers: React.Reducer<IFieldState, IAction> = (state, action) => {
    const { type, payload } = action;
    const { options } = state;
    switch (type) {
        case FieldAction.ON_FIELD_CHANGE: {
            const shouldClearError = !options.validateOnValueChange;
            if (shouldClearError) {
                state.isValid = true;
                state.validateError = null;
            }
            return {
                ...state,
                isPristine: false,
                value: payload
            };
        }

        case FieldAction.SET_VALIDATE_RESULT: {
            const { isValid, type, message } = payload;
            return {
                ...state,
                isValid,
                validateError: isValid
                    ? null
                    : {
                          type,
                          message
                      }
            };
        }

        case FieldAction.CLEAR_VALIDATE_ERROR: {
            return {
                ...state,
                isValid: true,
                validateError: null
            };
        }

        default:
            return state;
    }
};

const useFieldState = (
    initialState: IFieldState
): [IFieldState, React.Dispatch<IAction>] => {
    const [fieldState, dispatch] = useReducer(reducers, initialState);
    return [fieldState, dispatch];
};

export const useField = (
    name: string,
    initialValue: any,
    options: IFieldOption = {}
): [IFieldProps, (value: any) => void] => {
    const { setFieldValue, registerField } = useContext(FormContext);
    const [state, dispatch] = useFieldState({
        ...initialFieldState,
        value: initialValue,
        options
    });

    const clearValidateError = useCallback(() => {
        dispatch({
            type: FieldAction.CLEAR_VALIDATE_ERROR
        });
    }, []);

    const setValue = useCallback(
        (value: any) =>
            dispatch({
                type: FieldAction.ON_FIELD_CHANGE,
                payload: value
            }),
        []
    );

    const onChange = useCallback((value: any) => {
        setValue(value);
        setFieldValue(name, value);
        if (options.validateOnValueChange) {
            triggerValidate(value);
        }
    }, []);

    const triggerValidate: IValidateInnerFn = (nextVal = state.value) => {
        const [isValidField, errorType] = validate(options.rules)(nextVal);
        let errorMsg = "";
        if (isValidField) {
            clearValidateError();
        } else {
            errorMsg = get(options, ["validateErrors", errorType], "");
            dispatch({
                type: FieldAction.SET_VALIDATE_RESULT,
                payload: {
                    isValid: false,
                    type: errorType,
                    message: errorMsg
                }
            });
        }
        return [isValidField, errorType, errorMsg];
    };

    useEffect(() => {
        registerField(name, initialValue, setValue, triggerValidate);
    }, []);

    const fieldProps = useMemo(() => {
        return {
            ...state,
            validate: () => triggerValidate()
        };
    }, [state]);

    return [fieldProps, onChange];
};
