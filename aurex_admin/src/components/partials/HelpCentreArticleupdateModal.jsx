import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updatearticle } from "../../actions/category";
import { withRouter } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import $ from "jquery";
import { Editor } from "@tinymce/tinymce-react";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import axios from "axios";
import keys from "../../actions/config";
const url = keys.baseUrl;
class ArticleupdateModal extends React.Component {
  constructor(props) {
    super(props);
    $("#update-subcategory-modal")
      .find(".text-danger")
      .hide();
    this.state = {
      categoryName: "",
      status: "",
      errors: {},
      categoryName1: "",
      subcategoryName: "",
      maincategoryId: "",
      categoryName2: "",
      subcategoryId: "",
      subcategorydropdown: "",
      subcategoryName1: "",
      articlename: "",
      articlename_update: "",
      subcategoryoption: [],
      content: "",
      query_image: ""
    };
    this.handleEditorChange = this.handleEditorChange.bind(this);

  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.record) {
      console.log("nextpropss in arti update", nextProps);
      if (nextProps.record.maincategoryId) {
        var maincategoryId = {
          value: nextProps.record.maincategoryId._id,
          label: nextProps.record.maincategoryId.categoryName
        };
        this.setState({
          id: nextProps.record._id,
          articlename_update: nextProps.record.Articlename,
          categoryName: nextProps.record.maincategoryId._id,
          subcategoryName: nextProps.record.subcategoryName,
          content:nextProps.record.content,
          maincategoryId: maincategoryId,
          subcategoryId: subcategoryId,
          hidden1: nextProps.record.categoryName,
          errors: ""
        });
      }
      if (nextProps.record.subcategoryId) {
        var subcategoryId = {
          value: nextProps.record.subcategoryId._id,
          label: nextProps.record.subcategoryId.subcategoryName
        };
        this.setState({
          id: nextProps.record._id,
          articlename_update: nextProps.record.Articlename,
          categoryName: nextProps.record.maincategoryId._id,
          subcategoryName: nextProps.record.subcategoryName,
          content:nextProps.record.content,
          maincategoryId: maincategoryId,
          subcategoryId: subcategoryId,
          hidden1: nextProps.record.categoryName,
          errors: ""
        });
      }

      //   this.handleChange()
    }
    if (nextProps.errors) {
      $("#update-subcategory-modal")
        .find(".text-danger")
        .show();
      this.setState({
        errors: nextProps.errors
      });
    } else {
      this.setState({
        errors: ""
      });
    }
    // console.log(nextProps)
    if (
      nextProps.auth !== undefined &&
      nextProps.auth.currencyupdate !== undefined &&
      nextProps.auth.currencyupdate.data !== undefined &&
      nextProps.auth.currencyupdate.data.message !== undefined &&
      nextProps.auth.currencyupdate.data.success
    ) {
      $("#update-subcategory-modal").modal("hide");
      toast(nextProps.auth.currencyupdate.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      nextProps.auth.currencyupdate = "";
      this.setState({
        errors: ""
      });
    }
  }

  //   onChange = e => {
  //     $("#update-subcategory-modal")
  //       .find(".text-danger")
  //       .show();
  //     if (e.target.id === "currency-update-categoryName") {
  //       this.setState({ categoryName: e.target.value });
  //     }
  //   };

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  handleEditorChange(content, editor) {
    this.setState({ content });
  }

  handleChangefile = event => {
    this.setState({
      query_image: event.target.files[0]
    });
  };


  handleChange = selectedOption => {
    this.setState({ categoryName: selectedOption.value });
    console.log(`Option selected:`, selectedOption);

    var data = {
      categoryid: selectedOption.value
    };
    axios.post(url + "api/sub-category-select-find", data).then(subcategory => {
      console.log("Response data====>", subcategory);
      var subcategoryarray = [];
      subcategory.data.map((item, i) => {
        const name = item.subcategoryName;
        const value = item._id;
        const obj = { value: value, label: name };
        subcategoryarray.push(obj);
      });
      console.log(subcategoryarray, "subcategoryarray");
      this.setState({
        subcategoryoption: subcategoryarray,
        email_assigned: true
      });
    });
  };

  handleChange1 = selectedOption => {
    this.setState({ subcategorydropdown: selectedOption });
    // console.log(`Option selected:`, selectedOption );
  };

  componentDidMount() {
    console.log("call here");
    // this.setState({ errors: "" });
    this.getData();
  }

  getData() {
    axios
      .get(url + "api/category")
      .then(subcategory => {
        var categoryarray = [];
        subcategory.data.map((item, i) => {
          const name = item.categoryName;
          const value = item._id;
          const obj = { value: value, label: name };
          categoryarray.push(obj);
        });
        console.log(categoryarray, "categoryarray===");
        this.setState({ categoryName1: categoryarray, email_assigned: true });
      })
      .catch();
  }

  onArticleupdate = e => {
    e.preventDefault();
    $("#update-article-modal")
      .find(".text-danger")
      .show();
    const newcategory = {
      _id: this.state.id,
      articlenamee: this.state.articlename_update,
      subcategoryName: this.state.subcategorydropdown.value,
      categoryName: this.state.categoryName
    };

    const data = new FormData();

    data.append("_id", this.state.id);
    data.append("articledetails", this.state.articlename_update);
    data.append("maincategoryId", this.state.categoryName);
    data.append("subcategoryId",  this.state.subcategorydropdown.value);
    data.append("content", this.state.content);
    data.append("file", this.state.query_image);
    // console.log("New article to update", newcategory);

    axios
      .post(url + "api/article-update", data)
      .then(res => {
        if (res.status === 200) {
          toast(res.data.message, {
            position: toast.POSITION.TOP_CENTER
          });
        }
      })
      .catch();
    this.getData();
    // this.props.updatearticle(newcategory);
  };

  render() {
    const {
      errors,
      maincategoryId,
      selectedOption,
      subcategoryId,
      subcategoryName1,
      subcategoryoption,
      subcategorydropdown
    } = this.state;

    return (
      <div>
        <div className="modal fade" id="update-article-modal">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Update Category</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <form
                  noValidate
                  onSubmit={this.onArticleupdate}
                  id="update-subcategory"
                >
                  <input
                    onChange={this.onChange}
                    value={this.state.id}
                    id="category-update-id"
                    type="text"
                    className="d-none"
                  />
                  <input
                    onChange={this.onChange}
                    value={this.state.hidden}
                    id="hidden"
                    type="text"
                    className="d-none"
                  />
                  <input
                    onChange={this.onChange}
                    value={this.state.hidden1}
                    id="hidden1"
                    type="text"
                    className="d-none"
                  />
                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="currencyName">Article Name</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={this.onChange}
                        value={this.state.articlename_update}
                        id="articlename_update"
                        type="text"
                        // error={errors.currencyName}
                        className={classnames(
                          "form-control"
                          // , { invalid: errors.currencyName}
                        )}
                      />
                      <span className="text-danger">{errors.currencyName}</span>
                    </div>
                  </div>


                  <div className="row mt-2">
                    <div className="col-md-3">
                      <br />
                      <label htmlFor="query_image">Image</label>
                    </div>
                    <div className="col-md-6">
                    <label class="custom-file-upload">
                      <input type="file" onChange={this.handleChangefile} />
                      Choose File
                    </label>
                      <img width="100px" src={this.state.query_image} />
                    </div>
                  </div>


                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="content">Content</label>
                    </div>
                    <div className="col-md-9">
                      <Editor
                        apiKey="5vk89nvvi2zckrb2lp2ctyyolewhq1v3pzdiwb7at68h40a5"
                        initialValue="<p>This is the initial content of the editor</p>"
                        value={this.state.content}
                        onEditorChange={this.handleEditorChange}
                        init={{
                          height: 500,
                          menubar: false,
                          plugins: [
                            "advlist autolink lists link image charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table paste code help wordcount"
                          ],
                          toolbar:
                            "undo redo code | formatselect | bold italic backcolor | \
                                               alignleft aligncenter alignright alignjustify | \
                                               bullist numlist outdent indent | removeformat | help"
                        }}
                      />
                      <span className="text-danger">{errors.content}</span>
                    </div>
                  </div>





                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="first_currency">Main Category</label>
                    </div>
                    <div className="col-md-9">
                      {this.state.maincategoryId ? (
                        <Select
                          value={selectedOption}
                          defaultValue={{
                            label: maincategoryId.label,
                            value: maincategoryId.value
                          }}
                          onChange={this.handleChange}
                          options={this.state.categoryName1}
                        />
                      ) : (
                        ""
                      )}
                      <span className="text-danger">
                        {errors.first_currency}
                      </span>
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="first_currency">Sub Category</label>
                    </div>
                    <div className="col-md-9">
                      {subcategoryoption.length == 0 ? (
                        <span className="text-danger">
                          Please Select the other category
                        </span>
                      ) : (
                        <Select
                          value={subcategorydropdown}
                          defaultValue={{
                            label: subcategoryId.label,
                            value: subcategoryId.value
                          }}
                          onChange={this.handleChange1}
                          options={subcategoryoption}
                        />
                      )}
                      <span className="text-danger">
                        {errors.first_currency}
                      </span>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  form="update-subcategory"
                  type="submit"
                  className="btn btn-primary"
                >
                  Update Article
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ArticleupdateModal.propTypes = {
  updatearticle: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { updatearticle })(
  withRouter(ArticleupdateModal)
);
