import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { updatesubcategory } from "../../actions/category";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import $ from "jquery";
import { Editor } from "@tinymce/tinymce-react";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import axios from "axios";
import keys from "../../actions/config";
const url = keys.baseUrl;
class CategoryUpdateModal extends React.Component {
  constructor(props) {
    super(props);
    $("#update-subcategory-modal")
      .find(".text-danger")
      .hide();
    this.state = {
      categoryName: "",
      status: "",
      errors: {},
      categoryName1:"",
      subcategoryName:"",
      maincategoryId:"",
      categoryName2:""


    };
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.record) {
      if(nextProps.record.maincategoryId){
       var maincategoryId = {value:nextProps.record.maincategoryId._id,
        label:nextProps.record.maincategoryId.categoryName}
        this.setState({
          id: nextProps.record._id,
          categoryName:nextProps.record.maincategoryId._id,
          subcategoryName:nextProps.record.subcategoryName,
          maincategoryId: maincategoryId,
          hidden1: nextProps.record.categoryName,
          errors: ""
        });
       }
      // this.setState({
      //   id: nextProps.record._id,
      //   categoryName:nextProps.record.maincategoryId._id,
      //   subcategoryName:nextProps.record.subcategoryName,
      //   maincategoryId: maincategoryId,
      //   hidden1: nextProps.record.categoryName,
      //   errors: ""
      // });
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

  handleChange = selectedOption => {
    this.setState({ categoryName2: selectedOption.value });
     console.log(`Option selected:`, selectedOption );
  };

  componentDidMount() {
    console.log("call here");
    // this.setState({ errors: "" });
    this.getData();
  }


  getData() {
    axios
      .get(url + "api/helpcentrecategory")
      .then(subcategory => {
        console.log( "da in sub",subcategory.data);
        var categoryarray = [];
        subcategory.data.map((item, i) => {
          const name = item.categoryName;
          const value = item._id;
          const obj = { value: value, label: name };
          categoryarray.push(obj);
        });
        console.log(categoryarray,'categoryarray===');
        this.setState({ categoryName1: categoryarray, email_assigned: true });
      })
      .catch();
  }


  onsubCategoryUpdate = e => {
    e.preventDefault();
    $("#update-subcategory-modal")
      .find(".text-danger")
      .show();
    const newcategory = {
        _id: this.state.id,
        subcategoryName: this.state.subcategoryName,
        categoryName:this.state.categoryName2
    };
    axios
    .post(url+"api/sub_category_update", newcategory)
    .then(res =>{
        if (res.status === 200) {
            toast(res.data.message, {
                position: toast.POSITION.TOP_CENTER,
            })
         }
    }).catch();
    this.getData();

    // this.props.updatesubcategory(newcategory);
  };

  render() {
    const { errors, maincategoryId,selectedOption } = this.state;

    return (
      <div>
        <div className="modal fade" id="update-subcategory-modal">
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
                  onSubmit={this.onsubCategoryUpdate}
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
                      <label htmlFor="currencyName">Sub Category Name</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={this.onChange}
                        value={this.state.subcategoryName}
                        id="subcategoryName"
                        type="text"
                        // error={errors.currencyName}
                        className={classnames("form-control"
                        // , { invalid: errors.currencyName}
                        )}
                      />
                      <span className="text-danger">
                        {errors.currencyName}
                      </span>
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
                            label:maincategoryId.label,
                            value:maincategoryId.value
                          }}
                        onChange={this.handleChange}
                        options={this.state.categoryName1}
                        styles={this.styles} className="border_blue_select basic-multi-select"
                      />):("")}
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
                  Update SubCategory
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CategoryUpdateModal.propTypes = {
    updatesubcategory: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps)(
  withRouter(CategoryUpdateModal)
);
