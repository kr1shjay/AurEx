// import package
import React, { useState, useEffect } from 'react';
import { Button, MenuItem, Select } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import ConfirmOrder from './ConfirmOrder';

// import lib
import { toFixed } from '../../lib/roundOf'
import isEmpty from '../../lib/isEmpty';
import { completionValue } from '../../lib/calculation'
import { useTranslation } from 'react-i18next';
const OrderList = (props) => {
    const history = useHistory();
    const { t, i18n } = useTranslation();
    // props
    const { data, isAuth, refetch, orderList: { buyOrder, sellOrder }, search, setSearch, selCoin } = props;

    const { price, secondCoin, payBy } = search;

    // state
    const [payment, setPayment] = useState([])
    const [modal, setModal] = useState({
        show: false,
        record: {}
    })

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let query = { ...search, [name]: value }
        setSearch(query)
    }

    const closeModal = () => {
        setModal({
            show: false,
            record: {}
        })
    }

    const handleSearch = (e) => {
        e.preventDefault();
        let reqSearch = {};
        reqSearch['firstCoin'] = selCoin;
        if (!isEmpty(price)) reqSearch['price'] = price;
        if (!isEmpty(secondCoin) && secondCoin != 'all') reqSearch['secondCoin'] = secondCoin;
        if (!isEmpty(payBy) && payBy != 'all') reqSearch['payBy'] = payBy;
        refetch(reqSearch)
        history.replace(`/p2p`)
    }

    useEffect(() => {
        if (data && data.pair && data.pair.length > 0) {
            if (secondCoin == 'all') {
                let allPayment = [...new Set(data.pair.flatMap(({ payment }) => payment))]
                setPayment(allPayment)
            } else {
                let secCoinDoc = data.pair.find(el => el.secondCoin == secondCoin)
                if (secCoinDoc) {
                    setPayment(secCoinDoc.payment)
                    if (payBy != 'all') {
                        let query = { ...search, 'payBy': secCoinDoc.payment[0] }
                        setSearch(query)
                    }
                }
            }
        }
    }, [data, secondCoin])

    return (
        <div>
            <ConfirmOrder
                show={modal.show}
                record={modal.record}
                onHide={closeModal}
            />
            <GridContainer className="solo_pading pb-0">
                <GridItem xs={12} sm={12} md={12} lg={5}>
                    <div className="select_inbut">
                        <label>{t('ENTER_AMOUNT')}</label>
                        <div className="input_flex_section">
                            <div className="before_content">
                                <input
                                    type="text"
                                    name="price"
                                    value={price}
                                    onChange={handleChange}
                                    className="input_befor"
                                />
                            </div>
                            <Select
                                value={secondCoin}
                                name={'secondCoin'}
                                onChange={handleChange}
                                className="input_select input_diply_non"
                            >
                                <MenuItem value={'all'} >{t('ALL')}</MenuItem>
                                {
                                    data && data.pair && data.pair.length > 0 && data.pair.map((item, key) => {
                                        return (
                                            <MenuItem value={item.secondCoin}>{item.secondCoin}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </div>
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={5}>
                    <div className="select_inbut">
                        <label>{t('PAY_BY')}</label>
                        <div className="input_flex_section">
                            <Select
                                value={payBy}
                                name={'payBy'}
                                onChange={handleChange}
                                className="input_select w-100 input_diply_non">
                                <MenuItem value={'all'} >{t('ALL_PAYMENT')}</MenuItem>
                                {
                                    payment && payment.length > 0 && payment.map((item, key) => {
                                        return (
                                            <MenuItem key={key} value={item}> {item}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </div>
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={2}>
                    <div className="submit_btn simple_padind">
                        <Button onClick={handleSearch}>Search</Button>
                    </div>
                </GridItem>
            </GridContainer>
            {/* <GridContainer className="bye_sell_tlr_bg">
                <GridItem xs={12} sm={12} md={12} lg={6}>
                    <h4 className="bye_sell_tlr text_grreni" >Buy</h4>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={6}>
                    <h4 className="bye_sell_tlr text_reeed">Sell</h4>

                </GridItem>
            </GridContainer> */}
            <GridContainer className="solo_pading pb-0">
                <GridItem xs={12} sm={12} md={12} lg={6} className="paddin_right_o">
                    <GridContainer className="bye_sell_tlr_bg">
                        <GridItem xs={12} sm={12} md={12} lg={12}>
                            <h4 className="bye_sell_tlr text_grreni" >Buy</h4>
                        </GridItem>
                    </GridContainer>
                    <div className="table-responsive">
                        <table class="table table-striped table_buy_secion_sell">
                            <tbody>
                                {
                                    buyOrder && buyOrder.length > 0 && buyOrder.map((item, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>
                                                    <div className="User_id_section">
                                                        <h5>{t('USER_ID')} {item.postId}</h5>
                                                        <p>{item.orderCnt} {t('TRADES')}, </p>
                                                        <span>{toFixed(completionValue(item.quantity, item.filledQuantity))}% {t('COMPLETION')}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="amount_section">
                                                        <h5>{item.price} {item.secondCoin}</h5>
                                                        <p>{t('AVL')}:<span> {item.remainingQty} {item.firstCoin}</span></p>
                                                        <p>{t('LIMIT')}:<span>  {item.minLimit} {item.secondCoin} - {item.maxLimit} {item.secondCoin} </span></p>
                                                        <span>{item.payBy}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="table_button">
                                                        <Button
                                                            className="sell"
                                                            onClick={() => {
                                                                if (isAuth) {
                                                                    setModal({
                                                                        'show': true,
                                                                        'record': item
                                                                    })
                                                                    return
                                                                }

                                                                history.push('/login')
                                                            }}
                                                        >
                                                            {t('SELL')}
                                                        </Button>
                                                    </div>
                                                </td>

                                            </tr>
                                        )
                                    })
                                }
                                {
                                    buyOrder && buyOrder.length == 0 && <div className='text-center'>{t('NO_RECORD')}</div>
                                }
                            </tbody>
                        </table>
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={6} className="paddin_left_o">
                    <GridContainer className="bye_sell_tlr_bg">
                        <GridItem xs={12} sm={12} md={12} lg={12}>
                            <h4 className="bye_sell_tlr text_reeed">{t('SELL')}</h4>
                        </GridItem>
                    </GridContainer>
                    <div className="table-responsive">
                        <table class="table table-striped table_buy_secion_sell">
                            <tbody>
                                {
                                    sellOrder && sellOrder.length > 0 && sellOrder.map((item, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>
                                                    <div className="User_id_section">
                                                        <h5>{t('USER_ID')}{item.postId}</h5>
                                                        <p>{item.orderCnt} {t('TRADES')}, </p>
                                                        <span>{toFixed(completionValue(item.quantity, item.filledQuantity))}% {t('COMPLETION')}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="amount_section">
                                                        <h5>{item.price} {item.secondCoin}</h5>
                                                        <p>{t('AVL')}:<span> {item.remainingQty} {item.firstCoin}</span></p>
                                                        <p>{t('LIMIT')}:<span> {item.minLimit} {item.secondCoin}  - {item.maxLimit} {item.secondCoin} </span></p>

                                                        <span>{item.payBy}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="table_button">
                                                        <Button
                                                            onClick={() => {
                                                                if (isAuth) {
                                                                    setModal({
                                                                        'show': true,
                                                                        'record': item
                                                                    })
                                                                    return
                                                                }

                                                                history.push('/login')
                                                            }}
                                                        >
                                                            {t('BUY')}
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                {
                                    sellOrder && sellOrder.length == 0 && <div className='text-center'>{t('NO_RECORD')}</div>
                                }
                            </tbody>
                        </table>
                    </div>
                </GridItem>
            </GridContainer>
        </div>
    )
}

export default OrderList