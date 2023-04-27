// import package
import React, { useState } from 'react';
import PropTypes from "prop-types";
import { useTranslation } from 'react-i18next';
// import action
import { changeStatus, removeKey } from '../../actions/apiMgmtAction'

// import lib
import { toastAlert } from '../../lib/toastAlert';
import { useDispatch} from 'react-redux';
import  apikey  from '../../reducers/apikey'
import { setEmpty } from 'actions/commonAction';


const CustromBtn = (props) => {
    // props
    const { keyId, status, handleRefetch } = props;
    const { t, i18n } = useTranslation();
    // status
    const [loader, setLoader] = useState(false)
    const [loading, setLoading] = useState('')
    const dispatch= useDispatch()
    
    // function
    const handleStatus = async (e) => {
        e.preventDefault();
        try {
            setLoader(true)
            setLoading('changeStatus')
            const { status, loading, message, result } = await changeStatus(keyId);
            setLoader(loading)
            setLoading('')
            if (status == 'success') {
                handleRefetch(result)
                toastAlert('success', message, 'changeSts')
            } else {
                toastAlert('error', message, 'changeSts')
            }
        } catch (err) { }
    }

    const handleRemove = async (e) => {
        e.preventDefault();
        try {
            setLoader(true)
            setLoading('remove')
            const { status, loading, message, result } = await removeKey(keyId);
            setLoader(loading)
            setLoading('')
            if (status == 'success') {
                handleRefetch(result)
                toastAlert('success', message, 'removeKey')
                dispatch(setEmpty({'delete':true}))
            } else {
                toastAlert('error', message, 'removeKey')
            }
        } catch (err) { }
    }

    return (
        <>
            <button
                className="btn btn-outline py-1 m-0 mr-2"
                disabled={loader}
                onClick={handleStatus}
            >{loading == 'changeStatus' && <i class="fas fa-spinner fa-spin"></i>} {status == 'active' ? 'Disable' : 'Enable'}
            </button>

            <button
                className="btn btn-red-delete py-1 m-0"
                disabled={loader}
                onClick={handleRemove}
            >{loading == 'remove' && <i class="fas fa-spinner fa-spin"></i>} {t('DELETE')}</button>

        </>
    )
}

CustromBtn.propTypes = {
    keyId: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    handleRefetch: PropTypes.func.isRequired
};

CustromBtn.defaultProps = {
    keyId: '',
    status: 'active'
};

export default CustromBtn;