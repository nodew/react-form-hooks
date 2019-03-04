import { createContext } from "react";
import { IRegisterFieldFn } from "./type";
import { noop } from "./utils";

export type IFormContext = {
    values: {
        [prop: string]: any;
    };
    registerField: IRegisterFieldFn;
    setFieldsValue: (values: { [prop: string]: any }) => void;
    setFieldValue: (name: string, val: any, sync?: boolean) => void;
    resetFieldsValue: (...args: string[]) => void;
    validateFields: () => [boolean, { [prop: string]: string }];
};

export const FormContext = createContext<IFormContext>({
    values: {},
    registerField: noop,
    setFieldsValue: noop,
    setFieldValue: noop,
    resetFieldsValue: noop,
    validateFields: () => [true, null]
});
