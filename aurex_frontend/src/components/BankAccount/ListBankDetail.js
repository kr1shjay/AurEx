// import package
import React from "react";
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { setBankForm } from '../../actions/users';

const ListBankDetail = (props) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    // redux-state
    const { result } = useSelector(state => state.bankDetail);

    return (
        <>
            {
                result && result.length == 0 && <>
                    <p>{t('REGISTER_BANK_ACCOUNT')}</p>
                    <div className="form-group">
                        <button
                            onClick={() => {
                                dispatch(setBankForm({
                                    'formDisable': false,
                                    'formType': 'add'
                                }))
                            }}
                            className="btn btn-primary text-uppercase py-2"
                        >
                            {t("ADD_BANK_ACCOUNT")}
                        </button>
                    </div>
                </>
            }

            {
                result && result.length > 0 && <div className="profileDetailView">
                    <GridContainer>
                        {
                            result.map((item, key) => {
                                return (
                                    <GridItem xs={12} sm={12} md={6} lg={6}>
                                        <h4>{t("BANK_ACCOUNT")} #{key + 1}</h4>
                                        <ul>
                                            <li>
                                                <label>{t("BANK_NAME")}</label>
                                                <span>{item.bankName}</span>
                                            </li>
                                            <li>
                                                <label>{t("ACCOUNT_NUMBER")}</label>
                                                <span>{item.accountNo}</span>
                                            </li>
                                            <li>
                                                <label>{t("ACCOUNT_HOLDER_NAME")}</label>
                                                <span>{item.holderName}</span>
                                            </li>
                                            <li>
                                                <label>{t("IBAN_CODE")}</label>
                                                <span>{item.bankcode}</span>
                                            </li>
                                            <li>
                                                <label>{t("BANK")}{" "}{t("CITY")}</label>
                                                <span>{item.city}</span>
                                            </li>
                                            <li>
                                                <label>{t("BANK")}{" "}{t("COUNTRY")}</label>
                                                <span>{item.country}</span>
                                            </li>
                                        </ul>
                                    </GridItem>
                                )
                            })
                        }

                    </GridContainer>
                    <div className="form-group mb-0">
                        <button
                            className="btn btn-outline py-2 text-uppercase"
                            onClick={() => {
                                dispatch(setBankForm({
                                    'formDisable': false,
                                    'formType': 'add'
                                }))
                            }}
                        >
                            {t("ADD_ANOTHER_ACCOUNT")}
                        </button>
                    </div>
                </div>
            }
        </>

    )
}

export default ListBankDetail;