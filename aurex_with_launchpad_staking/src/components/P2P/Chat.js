// import package
import React, { useEffect, Fragment } from 'react';
import { Button } from "@material-ui/core";
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Conversation from './Conversation';
import ConversationDetail from './ConversationDetail';
import { useTranslation } from 'react-i18next';

// import action
import { getOrderDetail, resetOrderDetail } from '../../actions/p2pAction'

const Chat = () => {
    const { orderId } = useParams()
    const history = useHistory();
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation();
    // redux
    const { loader, data } = useSelector((state) => state.p2pOrder)

    // function
    const fetchDetail = async () => {
        try {
            const data = await getOrderDetail(orderId, dispatch);
            if (!data) {
                history.push('/p2p')
            }
        } catch (err) { }
    }

    useEffect(() => {
        if (orderId) {
            fetchDetail(dispatch)
        }
        return () => {
            if (orderId) {
                resetOrderDetail(dispatch)
            }
        }
    }, [])

    return (
        <Fragment>
            {
                loader && <div className="loader loader-1">
                    <div class="loader-outter"></div>
                    <div class="loader-inner"></div>
                </div>
            }
            {
                !loader && data && <GridContainer>
                    <GridItem xs={12} sm={12} md={5} lg={3}>
                        <ConversationDetail
                            detail={data}
                        />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={7} lg={9}>
                        <div className="p2p_card p2p_card_new p-0">
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12} lg={12}>
                                    <div className="table_p2p_section">
                                        <GridContainer>
                                            <Conversation
                                                detail={data}
                                            />
                                            <GridItem xs={12} sm={12} md={12} lg={4}>
                                                <div className="note_section_">
                                                    <div>
                                                        <p>{t('NOTES')}</p>
                                                        <ol>
                                                            <li>{t('CHAT_ONLY_TRADE')} </li>
                                                            <li> {t('AVOID_WORNG_WORDS')}</li>
                                                            <li>{t('TRANSFER_PAYMENT_BUTTON')}</li>

                                                        </ol>
                                                    </div>

                                                    <div className="support_section">
                                                        <p>{t('NEED_SUPPORT')}</p>
                                                        <Button onClick={() => history.push('/support-ticket')}>{t('CREAT_SUPPORT_TICKET')}</Button>
                                                    </div>

                                                </div>
                                            </GridItem>
                                        </GridContainer>
                                    </div>
                                </GridItem>
                            </GridContainer>
                        </div>
                    </GridItem>
                </GridContainer>
            }
        </Fragment>
    )
}

export default Chat;