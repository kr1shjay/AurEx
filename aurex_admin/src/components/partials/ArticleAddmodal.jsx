import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { addarticle } from "../../actions/category";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import $ from "jquery";
import { Editor } from "@tinymce/tinymce-react";
import Select from "react-select";
import axios from "axios";
import keys from "../../actions/config";
import "react-toastify/dist/ReactToastify.css";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';


const url = keys.baseUrl;

class SubcategoryAddModal extends React.Component {
  constructor() {
    super();
    this.state = {
      subcategoryName: "",
      status: "",
      errors: {},
      categoryName1: "",
      categoryName: "",
      subcategorydropdown: "",
      articlename: "",
      content: "",
      query_image: ""
    };
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  styles = {
		option: (provided, state) => ({
		  ...provided,
		  color: "white",
		  backgroundColor: "#242827",
		}),
		valueContainer: (provided, state) => ({
		  ...provided,
		  height: '52px',
		  padding: '0 6px',
		  backgroundColor: "#1a1b1c",
		  borderColor: '#242827',
		borderRadius: 8,
		borderStyle: 'solid',
		borderWidth: '1px'
		 
		}),
		control: (provided, state) => ({
		  ...provided,
		  height: '52px',
		  borderRadius:8,
		  backgroundColor: "#1a1b1c",
		  border:'none'
		 
		}),
		indicatorsContainer: (provided, state) => ({
		  ...provided,
		  height: '52px',
		  position: 'absolute',
		  right: 0,
		  top: 0,
		  color:'#fff' 
		}),    
		singleValue: (provided, state) => ({
		  ...provided,
		  color: "#fff"
		})
	  };
  componentDidMount() {
    this.getData();
  }

  getData() {
    axios.get(url + "api/category").then(category => {
      console.log("Response data====>", category);
      var categoryarray = [];
      category.data.map((item, i) => {
        const name = item.categoryName;
        const value = item._id;
        const obj = { value: value, label: name };
        categoryarray.push(obj);
      });
      // console.log(currencyarray,'currencyarray');
      this.setState({ categoryName1: categoryarray, email_assigned: true });
    });

    axios.get(url + "api/sub-category").then(subcategory => {
      console.log("Response data====>", subcategory);
      // var categoryarray = [];
      // category.data.map((item, i) => {
      //   const name = item.categoryName;
      //   const value = item._id;
      //   const obj = { value: value, label: name };
      //   categoryarray.push(obj);
      // });
      // // console.log(currencyarray,'currencyarray');
      // this.setState({ categoryName1: categoryarray, email_assigned: true });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      $("#add-article-modal")
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
    //console.log(nextProps.auth.currencyadd.data,'shdbjksfcgdsyfvfdsuy');
    if (
      nextProps.auth !== undefined &&
      nextProps.auth.currencyadd !== undefined &&
      nextProps.auth.currencyadd.data !== undefined &&
      nextProps.auth.currencyadd.data.message !== undefined
    ) {
      $("#add-article-modal").modal("hide");
      this.setState({
        errors: ""
      });
      toast(nextProps.auth.currencyadd.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      nextProps.auth.currencyadd = undefined;
      this.setState({
        errors: ""
      });
    }
  }
  handleEditorChange(content, editor) {
    this.setState({ content });
  }

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
        subcategoryName: subcategoryarray,
        email_assigned: true
      });
    });
  };

  handleChange1 = selectedOption => {
    this.setState({ subcategorydropdown: selectedOption });
    // console.log(`Option selected:`, selectedOption );
  };
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleChangefile = event => {
    this.setState({
      query_image: event.target.files[0]
    });
  };

  onarticleAdd = e => {
    e.preventDefault();
    // const newarticle = {
    //   articledetails: this.state.articlename,
    //   maincategoryId: this.state.categoryName,
    //   subcategoryId: this.state.subcategorydropdown.value,
    //   content: this.state.content,
    //   query_image: this.state.query_image

    // };
    // console.log("newarticle***********", newarticle);
    // this.props.addarticle(newarticle);

    const data = new FormData();
    // data.append('_id', this.state._id);
    data.append("articledetails", this.state.articlename);
    data.append("maincategoryId", this.state.categoryName);
    // data.append("subcategoryId", this.state.subcategorydropdown.value);
    data.append("content", this.state.content);
    data.append("file", this.state.query_image);
    console.log(":Daatataa", data);
    axios
      .post(url + "api/article-add", data)
      .then(res => {
        if (res.status === 200) {
          toast(res.data.message, {
            position: toast.POSITION.TOP_CENTER
          });
          this.getData();
          $("#add-article-modal").modal("hide");

        }
      })
      .catch();
    this.getData();
    // this.props.addarticle(data);
  };

  render() {
    const { selectedOption, subcategoryName } = this.state.categoryName1;

    const { errors } = this.state;
    return (
      <div>
        <div className="modal fade" id="add-article-modal" data-reset="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Article</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <form noValidate onSubmit={this.onarticleAdd} id="add-article">
                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="currencyName">Article Name</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={this.onChange}
                        value={this.state.articlename}
                        id="articlename"
                        type="text"
                        // error={errors.currencyName}
                        className={classnames("form-control", {
                          invalid: errors.currencyName
                        })}
                      />
                      {/* <span className="text-danger">{errors.currencyName}</span> */}
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-3">
                      <br />
                      <label htmlFor="query_image">Image</label>
                    </div>
                    <div className="col-md-6">
                    <label class="custom-file-upload">
                      <input type="file"   accept="image/x-png,image/gif,image/jpeg" onChange={this.handleChangefile} />
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
                      <Select
                        value={selectedOption}
                        defaultValue={{
                          label: this.state.maincategoryId,
                          value: this.state.maincategoryId
                        }}
                        onChange={this.handleChange}
                        options={this.state.categoryName1}
                        styles={this.styles} className="border_blue_select basic-multi-select"
                      />
                      <span className="text-danger">
                        {errors.first_currency}
                      </span>
                    </div>
                  </div>

                {/*}  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="first_currency">Sub Category</label>
                    </div>
                    <div className="col-md-9">
                      {this.state.subcategoryName.length == 0 ? (
                        <span className="text-danger">
                          Please select another category
                        </span>
                      ) : (
                        <Select
                          value={subcategoryName}
                          defaultValue={{
                            label: this.state.maincategoryId,
                            value: this.state.maincategoryId
                          }}
                          onChange={this.handleChange1}
                          options={this.state.subcategoryName}
                        />
                      )}

                      <span className="text-danger">
                        {errors.first_currency}
                      </span>
                    </div>
                  </div>*/}
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
                  form="add-article"
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Article
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SubcategoryAddModal.propTypes = {
  addarticle: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps)(withRouter(SubcategoryAddModal));
