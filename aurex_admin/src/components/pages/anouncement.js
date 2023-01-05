import React, { Component, Fragment } from "react";
import classnames from "classnames";
import DatePicker from "react-datepicker";

// import component
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";

//import lib
import { toastAlert } from "../../lib/toastAlert";
import fileObjectUrl from "../../lib/fileObjectUrl";

// import action
import { anouncementAdd } from "../../actions/anouncementAction";

const initialFormValue = {
  content: "",
  endDateTime: "",
  image: "",
};

class FaqPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formValue: initialFormValue,
      errors: {},
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
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
      } else {
        if (error) {
          this.setState({ errors: error });
        }
        toastAlert("error", message, "anouncementAdd");
      }
    } catch (err) {}
  }

  render() {
    const { errors } = this.state;
    const { content, endDateTime, image } = this.state.formValue;
    return (
      <div>
        <span>&nbsp;</span>
        <Navbar />
        <div className="d-flex" id="wrapper">
          <Sidebar />

          <div id="page-content-wrapper">
            <div className="container-fluid">
              <h3 className="mt-2 text-secondary">Announcement</h3>
              <form noValidate onSubmit={this.handleSubmit} enctype= "multipart/form-data">
                <div className="row mt-2">
                  <div className="col-md-3">
                    <label htmlFor="answer">End Date</label>
                  </div>
                  <div className="col-md-9">
                    <DatePicker
                      selected={endDateTime}
                      onChange={(date) => this.handleDateChange(date)}
                      minDate ={new Date()}
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
          </div>
        </div>
      </div>
    );
  }
}

export default FaqPage;
