import React, { Component, Fragment } from "react";
import ReactDatatable from "@ashvin27/react-datatable";
import * as moment from "moment";
//import components

import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";

//import actions
import { passBookHistory } from "../../actions/reportActions";
// import { CSVLink } from "react-csv";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

class tradehistory extends Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        key: "createdAt",
        text: "Date",
        className: "Date",
        align: "left",
        sortable: true,
        width: 200,
        cell:record=>{
        console.log('record',record)
          return(
              <Fragment>
                {moment.utc(record.createdAt).local().format("DD-MM-YYYY  h:mm a ")}
              
              </Fragment>
          )
          

      }
      },
      {
        key: "coin",
        text: "Coin",
        className: "coin",
        align: "left",
        sortable: true,
        width: 200,
      },
      {
        key: "tableId",
        text: "TableId",
        className: "status",
        align: "left",
        sortable: true,
      },
      {
        key: "userCodeId",
        text: "UserId",
        className: "status",
        align: "left",
        sortable: true,
      },
      {
        key: "type",
        text: "Type",
        className: "type",
        align: "left",
        sortable: true,
      },
      {
        key: "category",
        text: "Category",
        className: "Side",
        align: "left",
        sortable: true,
        width: 200,
      },

      {
        key: "beforeBalance",
        text: "Before Balance",
        className: "Price",
        align: "left",
        sortable: true,
        width: 200,
      },
      {
        key: "afterBalance",
        text: "After Balance",
        className: "Price",
        align: "left",
        sortable: true,
        width: 200,
      },
      {
        key: "amount",
        text: "Amount",
        className: "Amount",
        align: "left",
        sortable: true,
        width: 200,
      },
 
    ];

    this.config = {
      page_size: 10,
      length_menu: [10, 20, 50],
      filename: "Order",
      no_data_text: "No Records found!",
      language: {
        length_menu: "Show _MENU_ result per page",
        filter: "Filter in records...",
        info: "Showing _START_ to _END_ of _TOTAL_ records",
        pagination: {
          first: "First",
          previous: "Previous",
          next: "Next",
          last: "Last",
        },
      },
      show_length_menu: true,
      show_filter: true,
      show_pagination: true,
      show_info: true,
    };
    this.state = {
      records: [],
      loader: false,
      page: 1,
      limit: 10,
      count: 0,
    };
    this.handlePagination = this.handlePagination.bind(this);
    // this.exportPDF = this.exportPDF.bind(this);
  }
  componentDidMount() {
    const { userId } = this.props.match.params;
 
    const { page, limit } = this.state;
    let reqData = {
      userId,
      page,
      limit,
    };
    this.getData(reqData);
    console.log('reqData888',reqData)
  }

  handlePagination(index) {
    const { userId } = this.props.match.params;

    let reqData = {
      page: index.page_number,
      limit: index.page_size,
      search: index.filter_value,
      userId: userId,
    };
    this.getData(reqData);
    this.setState({
      page: index.page_number,
      limit: index.page_size,
      search: index.filter_value,
    });
  }

  async getData(reqData) {
    try {
      this.setState({ loader: true });

      const { status, loading, result } = await passBookHistory(reqData);
      console.log('result11111',result)
      this.setState({ loader: loading });
      if (status == "success") {
        this.setState({ 'count': result.count, 'records': result.data  });
      }
    } catch (err) {}
  }

  // async exportPDF() {
  //   const { records } = this.state;

  //   const unit = "pt";
  //   const size = "A4"; // Use A1, A2, A3 or A4
  //   const orientation = "landscape"; // portrait or landscape

  //   const marginLeft = 40;
  //   const doc = new jsPDF(orientation, unit, size);

  //   doc.setFontSize(13);

  //   const title = "Spot Trade History";
  //   const headers = [
  //     [
  //       "Date",
  //       "Coin",
  //       "Side",
  //       "Price",
  //       "Buyer Email",
  //       "Seller Email",
  //       "Excuted Price",
  //       "Total",
  //       "Fees",
  //     ],
  //   ];

  //   const data =
  //     records.length > 0 &&
  //     records.map((elt) => [
  //       elt.createdAt,
  //       // elt.firstCurrency + "_" + elt.secondCurrency,
  //       // // elt.secondCurrency,
  //       // elt.buyorsell,
  //       // parseFloat(elt.price).toFixed(2),
  //       // elt.buyeremail,
  //       // elt.selleremail,
  //       // parseFloat(elt.filledQuantity).toFixed(2),
  //       // parseFloat(elt.orderValue, 2).toFixed(2),
  //       // parseFloat(elt.Fees).toFixed(2),
  //     ]);

  //   let content = {
  //     startY: 50,
  //     head: headers,
  //     body: data,
  //   };

  //   doc.text(title, marginLeft, 40);
  //   doc.autoTable(content);
  //   doc.save("passbookHistory.pdf");
  // }

  render() {
    const { records, count } = this.state;
    return (
      <div>
        <Navbar />
        <div className="d-flex" id="wrapper">
          <Sidebar />
          <div id="page-content-wrapper">
            <div className="container-fluid">
              <h3 className="mt-2 text-secondary">PassBook History</h3>
              {/* <div className="form-group mb-0">
                {records.length > 0 ? (
                  <CSVLink
                    data={records}
                    filename={"spottradehistory.csv"}
                    className="btn btnTrade1 py-4"
                  >
                    <button>Download csv</button>
                  </CSVLink>
                ) : (
                  ""
                )}

                {records.length > 0 ? (
                  <CSVLink
                    data={records}
                    filename={"spottradehistory.xls"}
                    className="btn btnTrade1 py-4"
                  >
                    <button>Download xls</button>
                  </CSVLink>
                ) : (
                  ""
                )}

                {records.length > 0 ? (
                  <button onClick={this.exportPDF}>Download PDF</button>
                ) : (
                  ""
                )}
              </div> */}
              <ReactDatatable className="table table-bordered table-striped table-responsive passbook_history_table"
                config={this.config}
                records={this.state.records}
                columns={this.columns}
                dynamic={true}
                total_record={count}
                onChange={this.handlePagination}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default tradehistory;
