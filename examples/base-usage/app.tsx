import * as React from "react";
import { render } from "react-dom";
import { createForm, useForm, useField } from "../../src/Form";

const Demo = () => {
    const { getFieldsValue, resetFields } = useForm();
    const [firstName, setFirstName] = useField("firstName", {
        initialValue: "Joe"
    });
    const [lastName, setLastName] = useField("lastName", {
        initialValue: "Wang"
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
                    onChange={e => setFirstName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="lastName">LastName: </label>
                <input
                    name="lastName"
                    value={lastName.value}
                    onChange={e => setLastName(e.target.value)}
                />
            </div>
            <button type="submit">Submit</button>
            <button type="reset" onClick={() => resetFields()}>
                Reset
            </button>
        </form>
    );
};

const App = createForm()(Demo);

render(<App />, document.getElementById("app"));
