// import package
import React, { useEffect, useState } from 'react';

// import component
import CanvasChart from '../CanvasChart';

// // import action
// import { getDashBal } from '../../actions/dashboardAction';

const initialFormValue = [{
    'label': 'currency',
    'y': 100,
    'color': "grey",
    'toolTipContent': "Asset is zero balance"
}]

const BalanceChart = (props) => {
    // props
    const { result } = props;

    // state
    const [assetList, setAssetList] = useState([])
    const [dataPts, setDataPts] = useState(initialFormValue)
    const [defaultChart, setDefaultChart] = useState(true)

    // function
    // const fetchBalance = async () => {
    //     try {
    //         const { status, loading, result } = await getDashBal();
    //         if (status == 'success') {
    //             let arr = [], isDefault = true;
    //             if (result && result.length > 0) {
    //                 result.map((item, index) => {
    //                     if ((item.derivativeBal + item.spotBal) > 0) {
    //                         arr.push({
    //                             'label': item.coin,
    //                             'y': item.derivativeBal + item.spotBal,
    //                             'color': item.colorCode,
    //                         })
    //                         isDefault = false
    //                     }
    //                 })
    //                 if (!isDefault) {
    //                     setDataPts(arr)
    //                 }
    //                 setAssetList(result)
    //                 setDefaultChart(isDefault)
    //             }
    //         }
    //     } catch (err) { }
    // }

    useEffect(() => {
        if (result && result.length > 0) {
            let arr = [], isDefault = true;
            result.map((item, index) => {
                if ((item.derivativeBal + item.spotBal + item.p2pBal) > 0) {
                    arr.push({
                        'label': item.coin,
                        'y': item.derivativeBal + item.spotBal + item.p2pBal,
                        'color': item.colorCode,
                    })
                    isDefault = false
                }
            })
            console.log("balance chart array",arr)
            if (!isDefault) {
                setDataPts(arr)
            }
            setAssetList(result)
            setDefaultChart(isDefault)
        }

    }, [result])

    // useEffect(() => {
    //     fetchBalance()
    // }, [])

    return (
        <div className="balance_details_right">
            <div className="chartDash">
                <CanvasChart
                    chartType={"doughnut"}
                    dataPts={dataPts}
                    defaultChart={defaultChart}
                />
            </div>
            <div className="chartLabel">
                <ul>
                    {
                        assetList && assetList.length > 0 && assetList.map((item, key) => {
                            return (
                                <li>
                                    <label><i className="fas fa-square-full" style={{ color: item.colorCode }}></i> {item.coin}</label>
                                    <span>{item.derivativeBal + item.spotBal + item.p2pBal}</span>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}


export default BalanceChart;