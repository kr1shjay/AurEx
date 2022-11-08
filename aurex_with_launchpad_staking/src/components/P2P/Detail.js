// import package
import React, { useState, useEffect } from 'react';
import clsx from 'classnames';
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string';

// import component
import GridItem from "components/Grid/GridItem.js";
import OrderList from './OrderList'

// import action
import { detail, allPostAd } from '../../actions/p2pAction'

// import lib
import isLogin from '../../lib/isLogin';
import isEmpty from '../../lib/isEmpty';

const initialSearch = {
    'price': '',
    'secondCoin': 'all',
    'payBy': 'all'
}

const Detail = (props) => {
    const { recentRef } = props;
    const location = useLocation();
    const query = queryString.parse(location.search);

    // state
    const [search, setSearch] = useState(initialSearch)
    const [selCoin, setSelCoin] = useState('')
    const [pair, setPair] = useState([])
    const [orderList, setOrderList] = useState({
        'buyOrder': [],
        'sellOrder': []
    })
    const [data, setData] = useState({})
    const [loader, setLoader] = useState(false);

    // redux
    const currencyData = useSelector(state => state.currency)
    const { isAuth, userId } = useSelector(state => state.auth);

    // function
    const fetchDetail = async (reqData) => {
        try {
            setLoader(true)
            const { status, loading, result } = await detail(reqData);
            setLoader(loading)
            if (status == 'success') {
                setPair(result.pairData)
                setOrderList({
                    'buyOrder': result.buyOrder,
                    'sellOrder': result.sellOrder
                })
                recentRef.current.postRecord(result.recentPost)
                if (query.firstCoin) {
                    let doc = result.pairData.find(el => el._id.firstCoin == query.firstCoin)
                    if (doc) {
                        setData(doc)
                        setSelCoin(doc._id.firstCoin)
                    } else {
                        setData(result.pairData[0])
                        setSelCoin(result.pairData[0]._id.firstCoin)
                    }
                } else if (result.pairData && result.pairData.length > 0) {
                    setData(result.pairData[0])
                    setSelCoin(result.pairData[0]._id.firstCoin)
                }
            }
        } catch (err) {
        }
    }

    const refetchOrderList = async (reqData = {}) => {
        try {
            if (isLogin() && isAuth) {
                reqData['userId'] = userId;
            }

            setLoader(true)
            const { status, loading, result } = await allPostAd(reqData);
            setLoader(loading)
            if (status == 'success') {
                setOrderList({
                    'buyOrder': result.buyOrder,
                    'sellOrder': result.sellOrder
                })
            }
        } catch (err) {
        }
    }

    useEffect(() => {
        let reqData = {}
        if (!isEmpty(query)) {
            let searchQuery = search
            if (query.firstCoin) {
                reqData['firstCoin'] = query.firstCoin;
                setSelCoin(query.firstCoin)
            }
            if (query.secondCoin) {
                reqData['secondCoin'] = query.secondCoin;
                searchQuery['secondCoin'] = query.secondCoin;
            }
            if (query.payBy) {
                reqData['payBy'] = query.payBy;
                searchQuery['payBy'] = query.payBy;
            }
            if (query.price) {
                reqData['price'] = query.price;
                searchQuery['price'] = query.price;
            }
            setSearch(searchQuery)
        }

        if (isLogin() && isAuth) {
            reqData['userId'] = userId;
            fetchDetail(reqData)
        } else if (!isLogin()) {
            fetchDetail(reqData)
        }
    }, [isAuth])

    return (
        <GridItem xs={12} sm={12} md={12} lg={12}>
            {
                loader /* && data && data.length == 0 */ && <div className="loader loader-1">
                    <div class="loader-outter"></div>
                    <div class="loader-inner"></div>
                </div>
            }

            {
                !loader && <div className="table_p2p_section">
                    <div className="solo_pading pb-0">
                        <ul class="nav nav-tabs p-0">
                            {
                                pair && pair.length > 0 && pair.map((item, key) => {
                                    let curDoc = currencyData.find(el => el._id == item._id.firstCoinId)
                                    return (
                                        <li key={key} onClick={() => {
                                            let reqQuery = {
                                                'firstCoin': item._id.firstCoin
                                            }
                                            setSelCoin(item._id.firstCoin)
                                            setData(item)
                                            refetchOrderList(reqQuery)
                                        }}>
                                            <a className={clsx({ 'active': selCoin == item._id.firstCoin })}>
                                                <img src={curDoc && curDoc.image} alt="logo" className="img-fluid" />{item._id.firstCoin}
                                            </a>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className="">
                        <div class="tab-content">
                            <OrderList
                                data={data}
                                orderList={orderList}
                                refetch={refetchOrderList}
                                setSearch={setSearch}
                                search={search}
                                isAuth={isAuth}
                                selCoin={selCoin}
                            />
                        </div>
                    </div>
                </div>
            }

        </GridItem>
    )
}

export default Detail;