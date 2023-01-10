// import package
import React from 'react';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';

import { useTranslation } from "react-i18next";

// import action
import { cancelOrder } from "../../actions/spotTradeAction";

// import lib
import { toastAlert } from "../../lib/toastAlert";

const CancelModal = (props) => {
    // props
   const [cancel, buyCancel] = useState(true);

   const { t, i18n } = useTranslation();

   // state
   const [loader, setLoader] = useState();
    // function
    const handleCancelOrder = async (e) => {
        e.preventDefault();
        // if(!window.confirm('Are you sure want to cancel the order ?')){
        //     return
        // }

        setLoader(true);
        try {
            let { status, loading, message } = await cancelOrder(
                props.id
            );
            setLoader(loading);
            if (status == "success") {
                toastAlert("success", t(message), "cancelOrder");
                props.onDismiss()
            } else {
                toastAlert("error", t(message), "cancelOrder");
            }
        } catch (err) {}
    };
    return (
        <Modal
      show={cancel}
     
      backdrop="static"
      size="md"
      centered
    >
      <Modal.Header>
        <Modal.Title>
          <h4 className="modal-title mt-0">
           Cancel Order
          </h4>
        </Modal.Title>
        <button type="button" class="close" onClick={()=>props.onDismiss()}><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>

      </Modal.Header>
      <Modal.Body>
        <div className="modedl_subscribe_content">
        
       
        <p className='text-white mt-3 f-14'>
          Are you sure you want to cancell the order?</p>
        
          <div className="d-flex justify-content-between mt-4 pb-4">
          
          <button type="button" class="btn btn-bordered-secondary w-100 mt-3 mr-3"  onClick={()=>props.onDismiss()}>Cancel</button>
            <button
              type="button"
              onClick={handleCancelOrder}
              class="btn btn-primary w-100 mt-3"             
            >
             Confirm
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
    )
}

export default CancelModal;


// // import package
// import CancelModal from "components/Modal/CancelModal";
// import React, { useState } from "react";
// import { useTranslation } from "react-i18next";

// // import action
// import { cancelOrder } from "../../actions/spotTradeAction";

// // import lib
// import { toastAlert } from "../../lib/toastAlert";

// const CancelOrder = (props) => {
//    const [cancel, buyCancel] = useState(true);

//     const { t, i18n } = useTranslation();

//     // state
//     const [loader, setLoader] = useState();

//     // function
//     const handleCancelOrder = async (e) => {
//         e.preventDefault();
//         if(!window.confirm('Are you sure want to cancel the order ?')){
//             return
//         }

//         setLoader(true);
//         try {
//             let { status, loading, message } = await cancelOrder(
//                 props.orderId
//             );
//             setLoader(loading);
//             if (status == "success") {
//                 toastAlert("success", t(message), "cancelOrder");
//             } else {
//                 toastAlert("error", t(message), "cancelOrder");
//             }
//         } catch (err) {}
//     };

//     return (
//        <> 
//        {cancel && <CancelModal onDismiss={() => buyCancel(false)} />}
//        <button
//             type="button"
//             onClick={handleCancelOrder}
//             className="btn btn-primary text-uppercase py-2"
//             disabled={loader}
//         >
            
//             {loader && <i className="fas fa-spinner fa-spin"></i>}
//             {t("CANCEL")}
//         </button></>
//     );
// };

// export default CancelOrder;