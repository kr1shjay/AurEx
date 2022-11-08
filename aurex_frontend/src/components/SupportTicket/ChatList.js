// import package
import React, { useState, useEffect, useRef } from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

// import config
import config from '../../config'

// import component
import ReplyConversation from './ReplyConversation';
import IconButton from './IconButton';
import { useTranslation } from 'react-i18next';

// import action
import { supportIcon } from '../../actions/iconBtnAction'

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

    return (
        <Card>
            <Card.Header onClick={() => supportIcon(dispatch, eventKey)}>
                <h5 className="mb-0">
                    <Accordion.Toggle as={Button} variant="link" eventKey={`${eventKey}`} >
                        <span className="stHeadText subjectWidth"><small>{t('SUBJECT')}</small>{ticketRecord.categoryName}</span>
                        <span className="stHeadText ticketIdWidth"><small>{t('TICKET_ID')}</small>#{ticketRecord.tickerId}</span>
                        <span className="stHeadText statusWidth"><small>{t('STATUS')}</small><span className="yellowText">{capitalize(ticketRecord.status)}</span></span>
                        <IconButton eventKey={eventKey} />
                    </Accordion.Toggle>
                </h5>
            </Card.Header>
            <Accordion.Collapse eventKey={`${eventKey}`}>
                <Card.Body>
                    <p className="metaChatDetails">{t('CREATED_ON')}:{momentFormat(ticketRecord.createdAt)} </p>
                    <div className="row">
                        <div className="col-md-12">
                            <ul className="ticketComments">
                                {
                                    !isEmpty(ticketData) && ticketData.reply && ticketData.reply.length > 0 && ticketData.reply.reverse().map((el, index) => {
                                        if (el.senderId == sender._id) {
                                            return (
                                                <li>
                                                    <div className="ticketUserDetails">
                                                        <div className="userImg"><img src={require("../../assets/images/supportUserImg.jpg")} alt="" className="img-fluid" /></div>
                                                        <p>{t('USER')}</p>
                                                    </div>
                                                    <div>
                                                        {!isEmpty(el.attachment) &&
                                                            <div>
                                                                <a href={`${config.API_URL}/images/support/${el.attachment}`} target="_blank">
                                                                    <p className="attachment_div"><i className="fas fa-paperclip"></i> {t('ATTACHMENT')}</p>
                                                                </a>
                                                            </div>
                                                        }

                                                        <div className="ticketDetails">
                                                            {el.message}
                                                        </div>

                                                    </div>

                                                </li>
                                            )
                                        } else {
                                            return (
                                                <li>
                                                    <div className="ticketUserDetails">
                                                        <div className="userImg">
                                                            <img
                                                                src={require("../../assets/images/supportAdminLogo.jpg")}
                                                                alt=""
                                                                className="img-fluid"
                                                            />
                                                        </div>
                                                        <p>{t('SUPPORT_TEAM')}</p>
                                                    </div>

                                                    <div className="ticketDetails">
                                                        <p className="metaChatDetails">
                                                            {t('ADMIN_RLY')} {momentFormat(el.createdAt)}{/* 01-06-2020  15:35 */}
                                                        </p>
                                                        <p>{el.message}</p>
                                                    </div>
                                                </li>
                                            )
                                        }
                                    })
                                }
                            </ul>
                            {
                                ticketRecord.status == 'open' && <ReplyConversation
                                    receiverId={ticketRecord.adminId}
                                    ticketId={ticketRecord._id}
                                    replyChatFun={replyChatFun}
                                    closeTicketFun={closeTicketFun}
                                />
                            }
                        </div>
                    </div>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    )
}

export default ChatList;