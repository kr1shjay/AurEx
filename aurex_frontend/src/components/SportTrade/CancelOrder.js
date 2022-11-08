// import package
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// import action
import { cancelOrder } from "../../actions/spotTradeAction";

// import lib
import { toastAlert } from "../../lib/toastAlert";

const CancelOrder = (props) => {
    const { t, i18n } = useTranslation();

    // state
    const [loader, setLoader] = useState();

    // function
    const handleCancelOrder = async (e) => {
        e.preventDefault();
        if(!window.confirm('Are you sure want to cancel the order ?')){
            return
        }

        setLoader(true);
        try {
            let { status, loading, message } = await cancelOrder(
                props.orderId
            );
            setLoader(loading);
            if (status == "success") {
                toastAlert("success", t(message), "cancelOrder");
            } else {
                toastAlert("error", t(message), "cancelOrder");
            }
        } catch (err) {}
    };

    return (
        <button
            type="button"
            onClick={handleCancelOrder}
            className="btn btn-primary text-uppercase py-2"
            disabled={loader}
        >
            {loader && <i className="fas fa-spinner fa-spin"></i>}
            {t("CANCEL")}
        </button>
    );
};

export default CancelOrder;