import React from 'react';
import Navbar from '../partials/Navbar';
import Sidebar from '../partials/Sidebar';
import ReactDatatable from '@ashvin27/react-datatable';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { CSVLink } from "react-csv";

import { momentFormat } from '../../lib/dateTimeHelper'
import { loginHisPagination } from '../../actions/admin';

class LoginHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
    };
    this.columns = [
      {
        key: "countryCode",
        text: "Country Code",
        className: "countryCode",
        align: "left",
        sortable: true,
        width: "20px"
      },
      {
        key: "countryName",
        text: "Country Name",
        className: "currency",
        align: "left",
        width: "20px",
        sortable: true
      },
      {
        key: "regionName",
        text: "State",
        className: "currency",
        align: "left",
        width: "20px",
        sortable: true
      },
      {
        key: "broswername",
        text: "Browser",
        className: "currency",
        align: "left",
        width: "20px",
        sortable: true
      },
      {
        key: "ipaddress",
        text: "IP Address",
        className: "currency",
        align: "left",
        width: "20px",
        sortable: true
      },
      {
        key: "os",
        text: "OS",
        className: "currency",
        align: "left",
        width: "20px",
        sortable: true
      },
      {
        key: "ismobile",
        text: "Mobile",
        className: "currency",
        align: "left",
        width: "10px",
        sortable: true
      },
      {
        key: "createdDate",
        text: "Created Date",
        className: "currency",
        align: "left",
        width: "10px",
        sortable: true,
        cell: records => {
          return momentFormat(records.createdDate, 'YYYY-MM-DD HH:mm')
        }
      },
      {
        key: "status",
        text: "Status",
        className: "currency",
        align: "left",
        width: "10px",
        sortable: true
      },
      {
        key: "reason",
        text: "Reason",
        className: "currency",
        align: "left",
        width: "10px",
        sortable: true
      }
    ]

    this.config = {
      page_size: 10,
      length_menu: [10, 20, 50],
      filename: "Currency",
      no_data_text: 'No Currency found!',
      language: {
        length_menu: "Show _MENU_ result per page",
        filter: "Filter in records...",
        info: "Showing _START_ to _END_ of _TOTAL_ records",
        pagination: {
          first: "First",
          previous: "Previous",
          next: "Next",
          last: "Last"
        }
      },
      show_length_menu: false,
      show_filter: true,
      show_pagination: true,
      show_info: true,
    };

    this.state = {
      addFormModal: false,
      editFormModal: false,
      page: 1,
      limit: 10,
      count: 0,
      loader: false,
      records: [],
      imageUrl: '',
      dataToDownload: [],

    };

    this.exportPDF = this.exportPDF.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.fetchloginPagList = this.fetchloginPagList.bind(this);
  }

  componentDidMount() {
    const { page, limit } = this.state;
    let reqData = {
      page,
      limit,
      export: 'true'
    }
    this.fetchloginPagList(reqData)
  };

  handlePagination(index) {
    let reqData = {
      page: index.page_number,
      limit: index.page_size,
      search: index.filter_value,
      export: 'true'
    }


    this.fetchloginPagList(reqData);
    this.setState({ page: index.page_number, limit: index.page_size, search: index.filter_value })
  }


  async fetchloginPagList(reqData) {
    this.setState({ 'loader': true })
    try {
      const { status, loading, message, result } = await loginHisPagination(reqData)
      this.setState({ 'loader': loading })
      if (status == 'success') {
        this.setState({ "count": result.count, 'records': result && result.data })
      }
    } catch (err) { }
  }

  download = async () => {
    let respData = {
      export: 'false'
    }
    const { status, result } = await loginHisPagination(respData)
    this.setState({ dataToDownload: result.downloadData }, () => {
      // click the CSVLink component to trigger the CSV download
      this.csvLink.link.click();
    });
  }
  download1 = async () => {
    let respData = {
      export: 'false'
    }
    const { status, result } = await loginHisPagination(respData)
    this.setState({ dataToDownload: result.downloadData }, () => {
      // click the CSVLink component to trigger the CSV download
      this.xlsLink.link.click();
    });
  }

  async exportPDF() {
    let respData = {
      export: 'false'
    }
    const { status, result } = await loginHisPagination(respData)
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(13);

    const title = "LoginHistory";
    const headers = [
      [
        "CountryCode",
        "CountryName",
        "RegionName",
        "Broswername",
        "IpAddress",
        "Os",
        "IsMobile",
        "CreatedDate",
        "Status",
        "Reason"
      ],
    ];

    const data =
      result && result.downloadData && result.downloadData.length > 0 &&
      result.downloadData.map((elt) => [
        elt.countryCode,
        elt.countryName,
        elt.regionName,
        elt.broswername,
        elt.ismobile,
        elt.broswername,
        elt.ismobile,
        elt.createdDate,
        elt.status,
        elt.reason,
      ]);

    let content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("LoginHistory.pdf");
  }



  render() {
    const { records, count, loader, dataToDownload } = this.state;
    return (

      <div>
        <Navbar />
        <div className="d-flex" id="wrapper">
          <Sidebar />

          <div id="page-content-wrapper">
            <div className="container-fluid">
              <div>
                <h3 className="mt-2 text-secondary">Login History</h3>
                {records && records.length > 0 ? (
                  <button onClick={this.exportPDF} className='btn btn-info py-1 mr-2 mb-2'>Download(PDF)</button>
                ) : (
                  ""
                )}
                {records && records.length > 0 ? (
                  <>
                    <CSVLink
                      data={dataToDownload}
                      filename="LoginHistory.csv"
                      className="hidden"
                      ref={(r) => (this.csvLink = r)}
                      target="_blank">

                    </CSVLink>
                    <button onClick={this.download} className='btn btn-info py-1 mr-2 mb-2'>Download(CSV)</button>

                  </>

                ) : (
                  ""
                )}
                {records && records.length > 0 ? (
                  <>
                    <CSVLink
                      data={dataToDownload}
                      filename="LoginHistory.xls"
                      className="hidden"
                      ref={(r) => (this.xlsLink = r)}
                      target="_blank">

                    </CSVLink>
                    <button onClick={this.download1} className='btn btn-info py-1 mb-2'>Download(XLS)</button>

                  </>

                ) : (
                  ""
                )}

              </div>
              <ReactDatatable className="table table-bordered table-striped login_history_table"
                config={this.config}
                records={this.state.records}
                columns={this.columns}
                dynamic={true}
                total_record={count}
                loading={loader}
                onChange={this.handlePagination}

              />
            </div>
          </div>
        </div>
      </div>

    );
  }
}
export default LoginHistory