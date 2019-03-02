import isNil from "lodash/isNil";
import without from "lodash/without";
import { IRules } from "./type";

export const noop = () => {};

export const validate = (rules: IRules = {}) => (
    value: any
): [boolean, string] => {
    if (rules.required && typeof rules.required !== "function") {
        if (isNil(value) || value.trim() === "") {
            return [false, "required"];
        }
    }

    const ruleKeys = without(Object.keys(rules), "required");

    for (let i = 0; i < ruleKeys.length; i++) {
        const key = ruleKeys[i];
        if (!rules[key](value)) {
            return [false, key];
        }
    }

    return [true, ""];
};
