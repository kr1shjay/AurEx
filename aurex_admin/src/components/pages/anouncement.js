import React, { Component, Fragment } from "react";
import classnames from "classnames";
import DatePicker from "react-datepicker";
import ReactDatatable from '@ashvin27/react-datatable';

// import component
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";

//import lib
import { toastAlert } from "../../lib/toastAlert";
import fileObjectUrl from "../../lib/fileObjectUrl";
import { dateTimeFormat } from '../../lib/dateTimeHelper'
import EditAnouncement from "../partials/EditAnouncement";

// import action
import { anouncementAdd, getanouncement } from "../../actions/anouncementAction";
import ConfirmModal from "../partials/confirmModal";

const initialFormValue = {
  content: "",
  endDateTime: "",
  image: "",
};

class FaqPage extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        key: "endDateTime",
        text: "End Date",
        className: "date",
        align: "left",
        sortable: true,
        cell: record => {
          return dateTimeFormat(new Date(record.endDateTime).getTime(), 'YYYY-MM-DD HH:mm')
        }
      },
      {
        key: "content",
        text: "Content",
        className: "email",
        align: "left",
        sortable: true
      },
      {
        key: "action",
        text: "Action",
        className: "action",
        width: 200,
        align: "left",
        sortable: false,
        cell: record => {
          return (
            <>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => this.editRecord(record)}
                style={{ marginRight: '5px' }}>
                <i className="fa fa-edit"></i>
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => this.deleteRecord(record._id)}
                style={{ marginRight: '5px' }}>
                <i className="fa fa-trash"></i>
              </button>
            </>
          );
        }
      }
    ];

    this.config = {
      page_size: 10,
      length_menu: [10, 20, 50],
      filename: "Launchpad",
      no_data_text: 'No user found!',
      sort: { column: "Created date", order: "desc" },
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
      defaultSortAsc: true,
    };
    this.state = {
      formValue: initialFormValue,
      errors: {},
      page: 1,
      limit: 10,
      count: '',
      records: '',
      editFormModal: false,
      editRecord: {},
      imageUrl: '',
      deleteFormModal: false,
      deleteId: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }
  componentDidMount() {
    const { page, limit } = this.state;
    let reqData = {
      page,
      limit
    }
    this.fetchAnouncement(reqData);
  };
  async fetchAnouncement(reqData) {
    try {
      this.setState({ 'loader': true })
      const { status, loading, result } = await getanouncement(reqData);
      this.setState({ 'loader': loading })
      if (status == 'success') {
        this.setState({
          "count": result.count,
          'records': result.data,
          'imageUrl': result.imageUrl
        })
      }
    } catch (err) {
      console.log(err, 'err-->')
    }
  }
  handleChange(e) {
    e.preventDefault();
    let { id, value } = e.target;
    let formData = { ...this.state.formValue, ...{ [id]: value } };
    this.setState({ formValue: formData });
    this.setState({ errors: "" });
  }
  handleFile = (e) => {
    e.preventDefault();
    const { name, files } = e.target;
    let formData = { ...this.state.formValue, ...{ [name]: files[0] } };
    this.setState({ formValue: formData });
    console.log("file", this.formValue);
  };

  handleDateChange(date) {
    const formData = { ...this.state.formValue, ...{ endDateTime: date } };
    this.setState({ formValue: formData });
    this.setState({ errors: "" });
  }

  async handleSubmit(e) {
    try {
      e.preventDefault();
      //const { formValue } = this.state;
      const { endDateTime, content, image } = this.state.formValue;
      //let reqData = formValue;
      const formData = new FormData();
      formData.append("endDateTime", endDateTime);
      formData.append("content", content);
      formData.append("image", image);

      const { status, loading, message, error } = await anouncementAdd(formData);
      if (status == "success") {
        this.setState({ formValue: initialFormValue, errors: {} });
        toastAlert("success", message, "anouncementAdd");
        const { page, limit } = this.state;
        let reqData = {
          page,
          limit
        }
        this.fetchAnouncement(reqData);
      } else {
        if (error) {
          this.setState({ errors: error });
        }
        toastAlert("error", message, "anouncementAdd");
      }
    } catch (err) { }
  }
  editRecord(record) {
    this.setState({
      editFormModal: true,
      editRecord: record
    })
  }
  deleteRecord(record) {
    this.setState({
      deleteFormModal: true,
      deleteId: record
    })
  }
  handleCloseEditForm = () => {
    this.setState({ editFormModal: false, editRecord: {} })
  }

  render() {
    const { errors } = this.state;
    const { records, count, loader, editFormModal, editRecord, deleteId, deleteFormModal, imageUrl } = this.state;
    const { content, endDateTime, image } = this.state.formValue;
    return (
      <div>
        <span>&nbsp;</span>
        <Navbar />
        <div className="d-flex" id="wrapper">
          <Sidebar />
          <ConfirmModal
            isShow={deleteFormModal}
            onHide={() => { this.setState({ deleteFormModal: false }) }}
            fetchData={this.fetchAnouncement}
            record={deleteId}
          />
          <EditAnouncement
            isShow={editFormModal}
            onHide={this.handleCloseEditForm}
            fetchData={this.fetchAnouncement}
            record={editRecord}
            imageUrl={imageUrl}
          />
          <div id="page-content-wrapper">
            <div className="container-fluid">
              <h3 className="mt-2 text-secondary">Announcement</h3>
              <form noValidate onSubmit={this.handleSubmit} enctype="multipart/form-data">
                <div className="row mt-2">
                  <div className="col-md-3">
                    <label htmlFor="answer">End Date</label>
                  </div>
                  <div className="col-md-9">
                    <DatePicker
                      selected={endDateTime}
                      onChange={(date) => this.handleDateChange(date)}
                      minDate={new Date()}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                    <span className="text-danger">{errors.endDate}</span>
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-md-3">
                    <label htmlFor="answer">Content</label>
                  </div>
                  <div className="col-md-9">
                    <textarea
                      onChange={this.handleChange}
                      value={content}
                      error={errors.content}
                      name="content"
                      id="content"
                      type="text"
                      className={classnames("form-control", {
                        invalid: errors.content,
                      })}
                    />
                    <span className="text-danger">{errors.content}</span>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-3">
                    <label htmlFor="minimum">select Banner </label>
                  </div>
                  <div className="col-md-9">
                    <label class="custom-file-upload">
                      <input
                        name="image"
                        type="file"
                        onChange={this.handleFile}
                        accept="image/x-png,image/gif,image/jpeg, image/png"
                        aria-describedby="fileHelp"
                      />
                      Choose File
                    </label>

                    <img
                      className="img-fluid proofThumb"
                      src={fileObjectUrl(image)}
                    />
                    <div>
                      <span className="text-danger">{errors.image}</span>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
            <div className="px-3">
            <ReactDatatable className="table table-bordered table-striped user_management_table anpunce_table_sec"
              responsive={this.state.responsive}
              config={this.config}
              records={records}
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

export default FaqPage;
