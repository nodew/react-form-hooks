import * as React from "react";
import { useReducer } from "react";
import { FormContext } from "./context";
import { IFormOption, IRegisterFieldFn, IValidateInnerFn } from "./type";

type IFormState = {
    values: {
        [prop: string]: any;
    };
    initialValues: {
        [prop: string]: any;
    };
    validateFns: {
        [prop: string]: IValidateInnerFn;
    };
};

const initialState: IFormState = {
    values: {},
    initialValues: {},
    validateFns: {}
};

enum FormAction {
    ADD_NEW_FIELD,
    UPDATE_FIELD_VALUE,
    SET_FIELDS_VALUE,
    RESET_FIELDS_VALUE
}

type IAction = {
    type: FormAction;
    payload?: any;
};

const handleAddNewField = (state: IFormState, payload: any) => {
    const { key, initialValue, validateFn } = payload;
    const { values, initialValues, validateFns } = state;
    values[key] = initialValue;
    initialValues[key] = initialValue;
    validateFns[key] = validateFn;
    return {
        ...state,
        values: { ...values },
        initialValues: { ...initialValues },
        validateFns: { ...validateFns }
    };
};

const handleUpdateFieldValue = (state: IFormState, key: string, value: any) => {
    const { values } = state;
    values[key] = value;
    return {
        ...state,
        values: { ...values }
    };
};

const handleSetFieldsValue = (
    state: IFormState,
    fields: { [prop: string]: any } = {}
) => {
    const { values } = state;
    Object.keys(fields).forEach(key => {
        if (Object.getOwnPropertyDescriptor(values, key)) {
            values[key] = fields[key];
        }
    });
    return {
        ...state,
        values: { ...values }
    };
};

const handleResetFieldsValue = (state: IFormState, fields: string[]) => {
    const { values, initialValues } = state;
    fields = fields.length === 0 ? Object.keys(values) : fields;
    fields.forEach(field => {
        if (Object.getOwnPropertyDescriptor(values, field)) {
            values[field] = initialValues[field];
        }
    });
    return {
        ...state,
        values: { ...values }
    };
};

const reducers: React.Reducer<IFormState, IAction> = (
    state,
    action
): IFormState => {
    const { type, payload } = action;
    switch (type) {
        case FormAction.ADD_NEW_FIELD: {
            return handleAddNewField(state, payload);
        }
        case FormAction.UPDATE_FIELD_VALUE: {
            const { key, value } = payload;
            return handleUpdateFieldValue(state, key, value);
        }
        case FormAction.SET_FIELDS_VALUE: {
            return handleSetFieldsValue(state, payload);
        }
        case FormAction.RESET_FIELDS_VALUE: {
            return handleResetFieldsValue(state, payload);
        }
        default:
            return state;
    }
};

const useFormState = (initialState): [IFormState, React.Dispatch<IAction>] => {
    const [formState, dispatch] = useReducer(reducers, initialState);
    return [formState, dispatch];
};

export const createForm = (formOption: IFormOption = {}) => (
    Content: React.JSXElementConstructor<any>
) => {
    return (props: any) => {
        const [formState, dispatch] = useFormState(initialState);
        const registerField: IRegisterFieldFn = (
            field,
            initialValue,
            validateFn
        ) => {
            dispatch({
                type: FormAction.ADD_NEW_FIELD,
                payload: {
                    key: field,
                    initialValue,
                    validateFn
                }
            });
        };

        const resetFieldsValue = (...fields: string[]) => {
            dispatch({
                type: FormAction.RESET_FIELDS_VALUE,
                payload: fields
            });
        };

        const setFieldsValue = (nextFields: object) => {
            dispatch({
                type: FormAction.SET_FIELDS_VALUE,
                payload: nextFields
            });
        };

        const setFieldValue = (name: string, value: any) => {
            dispatch({
                type: FormAction.UPDATE_FIELD_VALUE,
                payload: {
                    key: name,
                    value: value
                }
            });
        };

        const validateFields = (
            ...fields: string[]
        ): [boolean, { [prop: string]: string }] => {
            let isFormValid = true;
            const validateFns = formState.validateFns;
            fields =
                fields.length === 0 ? Object.keys(formState.values) : fields;
            const errs = fields
                .map(key => {
                    if (Object.getOwnPropertyDescriptor(validateFns, key)) {
                        return validateFns[key]();
                    }
                    return [];
                })
                .filter(ret => ret === undefined || ret.length === 0)
                .reduce((acc, cur) => {
                    const [isFieldValid, errorType, errorMsg] = cur;
                    if (!isFieldValid) {
                        isFormValid = false;
                        acc[errorType] = errorMsg;
                    }
                    return acc;
                }, {});
            return [isFormValid, errs];
        };

        const context = {
            values: formState.values,
            registerField,
            setFieldValue,
            setFieldsValue,
            resetFieldsValue,
            validateFields
        };

        return (
            <FormContext.Provider value={context}>
                <Content {...props} {...context} />
            </FormContext.Provider>
        );
    };
};
