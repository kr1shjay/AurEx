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

const renderer = ({ days, hours, minutes, seconds }) => {
    return (
        <div className="timer_panel">
            <span><span className="timer_time">{zeroPad(days)}</span><span className="timer_label">Days</span></span>
            <span className="timer_dots">:</span>
            <span><span className="timer_time">{zeroPad(hours)}</span><span className="timer_label">Hours</span></span>
            <span className="timer_dots">:</span>
            <span><span className="timer_time">{zeroPad(minutes)}</span><span className="timer_label">Mins</span></span>
            <span className="timer_dots">:</span>
            <span><span className="timer_time">{zeroPad(seconds)}</span><span className="timer_label">Secs</span></span>
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

                    {
                        !loader && data && data.length > 0 && data.map((item, key) => {
                            let currency = currencyData.find(el => el._id == item.currencyId);
                            if (currency) {
                                return (
                                    <GridItem md={4} sm={6} key={key}>
                                        <div className="launchpad_token_single wow fadeInUp">
                                            <img
                                                src={currency.image}
                                                alt="Banner"
                                                className="img-fluid"
                                            />
                                            <h4 className="text-center">{currency.coin}</h4>
                                            <h6 className="text-center">{currency.name}</h6>
                                            <Countdown
                                                date={new Date(item.endTimeStamp)}
                                                renderer={renderer}
                                            />
                                            <hr />
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p>Available Currency</p>
                                                <p>{
                                                    item.availableCoin.map(function (currencyId) {
                                                        let currency = currencyData.find(el => el._id == currencyId);
                                                        return currency.coin;
                                                    }).join(', ')
                                                }</p>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p>Session Supply</p>
                                                <p>{item.maxSupply}</p>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p>Start</p>
                                                <p>{dateTimeFormat(item.startTimeStamp, 'YYYY-MM-DD HH:mm')}</p>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p>End</p>
                                                <p>{dateTimeFormat(item.endTimeStamp, 'YYYY-MM-DD HH:mm')}</p>
                                            </div>
                                            <div className="text-center mb-4 mt-4">
                                                <Button
                                                    className="btn btn-primary"
                                                    onClick={() => history.push('/launchpad-details/' + item._id)}
                                                >
                                                    View
                                                </Button>
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
                    <Button className="btn btn-primary px-4"
                        onClick={fetchMore}
                    >
                        View more</Button>
                </div>
            }
        </div>
    )
}

export default ActiveList;