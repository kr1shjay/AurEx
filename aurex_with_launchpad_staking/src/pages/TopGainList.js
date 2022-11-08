import React, { useEffect, useState } from "react";
// @material-ui/core components

import DataTable from 'react-data-table-component';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";


//action
import { getPairList, topGainList } from "actions/spotTradeAction";
import { AddFavorite, GetFavorite } from "actions/users";
import { isMetaProperty } from "typescript";
import isEmpty from "lib/isEmpty";








export default function SpotMarket(props) {
    const [record, setRecord] = useState([]);

    const fetchGain = async () => {
        let { status, result } = await topGainList()
        if (status == 'success') {
            setRecord(result)
        }
    }


    useEffect(() => {
        fetchGain()
    }, [])
    return (
        <>
            <GridContainer>
                <GridItem xs={12} sm={12} md={12} lg={2}>
                    <div className="statking_title">
                        <h3>Top Gaining</h3>
                        <small>pairs in 24H</small>
                    </div>
                </GridItem>
                {
                    record && record.length > 0 && record.map((item) => {
                        return (
                            <>
                                <GridItem xs={12} sm={3} md={4} lg={2}>
                                    <div className="coin_top_list">
                                        <h1>
                                            <div>
                                                <img src={item.firstCurrencyImage} alt="logo" className="img-fluid" />
                                                <span className="color_blue m-0">{item.firstCurrencySymbol + '/' + item.secondCurrencySymbol}</span>
                                            </div>

                                        </h1>
                                        <div className="markrt_amt_sec">
                                            <span>{item.markPrice + ' ' + item.secondCurrencySymbol}</span>
                                            <span className="color_green">{item.change}%</span>
                                        </div>
                                    </div>
                                </GridItem>
                            </>
                        )
                    })
                }
            </GridContainer>
        </>





    );
}
