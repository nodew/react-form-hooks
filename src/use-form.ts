import { useContext } from "react";
import get from "lodash/get";
import { FormContext } from "./context";

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
