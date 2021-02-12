import React from "react";
import { Form, FormControl, Button } from 'react-bootstrap';
import './Template.css';

const Template = (props) => {
    let { onSubmitFun, id, placeholder, onChangeFun, btnLabel } = props;

    return (
        <Form onSubmit={(e) => onSubmitFun(e)}>
            <Form.Group className="InputField">
                <FormControl
                    id={id}
                    placeholder={placeholder}
                    required={true}
                    onChange={(e) => onChangeFun(e.target.value)}
                />
            </Form.Group>
            <Button
                variant="outline-primary"
                type="submit"
            > {btnLabel}
            </Button>
        </Form>
    );
}

export default Template;