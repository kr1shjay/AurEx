import React from "react";
import keys from "../../actions/config";
import axios from "axios";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { addcategory } from "../../actions/category";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import $ from "jquery";
import { Editor } from "@tinymce/tinymce-react";
import "react-toastify/dist/ReactToastify.css";



const url = keys.baseUrl;

class CategoryAddModal extends React.Component {
  constructor() {
    super();
    this.state = {
      categoryName: "",
      status: "",
      errors: {}
    };
  }

  componentDidMount() {
    this.getData()
  };


getData() {
    axios
        .get(url+"api/category")
        .then(res => {
            console.log("Responmse category data",res)
            this.setState({ records: res.data})
        })
        .catch()
}


  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      $("#add-category-modal")
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
      $("#add-category-modal").modal("hide");
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

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onCategoryAdd = e => {
    e.preventDefault();
    const newCategory = {
      categoryName: this.state.categoryName
    };
    console.log(newCategory, "newCategory");
    // this.props.addcategory(newCategory);
    axios
    .post(url+"api/category-add", newCategory)
    .then(res =>{
        if (res.status === 200) {
          
            toast(res.data.message, {
                position: toast.POSITION.TOP_CENTER,
            })
            $("#add-category-modal").modal("hide");
            this.getData();

         }
    }).catch();
  
  };

  render() {
    const { errors } = this.state;
    return (
      <div>
        <div className="modal fade" id="add-category-modal" data-reset="true">
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
                  onSubmit={this.onCategoryAdd}
                  id="add-currency"
                >
                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="currencyName">Category Name</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={this.onChange}
                        value={this.state.categoryName}
                        id="categoryName"
                        type="text"
                        // error={errors.currencyName}
                        className={classnames("form-control", {
                          invalid: errors.currencyName
                        })}
                      />
                      {/* <span className="text-danger">{errors.currencyName}</span> */}
                    </div>
                  </div>
                  {/* <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="currencySymbol">currency Symbol</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.currencySymbol}
                                                error={errors.currencySymbol}
                                                id="currencySymbol"
                                                type="text"
                                                className={classnames("form-control", {
                                                    invalid: errors.currencySymbol
                                                })}
                                            />
                                            <span className="text-danger">{errors.currencySymbol}</span>
                                        </div>
                                    </div> */}
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

CategoryAddModal.propTypes = {
  addcategory: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps)(
  withRouter(CategoryAddModal)
);
