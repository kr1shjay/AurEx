// import package
import React, { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux'

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { editUserProfile, showBtn } from '../../actions/users'

const ViewDetail = (props) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [hide, setHide] = useState('false')
    // props
    const { handleEditForm } = props;

    // redux-state
    const accountData = useSelector(state => state.account);
    const { firstName, lastName, email, blockNo, address, state, city, postalCode, country } = accountData;
    const show = async () => {
        let { result, status } = await showBtn()
        if (status == 'success') {
            setHide(result.status)
        }
    }
    useEffect(() => {
        show()
    }, [])

    return (
        <div className="profileDetailView">
            <div class="alert alert-info" role="alert">
                <Trans
                    i18nKey="PROFILE_DESCRIPTION1"
                    values={{ 'SUPPORT_MAIL': 'support@aurex.com' }}
                    components={{ a: <a href="mailto:support@aurex.com" />, b: <b /> }}
                />

            </div>
            <GridContainer>

                <GridItem xs={12} sm={12} md={6} lg={6}>

                    <h4>{t("PERSONAL_DETAILS")}</h4>

                    <ul>
                        <li>
                            <label>{t("FULL_NAME")}</label>
                            <span>{firstName}{' '}{lastName}</span>
                        </li>
                        <li>
                            <label>{t("EMAIL_PLACEHOLDER")}</label>
                            <span>{email}</span>
                        </li>
                        {/* <li>
                            <label>Phone Number</label>
                            <span>+91 1234567890</span>
                        </li> */}
                    </ul>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                    <h4>{t("RESIDENTIAL_ADDRESS")}</h4>
                    <ul>
                        <li>
                            <label>{t("ADDRESS")}</label>
                            <span>{address}</span>
                        </li>
                        <li>
                            <label>{t("STATE_PROVISION")}</label>
                            <span>{state}</span>
                        </li>
                        <li>
                            <label>{t("CITY")} & {t("POSTAL_CODE")}</label>
                            <span>{city}{' '}{postalCode}</span>
                        </li>
                        <li>
                            <label>{t("COUNTRY")}</label>
                            <span>{country}</span>
                        </li>
                    </ul>
                </GridItem>
            </GridContainer>
            <div className="form-group">
                {
                    hide == 'false' ? null :
                        <button
                            className="btn btn-primary text-uppercase py-2"
                            onClick={() => {
                                handleEditForm(accountData)
                            }}
                        >
                            {t("EDIT_PROFILE")}
                        </button>
                }

            </div>
        </div>
    )
}

export default ViewDetail;