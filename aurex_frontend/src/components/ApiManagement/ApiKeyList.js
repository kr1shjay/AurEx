// import package
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import clsx from 'classnames'
import { useTranslation } from 'react-i18next';
// import component
import CustromBtn from './CustromBtn';

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
            <h5 class="dash_subtitle mt-3">{t('YOUR_API_KEY')}</h5>
            <div className="table-responsive">
                <table className="table">
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
                            loader && <tr><td colSpan={7}>{t('LOADING')}</td></tr>
                        }

                        {
                            !loader && record && record.length > 0 && record.map((item, key) => {
                                return (
                                    <tr>
                                        <td><i className={clsx({ "fas fa-check text-success": item.status == 'active' }, { "fas fa-times text-red": item.status == 'deactive' })}></i></td>

                                        <td>{item.name}</td>
                                        <td>{item._id}</td>
                                        <td>{item.ipRestriction == true ? item.ipList.join(',') : '0.0.0.0'}</td>
                                        <td>{item.createdAt}</td>
                                        <td><span className="bgHighlight mr-2 py-1 px-2">{t('READ')}</span></td>
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
                            !loader && record && record.length == 0 && <tr><td colSpan={7}>{t('NO_RECORD')}</td></tr>
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
})

export default ApiKeyList;