// import package
import React, { useState } from 'react';
import clsx from 'classnames';
import { useHistory } from 'react-router-dom';
// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import ActiveList from './ActiveList'
import CompletedList from './CompletedList';
import { Button } from "@material-ui/core";

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
        <div className="container">
            <div class="dashboard_box launchpad_box">
                <GridContainer>
                    <GridItem lg={12}>                        
                        <h3 className="login_title_8">Launchpad</h3>
                        <h4>For Dynamic Token Listing</h4>
                        <Button className="btn btn-primary mb-3" onClick={handleClick}>Apply</Button>
                        <div className="copy_trading_top_panel">
                            <ul class="nav nav-pills" id="pills-tab" role="tablist">
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
                                        Active Tokens {activeCnt > 0 && <span> - {activeCnt}</span>}
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
                                        Completed Tokens {completedCnt > 0 && <span> - {completedCnt}</span>}
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
    )
}

export default Launchpad;