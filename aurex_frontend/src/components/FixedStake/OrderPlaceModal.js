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
    return ''
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
              className={clsx("stake_date_btn", { "active": isActive })}
              onClick={() => {
                onClick_Days(duration);
              }}
            >
              {" "}
              {duration.days}
            </button>
          );
        } else {
          arr.push(
            <button
              className={clsx("stake_date_btn", { "active": isActive })}
              onClick={() => {
                onClick_Days(duration);
              }}
            >
              {" "}
              {duration.days}
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
            {"Transfer"}
            {record.name}
          </h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modedl_subscribe_content">
          <div className="duration_slecys">
            <label>{t('DURATION_DAYS')}</label>
            <div className="duratin-a">
              <p> {!isEmpty(durationdays) ? durationdays : record.periodList && record.periodList[0].days}</p>
            </div>
          </div>
          <div className="wlleet_ballece">
            <h3>{t('WALLET_BAL')} <span>{assetData && assetData.spotBal} {record.coin}</span></h3>
          </div>
          <div className="entaer_amount">
            <label>{t('SUBSCRIPTION_AMOUNT')}<a href="#" onClick={() => {
              let formData = { ...formValue, 'price': assetData.spotBal }
              setFormValue(formData)
            }}>{t('ALL')}</a></label>
            <div className="seacr_box_s d-flex">
              <input
                type="text"
                className="w-100"
                name="price"
                value={price}
                onChange={handleChange}
              />
              <span>{record.coin}</span>
            </div>
            {validateError.price && <p className="error-message">{t(validateError.price)}</p>}
          </div>
          <div className="contsnt_cls_model">

            <div>
              <span>{t('APY')}</span>
              <span>{!isEmpty(durationAPY) ? durationAPY : record.periodList && record.periodList[0].APY}%</span>
            </div>

            <div>
              <span>{t('MIN_SUBSCRIPTION')}</span>
              <span>{record.minimumAmount} {record.coin}</span>
            </div>

            <div>
              <span>{t('MAX_SUBSCRIPTION')}</span>
              <span>{record.maximumAmount} {record.coin}</span>
            </div>
            <div>
              <span>{t('REDEMPTION_PERIOD')}</span>
              <span>{record.redemptionPeriod} {"Days"}</span>
            </div>
          </div>
          <div className="form-group">
            <div className="form-check">
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

            <button
              type="button"
              class="btn btn-primary w-100 mt-3"
              disabled={loader}
              onClick={handleFormSubmit}
            >
              {t('CONFIRM')}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OrderPlaceModalLocked;
