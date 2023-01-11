// import package
import React, { useState, useEffect } from "react";
import clsx from "classnames";
import ReactDatatable from '@ashvin27/react-datatable';
import { useTranslation } from 'react-i18next';
import DataTable from "react-data-table-component";
// import action
import { gettradeHistory } from "../../actions/dashboardAction";

// import lib
import { dateTimeFormat } from "../../lib/dateTimeHelper";
import { transactionStatus } from "../../lib/displayStatus";

const RecentTransaction = () => {
  const { t, i18n } = useTranslation();
  // state
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [DownloadData, setDownloadData] = useState([]);
  const [reportData, setreportData] = useState([]);
  const [filter, setFilter] = useState({
    'page': 1,
    'limit': 10,
  })
  const [count, setcount] = useState(0);
  // funtion
  const fetchTransaction = async () => {
    try {
      const { status, loading, result, count, reportData } = await gettradeHistory(filter);
      setLoader(loading);
      if (status == "success") {
        setData(result);
        setreportData(reportData);
        setcount(count)

        // const headers = [
        //   [
        //     "Date",
        //     "Transaction Id",
        //     "Trade Type",
        //     "Contract",
        //     "Price",
        //     "Quantity",
        //     "Order Value",
        //   ],
        // ];

        // const download_data =
        //   reportData &&
        //   reportData.length > 0 &&
        //   reportData.map((elt) => [
        //     dateTimeFormat(elt.createdAt, "YYYY-MM-DD HH:mm"),
        //     elt._id,
        //     elt.orderType == "limit" ? "Limit" : "Market",
        //     elt.firstCurrency + elt.secondCurrency,
        //     elt.price,
        //     elt.quantity,
        //     elt.orderValue && elt.orderValue.toFixed(4),
        //   ]);
        // let download_csv = headers.concat(download_data);

        // if (reportData &&
        //   reportData.length > 0) {
        //   setDownloadData(download_csv);

        // }
      }
    } catch (err) { }
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

//   const exportPDF = () => {
//     const unit = "pt";
//     const size = "A4"; // Use A1, A2, A3 or A4
//     const orientation = "landscape"; // portrait or landscape

//     const marginLeft = 40;
//     const doc = new jsPDF(orientation, unit, size);

//     doc.setFontSize(13);

//     const title = "Order History";
//     const headers = [
//       [
//         "Date",
//         "Transaction Id",
//         "Trade Type",
//         "Contract",
//         "Price",
//         "Quantity",
//         "Order Value",
//       ],
//     ];

//     const download_data =
//       reportData &&
//       reportData.length > 0 &&
//       reportData.map((elt) => [
//         dateTimeFormat(elt.createdAt, "YYYY-MM-DD HH:mm"),
//         elt._id,
//         elt.orderType == "limit" ? "Limit" : "Market",
//         elt.firstCurrency + elt.secondCurrency,
//         elt.price,
//         elt.quantity,
//         elt.orderValue && elt.orderValue.toFixed(4),
//       ]);

//     let content = {
//       startY: 50,
//       head: headers,
//       body: download_data,
//     };

//     doc.text(title, marginLeft, 40);
//     doc.autoTable(content);
//     doc.save("tradehistory.pdf");
//   };

  function handlePagination(index) {
    let filterData = { ...filter, ...{ 'page': index.page_number, 'limit': index.page_size } }


    setFilter(filterData);
    fetchTransaction(filterData);
  }

  // const columns = [
  //   {
  //     key: "createdAt",
  //     text: "Date",
  //     className: "Date",
  //     align: "left",
  //     sortable: true,
  //     width: 200,
  //     cell: (record) => {
  //       return (
  //         <p>
  //           {dateTimeFormat(record.createdAt, "YYYY-MM-DD HH:mm")}
  //         </p>
  //       )
  //     }

  //   },
  //   {
  //     key: "_id",
  //     text: "Transaction id",
  //     className: "pairName",
  //     align: "left",
  //     sortable: true,
  //     width: 200,
  //   },
  //   {
  //     key: "buyorsell",
  //     text: "side",
  //     className: "name",
  //     align: "left",
  //     sortable: true,
  //   },
  //   {
  //     key: "orderType",
  //     text: "OrderType",
  //     className: "name",
  //     align: "left",
  //     sortable: true,
  //     cell: (record) => {

  //       console.log("orderTypeorderType",record.orderType)
  //       return (
  //         <p>
  //           {(record.orderType == "limit" ? "Limit" : "Market")}
  //         </p>
  //       )
  //     }
  //   },
  //   {
  //     text: "Pair Name",
  //     className: "name",
  //     align: "left",
  //     sortable: true,
  //     cell: (item) => {
  //       return (
  //         <p>
  //           {item.firstCurrency + item.secondCurrency}
  //         </p>
  //       )
  //     }
  //   },
  //   {
  //     key: "price",
  //     text: "Price",
  //     className: "name",
  //     align: "left",
  //     sortable: true,
  //   },
  //   {
  //     key: "quantity",
  //     text: "Quantity",
  //     className: "name",
  //     align: "left",
  //     sortable: true,
  //   },
  //   {
  //     text: "FilledQuantity",
  //     className: "name",
  //     align: "left",
  //     sortable: true,
  //     cell: (record) => {
  //       return (
  //         <p>
  //           {(record.filledQuantity)}
  //         </p>
  //       )
  //     }
  //   },
  //   {
  //     key: "orderValue",
  //     text: "Order Value",
  //     className: "name",
  //     align: "left",
  //     sortable: true,
  //     cell: (record) => {
  //       return (
  //         <p>
  //           {(record.orderValue.toFixed(4))}
  //         </p>
  //       )
  //     }
  //   },


  // ];
  const columns =[
    {
      name:"Date",
      selector:"createdAt",
      sortable:false
    },
    {
      name:"Transaction id",
      selector:"_id",
      sortable:false
    },
    {
      name:"side",
      selector:"buyorsell",
      sortable:false
    },
    {
      name:"OrderType",
      selector:"orderType",
      sortable:false
    },
    {
      name:"Pair Name",
      cell: (item) => {
              return (
                <p>
                  {item.firstCurrency + item.secondCurrency}
                </p>
              )
            }
    },
    {
      name:"Price",
      selector:"price",
      sortable:false
    },
    {
      name:"Quantity",
      selector:"quantity",
      sortable:false
    },
    {
      name:"FilledQuantity",
      selector:"filledQuantity",
      sortable:false
    },
    {
      name:"Order Value",
      selector:"orderValue",
      sortable:false
    }
  ]

  // const config = {
  //   page_size: 5,
  //   length_menu: [10, 20, 50],
  //   filename: "Order",
  //   no_data_text: 'No Records found!',
  //   language: {
  //     length_menu: "Show _MENU_ result per page",
  //     filter: "Filter in records...",
  //     info: "Showing _START_ to _END_ of _TOTAL_ records",
  //     pagination: {
  //       first: "First",
  //       previous: "Previous",
  //       next: "Next",
  //       last: "Last"
  //     }
  //   },
  //   show_length_menu: false,
  //   show_filter: false,
  //   show_pagination: true,
  //   show_info: true,
  // };


  return (
    <div className="table-responsive">
      <br />
      <span>
        {/* {data.length > 0 ? (
          <CSVLink data={DownloadData} filename={"tradehistory.csv"}>
            <button className="primary_btn primary_btn_small">{t('DOWNLOADE_CSV')}</button>
          </CSVLink>
        ) : (
          ""
        )}

        {data.length > 0 ? (
          <CSVLink data={DownloadData} filename={"tradehistory.xls"}>
            <button className="primary_btn primary_btn_small">{t('DOWNLOADE_XLS')}</button>
          </CSVLink>
        ) : (
          ""
        )}

        {data.length > 0 ? (
          <button className="primary_btn primary_btn_small" onClick={exportPDF}>{t('DOWNLOADE_PDF')}</button>
        ) : (
          ""
        )} */}
      </span>

      {/* <ReactDatatable
        config={config}
        records={data}
        columns={columns}
        dynamic={true}
        total_record={count}
        onChange={handlePagination}
      /> */}
      <DataTable
      columns={columns}
      data={data}
      noHeader
      pagination
      progressPending={loader}
      paginationServer
      paginationComponentOptions={{ noRowsPerPage: true }}
      paginationTotalRows={count}
      onChangePage={handlePagination}
      />

      {/* <table className="table mb-0">
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction Id</th>
            <th>Trade Type</th>
            <th>Contract</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Order Value</th>
          </tr>
        </thead>
        <tbody>
          {loader && <div>Loading...</div>}
          {!loader &&
            data &&
            data.length > 0 &&
            data.map((item, key) => {
              return (
                <tr key={key}>
                  <td>{dateTimeFormat(item.createdAt, "YYYY-MM-DD HH:mm")}</td>
                  <td>{item._id}</td>
                  <td>{item.buyorsell}</td>
                  <td>{item.firstCurrency + item.secondCurrency}</td>
                  <td>{item.price}</td>
                  <td>{item.filledQuantity}</td>
                  <td>{item.orderValue.toFixed(4)}</td>
                </tr>
              );
            })}
          {!loader && data && data.length <= 0 && <div>No Record</div>}
        </tbody>
      </table> */}
    </div>
  );
};

export default RecentTransaction;
