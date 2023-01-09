// import package
import React, { useState, useEffect } from "react";
import { MenuItem, Select, Button } from "@material-ui/core";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Checkbox from "rc-checkbox";

// import component
import WalletTransfer from "./WalletTransfer";
import CryptoDeposit from "./CryptoDeposit";
import CryptoWithdraw from "./CryptoWithdraw";
import FundTransfer from "./FundTransfer";
import isEmpty from "../../lib/isEmpty";
import { toFixed, toFixedDown } from "../../lib/roundOf";
import { GoogleReCaptchaConsumer } from "react-google-recaptcha-v3";
import { getPairList } from "../../actions/spotTradeAction";
//import action

import {
  gethideZeroStatus,
  updateHideZeroStatus,
} from "../../actions/walletAction";
import { checkEmail } from "../../actions/walletAction";
//import lib

import { toastAlert } from "../../lib/toastAlert";
const CryptoWallet = () => {
  const { t, i18n } = useTranslation();

  // state
  const [walletType, setWalletType] = useState("spot");
  const [filterData, setFilter] = useState([]);
  const [originalData, setOriginal] = useState([]);
  const [checkValue, setCheckValue] = useState(false);
  const [pairList, setPairList] = useState([]);

  const [model, setModal] = useState({
    type: "",
    assetData: {},
    currency: {},
  });

  // redux-state
  const walletData = useSelector((state) => state.wallet);
  const currencyDoc = useSelector((state) => state.currency);
  console.log('currency',currencyDoc)

  // function
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setWalletType(value);
  };

  const modalClose = () => {
    setModal({
      type: "",
      assetData: {},
      currency: {},
    });
  };
  const handleCheckBox = async (e) => {
    e.preventDefault();
    const { name, checked } = e.target;
    let reqData = {
      hideZeroStatus: checked,
    };
    const { message, status } = await updateHideZeroStatus(reqData);
    if (status) {
      setCheckValue(checked);
      toastAlert("success", message, "checkValue");
      gethideZeroSatus();
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    const { value } = e.target;
    let searchData = filterData;
    let arrayData = [];
    searchData &&
      searchData.length > 0 &&
      searchData.map((item, i) => {
        if (item.coin.includes(value.toUpperCase())) {
          arrayData.push(item);
        }
      });
    if (arrayData && arrayData.length > 0) {
      setOriginal(arrayData);
    }
    if (isEmpty(value)) {
      setOriginal(filterData);
    }
  };

  useEffect(() => {
    gethideZeroSatus();
    getSpotPair();
    if (walletData && walletData.length > 0) {
      setOriginal(walletData);
      setFilter(walletData);
    }

    // getWallet();
  }, [walletData]);

  const getSpotPair = async () => {
    const { result } = await getPairList();

    setPairList(result);
  };
  const gethideZeroSatus = async () => {
    const { result } = await gethideZeroStatus();
    setCheckValue(result.hideZeroStatus);
  };

  // const
  return (
    <div className="p2p_card min-h-auto input_box-flex">
      <WalletTransfer
        show={model.type == "walletTransfer"}
        assetData={model.assetData}
        onHide={modalClose}
      />
      <FundTransfer
        show={model.type == "fundTransfer"}
        assetData={model.assetData}
        currency={model.currency}
        onHide={modalClose}
      />
      <CryptoDeposit
        show={model.type == "deposit"}
        assetData={model.assetData}
        currency={model.currency}
        onHide={modalClose}
      />
      <CryptoWithdraw
        show={model.type == "withdraw"}
        assetData={model.assetData}
        currency={model.currency}
        onHide={modalClose}
      />
      <div className="d-flex justify-content-between">
        <h3 className="login_title_8">{t("CRYPTO_WALLET")}</h3>

        {/* <Checkbox
          name="CheckValue"
          onChange={handleCheckBox}
          
          checked={checkValue}
        /> */}

        <div className="d-flex align-items-center">
          <div className="zeroBalance mr-3">
            <Checkbox
              class="form-control"
              name="checkValue"
              onChange={handleCheckBox}
              checked={checkValue}
            />
            {/* <input class="form-check-input" type="checkbox" value={checkValue}  name={"checkValue"} checked={checkValue} onChange={handleCheckBox}  /> */}
            <label className="ml-1">Hide Zero Balance</label>
          </div>

          {
            <div className="seacr_box_s searc_right_pad_new">
              <input
                type="text"
                placeholder={t("FIND_COIN")}
                onChange={onSearch}
              />
              <i class="fas fa-search"></i>
            </div>
          }
        </div>
      </div>
      <div className="fialt_wallet_sectoin  table-responsive">
        {currencyDoc &&
          currencyDoc.length > 0 &&
          originalData &&
          originalData.length > 0 &&
          originalData.map((item, key) => {
            let curData = currencyDoc.find((el) => el.coin == item.coin);
            //redirect particular currency
            let pair = "",
              seconCurrencyPair,
              firstCurrencyPair;
            firstCurrencyPair =
              pairList.length > 0 &&
              pairList.find((el) => el.firstCurrencySymbol == item.coin);
            if (isEmpty(firstCurrencyPair)) {
              seconCurrencyPair =
                pairList.length > 0 &&
                pairList.find((el) => el.secondCurrencySymbol == item.coin);
            }

            // if(!isEmpty(firstCurrencyPair)){
            //   pair=firstCurrencyPair.firstCurrencySymbol==item.coin &&`${item.coin}_${firstCurrencyPair.secondCurrencySymbol}`
            // }else if(!isEmpty(seconCurrencyPair)){
            //   pair=seconCurrencyPair.secondCurrencySymbol==item.coin &&`${seconCurrencyPair.firstCurrencySymbol}_${item.coin}`
            // }

            pair =
              !isEmpty(firstCurrencyPair) &&
              firstCurrencyPair.firstCurrencySymbol == item.coin
                ? `${item.coin}_${firstCurrencyPair.secondCurrencySymbol}`
                : !isEmpty(seconCurrencyPair) &&
                  seconCurrencyPair.secondCurrencySymbol == item.coin
                ? `${seconCurrencyPair.firstCurrencySymbol}_${item.coin}`
                : "";
            if (curData && ["crypto", "token"].includes(curData.type)) {

              return item.spotBal == 0 ? (
                checkValue ? (
                  <>{""}</>
                ) : (
                  <div className="fiat_wallet_list" key={key}>
                    <div>
                      <div>
                        <img
                          src={curData && curData.image}
                          alt="logo"
                          className="img-fluid"
                        />
                        <span>{item.coin}</span>
                      </div>

                      {/* <p>{toFixedDown(item.spotBal, curData.decimal)}</p> */}
                      <p>{toFixed(item.spotBal, curData.decimal)}</p>
                      {/* {walletType == 'derivative' && <p>{item.derivativeBal}</p>}
                              {walletType == 'p2p' && <p>{item.p2pBal}</p>} */}
                    </div>
                    <div className="button_lst_section">
                      {curData.depositStatus == "On" && (
                        <div className="Subscribe">
                          <Button
                            className="btn-primary"
                            onClick={() => {
                              setModal({
                                type: "deposit",
                                assetData: item,
                                currency: curData,
                              });
                            }}
                          >
                            {t("DEPOSIT")}
                          </Button>
                        </div>
                      )}
                      {curData.depositStatus == "Off" && (
                        <div className="Subscribe">
                          <Button className="btn-primary" disabled="true">
                            {t("DEPOSIT")}
                          </Button>
                        </div>
                      )}
                      {curData.withdrawStatus == "On" && (
                        <div className="Subscribe">
                          <Button
                            className="btn-primary"
                            onClick={() => {
                              setModal({
                                type: "withdraw",
                                assetData: item,
                                currency: curData,
                              });
                            }}
                          >
                            {t("WITHDRAW")}
                          </Button>
                        </div>
                      )}
                      {curData.withdrawStatus == "Off" && (
                        <div className="Subscribe">
                          <Button className="btn-primary" disabled="true">
                            {t("WITHDRAW")}
                          </Button>
                        </div>
                      )}

                      <div className="Subscribe">
                        <Button className="btn-primary">
                          <Link to={`/spot/${pair}`}>{t("TRADE")}</Link>
                        </Button>
                      </div>
                      {/* <div className="Subscribe">
                                  <Button className="btn-primary" onClick={() => {
                                      setModal({
                                          type: 'walletTransfer',
                                          assetData: item,
                                          currency: curData
                                      })
                                  }}>{t("WALLET")}</Button>
                              </div>
                              <div className="Subscribe">
                                  <Button className="btn-primary" onClick={() => {
                                      setModal({
                                          type: 'fundTransfer',
                                          assetData: item,
                                          currency: curData
                                      })
                                  }}>{t("FUND")}</Button>
                              </div> */}
                      {/* <div className="Subscribe"><Button className="btn-primary" data-toggle="modal" data-target="buyModalCenter">Stake</Button></div> */}
                    </div>
                  </div>
                )
              ) : (
                <>
                  <div className="fiat_wallet_list" key={key}>
                    <div>
                      <div>
                        <img
                          src={curData && curData.image}
                          alt="logo"
                          className="img-fluid"
                        />
                        <span>{item.coin}</span>
                      </div>

                      {/* <p>{toFixedDown(item.spotBal, curData.decimal)}</p> */}
                      <p>{toFixed(item.spotBal, curData.decimal)}</p>
                      {/* {walletType == 'derivative' && <p>{item.derivativeBal}</p>}
                                        {walletType == 'p2p' && <p>{item.p2pBal}</p>} */}
                    </div>
                    <div className="button_lst_section">
                      {curData.depositStatus == "On" && (
                        <div className="Subscribe">
                          <Button
                            className="btn-primary"
                            onClick={async() => {
                              const emailvlaid = await checkEmail();
                              if (emailvlaid.email) {
                                setModal({
                                  type: "deposit",
                                  assetData: item,
                                  currency: curData,
                                });
                              }
                              else {
                                toastAlert("error", "Please submit email details", "email");
                              }
                              // setModal({
                              //   type: "deposit",
                              //   assetData: item,
                              //   currency: curData,
                              // });
                            }}
                          >
                            {t("DEPOSIT")}
                          </Button>
                        </div>
                      )}
                      {curData.depositStatus == "Off" && (
                        <div className="Subscribe">
                          <Button className="btn-primary" disabled="true">
                            {t("DEPOSIT")}
                          </Button>
                        </div>
                      )}
                      {curData.withdrawStatus == "On" && (
                        <div className="Subscribe">
                          <Button
                            className="btn-primary"
                            onClick={() => {
                              setModal({
                                type: "withdraw",
                                assetData: item,
                                currency: curData,
                              });
                            }}
                          >
                            {t("WITHDRAW")}
                          </Button>
                        </div>
                      )}
                      {curData.withdrawStatus == "Off" && (
                        <div className="Subscribe">
                          <Button className="btn-primary" disabled="true">
                            {t("WITHDRAW")}
                          </Button>
                        </div>
                      )}

                      <div className="Subscribe">
                        <Button className="btn-primary">
                          <Link to={`/spot/${pair}`}>{t("TRADE")}</Link>
                        </Button>
                      </div>
                      {/* <div className="Subscribe">
                                            <Button className="btn-primary" onClick={() => {
                                                setModal({
                                                    type: 'walletTransfer',
                                                    assetData: item,
                                                    currency: curData
                                                })
                                            }}>{t("WALLET")}</Button>
                                        </div>
                                        <div className="Subscribe">
                                            <Button className="btn-primary" onClick={() => {
                                                setModal({
                                                    type: 'fundTransfer',
                                                    assetData: item,
                                                    currency: curData
                                                })
                                            }}>{t("FUND")}</Button>
                                        </div> */}
                      {/* <div className="Subscribe"><Button className="btn-primary" data-toggle="modal" data-target="buyModalCenter">Stake</Button></div> */}
                    </div>
                  </div>
                </>
              );
              // return (
              //   <>
              //     {checkValue && item.spotBal==0 && <>{""}</>}
              //     {!checkValue && (
              //       <>
              //         <div className="fiat_wallet_list" key={key}>
              //           <div>
              //             <div>
              //               <img
              //                 src={curData && curData.image}
              //                 alt="logo"
              //                 className="img-fluid"
              //               />
              //               <span>{item.coin}</span>
              //             </div>

              //             <p>{toFixedDown(item.spotBal, curData.decimal)}</p>
              //             {/* {walletType == 'derivative' && <p>{item.derivativeBal}</p>}
              //                           {walletType == 'p2p' && <p>{item.p2pBal}</p>} */}
              //           </div>
              //           <div className="button_lst_section">
              //             {curData.depositStatus == "On" && (
              //               <div className="Subscribe">
              //                 <Button
              //                   className="btn-primary"
              //                   onClick={() => {
              //                     setModal({
              //                       type: "deposit",
              //                       assetData: item,
              //                       currency: curData,
              //                     });
              //                   }}
              //                 >
              //                   {t("DEPOSIT")}
              //                 </Button>
              //               </div>
              //             )}
              //             {curData.depositStatus == "Off" && (
              //               <div className="Subscribe">
              //                 <Button className="btn-primary" disabled="true">
              //                   {t("DEPOSIT")}
              //                 </Button>
              //               </div>
              //             )}
              //             {curData.withdrawStatus == "On" && (
              //               <div className="Subscribe">
              //                 <Button
              //                   className="btn-primary"
              //                   onClick={() => {
              //                     setModal({
              //                       type: "withdraw",
              //                       assetData: item,
              //                       currency: curData,
              //                     });
              //                   }}
              //                 >
              //                   {t("WITHDRAW")}
              //                 </Button>
              //               </div>
              //             )}
              //             {curData.withdrawStatus == "Off" && (
              //               <div className="Subscribe">
              //                 <Button className="btn-primary" disabled="true">
              //                   {t("WITHDRAW")}
              //                 </Button>
              //               </div>
              //             )}

              //             <div className="Subscribe">
              //               <Button className="btn-primary">
              //                 <Link to={"/spot"}>{t("TRADE")}</Link>
              //               </Button>
              //             </div>
              //             {/* <div className="Subscribe">
              //                               <Button className="btn-primary" onClick={() => {
              //                                   setModal({
              //                                       type: 'walletTransfer',
              //                                       assetData: item,
              //                                       currency: curData
              //                                   })
              //                               }}>{t("WALLET")}</Button>
              //                           </div>
              //                           <div className="Subscribe">
              //                               <Button className="btn-primary" onClick={() => {
              //                                   setModal({
              //                                       type: 'fundTransfer',
              //                                       assetData: item,
              //                                       currency: curData
              //                                   })
              //                               }}>{t("FUND")}</Button>
              //                           </div> */}
              //             {/* <div className="Subscribe"><Button className="btn-primary" data-toggle="modal" data-target="buyModalCenter">Stake</Button></div> */}
              //           </div>
              //         </div>
              //       </>
              //     )}
              //   </>

              //   // <div className="fiat_wallet_list" key={key}>
              //   //   <div>
              //   //     <div>
              //   //       <img
              //   //         src={curData && curData.image}
              //   //         alt="logo"
              //   //         className="img-fluid"
              //   //       />
              //   //       <span>{item.coin}</span>
              //   //     </div>

              //   //     <p>{ toFixedDown(item.spotBal, curData.decimal)}</p>
              //   //     {/* {walletType == 'derivative' && <p>{item.derivativeBal}</p>}
              //   //                         {walletType == 'p2p' && <p>{item.p2pBal}</p>} */}
              //   //   </div>
              //   //   <div className="button_lst_section">
              //   //     {curData.depositStatus == "On" && (
              //   //       <div className="Subscribe">
              //   //         <Button
              //   //           className="btn-primary"
              //   //           onClick={() => {
              //   //             setModal({
              //   //               type: "deposit",
              //   //               assetData: item,
              //   //               currency: curData,
              //   //             });
              //   //           }}
              //   //         >
              //   //           {t("DEPOSIT")}
              //   //         </Button>
              //   //       </div>
              //   //     )}
              //   //     {curData.depositStatus == "Off" && (
              //   //       <div className="Subscribe">
              //   //         <Button className="btn-primary" disabled="true">
              //   //           {t("DEPOSIT")}
              //   //         </Button>
              //   //       </div>
              //   //     )}
              //   //     {curData.withdrawStatus == "On" && (
              //   //       <div className="Subscribe">
              //   //         <Button
              //   //           className="btn-primary"
              //   //           onClick={() => {
              //   //             setModal({
              //   //               type: "withdraw",
              //   //               assetData: item,
              //   //               currency: curData,
              //   //             });
              //   //           }}
              //   //         >
              //   //           {t("WITHDRAW")}
              //   //         </Button>
              //   //       </div>
              //   //     )}
              //   //     {curData.withdrawStatus == "Off" && (
              //   //       <div className="Subscribe">
              //   //         <Button className="btn-primary" disabled="true">
              //   //           {t("WITHDRAW")}
              //   //         </Button>
              //   //       </div>
              //   //     )}

              //   //     <div className="Subscribe">
              //   //       <Button className="btn-primary">
              //   //         <Link to={"/spot"}>{t("TRADE")}</Link>
              //   //       </Button>
              //   //     </div>
              //   //     {/* <div className="Subscribe">
              //   //                             <Button className="btn-primary" onClick={() => {
              //   //                                 setModal({
              //   //                                     type: 'walletTransfer',
              //   //                                     assetData: item,
              //   //                                     currency: curData
              //   //                                 })
              //   //                             }}>{t("WALLET")}</Button>
              //   //                         </div>
              //   //                         <div className="Subscribe">
              //   //                             <Button className="btn-primary" onClick={() => {
              //   //                                 setModal({
              //   //                                     type: 'fundTransfer',
              //   //                                     assetData: item,
              //   //                                     currency: curData
              //   //                                 })
              //   //                             }}>{t("FUND")}</Button>
              //   //                         </div> */}
              //   //     {/* <div className="Subscribe"><Button className="btn-primary" data-toggle="modal" data-target="buyModalCenter">Stake</Button></div> */}
              //   //   </div>
              //   // </div>
              // );
            }
          })}
      </div>
    </div>
  );
};

export default CryptoWallet;
