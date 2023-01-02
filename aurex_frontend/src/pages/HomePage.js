// import package
import React, { useEffect, useInsertionEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Button, MenuItem } from "@material-ui/core";
import { Select } from "@material-ui/core";
import { useSelector, useDispatch } from 'react-redux'
import Ticker from 'react-ticker'

// import components
import HeaderLinks from "components/Header/HeaderLinks.js";
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Home from '../components/Home';
import P2pTrading from '../components/Home/P2pTrading';
import FaqTrend from '../components/Home/FaqTrend';
import { NavLink } from 'react-router-dom';

// import action
import { getLanguage, getAllCMSPage } from '../actions/commonAction';
import { getCmsData } from '../actions/homeAction';

// import lib
import isEmpty from "../lib/isEmpty";
import { useTranslation } from 'react-i18next';
const dashboardRoutes = [];

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

const HomePage = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [spot, setSpotTrade] = useState('')
  const [derivative, setDerivative] = useState('')
  const [p2p, setP2p] = useState('')
  const [encrypt, setencrypt] = useState('')
  const [wallet, setWallet] = useState('')
  const [p2pTrade, setP2pTrade] = useState('')
  const [coin, setSetCoin] = useState('')
  const [cmsData, setCmsData] = useState([])
  // redux
  const { isAuth } = useSelector(state => state.auth)
  const language = useSelector(state => state.language)

  const [tickerclose, setTickerclose] = useState(false);

  // const closeTicker = () =>
  // {

  // }

  const fetchCmsPage = async () => {
    try {
      const findLang = localStorage.getItem('lang')
      let data = {
        lang: findLang
      }
      const { status, loading, result } = await getAllCMSPage(data);
      if (status == 'success') {
        let spotTrade = result.find(item => item.identifier == 'home_spot')
        setSpotTrade(spotTrade)
        let derivativeTraded = result.find(item => item.identifier == 'home_derivative')
        setDerivative(derivativeTraded)
        let p2pContent = result.find(item => item.identifier == '2fa_protected')
        setP2p(p2pContent)
        let encryption = result.find(item => item.identifier == 'home_encryption')
        setencrypt(encryption)
        let wallet = result.find(item => item.identifier == 'home_wallet')
        setWallet(wallet)
        let p2pTrading = result.find(item => item.identifier == 'home_p2p')
        setP2pTrade(p2pTrading)
        let coinContent = result.find(item => item.identifier == 'home_coin')
        setSetCoin(coinContent)
      }
    } catch (err) { }
  }

  // identifier





const fetchCmsData = async () => {
        try {
            let reqData = {

            }
            const { status, loading, result } = await getCmsData();
            if (status == 'success') {
                setCmsData(result)
            }
        } catch (err) { }
}
  const createMarkup = (a) => {

    return { __html: a };
  }
  // function
  useEffect(() => {
    if (isEmpty(language)) {
      getLanguage(dispatch)
    }
  }, [])
  useEffect(() => {
    fetchCmsPage()
    fetchCmsData()
  }, [])
  return (
    <div className={tickerclose?"page_wrap home_page_header_banner without_ticker_banner":"page_wrap home_page_header_banner"}>
      <ScrollToTopOnMount />
      <div className={tickerclose?"upper_slider d-none":"upper_slider"}>
      <div className="banner_running_ticker">
        <i className="fas fa-bullhorn"></i>
        <Ticker>
            {({ index }) => (
                <>
                    <p>The zero maker fee promotion for spot trading is ongoing! Trade now to enjoy zero maker fees! 
                      {/* <Link to="/" className="newsticker_morelink">More</Link> */}
                      </p>
                    <img src="www.my-image-source.com/" alt="" />
                </>
            )}
        </Ticker>
        <span className="close_icon_ticker" onClick={()=>setTickerclose(true)}><i className="fas fa-times"></i></span>

    </div>
      </div>
      <Header className="header"
        color="transparent"
        routes={dashboardRoutes}
        brand={<img src={require("../assets/images/logo.png")} alt="logo" className="img-fluid" />}
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 20,
          color: "dark",
        }}
      />
    

      <Home />



      <section className="whyUs pb-0">
        <div className="container">
          <h2 className="title1" data-aos="fade-up" data-aos-duration="1000">Why Choose AUREX</h2>
          <h6 className="mb-0" data-aos="fade-up" data-aos-duration="1000">We are an leading digital currency exchange platform with a secure and peace of mind features for everyone who wish to invest and trade digital currency.</h6>
          <div className="row row_why_choose pb-5">
            <div className="col-md-4 mb-4" data-aos="fade-up">
              <div className="card calc_card">
                <div className="card-body pt-3 pb-0">
                <div className="feature_list feature_list1 text-center">
                <div className="feature_text mt-4">
                  <img src={require("../assets/images/card_icon1.png")} alt="Secure Storage" className="img-fluid" />
                  <h5>Secure Storage</h5>
                  <p className="heading-text px-lg-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, m ipsum dolor sit amet.
                  </p>
                </div>
              </div>
                </div>
              </div>
            
            </div>
            <div
              className="col-md-4  mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
             <div className="card calc_card">
                <div className="card-body pt-3 pb-0">
                <div className="feature_list feature_list1 text-center">
                <div className="feature_text mt-4">
                  <img src={require("../assets/images/card_icon2.png")} alt="Fast Crypto Listing" className="img-fluid" />
                  <h5>Fast Crypto Listing</h5>
                  <p className="heading-text px-lg-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, m ipsum dolor sit amet.
                  </p>
                </div>
              </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4" data-aos="fade-up">
            <div className="card calc_card">
                <div className="card-body pt-3 pb-0">
                <div className="feature_list feature_list1 text-center">
                <div className="feature_text mt-4">
                  <img src={require("../assets/images/card_icon3.png")} alt="Crypto Variety" className="img-fluid" />
                  <h5>Crypto Variety</h5>
                  <p className="heading-text px-lg-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, m ipsum dolor sit amet.
                  </p>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="whyUs pt-0 pb-3">
        <div className="container">
          <h2 className="title1" data-aos="fade-up" data-aos-duration="1000">Discover Our Products</h2>
          <h6 className="mb-0" data-aos="fade-up" data-aos-duration="1000">Trade a variety of products with AUREX based on your preferences.</h6>
          <div className="row row_why_choose pb-5">
            <div className="col-md-4 mb-4" data-aos="fade-up">
              <div className="card calc_card calc_card_new">
                <div className="card-body py-0">
                <div className="feature_list feature_list1 text-center">
                <div className="feature_text mt-4">
                  <img src={require("../assets/images/icon_spot.png")} alt="Secure Storage" className="img-fluid" />
                  <h5 className="mt-0">Spot</h5>
                  <p className="heading-text px-lg-0">
                  1,500+ crypto available for you to trade at the best rates.
                  </p>
                  <div className='btn_more_div text-center'>
              <Link to="/spot">Learn More <i className='fas fa-arrow-right'></i></Link>
          </div>
                </div>
              </div>
                </div>
              </div>
            
            </div>
            <div
              className="col-md-4  mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
             <div className="card calc_card calc_card_new">
                <div className="card-body py-0">
                <div className="feature_list feature_list1 text-center">
                <div className="feature_text mt-4">
                  <img src={require("../assets/images/icon_future.png")} alt="Fast Crypto Listing" className="img-fluid" />
                  <h5 className="mt-0">Low Trading Fee</h5>
                  <p className="heading-text px-lg-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <div className='btn_more_div text-center'>
              <Link to="/spot">Learn More <i className='fas fa-arrow-right'></i></Link>
          </div>
                </div>
              </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4" data-aos="fade-up">
            <div className="card calc_card calc_card_new">
                <div className="card-body py-0">
                <div className="feature_list feature_list1 text-center">
                <div className="feature_text mt-4">
                  <img src={require("../assets/images/icon_leveraged.png")} alt="Crypto Variety" className="img-fluid" />
                  <h5 className="mt-0">Secured Trades</h5>
                  <p className="heading-text px-lg-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <div className='btn_more_div text-center'>
              <Link to="/spot">Learn More <i className='fas fa-arrow-right'></i></Link>
          </div>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
         
        </div>
      </section>

      <div className="create_sec_home whyUs pt-0">
      <div className="container">
      <h2 className="title1" data-aos="fade-up" data-aos-duration="1000">Trade Anywhere with the AUREX</h2>
          <h6 className="mb-0" data-aos="fade-up" data-aos-duration="1000">Standard web application</h6>
        <div className="row row_order_rev mt-md-5 pt-4 pb-5">
        <div className="col-12 col-md-6 mt-4 mt-md-0 sec_left_centr">
           <div className="sec_flex mb-4" data-aos="fade-up">
            <div className="btn_green_icon">
            <img src={require("../assets/images/img_shield.png")} alt="Security" className="img-fluid" />
            </div>
            <div className="btn_desc_sec">
              <p className="sec_title_crate">Manage Your Portfolio Easily</p>
              <p className="sec_desc_create">Turn into a professional trader via our one-stop services platform with powerful features, high execution speed and low fees.</p>
            </div>
           </div>
           <div className="sec_flex mb-4" data-aos="fade-up">
            <div className="btn_green_icon">
            <img src={require("../assets/images/img_shield.png")} alt="Security" className="img-fluid" />
            </div>
            <div className="btn_desc_sec">
              <p className="sec_title_crate">Multi-Platform Web Support</p>
              <p className="sec_desc_create">Buy and trade all your favorite tokens on AUREX App effortlessly, anytime and anywhere.</p>
            </div>
           </div>
           <div className="sec_flex mb-0" data-aos="fade-up">
            <div className="btn_green_icon">
            <img src={require("../assets/images/img_shield.png")} alt="Security" className="img-fluid" />
            </div>
            <div className="btn_desc_sec">
              <p className="sec_title_crate">Lorem Ipsum</p>
              <p className="sec_desc_create">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
            </div>
           </div>
            </div>
          <div className="col-12 col-md-6 d-flex align-items-center">
          <img src={require("../assets/images/create_img.png")} alt="Security" className="img-fluid" />
          </div>
        
        </div>
      </div>
      </div>
      <div className="create_sec_community whyUs pt-0">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-9 col-xl-8">
          <h2 className="title1 text-left" data-aos="fade-up" data-aos-duration="1000">Join the AUREX Community Today</h2>
          <h6 className="mb-0 text-left ml-0" data-aos="fade-up" data-aos-duration="1000">Always there for you</h6>
          <div className="social_btn_sec mt-4">
            <a href="#" target="_blank" className="btn_outline_big_green mr-4">
            <i className="fab fa-twitter fa-fw mr-3" aria-hidden="true"></i>
            <span>Twitter</span>
            </a>
            <a href="#" target="_blank" className="btn_outline_big_green">
            <i className="fab fa-telegram-plane fa-fw mr-3" aria-hidden="true"></i>
            <span>Telegram</span>
            </a>
          </div>
          <div className="icon_social_sec mt-4">
          <div className="media_circle_round" target="_blank">
            <a href="#" target="_blank" className="youtube_round">
            <i className="fab fa-youtube"></i>
            </a>
            <a href="#" target="_blank" className="facebook_round">
            <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" target="_blank" className="linkedin_round">
            <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="#" target="_blank" className="discord_round">
            <i class="fab fa-discord"></i>
            </a>
            <a href="#" target="_blank" className="reddit_round">
            <i class="fab fa-reddit-alien"></i>
            </a>
            <a href="#" target="_blank" className="medium_round">
            <i class="fab fa-medium-m"></i>
            </a>
          </div>
          </div>
          </div>
        </div>
    
      </div>
      </div>
      <Footer />
    </div>

  );
}

export default HomePage;