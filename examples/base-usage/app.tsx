import * as React from "react";
import { render } from "react-dom";
import { createForm, useForm, useField } from "../../src";
import * as validator from "validator";

const Demo = () => {
    const { getFieldsValue, resetFieldsValue, setFieldValue } = useForm();
    const [firstName, setFirstName] = useField("firstName", "Joe", {
        rules: {
            required: true
        },
        validateErrors: {
            required: "Please type your first name"
        }
    });
    const [lastName, setLastName] = useField("lastName", "Wang", {
        rules: {
            required: true
        },
        validateErrors: {
            required: "Please type your last name"
        },
        validateOnValueChange: true
    });
    const [email, setEmail] = useField("email", "joe@react-form-hooks.dev", {
        rules: {
            required: true,
            isEmail: value => validator.isEmail(value)
        },
        validateErrors: {
            required: "Your email is required",
            isEmail: "Not valid email address"
        }
    });

    const onSubmit = e => {
        e.preventDefault();
        console.log(getFieldsValue());
    };

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="firstName">FirstName: </label>
                <input
                    name="firstName"
                    value={firstName.value}
                    onBlur={firstName.validate}
                    onChange={e => setFirstName(e.target.value)}
                />
                {!firstName.isValid && (
                    <span>{firstName.validateError.message}</span>
                )}
            </div>
            <div>
                <label htmlFor="lastName">LastName: </label>
                <input
                    name="lastName"
                    value={lastName.value}
                    onChange={e => setLastName(e.target.value)}
                />
                {!lastName.isValid && (
                    <span>{lastName.validateError.message}</span>
                )}
            </div>
            <div>
                <label htmlFor="Email">Email: </label>
                <input
                    name="Email"
                    value={email.value}
                    onBlur={email.validate}
                    onChange={e => setEmail(e.target.value)}
                />
                {!email.isValid && <span>{email.validateError.message}</span>}
            </div>
            <button type="submit">Submit</button>
            <button type="reset" onClick={() => resetFieldsValue()}>
                Reset
            </button>
            <button
                type="button"
                onClick={() => setFieldValue("firstName", "")}
            >
                Set firstName to empty
            </button>
        </form>
    );
};

const App = createForm()(Demo);

render(<App />, document.getElementById("app"));
