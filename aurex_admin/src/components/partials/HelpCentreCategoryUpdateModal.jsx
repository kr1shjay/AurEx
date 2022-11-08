import React from 'react'
import keys from "../../actions/config";
import axios from "axios";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { categoryupdate } from "../../actions/category";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';
import { Editor } from '@tinymce/tinymce-react';
import 'react-toastify/dist/ReactToastify.css';
const url = keys.baseUrl;

class CategoryUpdateModal extends React.Component {
    constructor(props) {
        super(props);
         $("#update-category-modal").find(".text-danger").hide();
        this.state = {
            hidden1:this.props.record.categoryName,
            id: this.props.record._id,
            categoryName: this.props.record.categoryName,
            errors1: {},

        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.record) {
            this.setState({
                id: nextProps.record._id,
                categoryName: nextProps.record.categoryName,
                hidden1:nextProps.record.categoryName,
                errors1:''
            })
        }
       if (nextProps.errors) {
         $("#update-category-modal").find(".text-danger").show();
            this.setState({
                errors1: nextProps.errors
            });
        }
        else
        {
            this.setState({
                errors1: ''
            });
        }
       // console.log(nextProps)
        if (nextProps.auth !== undefined
            && nextProps.auth.currencyupdate !== undefined
            && nextProps.auth.currencyupdate.data !== undefined
            && nextProps.auth.currencyupdate.data.message !== undefined
            && nextProps.auth.currencyupdate.data.success) {
            $('#update-category-modal').modal('hide');
            toast(nextProps.auth.currencyupdate.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            nextProps.auth.currencyupdate = "";
            this.setState({
                errors1: ""
            });
        }
    }

    onChange = e => {
         $("#update-category-modal").find(".text-danger").show();
        if (e.target.id === 'currency-update-categoryName') {
            this.setState({ categoryName: e.target.value });
        }

    };
componentDidMount() {
    console.log('call here');
             this.setState({ errors1:'' });
        };
    onCategoryUpdate = e => {
        e.preventDefault();
         $("#update-category-modal").find(".text-danger").show();
        const newcategory = {
            _id: this.state.id,
            categoryName: this.state.categoryName,
            hidden: this.state.hidden,
            hidden1: this.state.hidden1
        };
        axios
        .post(url+"api/helpcentrecategory_update", newcategory)
        .then(res =>{
            if (res.status === 200) {
                toast(res.data.message, {
                    position: toast.POSITION.TOP_CENTER,
                })
             }
        }).catch();

        // this.props.categoryupdate(newcategory);
    };

    render() {
        const { errors1 } = this.state;
        return (
            <div>
                <div className="modal fade" id="update-category-modal">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Update Category</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onCategoryUpdate} id="update-category">
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.id}
                                        id="category-update-id"
                                        type="text"
                                        className="d-none"/>
                                        <input
                                        onChange={this.onChange}
                                        value={this.state.hidden}
                                        id="hidden"
                                        type="text"
                                         className="d-none"/>
                                          <input
                                        onChange={this.onChange}
                                        value={this.state.hidden1}
                                        id="hidden1"
                                        type="text"
                                         className="d-none"/>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="currencyName">Category Name</label>
                                        </div>
                                        <div className="col-md-9">
                                        <input
                                            onChange={this.onChange}
                                            value={this.state.categoryName}
                                            id="currency-update-categoryName"
                                            type="text"
                                            error={errors1.currencyName}
                                            className={classnames("form-control", {
                                                invalid: errors1.currencyName
                                            })}/>
                                            <span className="text-danger">{errors1.currencyName}</span>
                                        </div>
                                    </div>


                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="update-category"
                                    type="submit"
                                    className="btn btn-primary">
                                    Update Category
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>

        )
    }
}

CategoryUpdateModal.propTypes = {
    categoryupdate: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,

)(withRouter(CategoryUpdateModal));
