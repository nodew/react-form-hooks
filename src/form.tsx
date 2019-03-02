import * as React from "react";
import { useState } from "react";
import get from "lodash/get";
import { FormContext } from "./context";
import {
    IFieldOption,
    IFormOption,
    IRegisterFieldFn,
    IValidateInnerFn
} from "./type";

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
