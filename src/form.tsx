import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import get from "lodash/get";
import isNil from "lodash/isNil";
import without from "lodash/without";
import {
    IFormContext,
    IRules,
    IFieldOption,
    IFormOption,
    IFieldProps,
    IValidateError,
    IRegisterFieldFn,
    IValidateInnerFn
} from "./type";

const noop = () => {};

export const FormContext = createContext<IFormContext>({
    values: {},
    registerField: noop,
    setFields: noop,
    setField: noop,
    resetFields: noop,
    validateFields: () => [true, null]
});

const validate = (rules: IRules = {}) => (value: any): [boolean, string] => {
    if (rules.required && typeof rules.required !== "function") {
        if (isNil(value) || value.trim() === "") {
            return [false, "required"];
        }
    }

    const ruleKeys = without(Object.keys(rules), "required");

    for (let i = 0; i < ruleKeys.length; i++) {
        const key = ruleKeys[i];
        if (!rules[key](value)) {
            return [false, key];
        }
    }

    return [true, ""];
};

export const createForm = (formOption: IFormOption = {}) => Content => {
    return props => {
        const [values, setState] = useState<{
            [prop: string]: any;
        }>({});
        const [options, setOptions] = useState<{
            [prop: string]: IFieldOption;
        }>({});
        const [setters, setSetter] = useState<{
            [prop: string]: React.Dispatch<any>;
        }>({});
        const [validateFns, setValidateFns] = useState<{
            [prop: string]: IValidateInnerFn;
        }>({});
        const [clearValidateErrorFns, setClearValidateErrorFns] = useState<{
            [prop: string]: () => void;
        }>({});
        const registerField: IRegisterFieldFn = (
            name,
            setterFn,
            opts = {},
            validateFn,
            clearValidateErrorFn
        ) => {
            values[name] = opts.initialValue;
            setters[name] = setterFn;
            validateFns[name] = validateFn;
            options[name] = opts;
            clearValidateErrorFns[name] = clearValidateErrorFn;
            setValidateFns(validateFns);
            setSetter(setters);
            setOptions(options);
            setClearValidateErrorFns(clearValidateErrorFns);
            setState({ ...values });
        };

        const resetFields = (...fields) => {
            if (fields.length === 0) {
                fields = Object.keys(values);
            }
            fields.forEach(field => {
                const initialValue = get(options, [field, "initialValue"]);
                values[field] = initialValue;
                setters[field](initialValue);
                clearValidateErrorFns[field]();
            });
            setState({ ...values });
        };

        const setFields = obj => {
            Object.keys(obj).forEach(key => {
                const val = obj[key];
                values[key] = val;
                setters[key](val);
                clearValidateErrorFns[key]();
            });
            setState({ ...values });
        };

        const setField = (name: string, val: any, sync?: boolean) => {
            values[name] = val;
            clearValidateErrorFns[name]();
            if (sync) {
                setters[name](val);
            }
            setState({ ...values });
        };

        const validateFields = (): [boolean, { [prop: string]: string }] => {
            let isFormValid = true;
            const errs = Object.keys(validateFns)
                .map(key => validateFns[key]())
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
            values,
            registerField,
            setField,
            setFields,
            resetFields,
            validateFields
        };
        return (
            <FormContext.Provider value={{ ...context }}>
                <Content {...props} {...context} />
            </FormContext.Provider>
        );
    };
};

export const useField = (
    name: string,
    options: IFieldOption = {}
): [IFieldProps, (value: any) => void] => {
    const { registerField, setField } = useContext(FormContext);
    const [value, setValue] = useState<any>(options.initialValue);
    const [isValid, setIsValid] = useState<boolean>(true);
    const [isPristine, setIsPristine] = useState<boolean>(true);
    const [validateError, setValidateError] = useState<IValidateError>(null);

    const triggerValidate: IValidateInnerFn = (nextVal = value) => {
        const [isValidField, errorType] = validate(options.rules)(nextVal);
        let errorMsg = "";
        if (isValidField) {
            clearValidateError();
        } else {
            errorMsg = get(options, ["validateErrors", errorType], "");
            setIsValid(false);
            setValidateError({
                type: errorType,
                message: errorMsg
            });
        }
        return [isValid, errorType, errorMsg];
    };

    const clearValidateError = () => {
        setIsValid(true);
        setValidateError(null);
    };

    const onChange = (val: any) => {
        setValue(val);
        setIsPristine(false);
        setField(name, val);
        if (options.validateOnValueChange) {
            triggerValidate(val);
        } else {
            clearValidateError();
        }
    };

    useEffect(() => {
        registerField(
            name,
            setValue,
            options,
            triggerValidate,
            clearValidateError
        );
    }, []);

    return [
        {
            value,
            isPristine,
            isValid,
            validateError,
            validate: () => triggerValidate()
        },
        onChange
    ];
};

export const useForm = () => {
    const {
        values,
        resetFields,
        setField,
        setFields,
        validateFields
    } = useContext(FormContext);

    const getFieldsValue = (...fields: string[]) => {
        if (fields.length === 0) {
            return values;
        }
        return fields.reduce((obj, key) => {
            obj[key] = values[key];
            return obj;
        }, {});
    };

    return {
        getFieldsValue,
        validateFields,
        resetFields,
        setField: (name: string, val: any) => setField(name, val, true),
        setFields
    };
};
