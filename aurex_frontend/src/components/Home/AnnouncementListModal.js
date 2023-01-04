import { FlashOnRounded } from '@material-ui/icons';
import React from 'react';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import config from "../../config/index.js"
import { momentFormat } from "../../lib/dateTimeHelper"
import AnnouncementModal from './AnnouncementModal.js';

const AnnouncementListModal = (props)=>{
const [isShowAdlist,setShowList]=useState(true)
const [isShowAd,setIsShowAd]=useState(false)
const [index,setIndex]=useState(0)
const {anncData,onDismiss}=props

return(
<Modal
show={isShowAdlist}
backdrop="static"
size="lg"
centered
>
<Modal.Header>
    <Modal.Title>
        Announcements List
    </Modal.Title>
    <button type="button" class="close" onClick={()=>props.onDismiss()}><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
</Modal.Header>
{anncData && anncData.length > 0 ? (
<>
<Modal.Body>
{anncData.map((val,index)=>(
    <>
   <div className='d-flex align-items-center  mob_res_block_md' 
   onClick={()=>{
    setIndex(index);
    setIsShowAd(true)
}}>
    <div className='banner_carousel_modal bane_car_margin'>
    <img src={`${config.API_URL}/images/anouncement/${val.image}`} alt="Banner" className="img-fluid" />
    </div>
    <div className='ml-3'>
    <p className='text-white mt-3'>
        {val.content}
        </p>
    <p>
        <b>End Date:</b>
         <span>{momentFormat(val.endDateTime,"YYYY-MM-DD")}</span>
    </p>  
    </div>
    </div>
    <hr className="hr_grey mt-2"></hr>
    </>
))}
{isShowAd && <AnnouncementModal index={index} anncData={anncData} onDismiss={()=>{setIsShowAd(false)}}/>}
<button type="button" class="btn btn-bordered-secondary w-100 mt-3 mr-3"  onClick={()=>props.onDismiss()}>close</button>
</Modal.Body>
</>):(<Modal.Body>
        There is no records found
    </Modal.Body>) }

</Modal>
    )

}
export default AnnouncementListModal