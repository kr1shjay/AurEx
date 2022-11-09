// import package
import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { Button } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom'
import Tabletabs from './Tabletabs'
import { useSelector } from 'react-redux';

// import context
import SocketContext from '../Context/SocketContext';

// import action
import { getMarketTrend, getCmsData } from '../../actions/homeAction'
import { toFixed } from '../../lib/roundOf'

import Ticker from 'react-ticker'
import Slider from "react-slick";

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// import config
import config from "../../config/index.js"

const MarketTrend = () => {
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const socketContext = useContext(SocketContext);

    var settings = {
        dots: true,
        infinite: true,
        arrows: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    // state
    const [pairData, setPairData] = useState([])
    const [cmsData, setCmsData] = useState({})
    const [newsData, setNewsData] = useState([])



    // function
    const fetchMarketTrend = async () => {
        try {
            const { status, loading, result } = await getMarketTrend();
            if (status == 'success') {
                setPairData(result)
            }
        } catch (err) { }
    }
    const fetchCmsData = async () => {
        try {
            const { status, loading, result } = await getCmsData();
            let newsImage = [];
            if (status == 'success') {
                result && result.map((item, i) => {
                    if (item.title == "Landing_News") {
                        setCmsData(item)
                    }
                    if (item.title == "Landing_NewsImage") {
                        newsImage.push(item.image && item.image[0])
                    }
                })
            }
            setNewsData(newsImage)
        } catch (err) { }
    }
    const announcementTicker = () => {
        console.log("announcementTicker : ",cmsData)
        return cmsData && cmsData.content ? (
            <p style={{ whiteSpace: "nowrap" }}>{ReactHtmlParser(cmsData.content)}</p>
        ) : (
            <p style={{ visibility: "hidden" }}>Placeholder</p>
        );
    }
    useEffect(() => {
        fetchMarketTrend();
        fetchCmsData();
        socketContext.socket.on('marketPrice', (result) => {
            setPairData((el) => {
                let pairList = [];
                el.map(item => {
                    if (item._id == result.pairId) {
                        pairList.push({
                            ...item,
                            "markPrice": toFixed(result.data.markPrice, item.secondFloatDigit),
                            "change": toFixed(result.data.change, 2)
                        })
                    } else {
                        pairList.push(item)
                    }
                })
                return pairList
            })
        })

        return () => {
            socketContext.socket.off("marketPrice");
        }
    }, [])

    return (
        <div className="coinTable pb-5 anounce_bg">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="banner_running_ticker_new pt-0" >
                        <div className='notices_wrapper'>
                        <div class="notices_tag">Announcement</div>
                        <div className='notice_sec d-flex justify-content-between align-items-center'>
                         <Link to="/" className='link_blk'>Announcement on revising XEN Crypto (XEN) Deposit to Earn Event</Link>
                         <Link to="/" className='d-flex align-items-center link_grn'>More 
                         <i class="fa fa-arrow-right pl-2"></i>
                     
                         </Link>
                            </div>
                            </div>
                      
                        </div>

                        <div className="mt-4 mb-3 slider_home" data-aos="fade-up" data-aos-duration="1000">
                            <Slider {...settings}>
                                {/* {newsData && newsData.map((item, i) => {
                                    return (
                                        <div>
                                            <img src={`${config.API_URL}/images/cms/${item}`} alt="Banner" className="img-fluid" />
                                        </div>

                                    )
                                })

                                } */}
                                <div>
                                    <div className='banner_carousel_boundary'>
                                    <img src={require("../../assets/images/banner_img_01.png")} alt="Banner" className="img-fluid" />
                                    </div>
                                </div>
                                <div>
                                <div className='banner_carousel_boundary'>
                                    <img src={require("../../assets/images/banner_img_02.png")} alt="Banner" className="img-fluid" />
                                </div>
                                </div>
                                <div>
                                <div className='banner_carousel_boundary'>
                                    <img src={require("../../assets/images/banner_img_01.png")} alt="Banner" className="img-fluid" />
                                </div>
                                </div>
                                <div>
                                <div className='banner_carousel_boundary'>
                                    <img src={require("../../assets/images/banner_img_02.png")} alt="Banner" className="img-fluid" />
                                </div>
                                </div>
                                <div>
                                <div className='banner_carousel_boundary'>
                                    <img src={require("../../assets/images/banner_img_01.png")} alt="Banner" className="img-fluid" />
                                </div>
                                </div>
                                <div>
                                <div className='banner_carousel_boundary'>
                                    <img src={require("../../assets/images/banner_img_02.png")} alt="Banner" className="img-fluid" />
                                </div>
                                </div>
                            </Slider>
                        </div>

                    </div>
                </div>
                <div className="row" data-aos="fade-up" data-aos-duration="1000">
                    <div className="col-md-12 text-center content-container">
                        <div className="coinTableMain">
                            <h1 className="mb-4 title1 mt-5">{t('MATKET_PRICE')}</h1>
                            <h6>At Aurex, you can trade multiple ways either with BTC, or ETH, or USDT. Our listed coins are sold at market prices without any hidden costs. Trade instantly without any hassles.</h6>
                            <div className="pb-4">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="table-responsive bg_white_res">
                                            <Tabletabs pairList={pairData} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MarketTrend;