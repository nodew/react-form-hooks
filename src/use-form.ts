import { useContext } from "react";
import { FormContext } from "./context";

export const useForm = () => {
    const {
        values,
        resetFieldsValue,
        setFieldValue,
        setFieldsValue,
        validateFields
    } = useContext(FormContext);

    const getFieldsValue = () => values;

    return {
        getFieldsValue,
        resetFieldsValue,
        setFieldValue,
        setFieldsValue,
        validateFields
    };
};
