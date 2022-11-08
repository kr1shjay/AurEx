// import package
import React, { useEffect, useState } from 'react';
import Countdown, { zeroPad } from "react-countdown";
import { Button } from "@material-ui/core";
import { useSelector } from 'react-redux'

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { launchpadList } from '../../actions/launchpad'

// import lib
import { dateTimeFormat } from '../../lib/dateTimeHelper';

import bannerimg1 from "../../assets/images/launchpad1.jpg"

const Launchpaddetails = (props) => {


    return (
        <>
        <div class="dashboard_box launchpad_box py-5">
                <div className='row align-items-center'>
                    <div className='col-12 col-lg-5 col-xl-4'>
                        <p className='text_big_white'>Aurex token launch platform</p>
                        <p className='text_sm_white mb-0'>Buy or earn new tokens directly on Binance</p>


                    </div>
                    <div className='col-12 col-lg-7 col-xl-8 mt-3 mt-lg-0'>
                        <div className='row'>
                            <div className='col-12 col-sm-6 col-md-3 text-center mb-3 mb-md-0'>
                                <p className='text_green_val'>$ 0</p>
                                <p className='text_sm_white mb-0'>Current Funds Locked</p>

                            </div>
                            <div className='col-12 col-sm-6 col-md-3 text-center mb-3 mb-md-0'>
                                <p className='text_green_val'>$ 1,22,333</p>
                                <p className='text_sm_white mb-0'>Total Funds Raised</p>

                            </div>
                            <div className='col-12 col-sm-6 col-md-3 text-center mb-3 mb-md-0'>
                                <p className='text_green_val'>56</p>
                                <p className='text_sm_white mb-0'>Projects Launched</p>

                            </div>
                            <div className='col-12 col-sm-6 col-md-3 text-center mb-3 mb-md-0'>
                                <p className='text_green_val'>3,56,555</p>
                                <p className='text_sm_white mb-0'>All-time Unique Participants</p>

                            </div>
                        </div>
                    </div>
                </div>
             </div>
             </>
    )
}

export default Launchpaddetails;