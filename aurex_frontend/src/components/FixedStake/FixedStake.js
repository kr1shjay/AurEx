
// import package
import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Button } from "react-bootstrap";
import OrderPlaceModal from './OrderPlaceModal';
import { useTranslation } from 'react-i18next';
import { toFixed } from "../../lib/roundOf";
// import action
import { getStaking } from '../../actions/stakingAction'

//import lib
import isEmpty from '../../lib/isEmpty'
import { interestByDays } from "../../lib/calculation";



// const lockedstakingHistory = [
// {
//     Coin:,
//     APY: ,
//     Duration_Days: ,
//     Interest_Per_Lot: ,
//     button: <div className="Subscribe"><Button data-toggle="modal" data-target="#lockedSubscribeETH">Subscribe</Button></div>,

// },
//     {
//         Coin: <div className="coin_section_table"><div><img src={require("../../assets/images/coin2.png")} alt="logo" className="img-fluid" /><span>BTC</span></div><span>Bitcoin</span></div>,
//         APY: <div className="apy_section"><span className="color_green">+10.25</span></div>,
//         Duration_Days: <div className="duration"> <ul class="nav nav-tabs ">
//             <li class="active"><a data-toggle="tab" class="active" href="">30</a></li>
//             <li><a data-toggle="tab" class="" href="">60</a></li>
//             <li><a data-toggle="tab" class="" href="">90</a></li>
//         </ul> </div>,
//         Interest_Per_Lot: <span className="font_gray">0.49315068 BTC</span>,
//         button: <div className="Subscribe"><Button data-toggle="modal" data-target="#lockedSubscribeETH">Subscribe</Button></div>,

//     },
//     {
//         Coin: <div className="coin_section_table"><div><img src={require("../../assets/images/coin2.png")} alt="logo" className="img-fluid" /><span>BTC</span></div><span>Bitcoin</span></div>,
//         APY: <div className="apy_section"><span className="color_green">+10.25</span></div>,
//         Duration_Days: <div className="duration"> <ul class="nav nav-tabs ">
//             <li class="active"><a data-toggle="tab" class="active" href="">30</a></li>
//             <li><a data-toggle="tab" class="" href="">60</a></li>
//             <li><a data-toggle="tab" class="" href="">90</a></li>
//         </ul> </div>,
//         Interest_Per_Lot: <span className="font_gray">0.49315068 BTC</span>,
//         button: <div className="Subscribe"><Button data-toggle="modal" data-target="#lockedSubscribeETH">Subscribe</Button></div>,

//     },
//     {
//         Coin: <div className="coin_section_table"><div><img src={require("../../assets/images/coin2.png")} alt="logo" className="img-fluid" /><span>BTC</span></div><span>Bitcoin</span></div>,
//         APY: <div className="apy_section"><span className="color_green">+10.25</span></div>,
//         Duration_Days: <div className="duration"> <ul class="nav nav-tabs ">
//             <li class="active"><a data-toggle="tab" class="active" href="">30</a></li>
//             <li><a data-toggle="tab" class="" href="">60</a></li>
//             <li><a data-toggle="tab" class="" href="">90</a></li>
//         </ul> </div>,
//         Interest_Per_Lot: <span className="font_gray">0.49315068 BTC</span>,
//         button: <div className="Subscribe"><Button data-toggle="modal" data-target="#lockedSubscribeETH">Subscribe</Button></div>,

//     },
//     {
//         Coin: <div className="coin_section_table"><div><img src={require("../../assets/images/coin2.png")} alt="logo" className="img-fluid" /><span>BTC</span></div><span>Bitcoin</span></div>,
//         APY: <div className="apy_section"><span className="color_green">+10.25</span></div>,
//         Duration_Days: <div className="duration"> <ul class="nav nav-tabs ">
//             <li class="active"><a data-toggle="tab" class="active" href="">30</a></li>
//             <li><a data-toggle="tab" class="" href="">60</a></li>
//             <li><a data-toggle="tab" class="" href="">90</a></li>
//         </ul> </div>,
//         Interest_Per_Lot: <span className="font_gray">0.49315068 BTC</span>,
//         button: <div className="Subscribe"><Button data-toggle="modal" data-target="#lockedSubscribeETH">Subscribe</Button></div>,

//     },
// ];


const initialFormValue = {
    'isModalOpen': false,
    'record': {}
}

const FixedStake = () => {
    const history = useHistory();
    const { t, i18n } = useTranslation();
    // state
    const [loader, setLoader] = useState(true)
    const [stakeData, setStakeData] = useState(initialFormValue)
    const [fetchData, setFetchData] = useState([])
    const [indexVla, setIndexVal] = useState()

    const [selDur, setSelDur] = useState({}) // select Duration

    // redux-state
    const { isAuth } = useSelector(state => state.auth);

    //colum
    const columns = [
        {
            name: 'Coin',
            selector: 'Coin',
            sortable: false,
            cell: (row, index, column, id) => {
                return <div className="coin_section_table"><div><img src={row.image} alt="logo" className="img-fluid" /><span>{row.coin}</span></div><span>{row.name}</span></div>
            }
        },
        {
            name: 'APY',
            selector: 'APY',
            sortable: false,
            cell: (record, row, index, column, id) => {
                return <div className="duration">
                    <ul class="nav nav-tabs ">
                        {
                            record.periodList && record.periodList.length > 0 && record.periodList.map((item, key) => {
                                if (!isEmpty(selDur)) {
                                    if (selDur.days == item.days && selDur.periodIndex == key && selDur.index == row) {
                                        return (
                                            <li class="active"><a data-toggle="tab" class="active" href="">{item.APY}</a></li>
                                        )
                                    }
                                }
                            })
                        }
                        {
                            !isEmpty(selDur.days) && selDur.index == row ? null : <li class="active"><a data-toggle="tab" class="active" href="">{record.periodList[0].APY}</a></li>
                        }
                    </ul>
                </div>
            }
        },
        {
            name: 'Duration Days',
            selector: 'redemptionPeriod',
            sortable: false,
            cell: (record, row, index, column, id) => {
                return <div className="duration">
                    <ul class="nav nav-tabs ">
                        {
                            record.periodList && record.periodList.length > 0 && record.periodList.map((item, key) => {
                                return (
                                    <li class="active"><a data-toggle="tab" class="active" onClick={() => handleApy(item, row, key, index)} href="">{item.days}</a></li>
                                )
                            })
                        }
                    </ul>
                </div>
            }
        },

        {
            name: 'Interest Per Lot',
            selector: 'Interest_Per_Lot',
            sortable: false,
            cell: (record, row, index, column, id) => {
                return (
                    <>
                        {
                            record.periodList && record.periodList.length > 0 && record.periodList.map((item, key) => {
                                if (selDur.days == item.days && selDur.periodIndex == key && selDur.index == row) {
                                    return (
                                        <>

                                            {selDur.intrest && selDur.indexval == key ?
                                                toFixed((item.days * interestByDays(1000, item.APY, 365)), 4) : toFixed((item.days * interestByDays(1000, item.APY, 365)), 4)}{" "}
                                            {item.currencySymbol}
                                        </>
                                    )
                                }

                            })
                        }
                        {
                            !isEmpty(selDur.days) && selDur.index == row ? null :
                                <>
                                    {selDur.intrest ?
                                        toFixed((record.periodList[0].days * interestByDays(1000, record.periodList[0].APY, 365)), 4) : toFixed((record.periodList[0].days * interestByDays(1000, record.periodList[0].APY, 365)), 4)}{" "}
                                    {/* {item.currencySymbol} */}
                                </>
                        }
                    </>
                )
            }
        },
        {
            name: 'Action',
            selector: 'button',
            sortable: false,
            cell: (record) => {
                return (
                    <div className='Subscribe'>
                        <Button
                            data-toggle="modal"
                            data-target="#SubscribeETH"
                            onClick={() => handleSubscribe(record)}
                        >{t('STAKE_NOW')}</Button>
                    </div>
                )

            }
        },


    ];

    // function

    const handleApy = (item, row, periodIndex, indexVal) => {
        setSelDur({
            index: row,
            periodIndex,
            days: item.days,
            APY: item.APY,
            indexVal,
            intrest: toFixed((item.days * interestByDays(1000, item.APY, 365)), 4)
        })
    }

    const handleSubscribe = (e) => {

        if (isAuth) {
            setStakeData({
                'isModalOpen': true,
                'record': e,
            })
        } else {
            history.push('/login')
        }
    }


    const fetchStaking = async () => {
        try {
            let reqData = {
                type: 'fixed'
            }
            const { status, loading, message, result } = await getStaking(reqData);
            setLoader(loading)
            console.log("Result staking : ",result)
            if (status == 'success') {
                setFetchData(result)
            }
        } catch (err) { }
    }

    const handleCloseModal = () => {
        setStakeData({ 'isModalOpen': false, 'record': {} })
        setSelDur({})
    }

    useEffect(() => {
        fetchStaking()
    }, [isAuth])

    return (
        <Fragment>
            <OrderPlaceModal
                isShow={stakeData.isModalOpen}
                record={stakeData.record}
                onHide={handleCloseModal}
                durationdays={!isEmpty(selDur) ? selDur.days && selDur.days : ''}
                durationAPY={!isEmpty(selDur) ? selDur.APY && selDur.APY : ''}
                fetchStake={fetchStaking}
            />
            <DataTable
                columns={columns}
                data={fetchData}
                noHeader
                progressPending={loader} className="text_center_div_table staking_btn_table table_staking_align_left_first"
            />
        </Fragment>

    )
}

export default FixedStake;