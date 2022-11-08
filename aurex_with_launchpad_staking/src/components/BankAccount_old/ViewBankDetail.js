// import package
import React from "react";
import ReactTooltip from 'react-tooltip';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// import action
import { setBankForm, setPrimaryBank, deleteBankDetail } from '../../actions/users';

// import lib
import { toastAlert } from '../../lib/toastAlert';

const ViewBankDetail = (props) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    // redux-state
    const { result } = useSelector(state => state.bankDetail);

    // function
    const handlePrimaryBank = async (item) => {
        try {
            let reqData = {
                'bankId': item._id
            }
            const { status, loading, message } = await setPrimaryBank(reqData, dispatch);
            if (status == 'success') {
                toastAlert('success', t(message), 'viewBank')
            } else {
                toastAlert('error', t(message), 'viewBank')
            }
        } catch (err) { }
    }

    const handleDelete = async (item) => {
        try {
            let reqData = {
                'bankId': item._id
            }
            const { status, loading, message } = await deleteBankDetail(reqData, dispatch);
            if (status == 'success') {
                toastAlert('success', t(message), 'deleteBank')
            } else {
                toastAlert('error', t(message), 'deleteBank')
            }
        } catch (err) { }
    }

    return (
        <>
            <h5 className="dash_subtitle pb-3 mb-1">{t("MY_BANK_ACCOUNT")}</h5>
            <div className="table-responsive">
                <table className="table dash_table">
                    <thead>
                        <th>{t("DEFAULT")}</th>
                        <th>{t("BANK_NAME")}</th>
                        <th>{t("ACCOUNT_NO")}</th>
                        <th>{t("STATUS")}</th>
                        <th>{t("TWO_FA")}</th>
                    </thead>
                    <tbody>

                        {
                            result && result.length > 0 && result.map((item, key) => {
                                return (
                                    <tr>
                                        <td>
                                            <div className="form-check">
                                                <input
                                                    className=""
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault2"
                                                    checked={item.isPrimary}
                                                    onChange={() => { handlePrimaryBank(item) }}
                                                />
                                                <label className="form-check-label" for="flexRadioDefault2">
                                                </label>
                                            </div>
                                        </td>
                                        <td>{item.bankName}</td>
                                        <td>{item.accountNo}</td>
                                        <td>
                                            [
                                                <Link
                                                to="#"
                                                onClick={() => {
                                                    dispatch(setBankForm({
                                                        'formDisable': false,
                                                        'formType': 'edit',
                                                        'editRecord': { ...item, 'key': key + 1 }
                                                    }))
                                                }}
                                            >
                                                {t("EDIT")}
                                            </Link>
                                            ] [
                                                <Link to="#" onClick={() => handleDelete(item)}>{t("DELETE")}</Link>
                                             ]
                                        </td>
                                        <td>
                                            <a data-tip data-for='clickme' data-event='click' className="ml-2">
                                                <i class="fas fa-info-circle"></i>
                                            </a>
                                            <ReactTooltip
                                                id='clickme'
                                                place='right'
                                                effect='solid'
                                                clickable={true}
                                            >
                                                {t('TWO_FA_MSG')}
                                            </ReactTooltip>
                                        </td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ViewBankDetail;