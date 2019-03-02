import { createContext } from "react";
import { IRegisterFieldFn } from "./type";
import { noop } from "./utils";

export type IFormContext = {
    values: {
        [prop: string]: any;
    };
    registerField: IRegisterFieldFn;
    setFields: (values: { [prop: string]: any }) => void;
    setField: (name: string, val: any, sync?: boolean) => void;
    resetFields: (...args: string[]) => void;
    validateFields: () => [boolean, { [prop: string]: string }];
};

export const FormContext = createContext<IFormContext>({
    values: {},
    registerField: noop,
    setFields: noop,
    setField: noop,
    resetFields: noop,
    validateFields: () => [true, null]
});
