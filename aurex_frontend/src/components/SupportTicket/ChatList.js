// import package
import React, { useState, useEffect, useRef } from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toastAlert } from '../../lib/toastAlert';

// import config
import config from '../../config'

// import component
import ReplyConversation from './ReplyConversation';
import IconButton from './IconButton';
import { useTranslation } from 'react-i18next';

// import action
import { supportIcon } from '../../actions/iconBtnAction'
import { closeTicket } from '../../actions/supportAction';

// import lib
import isEmpty from '../../lib/isEmpty';
import { capitalize } from '../../lib/stringCase'
import { momentFormat } from '../../lib/dateTimeHelper';


const ChatList = (props) => {
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation();
    // props
    const { ticketRecord, eventKey, sender } = props

    // state
    const [ticketData, setTicketData] = useState({})
    // function
    const replyChatFun = (replyMsg) => {
        setTicketData({ ...ticketData, ...{ 'reply': replyMsg } })
    }

    const closeTicketFun = (status) => {
        setTicketData((prev) => {
            return { ...prev, 'status': status }
        })
        window.location.reload()
    }

    useEffect(() => {
        if (ticketRecord) {
            setTicketData(ticketRecord)
        }
    }, [ticketRecord])

    const handleCloseTicket = async (e) => {
        e.preventDefault()
        let reqData = {
            'ticketId': ticketRecord._id
        }
        try {
            const { status, loading, error, message, result } = await closeTicket(reqData);
            if (status == 'success') {
                toastAlert('success', message, 'supportTicket');
                setTimeout(() => {
                    closeTicketFun(result.status)
                }, 1000)

            }
        } catch (err) { }
    }

    return (
        <Card>
            {console.log("statusClose in CHATLIST",ticketRecord)}
            <Card.Header className='support_header_new' onClick={() => supportIcon(dispatch, eventKey)}>
                <h5 className="mb-0">
                   
                        <span className="stHeadText subjectWidth"><small>{t('SUBJECT')}</small>{ticketRecord.categoryName}</span>
                        <span className="stHeadText ticketIdWidth"><small>{t('TICKET_ID')}</small>#{ticketRecord.tickerId}</span>
                        <span className="stHeadText statusWidth"><small>{t('STATUS')}</small><small className="yellowText">{capitalize(ticketRecord.status)}</small></span>
                        { ticketRecord.status == "open" && <button className='btn btn-primary btn-sm-close' onClick={handleCloseTicket}>Close</button> }
                       
                  
                </h5>
            </Card.Header>
         
        </Card>
    )
}

export default ChatList;