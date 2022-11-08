// import package
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux'
import clsx from 'classnames';

// import action
import { upgradeUser } from '../../actions/users'

// import lib
import { toastAlert } from '../../lib/toastAlert';

const UpgradeButton = (props) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    // props
    const { accountData, upgradeType, idProofData, addressProofData } = props;
    const { type } = accountData;

    // state
    const [loader, setLoader] = useState(false)

    // function
    const handleSubmit = async (e) => {
        e.preventDefault();
        let reqData = {
            upgradeType
        }
        try {
            setLoader(true)
            const { status, loading, message } = await upgradeUser(reqData, dispatch);
            setLoader(loading)
            if (status == 'success') {
                toastAlert('success', message, 'upgrade')
            } else {
                toastAlert('error', message, 'upgrade')
            }
        } catch (err) { }
    }

    let buttonDisable = false;
    if (loader) {
        buttonDisable = true;
    } else if (!(idProofData && idProofData.status == 'approved' && addressProofData && addressProofData.status == 'approved')) {
        buttonDisable = true;
    }

    return (
        <>
            {
                upgradeType == 'basic' && <>
                    {
                        type == 'not_activate' && <button
                            className="btn btn-primary text-uppercase py-2 m-0"
                            disabled={buttonDisable}
                            onClick={handleSubmit}
                        >
                            {loader && <i class="fas fa-spinner fa-spin"></i>}
                            {t('VERIFY_NOW')}
                        </button>
                    }
                    {
                        type == 'basic_processing' && <p>{t("PENDING")}</p>
                    }
                </>
            }

            {
                upgradeType == 'advanced' && idProofData && idProofData.status == 'approved' && addressProofData && addressProofData.status == 'approved' && <>
                    {
                        ['basic', 'basic_processing'].includes(type) && <button
                            className="btn btn-primary text-uppercase py-2 m-0"
                            disabled={loader}
                            onClick={handleSubmit}
                        >
                            {loader && <i class="fas fa-spinner fa-spin"></i>}
                            {t('VERIFY_NOW')}
                        </button>
                    }
                    {
                        type == 'advanced_processing' && <p>{t("PENDING")}</p>
                    }
                </>
            }

            {
                upgradeType == 'pro' && idProofData && idProofData.status == 'approved' && addressProofData && addressProofData.status == 'approved' && <>
                    {
                        ['basic', 'basic_processing', 'advanced', 'advanced_processing'].includes(type) && <button
                            className="btn btn-primary text-uppercase py-2 m-0"
                            disabled={loader}
                            onClick={handleSubmit}
                        >
                            {loader && <i class="fas fa-spinner fa-spin"></i>}
                            {t('VERIFY_NOW')}
                        </button>
                    }

                    {
                        type == 'pro_processing' && <p>{t("PENDING")}</p>
                    }
                </>
            }

        </>
    )

}

export default UpgradeButton;