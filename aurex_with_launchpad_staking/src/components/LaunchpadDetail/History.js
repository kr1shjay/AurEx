// import package
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

// import action
import { getPurchaseTkn } from '../../actions/launchpad';

// import lib
import { dateTimeFormat } from '../../lib/dateTimeHelper'
import { toFixed } from "../../lib/roundOf"


let decimalETH;
const History = (props) => {
    const dispatch = useDispatch();

    // props
    const { launchId } = props;

    // redux
    const { loader, data } = useSelector(state => state.purchaseToken);
    const currency = useSelector(state => state.currency)


    useEffect(() => {
        getPurchaseTkn(launchId, dispatch)
        currency && currency.length > 0 && currency.map(item => {
            if (item.symbol == 'ETH') {
                return decimalETH = item.decimal
            }

        })
    }, [])

    return (
        <div className="my_trade_table_sec">
            <h3 className='proj_intro_text'>My Trades</h3>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Send Coin</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Discount(%)</th>
                            <th>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loader && <tr>
                                <td colspan="4" className="text-center">Loading...</td>
                            </tr>
                        }
                        {
                            !loader && data && data.length == 0 && <tr>
                                <tr>
                                    <td colspan="4" className="text-center">No Trades Found!</td>
                                </tr>
                            </tr>
                        }
                        {
                            !loader && data && data.length > 0 && data.map((item, key) => {
                                return (
                                    <tr>
                                        <td>{dateTimeFormat(item.createdAt, 'YYYY-MM-DD HH:mm')}</td>
                                        <td>{item.sendCoin}</td>
                                        <td>{item && item.price && toFixed(item.price, decimalETH != '' ? decimalETH : 0)}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.discount}</td>
                                        <td>{item.total && toFixed(item.total, decimalETH != '' ? decimalETH : 0)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default History;