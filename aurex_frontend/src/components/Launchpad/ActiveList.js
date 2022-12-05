// import package
import React, { useEffect, useState } from 'react';
import Countdown, { zeroPad } from "react-countdown";
import { Button } from "@material-ui/core";
import { useSelector } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { launchpadList } from '../../actions/launchpad'

// import lib
import { dateTimeFormat } from '../../lib/dateTimeHelper';

import bannerimg1 from "../../assets/images/launchpad1.jpg"
import bannerimg2 from "../../assets/images/launchpad2.jpg"
import bannerimg3 from "../../assets/images/launchpad3.jpg"

const renderer = ({ days, hours, minutes, seconds }) => {
    return (
        <div className="timer_panel">
            <span><span className="timer_time">{zeroPad(days)}</span><span className="timer_label ml-1">Days</span></span>
            <span className="timer_dots">:</span>
            <span><span className="timer_time">{zeroPad(hours)}</span><span className="timer_label ml-1">Hours</span></span>
            <span className="timer_dots">:</span>
            <span><span className="timer_time">{zeroPad(minutes)}</span><span className="timer_label ml-1">Mins</span></span>
            <span className="timer_dots">:</span>
            <span><span className="timer_time">{zeroPad(seconds)}</span><span className="timer_label ml-1">Secs</span></span>
        </div>
    );
};

const ActiveList = (props) => {
    const history = useHistory();

    // props
    const { setActiveCnt } = props;

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
            const { status, loading, result } = await launchpadList('active', reqQuery);
            if (status == 'success') {
                setData([...data, ...result.data])
                setCount(result.count)
                setActiveCnt(result.count)
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
        <div class="tab-pane fade show active" id="active_tokens" role="tabpanel" aria-labelledby="active_tokens-tab">
            <div className="launchpad_token_panel">
                <GridContainer>

                    {
                        loader && data && data.length == 0 && <div className="loader loader-1">
                            <div class="loader-outter"></div>
                            <div class="loader-inner"></div>
                        </div>
                    }


                    {
                        !loader && data && data.length == 0 && <div className='text-center w-100 mt-5 mb-4'>
                            Record Not Found
                        </div>
                    }
                        { console.log("data launchpad : ",data) }
                    {
                        !loader && data && data.length > 0 && data.map((item, key) => {
                            let currency = currencyData.find(el => el._id == item.currencyId);
                            let launchCurrency = currencyData.find(el => el._id == item.launchCoin);
                            if (currency) {
                                console.log("data launchpad currency : ",currency)
                                return (
                                    <>
                                    <GridItem md={12} sm={12} key={key}>
                                        <div className="launchpad_card_view mt-4 wow fadeInUp">
                                            <div className='row'>
                                                <div className='col-12 col-lg-4 mb-3 mb-lg-0'>
                                                <div className='finish_col_boundary'>
                                                    {currency && currency.image ? (
                                                        <img
                                                         src=
                                                            {currency.image}
                                                            //{bannerimg1}
                                                            alt="Banner"
                                                            className="img-fluid"
                                                            />) : (<img
                                                            src=
                                                            //{currency && currency.image? currency.image : bannerimg1}
                                                            {bannerimg1}
                                                            alt="Banner"
                                                            className="img-fluid"
                                                        />)}
                                                {/* <img
                                                src=
                                                 {currency.image}
                                               // {bannerimg1}
                                                alt="Banner"
                                                className="img-fluid"
                                            /> */}
                                            </div>
                                                </div>
                                                <div className='col-12 col-lg-8'>
                                                    <div className='row mb-3'>
                                                        <div className='col-12 col-lg-6 mb-3 mb-lg-0'>
                                                        <h4>{currency.coin}</h4>
                                                        <h6 className='text_green_sm'>{currency.name}</h6>
                                                        </div>
                                                        <div className='col-12 col-lg-6 mb-3 mb-lg-0'>
                                                            <div className='timer_card_grey ml-lg-auto'>
                                                        <Countdown
                                                date={new Date(item.endTimeStamp)}
                                                renderer={renderer}
                                            />
                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='row'>
                                                        <div className='col-12 col-lg-6'>
                                                        <div className="grid_values">
                                                <p className='text_white_launch_p'>Available Currency</p>
                                                <p>{
                                                    item.availableCoin.map(function (currencyId) {
                                                        let currency = currencyData.find(el => el._id == currencyId);
                                                        return currency.coin;
                                                    }).join(', ')
                                                }</p>
                                            </div>
                                            <div className="grid_values">
                                                <p className='text_white_launch_p'>Session Supply</p>
                                                <p>{item.maxSupply}</p>
                                            </div>
                                            <div className="grid_values">
                                                <p className='text_white_launch_p'>Start</p>
                                                <p>{dateTimeFormat(item.startTimeStamp, 'YYYY-MM-DD HH:mm')}</p>
                                            </div>
                                            <div className="grid_values">
                                                <p className='text_white_launch_p'>End</p>
                                                <p>{dateTimeFormat(item.endTimeStamp, 'YYYY-MM-DD HH:mm')}</p>
                                            </div>
                                                        </div>
                                                        <div className='col-12 col-lg-6 mb-3 mb-lg-0'>
                                                        <div className="grid_values">
                                                <p className='text_white_launch_p'>Token Offered</p>
                                                <p>{item.availableSupply}</p>
                                            </div>
                                            <div className="grid_values">
                                                <p className='text_white_launch_p'>Price of {currency.symbol} </p>
                                                <p>{item.launchPrice} per {launchCurrency.symbol}</p>
                                            </div>
                                            <div className="grid_values">
                                                <p className='text_white_launch_p'>Industry</p>
                                                <p>{item.industry}</p>
                                            </div>
                                            <div className="grid_values">
                                                <p className='text_white_launch_p'>Website</p>
                                                <p> <a target={`_blank`} href={item.website}>{item.website}<i className="fa fa-external-link" aria-hidden="true"></i></a></p>
                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>                         
                                          
                                            
                                            <div className="text-right mb-2 mt-2">
                                                <Button
                                                    className="btn btn-green-sm"
                                                    onClick={() => history.push('/launchpad/' + item._id)}
                                                >
                                                   <i className="fa fa-plane" aria-hidden="true"></i> &nbsp; Launch
                                                </Button>
                                            </div>
                                        </div>
                                    </GridItem>
                                 
                                   
                                    </>
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

export default ActiveList;