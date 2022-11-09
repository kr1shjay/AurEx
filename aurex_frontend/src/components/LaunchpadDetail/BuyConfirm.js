// import package
import React from 'react';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';



const BuyConfirm = (props) => {
    // props
   const [shows, buyShow] = useState(true);
    return (
        <Modal
      show={shows}
     
      backdrop="static"
      size="md"
      centered
    >
      <Modal.Header>
        <Modal.Title>
          <h4 className="modal-title mt-0">
           Confirm BNB Commitment
          </h4>
        </Modal.Title>
        <button type="button" class="close" onClick={()=>props.onDismiss()}><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>

      </Modal.Header>
      <Modal.Body>
        <div className="modedl_subscribe_content">
        
        <div className='row mt-3'>
            <div className='col-12 col-md-6'>
                <p className='text-white'>BNB amount to commit</p>
            </div>
            <div className='col-12 col-md-6'>
                <p className='text_grey_launch_p text-md-right'>0.1100 BNB</p>
            </div>
        </div>
        <p className='text-white mt-3'>Once successfully committed, your BNB will be <b>temporarily locked and will not be able to be redeemed</b> until the final distribution period, which point the remaining BNB will be automatically sent back to ypur spot wallet</p>
        
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

export default BuyConfirm;