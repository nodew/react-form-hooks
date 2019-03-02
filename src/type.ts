import * as React from "react";

export type IRegisterFieldFn = (
    name: string,
    setter: React.Dispatch<any>,
    opts: IFieldOption,
    validateFn: IValidateInnerFn,
    clearValidateErrorFn: () => void
) => void;

export type IValidateInnerFn = (val?: any) => [boolean, string, string];
export type IValidateFn = () => [boolean, string, string];

export type IFormOption = {};

export type IRules = {
    required?: boolean;
    [prop: string]: ((value: any) => boolean) | any;
};

export type IFieldOption = {
    initialValue?: any;
    rules?: IRules;
    validateOnValueChange?: boolean;
    validateErrors?: {
        [prop: string]: string;
    };
};

export type IFieldProps = {
    value: any;
    isPristine: boolean;
    isValid: boolean;
    validate: IValidateFn;
    validateError?: IValidateError;
};

export type IValidateError = {
    type: string;
    message: string;
};
