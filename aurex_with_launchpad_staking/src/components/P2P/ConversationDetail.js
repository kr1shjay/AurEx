// import package
import React, { useState, useEffect, useContext } from 'react';
import { Button } from "@material-ui/core";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

// import context
import SocketContext from '../Context/SocketContext';

// import component
import ConfirmPayment from './ConfirmPayment'
import CodeVerification from './CodeVerification'

// import action
import {
    cancelOrder,
    transferPayment,
    orderUpdate,
    releaseAsset,
    disputeOrder,
    stopTimer
} from '../../actions/p2pAction'

// import lib
import { toastAlert } from '../../lib/toastAlert'
import { useTranslation } from 'react-i18next';
const initialFormValue = {
    'code': '',
}

const ConversationDetail = () => {
    const socketContext = useContext(SocketContext);
    const { orderId } = useParams();
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation();
    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [modal, setModal] = useState({
        show: false,
    })
    const [verificationModal, setVerificationModal] = useState({
        show: false,
    })

    // redux
    const { userId } = useSelector(state => state.auth);
    const { data } = useSelector(state => state.p2pOrder)
    const { twoFAStatus } = useSelector(state => state.account)

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;

        if (name == 'code') {
            if (!(value == '' || (/^[0-9\b]+$/.test(value) && value.length <= 6))) {
                return
            }
        }
        let formData = { ...formValue, ...{ [name]: value } }
        setFormValue(formData)
    }

    const handleCancel = async () => {
        try {
            const { status, loading, message } = await cancelOrder(orderId, dispatch);
            if (status == 'success') {
                toastAlert('success', message, 'cancelOrder')
            } else {
                toastAlert('error', message, 'cancelOrder')
                window.location.reload();
            }
        } catch (err) { }
    }

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            if (!modal.show) {
                setModal({
                    show: true,
                })
                return
            }

            const { status, loading, message } = await transferPayment(orderId, dispatch)
            if (status == 'success') {
                toastAlert('success', message, 'transferPayment')
                setModal({
                    show: false,
                })
            } else {
                toastAlert('error', message, 'transferPayment')
                window.location.reload();
            }
        } catch (err) {
        }
    }

    const handleReleaseAsset = async (e) => {
        e.preventDefault();
        try {
            if (twoFAStatus != 'enabled') {
                toastAlert('error', '2FA not enabled. Please enable 2FA to release asset.', 'releaseAsset')
                return
            }

            if (!verificationModal.show) {
                setVerificationModal({
                    show: true,
                })
                return
            }

            let reqData = {
                orderId,
                twoFACode: formValue.code
            }
            const { status, loading, message } = await releaseAsset(reqData, dispatch)
            if (status == 'success') {
                toastAlert('success', message, 'releaseAsset')
                setVerificationModal({
                    show: false,
                })
            } else {
                toastAlert('error', message, 'releaseAsset')
                window.location.reload();
            }
        } catch (err) {
        }
    }

    const handleDispute = async (e) => {
        e.preventDefault();
        try {
            const { status, loading, message } = await disputeOrder(orderId, dispatch)
            if (status == 'success') {
                toastAlert('success', message, 'disputeOrder')
            } else {
                toastAlert('error', message, 'disputeOrder')
                window.location.reload();
            }
        } catch (err) {
        }
    };

    const closeModal = () => {
        setModal({
            show: false,
        })
    }

    const closeVerificationModal = () => {
        setVerificationModal({
            show: false
        })
    }

    const formatRemainingTime = time => {
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds}`;
    };

    const renderTime = ({ remainingTime }) => {
        if (remainingTime === 0) {
            return <div className="timer">Too late...</div>;
        }

        return (
            <div className="timer">
                <div className="value">{formatRemainingTime(remainingTime)}</div>
            </div>
        );
    };

    useEffect(() => {
        //socket
        socketContext.socket.on('p2pChat', (result) => {
            if (result.orderId == orderId) {
                orderUpdate(result, 'chat', dispatch)
            }
        })

        socketContext.socket.on('p2pOrderCancel', (result) => {
            if (result.orderId == orderId) {
                orderUpdate(result, 'cancelled', dispatch)
            }
        })

        socketContext.socket.on('p2pTransferPay', (result) => {
            if (result.orderId == orderId) {
                orderUpdate(result, 'transferPayment', dispatch)
            }
        })

        socketContext.socket.on('p2pReleaseAsset', (result) => {
            if (result.orderId == orderId) {
                orderUpdate(result, 'releaseAsset', dispatch)
            }
        })

        socketContext.socket.on('p2pOrderDispute', (result) => {
            if (result.orderId == orderId) {
                orderUpdate(result, 'disputed', dispatch)
            }
        })
    }, [])

    return (
        <div className="p2p_card p2p_card_new">
            <ConfirmPayment
                show={modal.show}
                onHide={closeModal}
                onSubmit={handlePayment}
            />
            <CodeVerification
                show={verificationModal.show}
                onHide={closeVerificationModal}
                onSubmit={handleReleaseAsset}
                onChange={handleChange}
                formValue={formValue}
            />

            {
                userId == data.sellUserId && <h3 className="login_title_8"><span className="colo_ash_secton">{t('P2P')} - </span>{t('SELL_BITCOIN')}</h3>
            }


            {
                userId == data.buyUserId && <h3 className="login_title_8"><span className="colo_ash_secton">{t('P2P')} - </span>{t('BUY_BITCOIN')}</h3>
            }

            <div className="recent_post">
                <div>
                    <div className="flex_details">
                        <span className="text_color_w">{t('FINAL_AMOUNT')}</span>
                        <span className="text_color_blue text-right">{data.payValue} {data.secondCoin}</span>
                    </div>
                    <div className="flex_details">
                        <span className="text_color_w">{t('PRICE')}</span>
                        <span className="text_color_blue text-right">{data.price} {data.secondCoin}</span>
                    </div>
                    <div className="flex_details">
                        <span className="text_color_w">{t('Quantity')}</span>
                        <span className="text_color_blue text-right">{data.receiveValue} {data.firstCoin}</span>
                    </div>
                </div>
            </div>

            <hr />
            <div className="text-center chat_conte_po">
                <h3>{t('PAYMENT_TO_MADE')}</h3>
                {/* <img src={require("../assets/images/postconfirm.png")} alt="" className="img-fluid" /> */}
                {
                    ['open', 'paid'].includes(data.status) && <div className="new_timer">
                        <CountdownCircleTimer
                            isPlaying
                            duration={data.initialDuration}
                            initialRemainingTime={data.duration}
                            colors={[
                                ['#d4b768', 0.33],
                                ['#d4b768', 0.33],
                                ['#d4b768', 0.33],
                            ]}
                            onComplete={() => {
                                stopTimer(dispatch)
                            }}
                        >
                            {renderTime}
                        </CountdownCircleTimer>
                    </div>
                }

                <h3>{t('MINUTES')}</h3>
                <p>{t('PLEASE_MAKE_PAYMENT')}</p>
                <div className="button_section_po_chat">
                    <div className="submit_btn w70_i">
                        {
                            ['open'].includes(data.status) && userId == data.buyUserId && <Button onClick={handlePayment}>{t('TRANSFER_PAYMENT')}</Button>
                        }

                        {
                            userId == data.sellUserId && ['open', 'paid'].includes(data.status) && data.duration > 0 && <Button onClick={handleReleaseAsset}>{t('RELEASE_ASSET')}</Button>
                        }

                        {
                            ['paid'].includes(data.status) && data.duration == 0 && <Button onClick={handleDispute}> {t('DISPUTE_TRADE')}</Button>
                        }

                    </div>
                    {
                        ['open'].includes(data.status) && <a href="#" onClick={handleCancel}>{t('CANCEL_ORDER')}</a>
                    }

                </div>
            </div>
        </div>
    )
}

export default ConversationDetail;