import React from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateFaq } from "../../actions/faqActions";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';
import { Editor } from '@tinymce/tinymce-react';
import 'react-toastify/dist/ReactToastify.css';
class WithdrawShowModal extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            id: this.props.record._id,
            transferamount: this.props.record.transferamount,
            cryptoType: this.props.record.cryptoType,
            receiveraddress: this.props.record.receiveraddress,
            tagid: this.props.record.tagid,
        };
    }

    render() {
        return (
            <div>
                <div className="modal fade" id="show-withdraw-modal">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Withdraw Details</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="name">To Address</label>
                                </div>
                                <div className="col-md-9">
                                <span className="word_brak">{this.state.receiveraddress}</span>
                                </div>
                            </div>
                            {
                              (this.state.tagid!='')?
                              <div className="row mt-2">
                                  <div className="col-md-3">
                                      <label htmlFor="name">Tag id/Memo</label>
                                  </div>
                                  <div className="col-md-9">
                                  {this.state.tagid}
                                  </div>
                              </div>:''
                            }

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="update-faq"
                                    type="submit"
                                    className="btn btn-primary">
                                    Confirm Withdraw
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>

        )
    }
}

WithdrawShowModal.propTypes = {
    updateFaq: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { updateFaq }
)(withRouter(WithdrawShowModal));
