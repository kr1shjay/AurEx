import React, { useEffect, useState, useContext } from 'react';
import PropTypes, { func } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import clsx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars-2';
// import context
import SocketContext from '../Context/SocketContext';

// import action
import { getPairList, setPairList, setTradePair, setMarketPrice } from '../../actions/spotTradeAction';
import {
  getAssetByCurrency,
  setUserFirstCurrency,
  setUserSecondCurrency
} from '../../actions/walletAction';

// import lib
import isEmpty from '../../lib/isEmpty';
import { toFixed } from '../../lib/roundOf';
import isLogin from '../../lib/isLogin';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ScrollableTabsButtonAuto() {


  const history = useHistory();
  const dispatch = useDispatch();
  const { tikerRoot } = useParams();
  const socketContext = useContext(SocketContext);
  const { t, i18n } = useTranslation();
  // state
  const [pairLists, setPairLists] = useState([]);
  const [secondCurrencyList, setsecondCurrencyList] = useState([]);
  const [selectCurrency, setSelectCurrency] = useState('')
  const [search, setsearchValue] = useState("");

  // redux-state
  const tickerData = useSelector(state => state.marketPrice);
  const pairData = useSelector(state => state.tradePair);
  const pairListData = useSelector(state => state.pairList);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // function
  const fetchAssetByCurrency = async (spotPairId, type) => {
    try {
      if (!isLogin()) {
        return true
      }
      const { status, loading, error, result } = await getAssetByCurrency(spotPairId);
      if (status == 'success') {
        if (type == 'firstCurrency') {
          setUserFirstCurrency(result, dispatch)
        } else if (type == 'secondCurrency') {
          setUserSecondCurrency(result, dispatch)
        }
      } else { }
      return true
    } catch (err) { }
  }

  const fetchPairList = async () => {
    try {
      const { status, loading, result } = await getPairList();
      if (status == 'success') {
        setPairList(result, dispatch)
        if (result && result.length > 0) {
          if (isEmpty(tikerRoot)) {

            let pair = `${result[0].firstCurrencySymbol}_${result[0].secondCurrencySymbol}`
            history.replace('/spot/' + pair)

            // history.push('/spot/' + pair)
            
            setSelectCurrency(result[0].secondCurrencySymbol)
            await fetchAssetByCurrency(result[0].firstCurrencyId, 'firstCurrency')
            await fetchAssetByCurrency(result[0].secondCurrencyId, 'secondCurrency')
            await setMarketPrice(result[0], dispatch)
            await setTradePair(result[0], dispatch)
            // getMarketPrice(result[0]._id, dispatch);
          } else {
            let currency = tikerRoot.split('_');
            let pairDetail = result.find((el => el.firstCurrencySymbol == currency[0] && el.secondCurrencySymbol == currency[1]))
            setSelectCurrency(currency[1])
            await fetchAssetByCurrency(pairDetail.firstCurrencyId, 'firstCurrency')
            await fetchAssetByCurrency(pairDetail.secondCurrencyId, 'secondCurrency')
            // getMarketPrice(pairDetail._id, dispatch);
            await setMarketPrice(pairDetail, dispatch)
            await setTradePair(pairDetail, dispatch)
          }
        }
      } else { }
    }
    catch (err) { }
  }

  const handlePairChange = async (pairData,event) => {
    console.log(event.target.closest("tr"),"event");
    var allDivTd = document.getElementsByClassName("all_pair_tr");

for(var i = 0; i < allDivTd.length; i++){
    var td = allDivTd[i];
    // td.getElementsByTagName("tr").classList.remove("active_pair")
    console.log(td.getElementsByTagName("tr"),"fdsf");
  var alltd = td.getElementsByTagName("tr");
    for(var j = 0; j < alltd.length; j++){
      var tdnew = alltd[j];
      // td.getElementsByTagName("tr").classList.remove("active_pair")
      // console.log(td.getElementsByTagName("tr"),"fdsf")
      tdnew.classList.remove("active_pair")
  }
    // td.getElementsByTagName("tr").classList.remove("active_pair")
}
   
    event.target.closest("tr").classList.add("active_pair");

   
    let pair = `${pairData.firstCurrencySymbol}_${pairData.secondCurrencySymbol}`
    history.push('/spot/' + pair)
    if (tikerRoot != pair) {
      await fetchAssetByCurrency(pairData.firstCurrencyId, 'firstCurrency')
      await fetchAssetByCurrency(pairData.secondCurrencyId, 'secondCurrency')
      await setMarketPrice(pairData, dispatch)
      await setTradePair(pairData, dispatch)
      socketContext.socket.off("marketPrice");
      socketContext.socket.off("orderBook");
      socketContext.socket.off("recentTrade");
    }
  }

  const searchpair = (e) => {
    setsearchValue(e.target.value)
    var searcharr = [];
    if (pairListData && pairListData.length > 0) {
      for (var i = 0; i < pairListData.length; i++) {
        var temppair =
          pairListData[i].firstCurrencySymbol +
          "/" +
          pairListData[i].secondCurrencySymbol;
        if (temppair.indexOf(e.target.value.toUpperCase()) !== -1) {
          searcharr.push(pairListData[i]);
        }
        if (i == pairListData.length - 1) {
          setPairLists(searcharr)
        }
      }
    }

  };

  const secondCurrencyArray = (pairListData) => {
    let uniqueChars = [];
    pairListData.forEach((c) => {
      if (!uniqueChars.includes(c.secondCurrencySymbol)) {
        uniqueChars.push(c.secondCurrencySymbol);
      }
    });
    setsecondCurrencyList(uniqueChars);
  }
  useEffect(() => {

    if (pairListData && pairListData.length > 0) {
      secondCurrencyArray(pairListData);
      setPairLists(pairListData)
    }
  }, [pairListData])
  useEffect(() => {
    if (!isEmpty(pairData)) {
      // socket
      socketContext.socket.on('marketPrice', (result) => {
        if (result.pairId == pairData.pairId) {
          setMarketPrice(result.data, dispatch)
          let tempPairList = pairLists;
          let pairIndex = tempPairList.findIndex((el => el._id == result.pairId))
          if (pairIndex >= 0) {
            tempPairList[pairIndex] = {
              ...tempPairList[pairIndex],
              ...{
                'markPrice': result.data.markPrice,
                'change': result.data.change
              }
            }
            setPairLists(tempPairList)
          }
        }
      })
    }
  }, [pairData])

  useEffect(() => {
    fetchPairList();
    return () => {
      socketContext.socket.off("marketPrice");
      socketContext.socket.off("orderBook");
      socketContext.socket.off("recentTrade");
    }
  }, [])
  return (
    <div className="market_table">
      <div className="trade_search_table">
        <input type="text" placeholder="search" onChange={searchpair} />
        <i class="fas fa-search"></i>
      </div>
      {/* <div className={classes.root + " slaide_tab"}>
      {
              secondCurrencyList && secondCurrencyList.length > 0 && secondCurrencyList.map((item, key) => {
                console.log("🚀 ~ file: Markerpricetable.js ~ line 241 ~ secondCurrencyList&&secondCurrencyList.length>0&&secondCurrencyList.map ~ key", item)
                return (
                  <Tab label={item} className="tab_button" />
                )
              })
            }
        
      </div> */}
      <div className='pairColumn'>
      
      <nav>
       
					<div class="nav nav-tabs" id="nav-tab" role="tablist">
            {
              secondCurrencyList && secondCurrencyList.length > 0 && secondCurrencyList.map((item,i)=>{
               
               return(
                <>
                <a class="nav-item nav-link" 
                 // <a class={`nav-item nav-link py-2 ${item == selectCurrency  ? 'active' : ''}`}  */}
                // id="nav-ETH-tab" 
                id={`nav-${item}-tab`} 
                data-toggle="tab" 
                href= {`#nav-${item}`}
                // href="#nav-ETH" 
                // role="tab" aria-controls={`nav-${item}`}
                role="tab" aria-controls="nav-ETH" 
                aria-selected="false">  {item}</a>
                </>
               )
                

              })
            }
						{/* <a class="nav-item nav-link active" id="nav-USDT-tab" data-toggle="tab" href="#nav-USDT" role="tab" aria-controls="nav-USDT" aria-selected="true">USDT</a>
						<a class="nav-item nav-link" id="nav-ETH-tab" data-toggle="tab" href="#nav-ETH" role="tab" aria-controls="nav-ETH" aria-selected="false">ETH</a>
						<a class="nav-item nav-link" id="nav-BUSD-tab" data-toggle="tab" href="#nav-BUSD" role="tab" aria-controls="nav-BUSD" aria-selected="false">BUSD</a>
						<a class="nav-item nav-link" id="nav-INR-tab" data-toggle="tab" href="#nav-INR" role="tab" aria-controls="nav-INR" aria-selected="false">INR</a> */}
					</div>
				</nav>
				<div class="tab-content" id="nav-tabContent">

        {
                                secondCurrencyList && secondCurrencyList.length > 0 && secondCurrencyList.map((el, index) => {
                                    return (
                                        <div class={`tab-pane fade show ${el == selectCurrency ? 'active' : ''}`} id={`nav-${el}`} role="tabpanel" aria-labelledby={`nav-${el}-tab`}>
                                              <Scrollbars style={{ width: "100%", height: 455 }}>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                    <th>{t('PAIR')}</th>
                                                   <th>{t('LATEST_PRICE')}</th>
                                                   <th>{t('CHANGE')}</th>

                                                        {/* <th>24h Volume</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody className="all_pair_tr">
                                                    {
                                                        pairLists && pairLists.length > 0 && pairLists.map((item, key) => {
                                                            if (el == item.secondCurrencySymbol) {
                                                                return (
                                                                    <tr key={key} onClick={(e) => handlePairChange(item,e)}>
                                                                        <td>
                                                                            <p className="mb-0">{/* <i class="fas fa-star"></i> */}{item.firstCurrencySymbol}<span>/{item.secondCurrencySymbol}</span></p></td>
                                                                        <td className="balance_amt_detail">
                                                                            <p className="mb-0"><span className="price_increase">{item.markPrice}</span>{/* <span>/$314.5</span> */}</p>
                                                                        </td>
                                                                        <td className={clsx({
                                                                            "span_menu_gerrn": item.change > 0,
                                                                            "span_menu_red": item.change <= 0
                                                                        })}>{toFixed(item.change,2)}%</td>
                                                                        {/* <td className="buy_button_op">0</td> */}
                                                                    </tr>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                            </Scrollbars>

                                        </div>
                                    )
                                })
                            }
      
					{/* <div class="tab-pane fade show active" id="nav-ETH" role="tabpanel" aria-labelledby="nav-ETH-tab">
          <Scrollbars style={{ width: "100%", height: 455 }}>
					{
          secondCurrencyList && secondCurrencyList.length > 0 && secondCurrencyList.map((el, index) => {
            return (
            
               
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col"><i class="far fa-star"></i></th>
                        <th scope="col">Pairs</th>
                        <th scope="col">{t('LAST_PRICE')}</th>
                        <th scope="col">{t('24H_CHANGE')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        pairLists && pairLists.length > 0 && pairLists.map((item, key) => {
                          if (el == item.secondCurrencySymbol) {
                            return (

                              <tr key={key} onClick={() => handlePairChange(item)}>
                                <td><i class="far fa-star"></i></td>
                                <td>{item.firstCurrencySymbol}/{item.secondCurrencySymbol}</td>
                                <td>{item.markPrice}</td>
                                <td className={clsx({
                                  "span_menu_gerrn": item.change > 0,
                                  "span_menu_red": item.change <= 0
                                })}>{toFixed(item.change, 2)}%</td>
                              </tr>
                            )
                          }
                        })
                      }

                    </tbody>
                  </table>
               
            )
          })
        }
         </Scrollbars>
					</div> */}
          {/* <div class="tab-pane fade" id="nav-ETH" role="tabpanel" aria-labelledby="nav-ETH-tab">
          <Scrollbars style={{ width: "100%", height: 400 }}>
          {
          secondCurrencyList && secondCurrencyList.length > 0 && secondCurrencyList.map((el, index) => {
            return (
            
                
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col"><i class="far fa-star"></i></th>
                        <th scope="col">Pairs</th>
                        <th scope="col">{t('LAST_PRICE')}</th>
                        <th scope="col">{t('24H_CHANGE')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        pairLists && pairLists.length > 0 && pairLists.map((item, key) => {
                          if (el == item.secondCurrencySymbol) {
                            return (

                              <tr key={key} onClick={() => handlePairChange(item)}>
                                <td><i class="far fa-star"></i></td>
                                <td>{item.firstCurrencySymbol}/{item.secondCurrencySymbol}</td>
                                <td>{item.markPrice}</td>
                                <td className={clsx({
                                  "span_menu_gerrn": item.change > 0,
                                  "span_menu_red": item.change <= 0
                                })}>{toFixed(item.change, 2)}%</td>
                              </tr>
                            )
                          }
                        })
                      }

                    </tbody>
                  </table>
                
            )
          })
        }
        </Scrollbars>
					</div>
					<div class="tab-pane fade" id="nav-BUSD" role="tabpanel" aria-labelledby="nav-BUSD-tab">
          <Scrollbars style={{ width: "100%", height: 400 }}>
          {
          secondCurrencyList && secondCurrencyList.length > 0 && secondCurrencyList.map((el, index) => {
            return (
            
               
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col"><i class="far fa-star"></i></th>
                        <th scope="col">Pairs</th>
                        <th scope="col">{t('LAST_PRICE')}</th>
                        <th scope="col">{t('24H_CHANGE')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        pairLists && pairLists.length > 0 && pairLists.map((item, key) => {
                          if (el == item.secondCurrencySymbol) {
                            return (

                              <tr key={key} onClick={() => handlePairChange(item)}>
                                <td><i class="far fa-star"></i></td>
                                <td>{item.firstCurrencySymbol}/{item.secondCurrencySymbol}</td>
                                <td>{item.markPrice}</td>
                                <td className={clsx({
                                  "span_menu_gerrn": item.change > 0,
                                  "span_menu_red": item.change <= 0
                                })}>{toFixed(item.change, 2)}%</td>
                              </tr>
                            )
                          }
                        })
                      }

                    </tbody>
                  </table>
                
            )
          })
        }
        </Scrollbars>
					</div>
					<div class="tab-pane fade" id="nav-INR" role="tabpanel" aria-labelledby="nav-INR-tab">
          <Scrollbars style={{ width: "100%", height: 400 }}>
          {
          secondCurrencyList && secondCurrencyList.length > 0 && secondCurrencyList.map((el, index) => {
            return (
            
                
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col"><i class="far fa-star"></i></th>
                        <th scope="col">Pairs</th>
                        <th scope="col">{t('LAST_PRICE')}</th>
                        <th scope="col">{t('24H_CHANGE')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        pairLists && pairLists.length > 0 && pairLists.map((item, key) => {
                          if (el == item.secondCurrencySymbol) {
                            return (

                              <tr key={key} onClick={() => handlePairChange(item)}>
                                <td><i class="far fa-star"></i></td>
                                <td>{item.firstCurrencySymbol}/{item.secondCurrencySymbol}</td>
                                <td>{item.markPrice}</td>
                                <td className={clsx({
                                  "span_menu_gerrn": item.change > 0,
                                  "span_menu_red": item.change <= 0
                                })}>{toFixed(item.change, 2)}%</td>
                              </tr>
                            )
                          }
                        })
                      }

                    </tbody>
                  </table>
                
            )
          })
        }
        </Scrollbars>
					</div> */}
				</div>
        
     </div>
    </div>
  )
}
