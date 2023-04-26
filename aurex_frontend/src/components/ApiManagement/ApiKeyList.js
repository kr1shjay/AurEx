// import package
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import clsx from 'classnames'
import { useTranslation } from 'react-i18next';
// import component
import CustromBtn from './CustromBtn';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { keyList } from '../../actions/apiMgmtAction'

const ApiKeyList = forwardRef((props, ref) => {
    const { t, i18n } = useTranslation();
    // status
    const [record, setRecord] = useState([])
    const [loader, setLoader] = useState(false)

    // function
    const fetchKey = async () => {
        try {
            setLoader(true)
            const { status, loading, result } = await keyList();
            setLoader(loading)
            if (status == 'success') {
                setRecord(result)
            }
        } catch (err) { }
    }

    useEffect(() => {
        fetchKey()
    }, [])

    const handleRefetch = (data) => {
        setRecord(data)
    }

    useImperativeHandle(
        ref,
        () => ({
            listData(data) {
                setRecord(data)
            }
        }),
    )

    return (
        <>

<div>
                <GridContainer>
                    <GridItem lg={12}>  
                    <div className="launchpadCoinName">
                                <h3 className='login_title_8'>{t('YOUR_API_KEY')}
                                {/* <small className='text_sm_white mb-0'>{data.coin}</small> */}
                                </h3>
                            </div>
                    </GridItem>
                </GridContainer>
            </div>
            <div className='dashHistoryTable mt-3'>
            <div className="table-responsive">
                <table className="table table_api_mif">
                    <thead>
                        <tr>
                            <th>{t('ENABLED')}</th>
                            <th>{t('NAME')}</th>
                            <th>{t('ID')}</th>
                            <th>{t('IP_ADDRESS')}</th>
                            <th>{t('CREATED')}</th>
                            <th>{t('PERMISSION')}</th>
                            <th>{t('ACTION')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loader && <tr><td colSpan={7} className='text-center'>{t('LOADING')}</td></tr>
                        }

                        {
                            !loader && record && record.length > 0 && record.map((item, key) => {
                                return (
                                    <tr>
                                        <td><i className={clsx({ "fas fa-check text-success": item.status == 'active' }, { "fas fa-times text-red": item.status == 'Inactive' })}></i></td>

                                        <td>{item.name}</td>
                                        <td>{item._id}</td>
                                        <td>{item.ipRestriction == true ? item.ipList.join(',') : '0.0.0.0'}</td>
                                        <td>{item.createdAt}</td>
                                        <td><span className="bgHighlight btn_read_gren">{t('READ')}</span></td>
                                        <td>
                                            <CustromBtn
                                                keyId={item.keyId}
                                                status={item.status}
                                                handleRefetch={handleRefetch}
                                            />
                                        </td>
                                    </tr>
                                )
                            })
                        }

                        {
                            !loader && record && record.length == 0 && <tr><td colSpan={7} className='text-center'>{t('NO_RECORD')}</td></tr>
                        }
                    </tbody>
                </table>
            </div>
            </div>
        </>
    )
})

export default ApiKeyList;