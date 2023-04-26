import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import lodash from 'lodash'
import { AppBar, Tabs, Tab, Typography, Box } from '@material-ui/core';
import clsx from 'classnames'
import { useTranslation } from 'react-i18next';
// import lib
import { toFixed } from '../../lib/roundOf';

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

const MarketTable = (props) => {
    const classes = useStyles();

    // props
    const { pairList } = props;
    console.log("MarketTable",pairList)

    // state
    const [currency, setCurrency] = useState([])
    const [curIndex, setCurIndex] = useState(-1)
    const { t, i18n } = useTranslation();

    // redux-state
    const { isAuth } = useSelector(state => state.auth);

    // function
    const handleChange = (event, newValue) => {
        setCurIndex(newValue);
        
    };

    useEffect(() => {
        if (currency && currency.length == 0 && pairList && pairList.length > 0) {
            let curList = lodash.chain(pairList).map('secondCurrencySymbol').uniq().value();
            curList.sort().reverse();
            console.log("curList",curList)
            setCurrency(curList)
            setCurIndex(0)
        }
    }, [pairList])
    return (
        <>
        {currency && currency.length < 0 ? 
        //to do 
    //      <div className={classes.root + " slaide_tab home_table"}>
    //      <AppBar position="static" color="default">
    //          <Tabs
    //              value={curIndex}
    //              onChange={handleChange}
    //              indicatorColor="primary"
    //              textColor="primary"
    //              variant="scrollable"
    //              scrollButtons="auto"
    //              aria-label="scrollable  tabs example tab_scroll_section"
    //          >
    //              {
    //                  currency && currency.length > 0 && currency.map((item, key) => {

    //                      return (
    //                          <Tab key={key} label={item} {...a11yProps(key)} className="tab_button" />
    //                      )
    //                  })
    //              }
    //          </Tabs>
    //      </AppBar>

    //      {
    //          currency && currency.length > 0 && currency.map((el, index) => {
    //              return (
    //                  <TabPanel key={index} value={curIndex} index={index} className="p-padding_section p-0">
    //                      <table className="common-table homepage_table">
    //                          <thead>
    //                              <th>{t('CRYPTO') }</th>
    //                              <th>{t('LAST_PRICE')}</th>
    //                              <th>{t('24H_CHANGE')}</th>
    //                              <th></th>
    //                          </thead>
    //                          <tbody>

    //                              {
    //                                  pairList && pairList.length > 0 && pairList.map((item, key) => {
    //                                      if (el == item.secondCurrencySymbol) {
    //                                          return (
    //                                              <tr key={key}>
    //                                                  <td>
    //                                                      <div className="d-flex flex_section_s">
    //                                                          {/* <img src={item.firstCurrencyImage} alt="logo" className="marketIcon" /> */}
    //                                                          <span>{item.firstCurrencySymbol}/{item.secondCurrencySymbol}</span>
    //                                                      </div>
    //                                                  </td>
    //                                                  <td><span className="amount_section">{item.markPrice}</span></td>
    //                                                  <td><span className={clsx('amount_section', {
    //                                                      "green_text": item.change > 0,
    //                                                      "red_text": item.change <= 0
    //                                                  })}>{toFixed(item.change, 2)}</span></td>
    //                                                  <td>
    //                                                      <a href={isAuth ? "/spot" : "login"} class="btn greenButton mr-2" id="BTC-USDT">Trade</a> 
    //                                                  </td>
    //                                              </tr>
    //                                          )
    //                                      }
    //                                  })
    //                              }
    //                          </tbody>
    //                      </table>
    //                      <div className='btn_more_div py-4'>
    //                          <Link to="/spot">More <i className='fas fa-arrow-right'></i></Link>
    //                      </div>
    //                  </TabPanel>
    //              )
    //          })
    //      }
    //  </div> 
    <p className='py-4 no_mar_data'>No Market Price Available</p>
    : 
    <div className={classes.root + " slaide_tab home_table"}>
         <AppBar position="static" color="default">
             <Tabs
                 value={curIndex}
                 onChange={handleChange}
                 indicatorColor="primary"
                 textColor="primary"
                 variant="scrollable"
                 scrollButtons="auto"
                 aria-label="scrollable  tabs example tab_scroll_section"
             >
                 {
                     currency && currency.length > 0 && currency.map((item, key) => {

                         return (
                             <Tab key={key} label={item} {...a11yProps(key)} className="tab_button" />
                         )
                     })
                 }
             </Tabs>
         </AppBar>

         {
             currency && currency.length > 0 && currency.map((el, index) => {
                 return (
                     <TabPanel key={index} value={curIndex} index={index} className="p-padding_section p-0">
                         <table className="common-table homepage_table">
                             <thead>
                                 <th>{t('CRYPTO') }</th>
                                 <th>{t('LAST_PRICE')}</th>
                                 <th>{t('24H_CHANGE')}</th>
                                 <th></th>
                             </thead>
                             <tbody>

                                 {
                                     pairList && pairList.length > 0 && pairList.map((item, key) => {
                                         if (el == item.secondCurrencySymbol) {
                                             return (
                                                 <tr key={key}>
                                                     <td>
                                                         <div className="d-flex flex_section_s">
                                                             {/* <img src={item.firstCurrencyImage} alt="logo" className="marketIcon" /> */}
                                                             <span>{item.firstCurrencySymbol}/{item.secondCurrencySymbol}</span>
                                                         </div>
                                                     </td>
                                                     <td><span className="amount_section">{item.markPrice}</span></td>
                                                     <td><span className={clsx('amount_section', {
                                                         "green_text": item.change > 0,
                                                         "red_text": item.change <= 0
                                                     })}>{toFixed(item.change, 2)}</span></td>
                                                     <td>
                                                         <a href={isAuth ? "/spot" : "login"} class="btn greenButton btn_flex_ce mr-2" id="BTC-USDT">Trade</a> 
                                                     </td>
                                                 </tr>
                                             )
                                         }
                                     })
                                 }
                             </tbody>
                         </table>
                         <div className='btn_more_div py-4'>
                             <Link to="/spot">More <i className='fas fa-arrow-right'></i></Link>
                         </div>
                     </TabPanel>
                 )
             })
         }
     </div>
     
     }
       
        </>
    );
}

export default MarketTable;