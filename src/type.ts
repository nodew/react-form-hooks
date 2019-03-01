import * as React from "react";

export type IFormContext = {
    values: {
        [prop: string]: any;
    };
    options: {
        [prop: string]: IFieldOption;
    };
    setter: {
        [prop: string]: React.Dispatch<any>;
    };
    registerField: (
        name: string,
        setter: React.Dispatch<any>,
        opts: IFieldOption
    ) => void;
    setFields: (values: { [prop: string]: any }) => void;
    setField: (name: string, val: any) => void;
    resetFields: (...args: string[]) => void;
};

export type IRules = {
    required?: boolean;
    [prop: string]: ((value: any) => boolean) | any;
};

export type IFieldOption = {
    initialValue?: any;
    rules?: IRules;
    validateErrors?: {
        [prop: string]: string;
    };
};

export type IFieldProps = {
    value: any;
    isValid?: boolean;
    validateError?: {
        type: "";
        msg: "";
    };
};

export type IFormOption = {};
