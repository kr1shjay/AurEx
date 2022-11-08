// import package
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import action
import { getFaqTrend } from '../../actions/homeAction'

const FaqTrend = () => {
    // state
    const [data, setData] = useState([])
    const { t, i18n } = useTranslation();

    // function
    const fetchFaqTrend = async () => {
        try {
            const { status, loading, result } = await getFaqTrend();
            if (status == 'success') {
                setData(result)
            }
        } catch (err) {
        }
    }

    useEffect(() => {
        fetchFaqTrend()
    }, [])

    return (
        <section className="faq_sec ">
            <div className="container">
                <div class="titleDoubleColor"><h2>{t('FAQ')} <span></span></h2></div>
                <div className="row justify-content-center">

                    <div className="col-lg-10">
                        <div class="accordion md-accordion" id="accordionEx" role="tablist" aria-multiselectable="true" data-aos="zoom-out">

                            {
                                data && data.length > 0 && data.map((item, key) => {
                                    return (
                                        <div class="card">
                                            <div class="card-header" role="tab" id={`heading${key}`}>
                                                <a
                                                    className={key == 0 ? "" : "collapsed"}
                                                    data-toggle="collapse"
                                                    data-parent="#accordionEx" href={`#collapse${key}`} aria-expanded={key == 0 ? 'true' : 'false'}
                                                    aria-controls={`collapse${key}`}
                                                >
                                                    <h5 class="mb-0">
                                                        <span className="change_bg">{key + 1}</span>{item.question}<i class="fas fa-plus rotate-icon"></i>
                                                    </h5>
                                                </a>
                                            </div>


                                            <div id={`collapse${key}`} class={"collapse " + (key == 0 ? 'show' : '')} role="tabpanel" aria-labelledby={`heading${key}`}
                                                data-parent="#accordionEx">
                                                <div class="card-body">
                                                    {item.answer}
                                                </div>
                                            </div>

                                        </div>
                                    )
                                })
                            }
                        </div>

                        {/* <div class="accordion md-accordion" id="accordionEx" role="tablist" aria-multiselectable="true" data-aos="zoom-out">
                            <div class="card">
                                <div class="card-header" role="tab" id="headingOne1">
                                    <a data-toggle="collapsed" data-parent="#accordionEx" href="#collapseOne1" aria-expanded="true"
                                        aria-controls="collapseOne1">
                                        <h5 class="mb-0">
                                            <span className="change_bg">1</span>What is CoinGold？?<i class="fas fa-plus rotate-icon"></i>
                                        </h5>
                                    </a>
                                </div>


                                <div id="collapseOne1" class="collapse show" role="tabpanel" aria-labelledby="headingOne1"
                                    data-parent="#accordionEx">
                                    <div class="card-body">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    </div>
                                </div>

                            </div>



                            <div class="card">

                                <div class="card-header" role="tab" id="headingTwo2">
                                    <a class="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapseTwo2"
                                        aria-expanded="false" aria-controls="collapseTwo2">
                                        <h5 class="mb-0">
                                            <span className="change_bg">2</span>What’s the difference between Spot and Derivative trading？<i class="fas fa-plus rotate-icon"></i>
                                        </h5>
                                    </a>
                                </div>


                                <div id="collapseTwo2" class="collapse" role="tabpanel" aria-labelledby="headingTwo2"
                                    data-parent="#accordionEx">
                                    <div class="card-body">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    </div>
                                </div>

                            </div>



                            <div class="card">


                                <div class="card-header" role="tab" id="headingThree3">
                                    <a class="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapseThree3"
                                        aria-expanded="false" aria-controls="collapseThree3">
                                        <h5 class="mb-0">
                                            <span className="change_bg">3</span>How long will take my KYC complete?<i class="fas fa-plus rotate-icon"></i>
                                        </h5>
                                    </a>
                                </div>


                                <div id="collapseThree3" class="collapse" role="tabpanel" aria-labelledby="headingThree3"
                                    data-parent="#accordionEx">
                                    <div class="card-body">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    </div>
                                </div>

                            </div>

                            <div class="card">

                                <div class="card-header" role="tab" id="heading4">
                                    <a class="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse4"
                                        aria-expanded="false" aria-controls="collapse4">
                                        <h5 class="mb-0">
                                            <span className="change_bg">4</span> How to deposit and withdraw fiat currency?<i class="fas fa-plus rotate-icon"></i>
                                        </h5>
                                    </a>
                                </div>


                                <div id="collapse4" class="collapse" role="tabpanel" aria-labelledby="headingThree4"
                                    data-parent="#accordionEx">
                                    <div class="card-body">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    </div>
                                </div>
                            </div>
                        </div> */}

                    </div>
                </div>
            </div>
        </section>
    )
}

export default FaqTrend;