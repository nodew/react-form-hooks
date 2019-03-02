import { useContext, useEffect, useState } from "react";
import get from "lodash/get";
import { FormContext } from "./context";
import { validate } from "./utils";
import {
    IFieldOption,
    IFieldProps,
    IValidateError,
    IValidateInnerFn
} from "./type";

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
