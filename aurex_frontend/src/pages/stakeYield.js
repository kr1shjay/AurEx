import React, { useEffect, useState } from 'react'
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import { useTranslation } from 'react-i18next';

//Action
import { highYield } from '../actions/stakingAction';

// import lib
import { toFixed} from '../lib/roundOf'

const HighYield = () => {
    const { t, i18n } = useTranslation();
    const [fixedData, setfixedData] = useState([])
    const [flexData, setflexData] = useState([])
    const fetchData = async () => {
        let { status, result } = await highYield()
        if (status == 'success') {
            setfixedData(result.fixedData)
            setflexData(result.flexibleData)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <GridItem xs={12} sm={12} md={12} lg={2}>
                <div className="statking_title">
                    <h3>{t('Stake & Earn')}</h3>
                    <small>{t('Yields')}</small>
                </div>

              
            </GridItem>
            {/* <GridItem xs={12} sm={6} md={4} lg={2}>
                <div className="coin_top_list">
                    <h1>
                        <div>
                            <img src={require("../assets/images/coin3.png")} alt="logo" className="img-fluid" />
                            <span className="color_blue m-0">{t('ADA')} </span>
                        </div>
                        <div>
                            <span className="color_green">85.50%</span>
                        </div>
                    </h1>
                    <p>{t('FLEXIBLE')}</p>
                </div>
            </GridItem> */}

            {
                flexData && flexData.length > 0 && flexData.map(item => {
                    return (
                        <>
                            <GridItem xs={12} sm={6} md={4} lg={2}>
                                <div className="coin_top_list">
                                    <h1>
                                        <div>
                                            <img src={item.currencySymbol} alt="logo" className="img-fluid" />
                                            <span className="color_blue m-0">{item.coin}</span>
                                        </div>
                                        <div>
                                            <span className="color_green">{toFixed(item.percentage,8)}%</span>
                                        </div>
                                    </h1>
                                    <p>{t('FLEXIBLE')}</p>

                                </div>
                            </GridItem>
                        </>
                    )
                })
            }
            {
                fixedData && fixedData.length > 0 && fixedData.map(item => {
                    return (
                        <>
                            <GridItem xs={12} sm={6} md={4} lg={2}>
                                <div className="coin_top_list">
                                    <h1>
                                        <div>
                                            <img src={item.currencySymbol} alt="logo" className="img-fluid" />
                                            <span className="color_blue m-0">{item.coin} </span>
                                        </div>
                                        <div>
                                            <span className="color_green">{toFixed(item.percentage,8)}%</span>
                                        </div>
                                    </h1>
                                    <p>{t('LOCKED')} - <span className="color_blue">{item.day}</span>{t('DAYS')}</p>

                                </div>
                            </GridItem>
                        </>
                    )
                })
            }
        </>
    )
}

export default HighYield