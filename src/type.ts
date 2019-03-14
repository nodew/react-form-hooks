export type IRegisterFieldFn = (
    name: string,
    initialValue: any,
    setFn: (value: any) => void,
    validateFn: IValidateInnerFn
) => void;

export type IValidateInnerFn = (val?: any) => [boolean, string, string];
export type IValidateFn = () => [boolean, string, string];

export type IFormOption = {};

export type IRules = {
    required?: boolean;
    [prop: string]: ((value: any) => boolean) | any;
};

export type IFieldOption = {
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
