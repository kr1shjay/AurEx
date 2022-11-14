// import package
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Checkbox from "rc-checkbox";
import { Modal } from "react-bootstrap";
import { Slider } from "@material-ui/core";
import clsx from 'classnames'
import { useTranslation } from 'react-i18next';

// import component
import GridContainer from "../Grid/GridContainer.js";
import GridItem from "../Grid/GridItem.js";

// import action
import {
  orderPlaceLocked,
  updateStakeOrder,
} from "../../actions/stakingAction";
import { updateWallet } from "../../actions/walletAction";

// import lib
import isEmpty from "../../lib/isEmpty";
import { toFixed } from "../../lib/roundOf";
import { interestByDays } from "../../lib/calculation";
import { toastAlert } from "../../lib/toastAlert";
import validation from "./validation";

const marks = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 15,
    label: "15%",
  },
  {
    value: 30,
    label: "30%",
  },
  {
    value: 50,
    label: "50%",
  },
  {
    value: 65,
    label: "65%",
  },
  {
    value: 80,
    label: "80%",
  },
  {
    value: 100,
    label: "100%",
  },
];

function valuetext(value) {
  return `${value}%`;
}

const initialFormValue = {
  price: "",
  type: "fixed",
  isTerms: false,
};

const OrderPlaceModalLocked = (props) => {
  const dispatch = useDispatch();
  const walletData = useSelector(state => state.wallet)
  const { t, i18n } = useTranslation();
  // props
  const { isShow, record, onHide, durationdays, durationAPY, fetchStake } = props;
  // state
  const [formValue, setFormValue] = useState(initialFormValue);
  // const [assetData, setAssetData] = useState({});
  const [pricePct, setPricePct] = useState(0); // Balance Percentage
  const [validateError, setValidateError] = useState({});
  const [loader, setLoader] = useState();

  const [intrest_per, setintrest_per] = useState();
  const [assetData, setAssetData] = useState([])
  const [intrest, setintrest] = useState();
  const [indexval, setindexval] = useState();
  const [duration_days, setdurationdays] = useState(0);
  //   alert(durationdays);
  //   alert(duration_days);
  const { price, type, isTerms } = formValue;

  // // redux-state
  // const walletData = useSelector((state) => state.wallet);

  // function
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name == "price" && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    if (name == "price" && assetData && assetData.spotBal) {
      let balancePct = (value / assetData.spotBal) * 100;
      setPricePct(toFixed(balancePct, 2));
    }
    if (value) {
      setValidateError({})
    }

    let formData = { ...formValue, ...{ [name]: value } };
    setFormValue(formData);
  };

  const handleCheckBox = (e) => {
    const { name, checked } = e.target;
    let formData = { ...formValue, ...{ [name]: checked } };
    setFormValue(formData);
    if(checked){
      setValidateError({})
    }
  };

  const handlePercentage = (e, percentage) => {
    if (assetData && assetData.spotwallet) {
      let formData = {
        ...formValue,
        ...{
          price: assetData.spotwallet * (percentage / 100),
        },
      };
      setPricePct(percentage);
      setFormValue(formData);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    let reqData = {
      stakeId: record._id,
      price,
      type,
      isTerms,
      duration_days: !isEmpty(durationdays) ? durationdays : record.periodList && record.periodList[0].days
    }
    let validationError = validation(reqData);
    if (!isEmpty(validationError)) {
      setValidateError(validationError);
      setLoader(false);
      return;
    }

    try {
      let { status, loading, message, error, result } = await orderPlaceLocked(
        reqData
      );
      setLoader(loading);
      if (status == "success") {
        updateWallet(dispatch, result.wallet, "stake");
        updateStakeOrder(dispatch, result.orderData, "newOrder");
        setFormValue(initialFormValue);
        toastAlert("success", message, "stakeOrder");
        fetchStake()
        onHide();
      } else {
        if (error) {
          setValidateError(error);
        }
        toastAlert("error", message, "stakeOrder");
      }
    } catch (err) { }
  };
  const handleClose = () =>{
    setValidateError({})
    onHide()
  }

  useEffect(() => {
    // if (!isEmpty(record)) {
    //   let data = walletData.find((el) => el.currency._id == record.currencyId);
    //   if (!isEmpty(data)) {
    //     setAssetData(data);
    //     setdurationdays(durationdays);
    //     return;
    //   }
    //   // onHide()
    // }
    setdurationdays(props.durationdays)
    setintrest_per(props.durationAPY)
  }, [record]);

  useEffect(() => {
    if (!isEmpty(record)) {
      let data = walletData.find((el) => el._id == record.currencyId);
      if (!isEmpty(data)) {
        setAssetData(data);
        return;
      }
      // onHide()
    }
  }, [record]);

  const durationloop = (durations) => {
   // return ''
    let arr = [];
    if (!isEmpty(durations) && durations.length > 0) {
      durations.map((duration, index, array) => {
        let isActive = false;
        if (durationdays == duration.days) {
          isActive = true
        }

        if (index == array.length - 1) {
          arr.push(
            <button
              className={clsx("btn btn-secondary", { "active": isActive })}
              onClick={() => {
                onClick_Days(duration);
              }}
            >
              {" "}
              {`${duration.days} Days`}
            </button>
          );
        } else {
          arr.push(
            <button
              className={clsx("btn btn-secondary", { "active": isActive })}
              onClick={() => {
                onClick_Days(duration);
              }}
            >
              {" "}
              {`${duration.days} Days`}
            </button>
          );
        }
      });

      return arr;
    }
  };

  const onClick_Days = (duration) => {
   
    setintrest_per(duration.APY);
    setintrest(toFixed(interestByDays(1000, duration.APY, 365), 4));
    setdurationdays(duration.days);
  };

  return (
    <Modal
      show={isShow}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h4 className="modal-title mt-0">
            {"Lock "}
            {record.coin}
          </h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className='row'>
    <div className='col-12 col-md-7'>
    <div className="modedl_subscribe_content">
        {/* <p className='heading_whte_modal_dark'>Locked Staking</p> */}
    <div className="duration_slecys">
        <label>Type</label>
        <div className="duratin-a">
            <p>Locked</p>
        </div>
    </div>
    <div className="duration_slecys mt-3">
        <label>{t('DURATION_DAYS')}</label>
        <div>
        <div class="btn_grp_green" role="group" aria-label="Basic example">

        {/* <button type="button" class="btn btn-secondary">30 Days</button>
        <button type="button" class="btn btn-secondary ">60 Days</button>
        <button type="button" class="btn btn-secondary">90 Days</button> */}
        { durationloop(record.periodList)}

      </div>
            {/* <p>{!isEmpty(durationdays) ? durationdays : record.periodList && record.periodList[0].days}</p> */}
        </div>
    </div>
    <div className="wlleet_ballece_new">
        <p><span>{t('WALLET_BAL')}</span> <span>{assetData && assetData.spotBal} {record.coin}</span></p>
    </div>
    <div className="wlleet_ballece_new">
        <p><span>{t('SUBSCRIPTION_AMOUNT')}</span> <span><a href="#" onClick={() => {
            let formData = { ...formValue, 'price': assetData.spotBal }
            setFormValue(formData)
          }}>{t('MAX')}</a></span></p>
    </div>
    <div className="entaer_amount">
       
        <div className="seacr_box_s d-flex input_modal_new_amount">
            <input
                type="text"
                className="w-100"
                name="price"
                value={price}
                onChange={handleChange}
                placeholder="Please enter amount"
            />
            <span className='pr-2'>{record.coin}</span>
        </div>
        {validateError.price && <p className="error-message">{t(validateError.price)}</p>}
    </div>
    <div className="wlleet_ballece_new">
        <p><span>Locked amount limitation</span></p>
    </div>
    <p className='min_max_p'>
        <span className='tetx_grey_sm_amount'>Minumum:</span>
        <span className='tetx_white_sm_amount ml-2'>{record.minimumAmount} {record.coin}</span>
        <span className='tetx_grey_sm_amount ml-3'>Maximum:</span>
        <span className='tetx_white_sm_amount ml-2'>{record.maximumAmount} {record.coin}</span>

    </p>
  
    <div className="form-group mt-4">
        <div className="form-check formcheck_font">
            <Checkbox
                name="isTerms"
                onChange={handleCheckBox}
                checked={isTerms}
            />
            <label className="form-check-label" for="flexCheckDefault">
                {t('READ_AND_AGREE')} <a href="/stak-terms"> {t('STAKING_TERMS')}</a>
            </label>
            {validateError.isTerms && <p className="error-message">{t(validateError.isTerms)}</p>}
        </div>

        <div className="d-flex justify-content-between mt-4 pb-4 btn_div_sm_font">
<button type="button" className="btn btn-bordered-secondary w-100 mt-3 mr-3">Cancel</button>
{/* <button type="button" className="btn btn-primary w-100 mt-3" disabled={loader} onClick={handleFormSubmit}>{t('CONFIRM')}</button> */}
</div>
    </div>

</div>
    </div>
    <div className='col-12 col-md-5 modal_secnd_sec_border'>
    <div className="modedl_subscribe_content">
        <p className='heading_whte_modal_dark'>Summary</p>
        <div className='summary_flow mt-4'>
            <div className='row row_initiate'>
                <div className='col-6'>
                    <p className='mb-0 tetx_white_sm_amount'>Stake Date</p>
                </div>
                <div className='col-6'>
                    <p className='mb-0 tetx_grey_sm_amount'>{new Date().toLocaleString("en-IN")}</p>
                </div>
            </div>
            <div className='row row_initiate inner_complete_row'>
                <div className='col-6'>
                    <p className='mb-0 tetx_white_sm_amount'>Value Date</p>
                </div>
                <div className='col-6'>
                    <p className='mb-0 tetx_grey_sm_amount'>{new Date().toLocaleString("en-IN")}</p>
                </div>
            </div>
            <div className='row inner_complete_row'>
                <div className='col-6'>
                    <p className='mb-0 tetx_white_sm_amount'>Interest Period</p>
                </div>
                <div className='col-6'>
                    <p className='mb-0 tetx_grey_sm_amount'>{duration_days} days</p>
                </div>
            </div>
            <div className='row'>
                <div className='col-6'>
                    <p className='mb-0 tetx_white_sm_amount'>Interest End Date</p>
                </div>
                <div className='col-6'>
                    <p className='mb-0 tetx_grey_sm_amount'>{new Date(Date.now() + parseFloat(duration_days) * 86400000).toLocaleString("en-IN")}</p>
                </div>
            </div>
            <div className='row row_initiate row_fianl'>
                <div className='col-6'>
                    <p className='mb-0 tetx_white_sm_amount'>Redemption Period</p>
                </div>
                <div className='col-6'>
                    <p className='mb-0 tetx_grey_sm_amount'>{record.redemptionPeriod} {"Days"}</p>
                </div>
            </div>
            {/* <div className='row row_initiate row_fianl'>
                <div className='col-6'>
                    <p className='mb-0 tetx_white_sm_amount'>Redemption Date</p>
                </div>
                <div className='col-6'>
                    <p className='mb-0 tetx_grey_sm_amount'>{new Date(Date.now() + 86400 * 1000).toLocaleString("en-IN")}</p>
                </div>
            </div> */}
        </div>
  <hr className='border_bott_grey' />
    <div className="wlleet_ballece_new">
   
        <p><span>Est.APY</span> <span>{intrest_per && !isEmpty(intrest_per) ? intrest_per : record.periodList && record.periodList[0].APY}%</span></p>
    </div>
    <div className="wlleet_ballece_new">
        <p className='mt-1'><span>Est.Interest</span> <span>{toFixed((duration_days * interestByDays(price, intrest_per, 365)), 4)} {record.coin}</span></p>
    </div>
    <div className='apy_card mt-3'>
        <div className='d-flex'>
        <i className="fa fa-info-circle" aria-hidden="true"></i>
        <div>
            <p className='tetx_grey_sm_amount mb-0'>The APY is adjusted daily based on the on-chain staking rewards, and the specific APY is subject to the page display on the day.</p>
        </div>
        </div>
    </div>
    <div className="d-flex justify-content-between mt-4 pb-4 btn_div_sm_font">
<button type="button" className="btn btn-primary w-100 mt-3" disabled={!isTerms} onClick={handleFormSubmit}>{t('CONFIRM')}</button>
</div>
 
  
  
  

</div>
    </div>
</div>
      </Modal.Body>
    </Modal>
  );
};

export default OrderPlaceModalLocked;
