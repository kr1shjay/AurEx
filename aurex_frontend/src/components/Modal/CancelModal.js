// import package
import React from 'react';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';



const CancelModal = (props) => {
    // props
   const [cancel, buyCancel] = useState(true);
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
            <button onClick={(e)=>props.onSumbit(e)}
              type="button"
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