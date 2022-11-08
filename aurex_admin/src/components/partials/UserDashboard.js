import React, { useState, useEffect, Fragment } from "react";
import { Card, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
// import action
import { updateUsrDash } from '../../actions/siteSettingActions';

// import lib
import { toastAlert } from '../../lib/toastAlert'
import isEmpty from "../../lib/isEmpty";

const initialFormValue = {
    'currencyId': '',
    'colorCode': ''
}

const UserDashboard = (props) => {
    // props
    const { currencyOption, records } = props;

    // state
    const [inputFields, setInputFields] = useState([initialFormValue]);
    const [validErr, setValidErr] = useState({});
    const [status, setStatue] = useState(true);

    // function

    const handleAddFields = () => {
        if (isEmpty(inputFields.currencyId) && isEmpty(inputFields.colorCode)) {
            setStatue(false)
        }
        const values = [...inputFields];
        values.push({
            'currencyId': '',
            'colorCode': ''
        });
        setInputFields(values);
    };

    const handleRemoveFields = index => {
        const values = [...inputFields];
        values.splice(index, 1);
        setInputFields(values);
    };

    const handleInputChange = (index, event) => {
        event.preventDefault()
        const { name, value } = event.target;
        const values = [...inputFields];
        values[index][name] = value
        setInputFields(values);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let reqData = {
                currencyList: inputFields
            }
            const { status, loading, message, errors } = await updateUsrDash(reqData)
            if (status == 'success') {
                toastAlert('success', message, 'usrDash')
            } else {
                toastAlert('error', message, 'usrDash')
            }
            if (errors) {
                setValidErr(errors)
            }
        } catch (err) { }
    };

    useEffect(() => {
        if (!isEmpty(records) && records.userDashboard) {
            setInputFields(records.userDashboard)
        }
    }, [records])
    console.log(inputFields, '==============')
    return (
        <Card>
            <Card.Header><p className="text-white"><b>User Dashboard Detail</b></p></Card.Header>
            <Card.Body>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        {inputFields.map((inputField, index) => {
                            return (
                                <Fragment key={`${inputField}~${index}`}>
                                    <div className="form-group col-sm-6">
                                        <label htmlFor="firstName">Currency</label>
                                        <Form.Control
                                            name="currencyId"
                                            value={inputField.currencyId}
                                            onChange={event => handleInputChange(index, event)}
                                            as="select" custom
                                        >
                                            <option value={''}>Select Currency</option>
                                            {
                                                currencyOption && currencyOption.length > 0 && currencyOption.map((item, key) => {
                                                    console.log('currecyOption', item)
                                                    return (
                                                        <option value={item._id}>{item.coin}</option>
                                                    )
                                                })
                                            }
                                        </Form.Control>
                                        {
                                            inputField && inputField.currencyId ? null :
                                                <>
                                                    <p style={{ color: 'red' }}>{validErr && validErr.currency}</p>
                                                </>

                                        }

                                    </div>
                                    <div className="form-group col-sm-4">
                                        <label htmlFor="colorCode">Color Coder</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="colorCode"
                                            value={inputField.colorCode}
                                            onChange={event => handleInputChange(index, event)}
                                        />
                                        {
                                            inputField && inputField.colorCode ? null :
                                                <>
                                                    <p style={{ color: 'red' }}>{validErr && validErr.colorCode}</p>
                                                </>

                                        }
                                    </div>
                                    {
                                        <div className="form-group col-sm-2" id='plus_minus-button'>
                                            <button
                                                className="btn btn-danger"
                                                type="button"
                                                onClick={() => handleRemoveFields(index)}
                                            >
                                                <i class="fa fa-minus" aria-hidden="true"></i>
                                            </button> &nbsp;
                                            <button
                                                className="btn btn-success"
                                                type="button"
                                                onClick={() => handleAddFields()}
                                            >
                                                <i class="fa fa-plus" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    }
                                </Fragment>
                            )
                        })}
                    </div>
                    <div className="submit-button">
                        {
                            inputFields.length <= 0 && status == true ?
                                <>
                                    <button
                                        onClick={() => handleAddFields()}
                                        className="btn btn-outline-primary float-right mt-3 mr-2"
                                    ><FontAwesomeIcon icon={faPlus}  className="mr-1" /> Add Currency Color
                                    </button>
                                </> :
                                <button
                                    className="btn btn-primary mr-2"
                                    type="submit"
                                    onSubmit={isEmpty(inputFields.currencyId) && isEmpty(inputFields.colorCode) ? () => handleSubmit() : () => handleAddFields()}
                                >submit
                                </button>

                        }

                    </div>
                </form>
            </Card.Body>
        </Card>
    );
};

export default UserDashboard