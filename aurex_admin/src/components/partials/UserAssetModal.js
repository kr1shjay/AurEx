import React from 'react'
import ReactDatatable from '@ashvin27/react-datatable';
import { Modal } from "react-bootstrap";

class UserAssetModal extends React.Component {
    constructor(props) {
        super();

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
                key: "coin",
                text: "Coin",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "spotBal",
                text: "Spot Balance",
                className: "email",
                align: "left",
                sortable: true
            },
            // {
            //     key: "derivativeBal",
            //     text: "Derivative Balance",
            //     className: "email",
            //     align: "left",
            //     sortable: true
            // },
            // {
            //     key: "p2pBal",
            //     text: "p2p Balance",
            //     className: "email",
            //     align: "left",
            //     sortable: true
            // }
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
            show_length_menu: true,
            show_filter: true,
            show_pagination: true,
            show_info: true,
        };

    }

    componentWillReceiveProps(nextProps) {
        const { record } = nextProps;
        if (record) {
            this.setState({ formValue: record })
        }
    }

    handleClose = () => {
        const { onHide } = this.props;
        onHide();
    }

    render() {
        const { isShow, record } = this.props;
        console.log("🚀 ~ file: UserAssetModal.js ~ line 94 ~ UserAssetModal ~ render ~ record", record)

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
                        <h4 className="modal-title">User Asset Detail</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <ReactDatatable className="table table-bordered table-striped user_management_table"
                            config={this.config}
                            records={record}
                            columns={this.columns}
                        />

                    </Modal.Body>
                </Modal>
            </div>

        )
    }
}

export default UserAssetModal
