// import package
import React, { useEffect, useState } from 'react';
import Countdown, { zeroPad } from "react-countdown";
import { Button } from "@material-ui/core";
import { useSelector } from 'react-redux'

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { launchpadList } from '../../actions/launchpad'

// import lib
import { dateTimeFormat } from '../../lib/dateTimeHelper';

import bannerimg1 from "../../assets/images/launchpad1.jpg"

const Launchpaddetails = (props) => {


    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [totalBought, setTotalBought] = useState(0);
    const [totalSold, setTotalSold] = useState(0);
    const [all, setAll] = useState(0);
    const [loader, setLoader] = useState(true)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 6
    })

      // redux
      const currencyData = useSelector(state => state.currency)

      const fetchList = async (reqQuery) => {
          try {
              const { status, loading, result } = await launchpadList('active', reqQuery);
            
                setCount(result.count)
                setTotalBought(result.bought)
                setTotalSold(result.sold)
                setAll(result.all)
                console.log("Data result : ",status,result)
           
          } catch (err) { }
      }

      useEffect(() => {
          if (currencyData && currencyData.length > 0) {
              fetchList(pagination)
          }
      }, [currencyData])


    return (
        <>
        <div class="dashboard_box launchpad_box py-5">
                <div className='row align-items-center'>
                    <div className='col-12 col-lg-5 col-xl-4'>
                        <p className='text_big_white'>Aurex token launch platform</p>
                        <p className='text_sm_white mb-0'>Buy or earn new tokens directly on AurEx</p>


                    </div>
                    <div className='col-12 col-lg-7 col-xl-8 mt-3 mt-lg-0'>
                        <div className='row'>
                            <div className='col-12 col-sm-6 col-md-3 text-center mb-3 mb-md-0'>
                                <p className='text_green_val'>{count}</p>
                                <p className='text_sm_white mb-0'>Active Projects</p>

                            </div>
                            <div className='col-12 col-sm-6 col-md-3 text-center mb-3 mb-md-0'>
                                <p className='text_green_val'> {totalBought.toFixed(3)}</p>
                                <p className='text_sm_white mb-0'>Total Funds Raised</p>

                            </div>
                            <div className='col-12 col-sm-6 col-md-3 text-center mb-3 mb-md-0'>
                                <p className='text_green_val'>{all}</p>
                                <p className='text_sm_white mb-0'>Projects Launched</p>

                            </div>
                            <div className='col-12 col-sm-6 col-md-3 text-center mb-3 mb-md-0'>
                                <p className='text_green_val'> {totalSold.toFixed(3)}</p>
                                <p className='text_sm_white mb-0'>All-time Sold Launches</p>

                            </div>
                        </div>
                    </div>
                </div>
             </div>
             </>
    )
}

export default Launchpaddetails;