import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import Slider from '@material-ui/core/Slider';
import { Scrollbars } from 'react-custom-scrollbars-2';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import GridLayout from 'react-grid-layout';
import { useTranslation } from 'react-i18next';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const marks = [
  {
    value: 0,
    label: '1%',
  },
  {
    value: 25,
    label: '25%',
  },
  {
    value: 50,
    label: '50%',
  },
  {
    value: 75,
    label: '75%',
  },
  {
    value: 100,
    label: '100%',
  },
];

function valuetext(value) {
  return `${value}%`;
}
const ShowcaseDerivativeLayout = (props) => {
  const [value, setValue] = React.useState('ioc');
  const handleCheckChange = (event) => {
    setValue(event.target.value);
  };
  const { t, i18n } = useTranslation();
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg')
  const [compactType, setCompactType] = useState('vertical')
  const [mounted, setMounted] = useState(false)
  const [layouts, setLayouts] = useState({
    lg: props.initialLayout
  })

  // function

  const generateDOM = () => {
    return _.map(layouts.lg, function (l, i) {
      return (
        <div key={i} className={l.static ? "static" : ""}>
          {l.static ? (
            <span
              className="text"
              title="This item is static and cannot be removed or resized."
            >
              Static - {i}
            </span>
          ) : (
            <span className="text">{i}</span>
          )}
        </div>
      );
    });
  }

  const onBreakpointChange = (breakpoint) => {
    setCurrentBreakpoint(breakpoint)
  }
  const onLayoutChange = (layout, layouts) => {
    props.onLayoutChange(layout, layouts);
  }
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="derivativeTrade">
      <ResponsiveReactGridLayout
        {...props}
        layouts={layouts}
        onBreakpointChange={onBreakpointChange}
        onLayoutChange={onLayoutChange}
        // WidthProvider option
        measureBeforeMount={false}
        // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
        // and set `measureBeforeMount={true}`.
        useCSSTransforms={mounted}
        compactType={compactType}
        preventCollision={!compactType}
      >
        <div key={0} className="static">
          <div className="header-overview">
            <div className="selectCoinType">
              <img src={require("../../assets/images/btcIcon.png")} alt="" className="img-fluid" />
              <div className="btn-group my-0">
                <button type="button" className="selectPair dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {t('BTCUSDT')}<small className="d-block">{t('PERPETUAL')}</small>
                </button>
                <ul className="dropdown-menu">
                  <li className="dropdown-header">
                    <h6>{t('BTC_PAIRS')}</h6>
                    <ul>
                      <li className="active">
                        <Link to="#">BTC/ETH</Link>
                      </li>
                      <li>
                        <Link to="#">BTC/USDT</Link>
                      </li>
                      <li>
                        <Link to="#">BTC/XRP</Link>
                      </li>
                      <li>
                        <Link to="#">BTC/BCH</Link>
                      </li>
                      <li>
                        <Link to="#">BTC/LTC</Link>
                      </li>
                    </ul>
                  </li>
                  <li className="dropdown-header">
                    <h6>{t('ETH_PAIRS')}</h6>
                    <ul>
                      <li>
                        <Link to="#">ETH/BTC</Link>
                      </li>
                      <li>
                        <Link to="#">ETH/USDT</Link>
                      </li>
                      <li>
                        <Link to="#">ETH/XRP</Link>
                      </li>
                      <li>
                        <Link to="#">ETH/BCH</Link>
                      </li>
                      <li>
                        <Link to="#">ETH/LTC</Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div className="hoPriceConversion">
                <h3 className="tradeGreenText">54,905.50</h3>
              </div>
            </div>
            <div className="headerOverviewGroup">
              <div className="headerOverviewStatus">
                <h5><small>Mark</small>55,650.25</h5>
              </div>
              <div className="headerOverviewStatus">
                <h5><small>Index</small>53.214.25</h5>
              </div>
              <div className="headerOverviewStatus">
                <h5><small>Funding / Countdown</small><span><span className="tradeOrangeText">0.0100%</span> 01:02:05</span></h5>
              </div>
              <div className="headerOverviewStatus">
                <h5><small>24h Change</small><span className="tradeRedText">-2,725.25 -5.25%</span></h5>
              </div>
              <div className="headerOverviewStatus">
                <h5><small>24h High</small>55,650.25</h5>
              </div>
              <div className="headerOverviewStatus">
                <h5><small>24h Low</small>53.214.25</h5>
              </div>
              <div className="headerOverviewStatus">
                <h5><small>24h Volume(BTC)</small>91,547.05</h5>
              </div>
              <div className="headerOverviewStatus">
                <h5><small>24h Volume(USDT)</small>5,214.2547</h5>
              </div>
            </div>
          </div>
        </div>
        <div key={1}>
          <div className="tradeTableLeftSide darkBox orderBook">
            <div className="tableHead">
              <h4>Place Order</h4>
            </div>

            <div className="derivativeCalC">
              {/* <div className="calCBtnGroup">
                <button className="btn greyBtn py-2 px-4">Cross</button>
                <button className="btn greyBtn py-2 px-4">20X</button>
              </div> */}
              <div className="calcIcon"><a href="#"><i class="fas fa-calculator"></i></a></div>
            </div>
            <div className="ButtonFullWidth">
              <button className="btn placeOrderButton">Open</button>
              <button className="btn placeOrderButton">Close</button>
            </div>
            <div className="tradeFulltabbedTable">
              <nav>
                <div className="nav nav-tabs nav-fill" id="nav-tab1" role="tablist">
                  <a className="nav-item nav-link active py-2" id="nav-limit-tab" data-toggle="tab" href="#nav-limit" role="tab" aria-controls="nav-limit" aria-selected="true">Limit</a>
                  <a className="nav-item nav-link py-2" id="nav-market-tab" data-toggle="tab" href="#nav-market" role="tab" aria-controls="nav-market" aria-selected="false">Market</a>
                  <a className="nav-item nav-link py-2" id="nav-stopLimit-tab" data-toggle="tab" href="#nav-stopLimit" role="tab" aria-controls="nav-stopLimit" aria-selected="false">Stop-Limit</a>
                </div>
              </nav>
              <div className="tab-content" id="nav-tabContent1">
                <div className="tab-pane fade show active" id="nav-limit" role="tabpanel" aria-labelledby="nav-limit-tab">
                  <Scrollbars style={{ width: "100%", height: 620 }}>
                    <div className="placeOrderBox contact_form settingsSelect">
                      <div className="flexTitle">
                        <h3><small>Balance</small> <span>1,500.2575 USDT</span></h3>
                        <a href="#" className="exchangeIcon"><i class="fas fa-exchange-alt"></i></a>
                      </div>
                      <div className="form-group">
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <span class="btnType1">Price</span>
                          </div>
                          <input type="text" class="form-control text-right borderZero" value="55114.52" />
                          <div class="input-group-append">
                            <span class="btnType1">USDT</span>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <span class="btnType1">Size</span>
                          </div>
                          <input type="text" class="form-control text-right borderZero" value="0.00" />
                          <div class="input-group-append">
                            <span class="btnType1">USDT</span>
                          </div>
                        </div>
                      </div>
                      <div className="form-group px-2 mb-0">
                        <Slider
                          defaultValue={50}
                          getAriaValueText={valuetext}
                          aria-labelledby="discrete-slider-custom"
                          step={10}
                          valueLabelDisplay="auto"
                          marks={marks}
                        />
                      </div>
                      <div className="form-group">
                        <div className="form-check mb-0">
                          <Checkbox
                            defaultChecked
                            color="primary"
                            className="pl-0"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                          />
                          <label className="form-check-label pl-0" for="flexCheckDefault">TP/SL
                          </label>
                        </div>
                      </div>

                      <div className="form-group">
                        <div class="input-group">
                          <input type="text" class="form-control" value="Take Profit" />
                          <div class="input-group-append">
                            <Select value={10}>
                              <MenuItem value={10}>Mark</MenuItem>
                              <MenuItem value={20}>Limit</MenuItem>
                              <MenuItem value={30}>Stop</MenuItem>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <div class="input-group">
                          <input type="text" class="form-control" value="Stop Loss" />
                          <div class="input-group-append">
                            <Select value={10}>
                              <MenuItem value={10}>Mark</MenuItem>
                              <MenuItem value={20}>Limit</MenuItem>
                              <MenuItem value={30}>Stop</MenuItem>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <RadioGroup aria-label="type" name="type1" value={value} className="radioGroup" onChange={handleCheckChange}>
                        <FormControlLabel className="orderRadio" value="tif" control={<Radio />} label="TIF" />
                        <FormControlLabel className="orderRadio" value="gtc" control={<Radio />} label="GTC" />
                        <FormControlLabel className="orderRadio" value="ioc" control={<Radio />} label="IOC" />
                        <FormControlLabel className="orderRadio" value="fok" control={<Radio />} label="FOK" />
                      </RadioGroup>
                      <div className="ButtonFullWidth">
                        <button className="btn BuyNavButton">Long</button>
                        <button className="btn SellNavButton">Short</button>
                      </div>
                      <ul className="poList">
                        <li><label><small>Cost</small> 0.0000 USDT</label> <span><small>Cost</small> 0.0000 USDT</span></li>
                        <li><label><small>Max</small> 0.0000 USDT</label> <span><small>Max</small> 0.0000 USDT</span></li>
                      </ul>
                      <div className="poContentFlex">
                        <h2>Margin Ratio<span>0.00%</span></h2>
                        <div className="pocfRight">
                          <p><small>Maintenance Margin</small> 0.0000 USDT</p>
                          <p><small>Margin Balance</small> 0.0000 USDT</p>
                        </div>
                      </div>
                    </div>
                  </Scrollbars>
                </div>
                <div className="tab-pane fade" id="nav-market" role="tabpanel" aria-labelledby="nav-market-tab">
                  <div className="placeOrderBox contact_form">
                    <h3><small>Balance</small> <span>1,500.2575 USDT</span></h3>
                    <div className="form-group">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="btnType1">Price</span>
                        </div>
                        <input type="text" class="form-control text-right borderZero" value="55114.52" />
                        <div class="input-group-append">
                          <span class="btnType1">USDT</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="btnType1">Amount</span>
                        </div>
                        <input type="text" class="form-control text-right borderZero" value="0.00001234" />
                        <div class="input-group-append">
                          <span class="btnType1">BTC</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group px-2 mb-0">
                      <Slider
                        defaultValue={50}
                        getAriaValueText={valuetext}
                        aria-labelledby="discrete-slider-custom"
                        step={10}
                        valueLabelDisplay="auto"
                        marks={marks}
                      />
                    </div>
                    <div className="form-group">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="btnType1">Total</span>
                        </div>
                        <input type="text" class="form-control text-right borderZero" value="115.50 " />
                        <div class="input-group-append">
                          <span class="btnType1">USDT</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <button className="btn BuyNavButton btn-block">Buy BTC</button>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="nav-stopLimit" role="tabpanel" aria-labelledby="nav-stopLimit-tab">
                  <div className="placeOrderBox contact_form">
                    <h3><small>Balance</small> <span>1,500.2575 USDT</span></h3>
                    <div className="form-group">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="btnType1">Price</span>
                        </div>
                        <input type="text" class="form-control text-right borderZero" value="55114.52" />
                        <div class="input-group-append">
                          <span class="btnType1">USDT</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="btnType1">Amount</span>
                        </div>
                        <input type="text" class="form-control text-right borderZero" value="0.00001234" />
                        <div class="input-group-append">
                          <span class="btnType1">BTC</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group px-2">
                      <Slider
                        defaultValue={50}
                        getAriaValueText={valuetext}
                        aria-labelledby="discrete-slider-custom"
                        step={10}
                        valueLabelDisplay="auto"
                        marks={marks}
                      />
                    </div>
                    <div className="form-group">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="btnType1">Total</span>
                        </div>
                        <input type="text" class="form-control text-right borderZero" value="115.50 " />
                        <div class="input-group-append">
                          <span class="btnType1">USDT</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <button className="btn BuyNavButton btn-block">Buy BTC</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div key={2}>
          <div className="tradeChart">
            <img src={require("../../assets/images/trade.jpg")} alt="" className="img-fluid" />
          </div>
        </div>

        <div key={3}>
          <div className="tradeTableLeftSide darkBox orderBook">
            <div className="tableHead">
              <h4>Order Book</h4>
              <div className="inputGroup">
                <button className="btn"><img src={require("../../assets/images/btn-green-dot.png")} alt="" className="img-fluid" /></button>
                <button className="btn"><img src={require("../../assets/images/btn-pink-dot.png")} alt="" className="img-fluid" /></button>
                <button className="btn"><img src={require("../../assets/images/btn-green-pink-dot.png")} alt="" className="img-fluid" /></button>
              </div>
            </div>
            <div className="tradeTableTitle row mx-auto">
              <span className="col-4">Price(USDT)</span>
              <span className="col-4">Amount (BTC)</span>
              <span className="col-4">Total</span>
            </div>
            <Scrollbars style={{ width: "100%", height: 165 }}>
              <div className="tradeTableBody customScroll">
                <div className="tradeTableBodyRow odd row mx-auto" data-toggle="tooltip" data-placement="right" data-html="true" title="<b>Avg.Price:</b> = 7,138.75<br /><b>Sum BTC:</b> 1.302019<br /><b>Sum USDT:</b> 14,279.6600000">
                  <span className="col-4 pinkText">7455.50</span>
                  <span className="col-4">0.326598</span>
                  <span className="col-4">1,305,111</span>
                </div>
                <div className="tradeTableBodyRow even row mx-auto" data-toggle="tooltip" data-placement="right" data-html="true" title="<b>Avg.Price:</b> = 7,138.75<br /><b>Sum BTC:</b> 1.302019<br /><b>Sum USDT:</b> 14,279.6600000">
                  <span className="col-4 pinkText">7455.50</span>
                  <span className="col-4">1.235698</span>
                  <span className="col-4">2,254,125</span>
                </div>
                <div className="tradeTableBodyRow even row mx-auto" data-toggle="tooltip" data-placement="right" data-html="true" title="<b>Avg.Price:</b> = 7,138.75<br /><b>Sum BTC:</b> 1.302019<br /><b>Sum USDT:</b> 14,279.6600000">
                  <span className="col-4 pinkText">7455.50</span>
                  <span className="col-4">1.235698</span>
                  <span className="col-4">2,254,125</span>
                </div>
                <div className="tradeTableBodyRow odd row mx-auto" data-toggle="tooltip" data-placement="right" data-html="true" title="<b>Avg.Price:</b> = 7,138.75<br /><b>Sum BTC:</b> 1.302019<br /><b>Sum USDT:</b> 14,279.6600000">
                  <span className="col-4 pinkText">7455.50</span>
                  <span className="col-4">0.326598</span>
                  <span className="col-4">1,305,111</span>
                </div>
                <div className="tradeTableBodyRow even highLight row mx-auto" data-toggle="tooltip" data-placement="right" data-html="true" title="<b>Avg.Price:</b> = 7,138.75<br /><b>Sum BTC:</b> 1.302019<br /><b>Sum USDT:</b> 14,279.6600000">
                  <span className="pinkText pl-5"><i className="fas fa-caret-down"></i> 7455.50</span>
                </div>
                <div className="tradeTableBodyRow odd row mx-auto" data-toggle="tooltip" data-placement="right" data-html="true" title="<b>Avg.Price:</b> = 7,138.75<br /><b>Sum BTC:</b> 1.302019<br /><b>Sum USDT:</b> 14,279.6600000">
                  <span className="col-4 greenText">7455.50</span>
                  <span className="col-4">0.326598</span>
                  <span className="col-4">1,305,111</span>
                </div>
                <div className="tradeTableBodyRow odd row mx-auto" data-toggle="tooltip" data-placement="right" data-html="true" title="<b>Avg.Price:</b> = 7,138.75<br /><b>Sum BTC:</b> 1.302019<br /><b>Sum USDT:</b> 14,279.6600000">
                  <span className="col-4 greenText">7455.50</span>
                  <span className="col-4">0.326598</span>
                  <span className="col-4">1,305,111</span>
                </div>
                <div className="tradeTableBodyRow odd row mx-auto" data-toggle="tooltip" data-placement="right" data-html="true" title="<b>Avg.Price:</b> = 7,138.75<br /><b>Sum BTC:</b> 1.302019<br /><b>Sum USDT:</b> 14,279.6600000">
                  <span className="col-4 greenText">7455.50</span>
                  <span className="col-4">0.326598</span>
                  <span className="col-4">1,305,111</span>
                </div>
                <div className="tradeTableBodyRow odd row mx-auto" data-toggle="tooltip" data-placement="right" data-html="true" title="<b>Avg.Price:</b> = 7,138.75<br /><b>Sum BTC:</b> 1.302019<br /><b>Sum USDT:</b> 14,279.6600000">
                  <span className="col-4 greenText">7455.50</span>
                  <span className="col-4">0.326598</span>
                  <span className="col-4">1,305,111</span>
                </div>
              </div>
            </Scrollbars>
          </div>
        </div>
        <div key={6}>
          <div className="tradeTableLeftSide darkBox recentTrades">
            <div className="tableHead">
              <h4>Recent Trades</h4>
            </div>
            <div className="tradeTableTitle row mx-auto">
              <span className="col-4">Price(USDT)</span>
              <span className="col-4">Amount</span>
              <span className="col-4">Time</span>
            </div>
            <div className="tradeTableBody customScroll">
              <Scrollbars style={{ width: "100%", height: 130 }}>
                <div className="tradeTableBodyRow odd row mx-auto">
                  <span className="col-4 pinkText">7455.50</span>
                  <span className="col-4">0.326598</span>
                  <span className="col-4">15:05:05</span>
                </div>
                <div className="tradeTableBodyRow odd row mx-auto">
                  <span className="col-4 pinkText">7455.50</span>
                  <span className="col-4">0.326598</span>
                  <span className="col-4">15:05:05</span>
                </div>
                <div className="tradeTableBodyRow odd row mx-auto">
                  <span className="col-4 greenText">7455.50</span>
                  <span className="col-4">1.235698</span>
                  <span className="col-4">15:05:05</span>
                </div>
                <div className="tradeTableBodyRow odd row mx-auto">
                  <span className="col-4 greenText">7455.50</span>
                  <span className="col-4">0.326598</span>
                  <span className="col-4">15:05:05</span>
                </div>
                <div className="tradeTableBodyRow odd row mx-auto">
                  <span className="col-4 greenText">7455.50</span>
                  <span className="col-4">1.235698</span>
                  <span className="col-4">15:05:05</span>
                </div>
                <div className="tradeTableBodyRow odd row mx-auto">
                  <span className="col-4 pinkText">7455.50</span>
                  <span className="col-4">0.326598</span>
                  <span className="col-4">15:05:05</span>
                </div>
                <div className="tradeTableBodyRow odd row mx-auto">
                  <span className="col-4 greenText">7455.50</span>
                  <span className="col-4">1.235698</span>
                  <span className="col-4">15:05:05</span>
                </div>
                <div className="tradeTableBodyRow odd row mx-auto">
                  <span className="col-4 greenText">7455.50</span>
                  <span className="col-4">0.326598</span>
                  <span className="col-4">15:05:05</span>
                </div>
                <div className="tradeTableBodyRow odd row mx-auto">
                  <span className="col-4 greenText">7455.50</span>
                  <span className="col-4">1.235698</span>
                  <span className="col-4">15:05:05</span>
                </div>
                <div className="tradeTableBodyRow odd row mx-auto">
                  <span className="col-4 greenText">7455.50</span>
                  <span className="col-4">0.326598</span>
                  <span className="col-4">15:05:05</span>
                </div>
                <div className="tradeTableBodyRow odd row mx-auto">
                  <span className="col-4 greenText">7455.50</span>
                  <span className="col-4">1.235698</span>
                  <span className="col-4">15:05:05</span>
                </div>
                <div className="tradeTableBodyRow odd row mx-auto">
                  <span className="col-4 greenText">7455.50</span>
                  <span className="col-4">0.326598</span>
                  <span className="col-4">15:05:05</span>
                </div>
              </Scrollbars>
            </div>
          </div>
        </div>
        <div key={4}>
          <div className="darkBox tradeFulltabbedTable">
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <a className="nav-item nav-link active py-2" id="nav-positions-tab" data-toggle="tab" href="#nav-positions" role="tab" aria-controls="nav-positions" aria-selected="true">Open Orders(3)</a>
                <a className="nav-item nav-link py-2" id="nav-closedPL-tab" data-toggle="tab" href="#nav-closedPL" role="tab" aria-controls="nav-closedPL" aria-selected="false">Order History</a>
                <a className="nav-item nav-link py-2" id="nav-active0-tab" data-toggle="tab" href="#nav-active0" role="tab" aria-controls="nav-active0" aria-selected="false">Trade History</a>
              </div>
            </nav>
            <div className="tab-content px-xl-3" id="nav-tabContent">
              <div className="tab-pane fade show active" id="nav-positions" role="tabpanel" aria-labelledby="nav-positions-tab">
                <Scrollbars style={{ width: "100%", height: 165 }}>
                  <div className="table-responsive">
                    <table id="positionsTable" className="table table-striped">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Pair</th>
                          <th>Type</th>
                          <th>Side</th>
                          <th>Price</th>
                          <th>Amount</th>
                          <th>Filled</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>11-05-2021 15:15</td>
                          <td>BTC/USDT</td>
                          <td>Limit</td>
                          <td className="greenText">Buy</td>
                          <td>54,257.50</td>
                          <td>0.000002547</td>
                          <td>50.55%</td>
                          <td>125.50 USDT</td>
                          <td><a href="#">Cancel</a></td>
                        </tr>
                        <tr>
                          <td>11-05-2021 15:15</td>
                          <td>BTC/USDT</td>
                          <td>Limit</td>
                          <td className="pinkText">Sell</td>
                          <td>54,257.50</td>
                          <td>0.000002547</td>
                          <td>50.55%</td>
                          <td>125.50 USDT</td>
                          <td><a href="#">Cancel</a></td>
                        </tr>
                        <tr>
                          <td>11-05-2021 15:15</td>
                          <td>BTC/USDT</td>
                          <td>Limit</td>
                          <td className="greenText">Buy</td>
                          <td>54,257.50</td>
                          <td>0.000002547</td>
                          <td>50.55%</td>
                          <td>125.50 USDT</td>
                          <td><a href="#">Cancel</a></td>
                        </tr>
                        <tr>
                          <td>11-05-2021 15:15</td>
                          <td>BTC/USDT</td>
                          <td>Limit</td>
                          <td className="greenText">Buy</td>
                          <td>54,257.50</td>
                          <td>0.000002547</td>
                          <td>50.55%</td>
                          <td>125.50 USDT</td>
                          <td><a href="#">Cancel</a></td>
                        </tr>
                        <tr>
                          <td>11-05-2021 15:15</td>
                          <td>BTC/USDT</td>
                          <td>Limit</td>
                          <td className="greenText">Buy</td>
                          <td>54,257.50</td>
                          <td>0.000002547</td>
                          <td>50.55%</td>
                          <td>125.50 USDT</td>
                          <td><a href="#">Cancel</a></td>
                        </tr>
                        <tr>
                          <td>11-05-2021 15:15</td>
                          <td>BTC/USDT</td>
                          <td>Limit</td>
                          <td className="pinkText">Sell</td>
                          <td>54,257.50</td>
                          <td>0.000002547</td>
                          <td>50.55%</td>
                          <td>125.50 USDT</td>
                          <td><a href="#">Cancel</a></td>
                        </tr>
                        <tr>
                          <td>11-05-2021 15:15</td>
                          <td>BTC/USDT</td>
                          <td>Limit</td>
                          <td className="pinkText">Sell</td>
                          <td>54,257.50</td>
                          <td>0.000002547</td>
                          <td>50.55%</td>
                          <td>125.50 USDT</td>
                          <td><a href="#">Cancel</a></td>
                        </tr>
                        <tr>
                          <td>11-05-2021 15:15</td>
                          <td>BTC/USDT</td>
                          <td>Limit</td>
                          <td className="greenText">Buy</td>
                          <td>54,257.50</td>
                          <td>0.000002547</td>
                          <td>50.55%</td>
                          <td>125.50 USDT</td>
                          <td><a href="#">Cancel</a></td>
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </Scrollbars>
              </div>
              <div className="tab-pane fade" id="nav-closedPL" role="tabpanel" aria-labelledby="nav-closedPL-tab">
                <Scrollbars style={{ width: "100%", height: 165 }}>
                  <div className="table-responsive">
                    <table id="closedPLTable" className="table table-striped">
                      <thead>
                        <tr>
                          <th>Contracts</th>
                          <th>Closing Direction</th>
                          <th>Quntity</th>
                          <th>Entry Price</th>
                          <th>Exit Price</th>
                          <th>Closed P&L(Excl Fee)</th>
                          <th>Exit Type</th>
                          <th>Close Position Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td colspan="8" height="150" className="text-center">- No data Available -</td></tr>
                      </tbody>
                    </table>
                  </div>
                </Scrollbars>
              </div>
              <div className="tab-pane fade" id="nav-active0" role="tabpanel" aria-labelledby="nav-active0-tab">
                <Scrollbars style={{ width: "100%", height: 165 }}>
                  <div className="table-responsive">
                    <table id="active0Table" className="table table-striped">
                      <thead>
                        <tr>
                          <th>Contracts</th>
                          <th>Quntity</th>
                          <th>Price</th>
                          <th>Filled Remaining</th>
                          <th>Order Value</th>
                          <th>Tp/SL</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Order#</th>
                          <th>Order Time</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td colspan="11" height="150" className="text-center">- No data Available -</td></tr>
                      </tbody>
                    </table>
                  </div>
                </Scrollbars>
              </div>
            </div>
          </div>
        </div>


      </ResponsiveReactGridLayout>
    </div>
  );

}

ShowcaseDerivativeLayout.propTypes = {
  onLayoutChange: PropTypes.func.isRequired
};

ShowcaseDerivativeLayout.defaultProps = {
  className: "layout",
  rowHeight: 30,
  onLayoutChange: function () { },
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  initialLayout: [{
    x: 0,
    y: 0,
    w: 9,
    h: 2,
    i: "0",
    name: 'marketPrice',
    static: true,
  },
  {
    x: 9,
    y: 0,
    w: 3,
    h: 21,
    i: "1",
    name: 'placeOrder',
    static: false,
  },
  {
    x: 0,
    y: 2,
    w: 6,
    h: 13,
    i: "2",
    name: 'chart',
    static: false,
  },
  {
    x: 6,
    y: 2,
    w: 3,
    h: 7,
    i: "3",
    name: 'orderBook',
    static: false,
  },
  {
    x: 6,
    y: 2,
    w: 3,
    h: 6,
    i: "6",
    name: 'Recent Trade',
    static: false,
  },
  {
    x: 0,
    y: 10,
    w: 9,
    h: 6,
    i: "4",
    name: 'tradeHistory',
    static: false,
  }
  ]
};


export default ShowcaseDerivativeLayout;