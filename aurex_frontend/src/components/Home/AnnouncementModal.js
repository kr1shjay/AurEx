
import React from 'react';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import config from "../../config/index.js"

const AnnouncementModal = (props)=>{
console.log(props,"props")
const [isShowAd,setIsShowAd]=useState(true)

return(
<Modal
show={isShowAd}
backdrop="static"
size="lg"
centered
>
<Modal.Header>
    <Modal.Title>
        Announcement
    </Modal.Title>
    <button type="button" class="close" onClick={()=>props.onDismiss()}><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
</Modal.Header>
<Modal.Body>
<div className='banner_carousel_modal'>
<img src={`${config.API_URL}/images/anouncement/${props.anncData[props.index].image}`} alt="Banner" className="img-fluid" />
</div>
<p className='text-white mt-3'>{props.anncData[props.index].content}</p>
<p>
    <b>End Date:</b>
    <span>{props.anncData[props.index].endDateTime}</span>
</p>
<button type="button" class="btn btn-bordered-secondary w-100 mt-3 mr-3"  onClick={()=>props.onDismiss()}>Cancel</button>

</Modal.Body>
</Modal>
    )

}
export default AnnouncementModal