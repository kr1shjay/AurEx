// import package
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

//
import { getAllTrade } from '../../actions/users'

const Statistics = () => {
    const { t, i18n } = useTranslation();
    let [data, setData] = useState([])

    const fetchData = async () => {
        const { status, message, result } = await getAllTrade()
        if (status) {
            setData(result)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="p2p_card min-h-auto">
            <h5 className="login_title_8 new_dashboard">{t("STATISTICS")}</h5>
            <GridContainer>
                <GridItem xs={12} sm={6} md={3} lg={3} className="p-0">
                    <div className="statisctic">
                        <div>
                            <lable className="label">{t("TOTAL_SPOT_TRADE")}</lable>
                            <p className="color_blue">{data && data.spotCompleted > 0 ? data.spotCompleted : 0}</p>
                        </div>
                        {/* <div>
                            <lable className="label">Total Spot <br /> P&L</lable>
                            <p className="color_green"> +2.5%</p>
                            <p className="color_green">=$210.50</p>

                        </div> */}
                    </div>
                </GridItem>
                <GridItem xs={12} sm={6} md={3} lg={3} className="p-0">
                    <div className="statisctic">
                        <div>
                            <lable className="label">{t("TOTAL_DERIVATIVE_TRADE")}</lable>
                            <p className="color_blue" style={{ marginTop: '20px' }}>{data && data.TotalDerivative > 0 ? data.TotalDerivative : 0}</p>
                        </div>
                        {/* <div>
                            <lable className="label">Total Derivatives<br /> P&L</lable>
                            <p className="color_blue">10%</p>

                        </div> */}
                    </div>
                </GridItem>
                <GridItem xs={12} sm={6} md={3} lg={4} className="p-0">
                    <div className="statisctic">
                        <div>
                            <lable className="label">{t("OPEN")} <br />{t("P2P_TRADE")}</lable>
                            <p className="color_blue" >{data && data.p2pOpenOrder > 0 ? data.p2pOpenOrder : 0}</p>
                        </div>
                        {/* <div>
                            <lable className="label">{t("PENDING")} <br />{t("ESCROW_STATUS")}</lable>
                            <p className="color_blue">10%</p>

                        </div> */}
                        {/* <div>
                            <lable className="label">{t("COMPLETED")} <br />{t("P2P_TRADE")}</lable>
                            <p className="color_blue">{data.p2pCompleteOrder}</p>

                        </div> */}
                    </div>
                </GridItem>

                <GridItem xs={12} sm={6} md={3} lg={2} className="p-0">
                    <div className="statisctic">

                        <div>
                            <lable className="label">{t("COMPLETED")} <br />{t("P2P_TRADE")}</lable>
                            <p className="color_blue">{data && data.p2pCompleteOrder > 0 ? data.p2pCompleteOrder : 0}</p>

                        </div>
                    </div>
                </GridItem>
            </GridContainer>
        </div >
    )
}

export default Statistics;