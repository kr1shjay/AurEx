// import package
import React, { useState, useEffect } from 'react';
import { Button, MenuItem, Select } from "@material-ui/core";
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
// import action
import { getPairList } from '../../actions/p2pAction'

// import lib
import isEmpty from '../../lib/isEmpty'
import { capitalize } from '../../lib/stringCase'

const initialSearch = {
    'side': 'sell',
    'price': '',
}

const P2pTrading = (props) => {
    const dispatch = useDispatch()
    const history = useHistory();
    const { t, i18n } = useTranslation();
    // state
    const [search, setSearch] = useState(initialSearch)
    const [firstCoin, setFirstCoin] = useState('')
    const [secondCoin, setSecondCoin] = useState('')
    const [payBy, setPayBy] = useState('')
    const [pairList, setPairList] = useState([])
    const [payment, setPayment] = useState([])

    const { side, price } = search;

    // redux
    const { isAuth } = useSelector(state => state.auth);
    const p2pPair = useSelector(state => state.p2pPair)

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let formData = { ...search, [name]: value }
        formData[name] = value
        setSearch(formData)
    }

    const handleFirstCoin = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFirstCoin(value)

        let data = p2pPair.find(el => el._id.firstCoin == value)
        if (data) {
            setPairList(data)
            if (data.pair && data.pair.length > 0) {
                setSecondCoin(data.pair[0].secondCoin)
                setPayment(data.pair[0].payment)
                setPayBy(data.pair[0].payment[0])
            }
        }
    }

    const handleSecondCoin = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setSecondCoin(value)

        let data = pairList.pair.find(el => el.secondCoin == value)
        if (data) {
            setPayment(data.payment)
            setPayBy(data.payment[0])
        }
    }

    const handlePayBy = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setPayBy(value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isAuth) {
            let reqQuery = {
                side,
                firstCoin,
                secondCoin,
                payBy
            }
            if (!isEmpty(price) && !isNaN(price)) {
                reqQuery['price'] = price
            }
            history.push(`/p2p?${queryString.stringify(reqQuery)}`)
            return
        }
        history.push('/login')
        return
    }

    useEffect(() => {
        if (isEmpty(p2pPair)) {
            getPairList(dispatch)
        }
    }, [])

    useEffect(() => {
        if (!isEmpty(p2pPair) && p2pPair.length > 0) {
            setFirstCoin(p2pPair[0]._id.firstCoin)
            setPairList(p2pPair[0])
            if (p2pPair[0] && p2pPair[0].pair && p2pPair[0].pair.length > 0) {
                setSecondCoin(p2pPair[0].pair[0].secondCoin)
                setPayment(p2pPair[0].pair[0].payment)
                setPayBy(p2pPair[0].pair[0].payment[0])
            }
        }
    }, [p2pPair])
    return (
        <div className="p2p-fonr_section" data-aos="zoom-in" data-aos-duration="1000">
            <h1>{t('P2P_TRADING')}</h1>
            {/* <p>{t('PARAGRAPH_6')} </p> */}
            <div dangerouslySetInnerHTML={{ '__html': props && props.content }} />
            <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group form_flex">
                        <label>{t('I_WANT_TO')}</label>
                        <Select value={side} name="side" onChange={handleChange} className="select">
                            <MenuItem value={'sell'}>{t('SELL')}</MenuItem>
                            <MenuItem value={'buy'}>{t('BUY')}</MenuItem>
                        </Select>
                    </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group form_flex">
                        <label>{t('SELECT_CRYPTO')} </label>
                        <Select
                            name={'firstCoin'}
                            value={firstCoin}
                            onChange={handleFirstCoin}
                            className="select"
                        >
                            {
                                p2pPair && p2pPair.length > 0 && p2pPair.map((item, key) => {
                                    return (
                                        <MenuItem key={key} value={item._id.firstCoin}>{item._id.firstCoin}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </div>
                </div>

                <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group form_flex">
                        <label>{t('AMOUNT')} </label>
                        <div className="input_flex_section">
                            <div className="before_content">
                                <input
                                    type="text"
                                    className="input_befor"
                                    name="price"
                                    value={price}
                                    onChange={handleChange}
                                />
                            </div>

                            <Select
                                name={'secondCoin'}
                                value={secondCoin}
                                onChange={handleSecondCoin}
                                className="input_select"
                            >
                                {
                                    pairList && pairList.pair && pairList.pair.length > 0 && pairList.pair.map((item, key) => {
                                        return (
                                            <MenuItem key={key} value={item.secondCoin}>{item.secondCoin}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </div>

                    </div>


                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group form_flex">
                        <label>{t('PAYMENT_TYPE')}</label>
                        <Select
                            value={payBy}
                            name="payBy"
                            onClick={handlePayBy}
                            className="select"
                        >
                            {
                                payment && payment.length > 0 && payment.map((item, key) => {
                                    return (
                                        <MenuItem key={key} value={item}>{capitalize(item)}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </div>
                </div>
                <div className="col-lg-12">
                    <div className="submit_btn">
                        <Button onClick={handleSubmit}>{t('START_p2p')} </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default P2pTrading;