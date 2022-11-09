// import package
import React, { useState } from 'react';
import clsx from 'classnames';
import { useHistory } from 'react-router-dom';
// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import ActiveList from './ActiveList'
import CompletedList from './CompletedList';
import Launchpaddetails from './Launchpaddetails';
import { Button } from "@material-ui/core";
import Footer from '../../components/Footer/Footer';

//config
import config from '../../config';
const Launchpad = () => {
    // state
    const [listType, setListType] = useState('active'); //active, completed
    const [activeCnt, setActiveCnt] = useState(0)
    const [completedCnt, setCompletedCnt] = useState(0)
    const history = useHistory()

    const handleClick = () =>{
        history.push(config.AUTHENTICATOR_URL.PLAY_STORE)
    }

    return (
        <>
        <div className="container-fluid">
            <Launchpaddetails />
           
            <div class="dashboard_box launchpad_box">
                <GridContainer>
                    <GridItem lg={12}>  
                    <div className='d-flex align-items-center justify-content-between'>
                        <div>
                        <h3 className="login_title_8">Launchpad</h3>
                        <p className='text_sm_white'>Explore the Crypto Newbies</p>
                        </div>
                        <div>
                        <Button className="btn btn-green-new mb-3" onClick={handleClick}>Apply</Button>

                        </div>
                    </div>                      
                      
                        <div className="copy_trading_top_panel mt-4">
                            <ul class="nav nav-pills primaryNav block_nav" id="pills-tab" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <a
                                        className="nav-link active"
                                        id="pills-active_tokens"
                                        data-toggle="pill"
                                        href="#active_tokens"
                                        role="tab"
                                        aria-controls="pills-active_tokens"
                                        aria-selected="true"
                                    >
                                        Active  {activeCnt > 0 && <span>  {activeCnt}</span>}
                                    </a>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <a
                                        className="nav-link"
                                        id="pills-completed_tokens"
                                        data-toggle="pill"
                                        href="#completed_tokens"
                                        role="tab"
                                        aria-controls="pills-completed_tokens"
                                        aria-selected="false"
                                    >
                                        Completed  {completedCnt > 0 && <span>  {completedCnt}</span>}
                                    </a>
                                </li>
                            </ul>

                            {/* <div className="contact_form">
                                <div class="input-group">
                                    <input type="text" class="form-control" placeholder="Search" aria-label="search" aria-describedby="basic-addon1" />
                                    <div class="input-group-append">
                                        <span class="btn btnType1 py-0 my-0 px-2" id="basic-addon1"><i class="bi bi-search"></i></span>
                                    </div>
                                </div>
                            </div> */}
                        </div>


                        <div class="tab-content" id="pills-tabContent">
                            <ActiveList
                                setActiveCnt={setActiveCnt}
                            />

                            <CompletedList
                                setCompletedCnt={setCompletedCnt}
                            />
                     
                        </div>
                    </GridItem>
                </GridContainer>

            </div>
        </div>
        <Footer />
        </>
    )
}

export default Launchpad;