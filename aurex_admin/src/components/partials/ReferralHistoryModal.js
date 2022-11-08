import React from 'react'
import ReactDatatable from '@ashvin27/react-datatable';
import { Modal } from "react-bootstrap";
import { ReferenceHist } from '../../actions/userActions'
import { momentFormat } from '../../lib/dateTimeHelper'
//lib
import isEmpty from '../../lib/isEmpty'


class ReferralModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            refInfo: [],
        }

        this.columns = [
            // {
            //     key: "address",
            //     text: "Address",
            //     className: "date",
            //     align: "left",
            //     sortable: true,

            // },
            // {
            //     key: "destTag",
            //     text: "Tag ID",
            //     className: "date",
            //     align: "left",
            //     sortable: true,

            // },
            {
                key: "refEmail",
                text: "Email",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "date",
                text: "Date",
                className: "email",
                align: "left",
                sortable: true,
                cell: (refInfo) => {
                    return momentFormat(refInfo.date, 'YYYY-MM-DD HH:mm')
                }
            },
            {
                key: "amount",
                text: "Amount",
                className: "email",
                align: "left",
                sortable: true,
                cell: (refInfo) => {
                    if (refInfo.amount === 0) {
                        return 0
                    }
                    return refInfo.amount
                }
            }
        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "Perpetual",
            no_data_text: 'No Contracts found!',
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
            show_pagination: false,
            show_info: false,
        };

    }


    async componentWillReceiveProps(nextProps) {
        const { record } = nextProps;
        if (!isEmpty(record)) {
            let respData = {
                id: record._id
            }
            let { status, result } = await ReferenceHist(respData)
            if (status) {
                this.setState({ refInfo: result })
            }
        }
    }

    handleClose = () => {
        const { onHide } = this.props;
        onHide();
    }

    render() {
        const { isShow, record } = this.props;
        let { refInfo } = this.state
        return (
            <div>
                <Modal className='user_asset_modal_table'
                    show={isShow}
                    onHide={this.handleClose}
                    size="lg"
                    centered
                    scrollable={true}
                >
                    <Modal.Header closeButton>
                        <h4 className="modal-title">Referral Id:{record.userId}</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <ReactDatatable className="table table-bordered table-striped user_management_table"
                            config={this.config}
                            records={refInfo}
                            columns={this.columns}
                        />

                    </Modal.Body>
                </Modal>
            </div>

        )
    }
}

export default ReferralModal
