// import package
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Button } from "@material-ui/core";
import { useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";
// import config
import config from "../../config";

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import isEmpty from "../../lib/isEmpty";
// import action
import { referralHist, getTranList } from "../../actions/users";

// import lib
import { toastAlert } from "../../lib/toastAlert";
import { momentFormat } from "../../lib/dateTimeHelper";

const column = [
  {
    name: "Date",
    selector: "Date",
    cell: (row, index, column, id) => {
      return momentFormat(row.date, "YYYY-MM-DD HH:mm");
    },
  },
  {
    name: "Ref Email",
    selector: "refEmail",
  },
  {
    name: "Amount",
    selector: "amount",
  },
];

const Referral = () => {
  // state
  const [orderData, setOrderData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [earnAmt, setEarnAmt] = useState(0);
  const [data, setData] = useState("");
  const { t, i18n } = useTranslation();
  // redux
  const accountData = useSelector((state) => state.account);


  // function
  const fetchHistory = async () => {
    try {
      setLoader(true);
      const { status, loading, result } = await referralHist();
      setLoader(loading);
      if (status == "success") {
        setOrderData(result);
        setEarnAmt(result.reduce((a, b) => a + (b["amount"] || 0), 0));
      }
    } catch (err) {}
  };

  // function
  const fetchTranList = async () => {
    try {
      setLoader(true);
      const { status, loading, result } = await getTranList();
      setLoader(loading);
      if (status == "success") {
        setData(result);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchHistory();
    fetchTranList();
  }, []);

  return (
    <div className="p2p_card min-h-auto">
      <h3 className="login_title_8">{t("REFERRAL")}</h3>
      <div className="referaal_box_collection">
        <GridItem xs={12} sm={12} md={12} lg={12}>
          {!isEmpty(data && data.paymentType) && (
            <GridContainer className="bg_contaione">
              <GridItem xs={12} sm={12} md={6} lg={4}>
                <h3>
                  {t("YOUR_REFERRAL_ID")}

                  <CopyToClipboard
                    text={accountData && accountData.userId}
                    onCopy={() => {
                      toastAlert("success", "Copied", "wallet");
                    }}
                  >
                    <a>
                      {accountData && accountData.userId}
                      <span>
                        <i class="fas fa-copy"></i>
                      </span>
                    </a>
                  </CopyToClipboard>
                </h3>
                {/* <div className="submit_btn justify-content-start">
                                <Button disabled>{t('INVITE_FRIENDS')}</Button>
                            </div> */}
              </GridItem>
              <GridItem xs={12} sm={12} md={6} lg={8}>
                <h3>
                  {t("YOUR_REFERRAL_ID")}{" "}
                  <CopyToClipboard
                    text={`${config.FRONT_URL}/register?referenceCode=${
                      accountData && accountData.userId
                    }`}
                    onCopy={() => {
                      toastAlert("success", "Copied", "wallet");
                    }}
                  >
                    <a>
                      {`${config.FRONT_URL}/register?referenceCode=${
                        accountData && accountData.userId
                      }`}
                      <span>
                        <i class="fas fa-copy"></i>
                      </span>
                    </a>
                  </CopyToClipboard>
                </h3>
                <h4>
                  {t("YOUR_TOTAL_REFERRAL")}
                  <span className="color_blue">
                    {earnAmt} {t("AUREX")}
                  </span>
                </h4>
              </GridItem>
            </GridContainer>
          )}
          {data == null && (
            <GridContainer className="bg_contaione">
              <GridItem xs={12} sm={12} md={6} lg={4}>
              <h3>
                  Please Deposit
                </h3>
              </GridItem>
            </GridContainer>
          )}
        </GridItem>
      </div>

      <GridItem xs={12} sm={12} md={12} lg={12}>
        <div className="referral_table">
          <DataTable
            columns={column}
            data={orderData}
            noHeader
            progressPending={loader}
          />
        </div>
      </GridItem>
    </div>
  );
};

export default Referral;
