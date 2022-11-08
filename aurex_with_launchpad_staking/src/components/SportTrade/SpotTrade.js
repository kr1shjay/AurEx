import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "classnames";
import { useTranslation } from 'react-i18next';
import _ from "lodash";
import "./styles.css";
import "./example-styles.css";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";


// import component
import OrderPlace from "./OrderPlace";
import MarketPrice from "./MarketPrice";
import OrderBook from "./OrderBook";
import UserOrderList from "./UserOrderList";
import MarketPriceTable from "./Markerpricetable";

import Chart from "./Chart";
import RecentTrade from "./RecentTrade";

const ShowcaseLayout = (props) => {
  const orderBookRef = useRef();
  const { t, i18n } = useTranslation();
  // state
  const [expandScreen, setExpandScreen] = useState("");

  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
  const [compactType, setCompactType] = useState("vertical");
  const [mounted, setMounted] = useState(false);
  const [layouts, setLayouts] = useState({
    lg: props.initialLayout,
  });

  // function

  const onBreakpointChange = (breakpoint) => {
    setCurrentBreakpoint(breakpoint);
  };

  useEffect(() => {
    setMounted(true);
  }, []);



  return (
    <div>
      <div className="container-fluid">
        <GridContainer className="rom_minus_outer">
          <GridItem xs={12} sm={12} md={12} lg={12}>
            {/* <div className="static topOverview gridItemYellow">
                  <MarketPrice />
                </div> */}
            <div className="spotInnerContainer">
              <GridContainer>
                <GridItem xs={12} sm={12} md={12} lg={9}>
                  <GridContainer>

                    <GridItem xs={12} sm={12} md={12} lg={4} className="px-3 px-lg-1 px-xl-0">
                      <div className="tradeChartMain gridItemYellow">
                        <MarketPriceTable />
                      </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={8} className="px-3 px-lg-1 px-zero-width">
                      <div className="tradeChartMain gridItemYellow">
                        <MarketPrice />
                        <div className="tradeChart">
                          <Chart />
                        </div>
                      </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12} className="pl-3 pl-lg-1 pl-xl-0 pr-3 pr-lg-1 pr-xl-1 pad_right_xl">
                      <div className="tradeChartMain gridItemYellow">
                        <UserOrderList />
                      </div>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={3} className="px-3 px-lg-0">
                  <GridContainer className="order_pace_row">
                    <GridItem xs={12} sm={12} md={12} lg={12} className="pr_xl_view">
                      <div className={clsx("orderPlaceMain gridItemYellow", {
                        fullScreen: expandScreen === "orderPlace",
                      })}
                      >
                        <OrderPlace
                          setExpandScreen={setExpandScreen}
                          expandScreen={expandScreen}
                        />
                      </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12} className="pr_xl_view">
                      <div className="gridItemYellow table_tabs_new mb-0 pb-0">
                        <ul class="nav nav-tabs">
                          <li class="active"><a data-toggle="tab" className="active" href="#home">{t('ORDER_BOOK')}</a></li>
                          <li><a data-toggle="tab" href="#menu1">{t('RECENT_TRADE')}</a></li>

                        </ul>
                        <div class="tab-content">
                          <div id="home" class="tab-pane fade in active show">
                            <div className={clsx("orderBookMain ", {
                              fullScreen: expandScreen === "orderBook",
                            })}
                            >
                              <OrderBook
                                ref={orderBookRef}
                                layout={
                                  props.initialLayout &&
                                  props.initialLayout.find((el) => el.i === "1")
                                }
                                setExpandScreen={setExpandScreen}
                                expandScreen={expandScreen}
                              />
                            </div>
                          </div>
                          <div id="menu1" class="tab-pane fade">
                            <div className={clsx("recentTradeMain ", {
                              fullScreen: expandScreen === "recentTrade",
                            })}
                            >
                              <RecentTrade
                                setExpandScreen={setExpandScreen}
                                expandScreen={expandScreen}
                              />
                            </div>
                          </div>
                        </div>

                      </div>





                    </GridItem>

                  </GridContainer>
                </GridItem>

              </GridContainer>
            </div>
          </GridItem>
        </GridContainer>
      </div>

    </div>
  );
};



export default ShowcaseLayout;