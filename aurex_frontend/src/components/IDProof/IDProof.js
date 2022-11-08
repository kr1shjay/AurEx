// import package
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import ProofForm from './ProofForm';

const IDProof = () => {
    const { t, i18n } = useTranslation();

    // redux-state
    const { idProof } = useSelector(state => state.userKyc);

    return (
        <>

            <div className="row align-items-center">
                <div className="col-lg-12">
                    <h3 className="dash_title mb-3">{t("IDENTITY_DOCUMENT")}</h3>
                </div>
            </div>
            <div className="">
                <div className="kycIdentityDocument pb-4">
                    <GridContainer>
                        {
                            idProof && ['new', 'rejected'].includes(idProof.status) && <>
                                <p className='px-3'>{t("IDENTITY_DOCUMENT_TITLE1")}</p>
                                <GridItem xs={12} sm={12} md={7} lg={7}>
                                    <div className="twoFAForm">
                                        <ProofForm />
                                    </div>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={5} lg={5}>
                                    <div className="settingsNote">
                                        <h6>{t("NOTES")}</h6>
                                        <ul className='flex_ul_li'>
                                            <li> <span className='pr-2'>-</span> {t("IDENTITY_DOCUMENT_DESCRIPTION1")}</li>
                                            <li> <span className='pr-2'>-</span> {t("IDENTITY_DOCUMENT_DESCRIPTION2")}</li>
                                            <li> <span className='pr-2'>-</span> {t("IDENTITY_DOCUMENT_DESCRIPTION3")}{/*  <a href="#">{t("HERE")}</a> */}</li>
                                        </ul>
                                    </div>
                                </GridItem>
                            </>
                        }

                        {
                            idProof && !['new', 'rejected'].includes(idProof.status) && <GridItem xs={12} sm={12} md={12} lg={12}>
                                <div className="verifiedDocument">
                                    <h3>{t("IDENTITY_DOCUMENT_VERIFIED")}</h3>
                                    <p>{t("IDENTITY_DOCUMENT_DESCRIPTION4")} <Link to="/support-ticket">{t("SUPPORT_TEAM")}</Link></p>
                                </div>
                            </GridItem>
                        }

                    </GridContainer>
                </div>
            </div>
        </>
    )
}

export default IDProof;