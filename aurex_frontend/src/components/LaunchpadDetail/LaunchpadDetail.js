// import package
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Announcement from '../Announcement';
import BuyToken from './BuyToken';
import History from './History';

// import action
import { getLaunchpad } from '../../actions/launchpad';

// import lib
import isEmpty from '../../lib/isEmpty';
import { dateTimeFormat } from '../../lib/dateTimeHelper'

const LaunchpadDetail = () => {
    const { launchId } = useParams();

    // state
    const [data, setData] = useState({});
    const [loader, setLoader] = useState(true)

    // function
    const fetchLaunchpad = async () => {
        try {
            const { status, loading, result } = await getLaunchpad(launchId);
            if (status == 'success') {
                setData(result)
                setLoader(false)
            }
        } catch (err) {
        }
    }

    useEffect(() => {
        fetchLaunchpad()
    }, [])
    return (

        <div className="container">

            {
                loader && isEmpty(data) && <div className="loader loader-1">
                    <div class="loader-outter"></div>
                    <div class="loader-inner"></div>
                </div>
            }           

            {
                !loader && !isEmpty(data) && <div className="whiteBoxLaunchpad dashboard_box">
                     {
                        !loader && !isEmpty(data) && 
                        <div className='launchPadCoinDetails'>
                            <div className="launchpadCoinName">
                                <img src={data.image} className="img-fluid" />
                                <h3>{data.name} <small>{data.coin}</small></h3>
                            </div>
                            <h4>{dateTimeFormat(data.startTimeStamp)} - {dateTimeFormat(data.endTimeStamp)}</h4>
                        </div>                       
                    }
                    <div className="row">
                        <div className="col-md-6">
                            <div className="projectIntroduction">
                                <h3>Project Introduction</h3>
                                <ul>
                                    <li><span>Name</span> {data.name}</li>
                                    <li><span>Industry</span> {data.industry}</li>
                                    <li><span>Website</span> {data.website}</li>
                                </ul>
                                <div dangerouslySetInnerHTML={{ __html: data.content }} />

                                <h3>Token Details</h3>
                                <ul>
                                    <li><span>Name</span> {data.name}</li>
                                    <li><span>Symbol</span> {data.symbol}</li>
                                    <li><span>Token Sale Start Date</span> {dateTimeFormat(data.startTimeStamp)}</li>
                                    <li><span>Token Sale End Date</span> {dateTimeFormat(data.endTimeStamp)}</li>
                                    <li><span>Token Launch Price</span>{data.launchPrice} {data.launchCoin}</li>
                                    <li><span>Minimim Purchase Amount</span> {data.minAmount} {data.coin}</li>
                                    <li><span>Accepted Currencies</span> {data.availableCoin.join(', ')}</li>
                                    <li><span>Discount</span>{data.discount > 0 ? `${data.discount}%` : '0%'} </li>
                                    <li><span>Token Available to Sale</span> {data.availableSupply}</li>
                                    <li><span>Token Max Supply</span> {data.maxSupply}</li>
                                </ul>
                                <h3>Documents</h3>
                                <p className="project_docs"><a href={data.whitePaper} target="_blank" className="active">Whitepaper</a></p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <BuyToken
                                data={data}
                                setData={setData}
                            />
                            <History
                                launchId={launchId}
                            />
                            <div className="socialMediaCoinDetails">
                                <h3>Social Media</h3>
                                <ul>
                                    <li><a href={data.telegram} target="_blank"><i className="fab fa-telegram-plane"></i></a></li>
                                    <li><a href={data.twitter} target="_blank"><i className="fab fa-twitter"></i></a></li>
                                    <li><a href={data.facebook} target="_blank"><i className="fab fa-facebook-f"></i></a></li>
                                    <li><a href={data.youtube} target="_blank"><i className="fab fa-youtube"></i></a></li>
                                    <li><a href={data.linkedIn} target="_blank"><i className="fab fa-linkedin-in"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default LaunchpadDetail;