// import package
import React from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const CodeVerification = (props) => {
    const { t, i18n } = useTranslation();
    // props
    const { show, onHide, onSubmit, onChange, formValue } = props;

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>{t('2FA_VERIFID')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="confirm_body">
                        <img
                            // src={require("../../assets/images/postconfirm.png")}
                            alt=""
                            className="img-fluid"
                        />
                        <div className="model_detail_text justify-content-center">
                            <div className="form-group pl-3 pr-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t('ENTER_CODE')}
                                    name="code"
                                    value={formValue.code}
                                    onChange={onChange}
                                />
                            </div>
                        </div>
                        <div className="new_confirm_pay_button mat_205">
                            <button className="button1 button2" onClick={onHide}>
                                {t('CANCEL')}
                            </button>
                            <button
                                className="button1"
                                onClick={onSubmit}
                            >
                                {t('RELEASE')}
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal.Dialog>
        </Modal>
    )
}

export default CodeVerification;