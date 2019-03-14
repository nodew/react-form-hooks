import { useContext } from "react";
import { FormContext } from "./context";

export const useForm = () => {
    const {
        resetFieldsValue,
        setFieldValue,
        setFieldsValue,
        validateFields,
        getFieldValue,
        getFieldsValue
    } = useContext(FormContext);

    return {
        getFieldValue,
        getFieldsValue,
        resetFieldsValue,
        setFieldValue,
        setFieldsValue,
        validateFields
    };
};
