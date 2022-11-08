// import package
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// import action
import { cancelOrder } from '../../actions/perpetualTradeAction';

// import lib
import { toastAlert } from '../../lib/toastAlert';

const CancelOrder = (props) => {
    const { t, i18n } = useTranslation();

    // state
    const [loader, setLoader] = useState();

    // function
    const handleCancelOrder = async (e) => {
        e.preventDefault();
        setLoader(true)
        try {
            let { status, loading, error, message } = await cancelOrder(props.orderId);
            setLoader(loading)
            if (status == "success") {
                toastAlert('success', t(message), 'cancelOrder');
            } else {
                toastAlert('error', t(message), 'cancelOrder');
            }
        }
        catch (err) { }
    }

    return (
        <button
            type="button"
            onClick={handleCancelOrder}
            className="btn btn-primary text-uppercase py-2"
        >
            {loader && <i class="fas fa-spinner fa-spin"></i>}
            {t("CANCEL")}
        </button>
    )
}

export default CancelOrder;