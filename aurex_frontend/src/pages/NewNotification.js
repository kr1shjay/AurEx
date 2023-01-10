import React, { useState, useEffect,useContext } from 'react';
import { useDispatch } from 'react-redux';
// import context
import SocketContext from '../components/Context/SocketContext'
// import lib
import { dateTimeFormat, momentFormat } from '../lib/dateTimeHelper';
import { getNotification, unReadNotice,readNotification ,noticePopup,readsingelNotification} from '../actions/notificationAction'


const NewNotification = () =>{
  const socketContext = useContext(SocketContext)
let dispatch = useDispatch()
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);

  // function
  const fetchNotificationHistory = async () => {
    try {
      const { status, loading, ReadMsg } = await getNotification();
      setLoader(loading)
      if (status == 'success') {
        console.log("read",ReadMsg)
        setData(ReadMsg)
      }
    } catch (err) { }
  }
  const readMess = async (id) => {
    let data = {id:id}
    let { staus, message } = await readsingelNotification(data);
    //noticePopup(dispatch, false);

  };

  const readAllMsg = async () => {
    let { staus, message } = await readNotification();
    noticePopup(dispatch, false);
  };
  useEffect(() => {
    fetchNotificationHistory()
    socketContext.socket.on('read',(data)=>{
      setData(data)
    })
    document.title="AUREX"
  }, [socketContext])
    return(
    <>
       <div className='newnotify'>
       <button className="btn btn-link ml-auto text-capital f-12 py-0 pr-2 shrink-0 pl-2 d-sm-block d-none" onClick={(e)=>{readAllMsg()}}>
        Mark all as read</button>
          <ul className='pl-0'>
            {data && data.length > 0 ? (
                <>
                {data.map((val,index)=>(
                    <li className= {val.isRead ?'read' :'unread'}>
                    <div className='d-flex align-items-center pl-sm-2'>
                        <span className='stat mr-2 shrink-0'></span>
                        <div>
                            <p className='f-12 lighttxt'>{val.description}</p>
                            <p className='text-muted f-12'>{momentFormat(val.createdAt, 'YYYY-MM-DD HH:mm')}</p>
                        </div>
                        <button className='btn btn-link ml-auto text-capital f-12 py-0 pr-2 shrink-0 pl-2 d-sm-block d-none' onClick={(e)=>{readMess(val._id)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M374.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 178.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l160-160zm96 128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7 86.6 297.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l256-256z"/></svg>
                        Mark as read</button>
                    </div>
                </li>
                ))}
                </>
            ):(<p>There is no data</p>)}
          </ul>
       </div>
    </>)
}

export default NewNotification