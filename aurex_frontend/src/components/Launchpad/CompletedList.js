// import package
import React, { useEffect, useState } from 'react';
import Countdown, { zeroPad } from "react-countdown";
import { Button } from "@material-ui/core";
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { launchpadList } from '../../actions/launchpad'

// import lib
import { dateTimeFormat } from '../../lib/dateTimeHelper';

import bannerimg1 from "../../assets/images/launchpad1.jpg"

const CompletedList = (props) => {
    const history = useHistory();

    // props
    const { setCompletedCnt } = props;

    // state
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [loader, setLoader] = useState(true)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 6
    })

    // redux
    const currencyData = useSelector(state => state.currency)

    const fetchList = async (reqQuery) => {
        try {
            const { status, loading, result } = await launchpadList('completed', reqQuery);
            if (status == 'success') {
                setData([...data, ...result.data])
                setCount(result.count)
                setCompletedCnt(result.count)
                setLoader(false)
            }
        } catch (err) { }
    }

    const fetchMore = (e) => {
        e.preventDefault();
        let paginationData = { ...pagination, 'page': pagination.page + 1 }
        setPagination(paginationData)
        fetchList(paginationData)
    }

    useEffect(() => {
        if (currencyData && currencyData.length > 0) {
            fetchList(pagination)
        }
    }, [currencyData])

    return (
        <div class="tab-pane fade" id="completed_tokens" role="tabpanel" aria-labelledby="completed_tokens-tab">
            <div className="launchpad_token_panel">
                <GridContainer>

                    {
                        loader && data && data.length == 0 && <div className="loader loader-1">
                            <div class="loader-outter"></div>
                            <div class="loader-inner"></div>
                        </div>
                    }


                    {
                        !loader && data && data.length == 0 && <div  className='text-center w-100 mt-5 mb-4'>
                            Record Not Found
                        </div>
                    }

                    {
                        !loader && data && data.length > 0 && data.map((item, key) => {
                            let currency = currencyData.find(el => el._id == item.currencyId);
                            if (currency) {
                                return (

                                    <GridItem md={12} sm={12} key={key}>
                                    <div className="launchpad_card_view mt-4 wow fadeInUp">
                                    <div className='row'>
                                                <div className='col-12 col-lg-4 mb-3 mb-lg-0 finish_col'>
                                       <div className='finish_col_boundary'>
                                        <img
                                            src=
                                            // {currency.image}
                                            {bannerimg1}
                                            alt="Banner"
                                            className="img-fluid"
                                        />
                                        </div>
                                        <span className='badge_finish'>
                                            <span className='check_round'><i class="fa fa-check"></i></span>
                                            <span className='finish_tect_tag ml-2'>Finished</span>
                                        </span>
                                        </div>
                                        <div className='col-12 col-lg-8'>
                                        <div className='row mb-3'>
                                        <div className='col-12 col-lg-6 mb-3 mb-lg-0'>
                                        <h4>{currency.coin}</h4>
                                        <h6 className='text_green_sm'>{currency.name}</h6>
                                        </div>
                                        </div>
                                        <div className='row'>
                                                        <div className='col-12 col-lg-6'>
                                                        <div className="grid_values">
                                            <p>Available Currency</p>
                                            <p>{
                                                item.availableCoin.map(function (currencyId) {
                                                    let currency = currencyData.find(el => el._id == currencyId);
                                                    return currency.coin;
                                                }).join(', ')
                                            }</p>
                                        </div>
                                        <div className="grid_values">
                                            <p>Session Supply</p>
                                            <p>{item.maxSupply}</p>
                                        </div>
                                        <div className="grid_values">
                                            <p>Start</p>
                                            <p>{dateTimeFormat(item.startTimeStamp, 'YYYY-MM-DD HH:mm')}</p>
                                        </div>
                                        <div className="grid_values">
                                            <p>End</p>
                                            <p>{dateTimeFormat(item.endTimeStamp, 'YYYY-MM-DD HH:mm')}</p>
                                        </div>
                                        </div>

                                        <div className='col-12 col-lg-6'>
                                                        <div className="grid_values">
                                            <p>Available Currency</p>
                                            <p>{
                                                item.availableCoin.map(function (currencyId) {
                                                    let currency = currencyData.find(el => el._id == currencyId);
                                                    return currency.coin;
                                                }).join(', ')
                                            }</p>
                                        </div>
                                        <div className="grid_values">
                                            <p>Session Supply</p>
                                            <p>{item.maxSupply}</p>
                                        </div>
                                        <div className="grid_values">
                                            <p>Start</p>
                                            <p>{dateTimeFormat(item.startTimeStamp, 'YYYY-MM-DD HH:mm')}</p>
                                        </div>
                                        <div className="grid_values">
                                            <p>End</p>
                                            <p>{dateTimeFormat(item.endTimeStamp, 'YYYY-MM-DD HH:mm')}</p>
                                        </div>
                                        </div>
                                        </div>

                                        <div className="text-right mb-2 mt-2">
                                            <Button
                                                className="btn btn-green-sm"
                                                onClick={() => history.push('/launchpad-details/' + item._id)}
                                            >
                                                View
                                            </Button>
                                        </div>
                                            </div>
                                        </div>
                                      
                                     
                                       
                                       
                                      
                                    </div>
                                    </GridItem>


                                 
                                )
                            }
                        })
                    }
                </GridContainer>
            </div>

            {
                !loader && data && data.length > 0 && count > data.length && <div className="text-center mt-3">
                    <Button className="btn_view_link"
                        onClick={fetchMore}
                    >
                        View more</Button>
                </div>
            }
        </div>
    )
}

export default CompletedList;