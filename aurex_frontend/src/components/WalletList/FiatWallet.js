// import package
import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// import component
import FiatDeposit from './FiatDeposit'
import FiatWithdraw from './FiatWithdraw'
import isEmpty from '../../lib/isEmpty';
import { toFixed ,toFixedDown} from '../../lib/roundOf';


const FiatWallet = () => {
    const { t, i18n } = useTranslation();

    // state
    const [model, setModal] = useState({
        type: '',
        assetData: {},
        currency: {}
    })
    const [filterData, setFilter] = useState([])
    const [originalData, setOriginal] = useState([])
 
    // redux-state
    const walletData = useSelector(state => state.wallet);
    const currencyDoc = useSelector(state => state.currency)

    // function
    const modalClose = () => {
        setModal({
            type: '',
            assetData: {},
            currency: {}
        })
    }

    const onSearch = (e) => {
        e.preventDefault();
        const { value } = e.target;
        let searchData = filterData;
        let  arrayData = [];
        searchData && searchData.length > 0 && searchData.map((item, i) => {
            if(item.coin.includes(value.toUpperCase())){
                arrayData.push(item)
            }
        })
        if(arrayData && arrayData.length >0){
            setOriginal(arrayData)
        }
        if(isEmpty(value)){
            setOriginal(filterData)
        }
    }

    useEffect(() => {
        if(walletData && walletData.length > 0){
            setOriginal(walletData)
            setFilter(walletData)
        }
    }, [walletData])
    return (
        <div className="p2p_card min-h-auto input_box-flex">
            <FiatDeposit
                show={model.type == 'deposit'}
                assetData={model.assetData}
                currency={model.currency}
                onHide={modalClose}
            />
            <FiatWithdraw
                show={model.type == 'withdraw'}
                assetData={model.assetData}
                currency={model.currency}
                onHide={modalClose}
            />
            <div className="d-flex justify-content-between">
                <h3 className="login_title_8">{t("FIAT_WALLET")}</h3>
                 <div className="seacr_box_s">
                    <input type="text" placeholder={t("FIND_COIN")}  onChange={onSearch}/>
                    <i class="fas fa-search"></i>
                </div> 
            </div>
            <div className="fialt_wallet_sectoin table-responsive">
                {
                    currencyDoc && currencyDoc.length > 0 && originalData && originalData.length > 0 && originalData.map((item, key) => {
                        let curData = currencyDoc.find(el => el.coin == item.coin)
                        if (curData && ['fiat'].includes(curData.type)) {
                            return (
                                <div className="fiat_wallet_list">
                                    <div>
                                        <div>
                                            <img src={curData && curData.image} alt="logo" className="img-fluid" />
                                            <span>{item.coin}</span>
                                        </div>
                                        <p>{toFixedDown(item.spotBal,curData.decimal)}</p>
                                    </div>
                                    <div className="button_lst_section">
                                    { curData.depositStatus ==  "On" &&
                                        <div className="Subscribe">
                                            <Button className="btn-primary" onClick={() => {
                                                setModal({
                                                    type: 'deposit',
                                                    assetData: item,
                                                    currency: curData,
                                                })
                                            }}>{t("DEPOSIT")}</Button>
                                        </div>
                                    }
                                    { curData.depositStatus ==  "Off" &&
                                        <div className="Subscribe">
                                            <Button className="btn-primary" disabled="true">{t("DEPOSIT")}</Button>
                                        </div>
                                    }
                                    { curData.withdrawStatus == "On" &&
                                        <div className="Subscribe">
                                            <Button className="btn-primary"
                                                onClick={() => {
                                                    setModal({
                                                        type: 'withdraw',
                                                        assetData: item,
                                                        currency: curData,
                                                    })
                                                }}
                                            >{t("WITHDRAW")}</Button></div>
                                    }
                                    { curData.withdrawStatus == "Off" &&
                                        <div className="Subscribe">
                                            <Button className="btn-primary" disabled="true">{t("WITHDRAW")}</Button></div>
                                    }
                                    <div className="Subscribe">
                                            <Button className="btn-primary"><Link  to={'/spot'}>{t("TRADE")}</Link></Button>
                                    </div>
                                    </div>                                    
                                </div>
                            )
                        }
                    })
                }
            </div>
        </div>
    )
}

export default FiatWallet;