// import package
import React from 'react';
import clsx from 'classnames';
import { useSelector } from 'react-redux'
import { TimeAgo } from "@n1ru4l/react-time-ago";
import { useTranslation } from 'react-i18next';
// import config
import config from '../../config'

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import SendMessage from './SendMessage'

// import lib
import isEmpty from '../../lib/isEmpty';
import { momentFormat } from '../../lib/dateTimeHelper'

const Conversation = (props) => {
    // props
    const { detail } = props
    const { t, i18n } = useTranslation();
    // redux
    const { userId } = useSelector(state => state.auth);
    const { data, chat } = useSelector((state) => state.p2pOrder)

    return (
        <GridItem xs={12} sm={12} md={12} lg={8} className="position_border_o">
            <div className="chat_detail_flex">
                <p>{t('CREATED_TIME')}: <span>{momentFormat(data.createdAt, 'DD MMM YYYY HH:mm')}</span></p>
                <p>{t('ORDER_ID')}:  <span> {data.orderId}</span></p>
            </div>
            <div className="chat_box_dark">

                <GridContainer>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                        <div className="chat_message_section">
                            {
                                chat && chat.length > 0 && chat.map((item, key) => {
                                    return (
                                        <div
                                            key={key}
                                            className={clsx('message_section', { "message_send": item.senderId == userId }, { "messAge_recive": item.receiverId == userId }, { "messAge_recive": item.admin })}
                                        >
                                            <div>
                                                <p>
                                                    {item.message}
                                                    {!isEmpty(item.attachment) && <a href={`${config.API_URL}/p2p/${item.attachment}`} target="_blank">                                                        
                                                        <p className="attachment_div"><i className="fas fa-paperclip"></i> {t('ATTACHMENT')}</p>
                                                    </a>}
                                                    {item.admin && <span className="msg_admin">{t('ADMIN')}</span>}
                                                    <span>
                                                        {
                                                            <TimeAgo date={new Date(item.createdAt)}>
                                                                {({ value }) => value}
                                                            </TimeAgo>
                                                        }
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                        <div className="footer_chat">
                            <div className="form-group">
                                <div>
                                    {
                                        ['open', 'paid'].includes(data.status) && <SendMessage
                                            detail={detail}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    </GridItem>
                </GridContainer>

            </div>
        </GridItem>
    )
}

export default Conversation;