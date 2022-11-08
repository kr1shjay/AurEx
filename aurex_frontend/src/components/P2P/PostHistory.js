// import package
import React, { useEffect, useState, Fragment, forwardRef, useImperativeHandle } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';
import { Scrollbars } from 'react-custom-scrollbars-2';

// import component
import EditPostAd from '../EditPostAd'
import CanelPostModal from './CanelPostModal'

// import action
import { postOrderList } from '../../actions/p2pAction'

// import lib
import { momentFormat } from '../../lib/dateTimeHelper'
import { toFixed } from '../../lib/roundOf';

const PostHistory = forwardRef((props, ref) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    // state
    const [hasMore, setHasMore] = useState(true)
    const [orderData, setOrderData] = useState({
        page: 1,
        limit: 10,
    })
    const [modal, setModal] = useState({
        show: false,
        record: {}
    })
    const [cancelModal, setCancelModal] = useState({
        show: false,
        record: {}
    })

    const { currentPage, page, limit } = orderData

    // redux
    const { loader, count, data } = useSelector(state => state.p2pPost);

    // function
    const fetchMoreData = () => {
        if (data.length == count) {
            setHasMore(false)
            return;
        }
        setOrderData({
            page: page + 1,
            limit
        })
        let reqData = {
            page: page + 1,
            limit
        }
        postOrderList(reqData, dispatch)
    }

    const closeModal = (type = 'editModal') => {
        if (type == 'editModal') {
            setModal({
                show: false,
                record: {}
            })
        } else if (type == 'cancelModal') {
            setCancelModal({
                show: false,
                record: {}
            })
        }
    }

    useEffect(() => {
        let reqData = {
            page: page,
            limit
        }
        postOrderList(reqData, dispatch)
    }, [])

    const refetch = () => {
        let reqData = {
            page: page,
            limit
        }
        postOrderList(reqData, dispatch)
    }

    useImperativeHandle(
        ref,
        () => ({
            refetchData() {
                refetch()
            }
        }),
    )
    // console.log('data.status---',data)

    return (
        <div className="p2p_card">
            <EditPostAd
                show={modal.show}
                record={modal.record}
                onHide={closeModal}
                refetch={refetch}
            />
            <CanelPostModal
                show={cancelModal.show}
                record={cancelModal.record}
                onHide={closeModal}
                refetch={refetch}
            />
            <h3 className="login_title_8">{t('POST_HISTORY')}</h3>
            <InfiniteScroll
                dataLength={data.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4>{t('LOADING')}</h4>}
                height={500}
            >

                {
                    !loader && data && data.length > 0 && data.map((item, key) => {
                        return (
                            <Fragment key={key}>
                                <div className="recent_post mr-2">
                                    <div>
                                        <div className="flex_details">
                                            <span className="text_color_w">{t('POST_ID')}</span>
                                            <span className="text_color_blue text-right">{item.postId}</span>
                                        </div>
                                        <div className="flex_details">
                                            <span className="text_color_w">{t('POSTED_ON')}</span>
                                            <span className="text-right clor_black">{momentFormat(item.orderDate, 'YYYY-MM-DD HH:mm')}</span>
                                        </div>
                                        <div className="flex_details">
                                            <span className="text_color_w">{t('TYPE')}</span>
                                            <span className="text-right clor_black">{item.side}<br />
                                                {toFixed(item.quantity - item.filledQuantity, 8)} {item.firstCoin}<br />
                                                {item.price}<br />
                                                {item.payBy}
                                            </span>
                                        </div>
                                        {
                                            item.status == 'open' && <div className="flex_details">
                                                <span className="text_color_w"> {t('STATUS')}</span>
                                                <span className="text-right text_color_blue">
                                                    <a onClick={() => setCancelModal({
                                                        'show': true,
                                                        'record': item
                                                    })}>{t('CANCEL')}</a><i>|</i><a onClick={() => setModal({
                                                        'show': true,
                                                        'record': item
                                                    })}>{t('EDIT_MY_POST')}</a>
                                                </span>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <hr />
                            </Fragment>
                        )
                    })
                }

                {
                    !loader && data && data.length == 0 &&
                    <h4 className="text-center">{t('NO_RECORD')}</h4>
                }
            </InfiniteScroll>
        </div>
    )
})

export default PostHistory;