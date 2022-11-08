// import package
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';
// import lib
import { momentFormat } from '../../lib/dateTimeHelper';

const RecentPost = forwardRef((props, ref) => {
    // state
    const [list, setList] = useState([]);
    const { t, i18n } = useTranslation();
    // redux
    const { isAuth } = useSelector(state => state.auth)

    useImperativeHandle(
        ref,
        () => ({
            postRecord(record) {
                setList(record)
            }
        }),
    )

    return (
        <div className="recent_post">
            <h4>{t('RECENT_POST')}</h4>
            {
                list && list.length > 0 && list.map((item, key) => {
                    return (
                        <div key={key}>
                            <div className="flex_details">
                                <span className="text_color_w">{t('POST_ID')}</span>
                                <span className="text_color_blue text-right">#{item.postId}</span>
                            </div>
                            <div className="flex_details">
                                <span className="text_color_w">{t('POSTED_ON')}</span>
                                <span className="text-right clor_black">{momentFormat(item.orderDate, 'DD MMM YYYY HH:mm')}</span>
                            </div>
                            <div className="flex_details">
                                <span className="text_color_w">{t('TYPE')}</span>
                                <span className="text-right clor_black">{item.side}<br />
                                    {item.price} {item.secondCoin}<br />
                                    {item.quantity} {item.firstCoin}<br />
                                    {item.payBy}
                                </span>
                            </div>
                            {/* {
                                isAuth && <div className="flex_details">
                                    <span className="text_color_w"> Status</span>
                                    <span className="text-right text_color_blue"><a href="">Edit My Post</a></span>
                                </div>
                            } */}

                            <hr />
                        </div>
                    )
                })
            }
        </div>
    )
})

export default RecentPost;