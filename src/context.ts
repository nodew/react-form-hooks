import { createContext } from "react";
import { IRegisterFieldFn } from "./type";
import { noop } from "./utils";

export type IFormContext = {
    registerField: IRegisterFieldFn;
    setFieldsValue: (values: { [field: string]: any }) => void;
    setFieldValue: (field: string, val: any, sync?: boolean) => void;
    resetFieldsValue: (...fields: string[]) => void;
    getFieldValue: <T>(field: string) => any;
    getFieldsValue: (...fields: string[]) => any;
    validateFields: () => [boolean, { [prop: string]: string }];
};

export const FormContext = createContext<IFormContext>({
    registerField: noop,
    setFieldsValue: noop,
    setFieldValue: noop,
    resetFieldsValue: noop,
    getFieldValue: noop,
    getFieldsValue: noop,
    validateFields: () => [true, null]
});
