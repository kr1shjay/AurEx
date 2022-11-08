import React from 'react'
import ReactDatatable from '@ashvin27/react-datatable';
import { Modal } from "react-bootstrap";
import { kycList } from '../../actions/userActions'
import { momentFormat } from '../../lib/dateTimeHelper'
//lib
import isEmpty from '../../lib/isEmpty'


class KycModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            kycDetails: [],
        }

        this.columns = [
            {
                key: "status",
                text: "IdProofStatus",
                className: "email",
                align: "left",
                sortable: true,
                cell: (kycDetails) => {
                    return kycDetails && kycDetails.idProof && kycDetails.idProof.status
                }
            },
            {
                key: "status",
                text: "AddressProofStatus",
                className: "email",
                align: "left",
                sortable: true,
                cell: (kycDetails) => {
                    return kycDetails && kycDetails.addressProof && kycDetails.addressProof.status

                }
            },
            // {
            //     key: "amount",
            //     text: "Amount",
            //     className: "email",
            //     align: "left",
            //     sortable: true,
            //     cell: (kycDetails) => {
            //         if (kycDetails.amount === 0) {
            //             return 0
            //         }
            //         return kycDetails.amount
            //     }
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
            show_length_menu: false,
            show_filter: false,
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
            let { status, result } = await kycList(respData)
            if (status) {
                this.setState({ kycDetails: result })
            }
        }
    }

    handleClose = () => {
        const { onHide } = this.props;
        onHide();
    }

    render() {
        const { isShow, record } = this.props;
        let { kycDetails } = this.state
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
                        <h4 className="modal-title">Kyc</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <ReactDatatable className="table table-bordered table-striped user_management_table"
                            config={this.config}
                            records={kycDetails}
                            columns={this.columns}
                        />

                    </Modal.Body>
                </Modal>
            </div>

        )
    }
}

export default KycModal
