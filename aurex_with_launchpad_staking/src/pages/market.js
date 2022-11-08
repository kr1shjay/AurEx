import React, { useEffect, useState } from "react";
// @material-ui/core components
import { Link } from "react-router-dom";
import Header from "components/Header/Header.js";
import DataTable from 'react-data-table-component';
import Checkbox from 'rc-checkbox';
import { useTranslation } from 'react-i18next';

import FooterInner from "../components/Footer/Footer_innerpage"

import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";


// import component
import Staking from '../components/Staking/Staking';
import { Button } from "react-bootstrap";
import { Favorite } from "@material-ui/icons";
import SpotMarket from "./Spotmarket";
import TopGain from './TopGainList'
import DerivativeMarket from "./Derivativemarket";
import Announcement from "components/Announcement/Announcement";






// const stakingHistory = [
//   {
//     star_icon: <div className="color_fill_star"><i class="fas fa-star"></i></div>,
//     Coin: <div className="coin_section_table"><div><img src={require("../assets/images/coin2.png")} alt="logo" className="img-fluid" /><span>BTC</span></div><span>Bitcoin</span></div>,
//     Current_Price: "$61,235.63",
//     a24H_Change: <div className="apy_section"><span className="color_red">-10.25</span></div>,
//     a24H_High: "$61,235.63",
//     a24H_Low: "$61,235.63",
//     a24H_Volume: "$61,235.63",
//     button: <div className="Subscribe"><Button>Trade</Button></div>,

//   },
//   {
//     star_icon: <div className=""><i class="far fa-star"></i></div>,
//     Coin: <div className="coin_section_table"><div><img src={require("../assets/images/coin2.png")} alt="logo" className="img-fluid" /><span>BTC</span></div><span>Bitcoin</span></div>,
//     Current_Price: "$61,235.63",
//     a24H_Change: <div className="apy_section"><span className="color_green">+10.25</span></div>,
//     a24H_High: "$61,235.63",
//     a24H_Low: "$61,235.63",
//     a24H_Volume: "$61,235.63",
//     button: <div className="Subscribe"><Button>Trade</Button></div>,

//   },
//   {
//     star_icon: <div className=""><i class="far fa-star"></i></div>,
//     Coin: <div className="coin_section_table"><div><img src={require("../assets/images/coin2.png")} alt="logo" className="img-fluid" /><span>BTC</span></div><span>Bitcoin</span></div>,
//     Current_Price: "$61,235.63",
//     a24H_Change: <div className="apy_section"><span className="color_red">-10.25</span></div>,
//     a24H_High: "$61,235.63",
//     a24H_Low: "$61,235.63",
//     a24H_Volume: "$61,235.63",
//     button: <div className="Subscribe"><Button>Trade</Button></div>,

//   },
//   {
//     star_icon: <div className="color_fill_star"><i class="fas fa-star"></i></div>,
//     Coin: <div className="coin_section_table"><div><img src={require("../assets/images/coin2.png")} alt="logo" className="img-fluid" /><span>BTC</span></div><span>Bitcoin</span></div>,
//     Current_Price: "$61,235.63",
//     a24H_Change: <div className="apy_section"><span className="color_red">-10.25</span></div>,
//     a24H_High: "$61,235.63",
//     a24H_Low: "$61,235.63",
//     a24H_Volume: "$61,235.63",
//     button: <div className="Subscribe"><Button>Trade</Button></div>,

//   },
//   {
//     star_icon: <div className=""><i class="far fa-star"></i></div>,
//     Coin: <div className="coin_section_table"><div><img src={require("../assets/images/coin2.png")} alt="logo" className="img-fluid" /><span>BTC</span></div><span>Bitcoin</span></div>,
//     Current_Price: "$61,235.63",
//     a24H_Change: <div className="apy_section"><span className="color_green">+10.25</span></div>,
//     a24H_High: "$61,235.63",
//     a24H_Low: "$61,235.63",
//     a24H_Volume: "$61,235.63",
//     button: <div className="Subscribe"><Button>Trade</Button></div>,

//   },

// ];




const dashboardRoutes = [];

function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

// Account Approval Table
export default function StakingPage(props) {
  const [formValue, setFormValue] = useState()

  const { t, i18n } = useTranslation();
  const handleChange = (e) => {

    let { name, value } = e.target
    setFormValue(value)

  }


  const { ...rest } = props;
  return (
    <div className="dashboard_container page_wrap">

      <ScrollToTopOnMount />
      <div className="dashboardMain">
        <div className="dashboardRight afterLoginHeader">
          <Header className="header"
            color="transparent"
            routes={dashboardRoutes}
            brand={<img src={require("../assets/images/logo.png")} alt="logo" className="img-fluid" />}
            rightLinks={<HeaderLinksAfterlogin />}
            fixed
            changeColorOnScroll={{
              height: 20,
              color: "dark",
            }}
            {...rest} />
          <div className="dashboardContent userPages pr-3 pl-4">
            <TopGain />
            <div className="p2p_card p2p_card1 border-none min-h-auto">
              <div className="container-fluid">
                <GridContainer>
                  <GridItem xs={12} sm={12} md={5} lg={5}>
                    <h3 className="dash_title login_title_8">{t('MARKETS')}</h3>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={7} lg={7}>
                    {/* <ul className="profile_dash">
                      <li>New trade pair XRP/BNB will add for trade on next 48 hrs - <span>Admin Announcement</span></li>
                      <li>13-05-2021  15:15, Chrome, 182.254.127  - <span>Last login</span></li>
                    </ul> */}
                    <Announcement />
                  </GridItem>
                </GridContainer>
                <GridContainer>

                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <div className="table_p2p_section inprofile cion_table_sectio">
                      <div className="d-flex justify-content-between">
                        <ul class="nav nav-tabs ">
                          <li class="active"><a data-toggle="tab" class="active" href="#SpotMarket">{t('SPOT_MARKET')}</a></li>
                          {/*<li><a data-toggle="tab" class="" href="#DerivativeMarket">{t('DERIVATIVE_MARKET')}</a></li>*/}
                        </ul>
                        {/* <div className="seacr_box_s">
                          <input
                            type="text"
                            placeholder="Find Coin"
                            onChange={handleChange}
                          />
                          <i class="fas fa-search"></i>
                        </div> */}
                      </div>




                      <div class="tab-content">
                        <div id="SpotMarket" class="tab-pane fade  in active show">
                          {/* <DataTable
                            columns={stakingHistoryColumns}
                            data={record}
                            noHeader
                          /> */}
                          < SpotMarket
                            filter={formValue}
                          />
                        </div>
                        <div id="DerivativeMarket" class="tab-pane fade">
                          {/* <DataTable
                            columns={stakingHistoryColumns}
                            data={stakingHistory}
                            noHeader
                          /> */}
                          {/*<DerivativeMarket
                            filter={formValue}
                          />*/}
                        </div>
                      </div>
                    </div>
                  </GridItem>
                </GridContainer>




                {/* <Staking /> */}
                {/*  */}



              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterInner />
      {/* model */}

      {/* 
      <div class="modal fade" id="lockedSubscribeETH" tabindex="-1" role="dialog" aria-labelledby="lockedSubscribeETHCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="SubscribeETHLongTitle">Subscribe ETH</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                    <div className="modedl_subscribe_content"> 
                        <div className="duration_slecys">
                          <label>Duration (Days)</label>
                          <div className="duration margin_conten mt-2"> 
                          <ul class="nav nav-tabs pl-0">
                            <li class="active"><a data-toggle="tab" class="active" href="">30</a></li>
                            <li><a data-toggle="tab" class="" href="">60</a></li>
                            <li><a data-toggle="tab" class="" href="">90</a></li>
                            </ul> 
                            </div>
                        </div>
                      
                        <div className="entaer_amount">
                          <label>Lot amount<span>Available 10 Lots<a href="" className="ml-2">All</a></span></label>
                          <div className="seacr_box_s d-flex">
                              <input type="text" value="1.23659878" className="w-100" />
                              <span>ETH</span>
                          </div>
                          <p>Stake Limit:<span>Minimum 1 Lot</span></p>
                        </div>
                        <div className="contsnt_cls_model">
                            <div>
                              <span>Lot size</span>
                              <span>0.1 BTC</span>
                            </div>
                            <div>
                              <span>Interest per lot</span>
                              <span>0.00015068 BTC</span>
                            </div>
                            <div>
                              <span>Individual max</span>
                              <span>200 Lots</span>
                            </div>
                            <div>
                              <span>Value date</span>
                              <span>2021-11-18 05:30</span>
                            </div>
                            <div>
                              <span>Redemption date</span>
                              <span>2022-05-18 05:30</span>
                            </div>
                            <div>
                              <span>Expected interest</span>
                              <span className="color_green">0.00254 BTC</span>
                            </div>
                        </div>
                        <div className="form-group">
                <div className="form-check">
                    <Checkbox
                        name="isTerms"
                        
                    />
                    <label className="form-check-label" for="flexCheckDefault">
                    I have read and I agree to the <a href=""> Staking Terms</a>
                    </label>
                </div>
                
              <button type="button" class="btn btn-primary w-100 mt-3" >
              Confirm
              </button>
            </div>

                    </div>
                    </div>
                   
                  </div>
                </div>
              </div>
      <div class="modal fade" id="SubscribeETH" tabindex="-1" role="dialog" aria-labelledby="SubscribeETHCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="SubscribeETHLongTitle">Subscribe ETH</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                    <div className="modedl_subscribe_content"> 
                        <div className="duration_slecys">
                          <label>Duration (Days)</label>
                          <div className="duratin-a">
                            <p>Flexible</p>
                          </div>
                        </div>
                        <div className="wlleet_ballece">
                              <h3>Wallet Balance <span>2.23569878 ETH</span></h3>
                        </div>
                        <div className="entaer_amount">
                          <label>Subscription amount<a href="">All</a></label>
                          <div className="seacr_box_s d-flex">
                              <input type="text" value="1.23659878" className="w-100" />
                              <span>ETH</span>
                          </div>
                          <p>Stake Limit:<span>Minimum 0.01 ETH</span></p>
                        </div>
                        <div className="contsnt_cls_model">
                            <div>
                              <span>Subscription Date</span>
                              <span>2021-11-17 10:47</span>
                            </div>
                            <div>
                              <span>Value Date</span>
                              <span>2021-11-18 05:30</span>
                            </div>
                            <div>
                              <span>Interest Rate</span>
                              <span className="color_green">25.50%</span>
                            </div>
                            <div>
                              <span>Interest Distribution Date</span>
                              <span>2021-11-19 05:30</span>
                            </div>
                        </div>
                        <div className="form-group">
                <div className="form-check">
                    <Checkbox
                        name="isTerms"
                        
                    />
                    <label className="form-check-label" for="flexCheckDefault">
                    I have read and I agree to the <a href=""> Staking Terms</a>
                    </label>
                </div>
                
              <button type="button" class="btn btn-primary w-100 mt-3" >
              Confirm
              </button>
            </div>

                    </div>
                    </div>
                   
                  </div>
                </div>
              </div>
    
     */}


    </div>
  );
}
