import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import get from "lodash/get";
import isNil from "lodash/isNil";
import omit from "lodash/omit";
import {
    IFormContext,
    IRules,
    IFieldOption,
    IFormOption,
    IFieldProps
} from "./type";

export const FormContext = createContext<IFormContext>({
    values: {},
    options: {},
    setter: {},
    registerField: () => {},
    setFields: () => {},
    setField: () => {},
    resetFields: () => {}
});

const validate = (rules: IRules = {}) => (value: any): [boolean, string] => {
    if (rules.required) {
        if (!(isNil(value) || value.trim() === "")) {
            return [false, "required"];
        }
    }
    const ruleKeys = omit(Object.keys(rules), "required");
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
        const [values, setState] = useState({});
        const [options, setOptions] = useState({});
        const [setter, setSetter] = useState({});
        const registerField = (name, setFn, opts: IFieldOption = {}) => {
            values[name] = opts.initialValue;
            setter[name] = setFn;
            options[name] = opts;
            setState({ ...values });
            setOptions({ ...options });
            setSetter({ ...setter });
        };

        const resetFields = (...fields) => {
            if (fields.length === 0) {
                fields = Object.keys(values);
            }
            fields.forEach(field => {
                const initialValue = get(options, [field, "initialValue"]);
                values[field] = initialValue;
                setter[field](initialValue);
            });
            setState({ ...values });
        };

        const setFields = obj => {
            Object.keys(obj).forEach(key => {
                values[key] = obj[key];
            });
        };

        const setField = (name, val) => {
            values[name] = val;
            setState({ ...values });
        };

        const context = {
            values,
            options,
            setter,
            registerField,
            setField,
            setFields,
            resetFields
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
): [IFieldProps, (val: any) => void] => {
    const { registerField, setField } = useContext(FormContext);
    const [val, setVal] = useState<any>(options.initialValue);
    useEffect(() => {
        registerField(name, setVal, options);
    }, []);
    const onChange = (val: any) => {
        setVal(val);
        setField(name, val);
    };
    return [
        {
            value: val,
            isValid: true,
            validateError: {
                type: "",
                msg: ""
            }
        },
        onChange
    ];
};

export const useForm = () => {
    const { values, resetFields } = useContext(FormContext);
    const getFieldsValue = (...fields: string[]) => {
        if (fields.length === 0) {
            return values;
        }
        return fields.reduce((obj, key) => {
            obj[key] = values[key];
            return obj;
        }, {});
    };

    const validateFields = (...fields: string[]) => {};

    return {
        getFieldsValue,
        validateFields,
        resetFields
    };
};
