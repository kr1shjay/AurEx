// import package
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Announcement from '../Announcement';
import Countdown, { zeroPad } from "react-countdown";
import BuyToken from './BuyToken';
import History from './History';
import Launchpaddetails from '../Launchpad/Launchpaddetails';
import Footer from '../../components/Footer/Footer';

// import action
import { getLaunchpad } from '../../actions/launchpad';

// import lib
import isEmpty from '../../lib/isEmpty';
import { dateTimeFormat } from '../../lib/dateTimeHelper'


import launchpad_round from "../../assets/images/launchpad_round.png"


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
        <>
        <div className="container-fluid">
            <Launchpaddetails />

            {
                loader && isEmpty(data) && <div className="loader loader-1">
                    <div className="loader-outter"></div>
                    <div className="loader-inner"></div>
                </div>
            }           

            {
                !loader && !isEmpty(data) && <div className="whiteBoxLaunchpad">
                  
                    <div className="row">
                        <div className="col-md-7">
                        <div className="whiteBoxLaunchpad dashboard_box dash_border mb-0 h-100">
                            <div className="projectIntroduction">
                            {
                        !loader && !isEmpty(data) && 
                        <div className=''>
                            <div className="launchpadCoinName">
                                <h3 className='title_green_launchpad'>{data.name} <small className='text_sm_white mb-0'>{data.coin}</small></h3>
                            </div>
                            <div className='row'>
                            <div className='col-12 col-md-5 col-lg-4'>
                            <div className='finish_col finish_col_round'>

                            <img src=
                             {data.image} 
                          // {launchpad_round}
                            alt="Banner" className="img-fluid" /> 
                                {          parseFloat(data.endTimeStamp) < Date.now() ?                            
                                        <span className='badge_finish'>
                                            <span className='check_round'><i className="fa fa-check"></i></span>
                                            <span className='finish_tect_tag ml-2'>Finished</span>
                                        </span> : <></>
                                        }
                                        </div>

                         
                            </div>
                            <div className='col-12 col-md-7 col-lg-8 mt-4 mt-md-0'>
                            {/* <div className='timer_card_grey ml-lg-auto'>
                            <p className='my-0'>{dateTimeFormat(data.startTimeStamp)} - {dateTimeFormat(data.endTimeStamp)}</p>

                                </div> */}
                                  <div className='timer_card_grey ml-lg-auto'>
                                                        <Countdown
                                                date={new Date(data.endTimeStamp)}
                                                renderer={renderer}
                                            />
                                            </div>
                            <h3 className='proj_intro_text'>Project Introduction</h3>
                                <ul className='proj_ul_new'>
                                    <li><span>Name : </span> {data.name}</li>
                                    <li><span>Industry : </span> {data.industry}</li>
                                    <li><span>Website : </span> {data.website}</li>
                                </ul>
                                <div dangerouslySetInnerHTML={{ __html: data.content }} className="text_white_desc" />
                          


                            </div>
                            </div>
                        </div>                       
                    }
                                
                    <hr className='hr_blue' />
                                <h3 className='proj_intro_text'>Token Details</h3>
                                <div className="row">
                                    <div className="col-12 col-lg-6">
                                        <div className="grid_values">
                                            <p className="text_white_launch_p">Name</p>
                                            <p className='text_grey_launch_p'>{data.name}</p>
                                            </div>
                                            <div className="grid_values">
                                                <p className="text_white_launch_p">Symbol</p>
                                                <p className='text_grey_launch_p'>{data.symbol}</p>
                                            </div>
                                            <div className="grid_values">
                                                <p className="text_white_launch_p">Token Sale Start Date</p>
                                                <p className='text_grey_launch_p'>{dateTimeFormat(data.startTimeStamp)}</p>
                                                </div>
                                                <div className="grid_values">
                                                    <p className="text_white_launch_p">Token Sale End Date</p>
                                                    <p className='text_grey_launch_p'>{dateTimeFormat(data.endTimeStamp)}</p>
                                                    </div>
                                                    <div className="grid_values">
                                                            <p className="text_white_launch_p">Token Launch Price</p>
                                                            <p className='text_grey_launch_p'>{data.launchPrice} {data.launchCoin}</p>
                                                            </div>
                                                    </div>
                                                    <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                                                       
                                                            <div className="grid_values">
                                                                <p className="text_white_launch_p">Minimim Purchase Amount</p>
                                                                <p className='text_grey_launch_p'>{data.minAmount} {data.coin}</p>
                                                                </div>
                                                                <div className="grid_values">
                                                                    <p className="text_white_launch_p">Accepted Currencies</p>
                                                                    <p className='text_grey_launch_p'>{data.availableCoin.join(', ')}</p>
                                                                    </div>
                                                                    <div className="grid_values">
                                                                        <p className="text_white_launch_p">Discount</p>
                                                                        <p className='text_grey_launch_p'>{data.discount > 0 ? `${data.discount}%` : '0%'}</p>
                                                                        </div>
                                                                    
                                                                        <div className="grid_values">
                                                                        <p className="text_white_launch_p">Token Available to Sale</p>
                                                                        <p className='text_grey_launch_p'>{data.availableSupply}</p>
                                                                        </div>

                                                                        <div className="grid_values">
                                                                        <p className="text_white_launch_p">Token Max Supply</p>
                                                                        <p className='text_grey_launch_p'>{data.maxSupply}</p>
                                                                        </div>
                                                                        </div>
                                                                        </div>
                                                                        <div className='document_sec'>
                            <div className='row'>
                                <div className='col-12 col-md-6'>
                                <p className='proj_intro_text my-3'>Documents</p>
                                </div>
                                <div className='col-12 col-md-6'>
                                <p className="project_docs my-3"><a href={data.whitePaper} target="_blank" className="active">Whitepaper</a></p>

                                </div>
                            </div>
                            </div>
                            <div className='timeline_details'>
                            <h3 className='proj_intro_text'>LaunchPad Timeline</h3>
                            <div className='row mt-5 ml-2'>
                                <div className={`col-12 ${ data.startTimeStamp < Date.now() ? "completed" : "final" }`}>
                                    <p className='timeline_head'>Sale Created Period</p>
                                    <p className='timeline_desc'>{new Date(data.createdAt).toLocaleString("en-IN")}</p>
                                </div>
                                <div  className={`col-12 ${ data.startTimeStamp < Date.now() ? "completed" : "final" }`}>
                                    <p className='timeline_head'>Sale Started Period</p>
                                    <p className='timeline_desc'>{new Date(data.startTimeStamp).toLocaleString("en-IN")}</p>
                                </div>
                               
                                <div className={`col-12 ${ data.endTimeStamp < Date.now() ? "completed" : "final" }`}>
                                    <p className='timeline_head'>Sale Ended Period</p>
                                    <p className='timeline_desc'>{new Date(data.endTimeStamp).toLocaleString("en-IN")}</p>
                                </div>
                            </div>
                            <div className='text_white_desc ml-5'>
                            <p>The allocation calculation is complete. We will deduct the corresponding Crypto/Token from your account on instant transferred to your spot account.</p>
                            </div>
                            </div>
                           </div>
                            </div>
                        </div>
                        <div className="col-md-5">
                        <div className="whiteBoxLaunchpad dashboard_box h-100">
                            <BuyToken
                                data={data}
                                setData={setData}
                            />
                            <History
                                launchId={launchId}
                            />
                            <div className="socialMediaCoinDetails">
                                <h3 className='proj_intro_text'>Social Media</h3>
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
                </div>
            }
            
          

        </div>
        <div className='mt-5'>
          <Footer />
          </div>
          </>
    )
}

export default LaunchpadDetail;