import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addsubcategory } from "../../actions/category";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import $ from "jquery";
import { Editor } from "@tinymce/tinymce-react";
import Select from "react-select";
import axios from "axios";
import keys from "../../actions/config";
import "react-toastify/dist/ReactToastify.css";

const url = keys.baseUrl;

class SubcategoryAddModal extends React.Component {
  constructor() {
    super();
    this.state = {
      subcategoryName: "",
      status: "",
      errors: {},
      categoryName1:"",
      categoryName:""

    };
  }
  componentDidMount() {
    this.getData();
  }

  getData(){
    axios
    .get(url + "api/helpcentrecategory")
    .then(category=>{
        console.log("Response data====>",category)
        var categoryarray = [];
        category.data.map((item, i) => {
          const name = item.categoryName;
          const value = item._id;
          const obj = { value: value, label: name };
          categoryarray.push(obj);
        });
        // console.log(currencyarray,'currencyarray');
        this.setState({ categoryName1: categoryarray, email_assigned: true });
      })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      $("#add-subcategory-modal")
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
      $("#add-subcategory-modal").modal("hide");
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

  handleChange = selectedOption => {
    this.setState({ categoryName: selectedOption.value });
    //  console.log(`Option selected:`, selectedOption );
  };
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onsubCategoryAdd = e => {
    e.preventDefault();
    const newCategory = {
      subcategoryName: this.state.subcategoryName,
      categoryName:this.state.categoryName
    };
    console.log(newCategory, "newCategory");
    axios
    .post(url+"api/sub_category_add", newCategory)
    .then(res =>{
        if (res.status === 200) {
            toast(res.data.message, {
                position: toast.POSITION.TOP_CENTER,
            })
            $("#add-subcategory-modal")
        .hide();
         }
    }).catch();


    // this.props.addsubcategory(newCategory);



  };

  render() {
    const { selectedOption } = this.state.categoryName1;

    const { errors } = this.state;
    return (
      <div>
        <div
          className="modal fade"
          id="add-subcategory-modal"
          data-reset="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Category</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <form
                  noValidate
                  onSubmit={this.onsubCategoryAdd}
                  id="add-currency"
                >
                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="currencyName">Sub Category Name</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={this.onChange}
                        value={this.state.subcategoryName}
                        id="subcategoryName"
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
                      />
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
                  form="add-currency"
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Category
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
    addsubcategory: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps)(
  withRouter(SubcategoryAddModal)
);
