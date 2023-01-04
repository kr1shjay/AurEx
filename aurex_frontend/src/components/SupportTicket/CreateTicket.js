// import package
import React, { useEffect, useState } from 'react'
import { Select, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import actions
import { getSptCat, createNewTicket } from '../../actions/supportAction';

// import lib
import isEmpty from '../../lib/isEmpty'
import validation from './validation';
import { toastAlert } from '../../lib/toastAlert';

const initialFormValue = {
    'categoryId': ' ',
    'message': '',
    'attachment': ''
}

const CreateTicket = (props) => {
    const { listRef } = props;
    // state
    const [categoryList, setCategoryList] = useState([])
    const [formValue, setFormValue] = useState(initialFormValue);
    const [loader, setLoader] = useState()
    const [validateError, setValidateError] = useState({});
    const { t, i18n } = useTranslation();
    const { categoryId, message, attachment } = formValue;

    // function

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let formData = { ...formValue, ...{ [name]: value } }
        setFormValue(formData)
        if (!isEmpty(validateError)) {
            setValidateError({})
        }
    }

    const refreshPage = () => {
        window.location.reload(false);
    }

    const handleFile = async (e) => {
        e.preventDefault()
        const { name, files } = e.target
        const formData = { ...formValue, ...{ [name]: files[0] } }
        setFormValue(formData)
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        let reqData = {
            categoryId,
            message
        }
        let validationError = validation(reqData, 'createTicket')
        if (!isEmpty(validationError)) {
            setValidateError(validationError)
            return
        }
        setLoader(true)

        let formData = new FormData();
        formData.append('categoryId', categoryId)
        formData.append('message', message)
        formData.append('attachment', attachment)
        try {
            const { status, loading, message, error } = await createNewTicket(formData);
            setLoader(loading)
            if (status == 'success') {
                setFormValue(initialFormValue)
                listRef.current.listData()
                toastAlert('success', message, 'createTicket')
                if (formValue.attachment != '') {
                    setFormValue(initialFormValue)
                    refreshPage()
                }
                // handleTicketList({
                //     'callFrom': 'createTicket'
                // })
            } else {
                if (error) {
                    setValidateError(error)
                    return
                }
                toastAlert('error', message, 'createTicket')
            }
        } catch (err) {
        }
    }

    const fetchCategory = async () => {
        try {
            const { status, loading, error, result } = await getSptCat();
            if (status == 'success') {
                setCategoryList(result)
            }
        } catch (err) { }
    }

    useEffect(() => {
        fetchCategory();
    }, [])
    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={7} lg={8}>
                <div className="contact_form settingsSelect mb-0">
                    <div className="form-group">
                        <label>{t('TICKET_FOR')}</label>
                        <Select
                            value={categoryId}
                            name={'categoryId'}
                            id={'categoryId'}
                            onChange={handleChange}
                        >
                            <MenuItem value={' '}>{"Select Issue"}</MenuItem>

                            {
                                categoryList && categoryList.length > 0 && categoryList.map((item, key) => {
                                    return (
                                        <MenuItem key={key} value={item._id}>{item.categoryName}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                        {
                            validateError.categoryId && <p className="error-message">{t(validateError.categoryId)}</p>
                        }
                    </div>
                    <div className="form-group">
                        <label>{t('MSG_TO_SUPPORT_TEAM')}</label>
                        <textarea
                            rows="4"
                            className="form-control"
                            name={"message"}
                            onChange={handleChange}
                            value={message}
                        />
                        {
                            validateError.message && <p className="error-message">{t(validateError.message)}</p>
                        }
                    </div>
                    <div className="form-group">
                        <label>{t('ATTACHMENT')}</label>
                        <div className="custom-file">
                            <input
                                onChange={handleFile}
                                type="file"
                                className="custom-file-input"
                                aria-describedby="inputGroupFileAddon01"
                                name="attachment"
                            />


                            <label className="custom-file-label">
                                {
                                    attachment && attachment.name ? <small>{attachment.name}</small> : <small>attachment</small>
                                }
                            </label>
                        </div>
                        {
                            validateError.attachment && <p className="error-message">{t(validateError.attachment)}</p>
                        }

                    </div>


                    {/* <div className="file-upload-wrapper" data-text="Select your file!">
                        <input name="file-upload-field"
                            type="file"
                            name="attachment"
                            class="file-upload-field primary_inp_inner"
                            onChange={handleFile}
                            value={attachment}
                        />
                        <label className="custom-file-label">
                            {
                                frontImage && frontImage.name ? <small>{frontImage.name}</small> : <small>{t("IDENTITY_HINT2")}</small>
                            }
                        </label>
                    </div> */}
                    <div class="form-group">
                        {loader && <i class="fas fa-spinner fa-spin support_ticket_spin"></i>}
                        <input
                            type="submit"
                            className="btn btn-primary text-uppercase py-2"
                            value="Create Ticket"
                            onClick={handleFormSubmit}
                            disabled={loader}
                        />
                    </div>
                </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={5} lg={4}>
                <div className="supportTicketList">
                    <h5 class="dash_subtitle">{t('MORE_ABOUT_SUPPORT')}</h5>
                    {
                        categoryList && categoryList.length > 0 && categoryList.map((item, i) =>{
                            return (
                                <ul>
                                    <li ><a href='#'  onClick={(e)=>{
                                    e.preventDefault();
                                    setFormValue({ ...formValue, ...{ ['categoryId']:item._id}});
                                }}>{i+1}. {item.categoryName}</a></li>
                                </ul>
                            )
                        })
                    }
                    {/*<ul>
                        <li><a href="#">1. {t('LOGIN_ISSUE')}</a></li>
                        <li><a href="#">2. {t('DEPOSIT_ISSUE')}</a></li>
                        <li><a href="#">3. {t('WITHDRAW_ISSUE')}</a></li>
                        <li><a href="#">4. {t('SPOT_TRADE')}</a></li>
                        <li><a href="#">5. {t('DERIVATIVE_TRADE')}</a></li>
                        <li><a href="#">6. {t('2FA_PASS_UPDATE')}</a></li>
                        <li><a href="#">7. {t('GENERAL')}</a></li>
                    </ul>*/}
                </div>
            </GridItem>
        </GridContainer>
    )
}

export default CreateTicket;