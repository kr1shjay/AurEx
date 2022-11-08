// import package
import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SocketContext from '../Context/SocketContext';
import { useHistory } from 'react-router-dom';

// import action
import { getBankDetail, getUserSetting, viewUserProfile ,logout} from '../../actions/users';
import { getPriceConversion, getANNC, getCurrency, getMedia } from '../../actions/commonAction';
import { getAssetData } from '../../actions/walletAction';
import { unReadNotice, FetchunReadNotice } from '../../actions/notificationAction';

const HelperRoute = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const socketContext = useContext(SocketContext);
    // redux-state
    const { isAuth } = useSelector(state => state.auth);
    const currencyOption = useSelector(state => state.currency)

    // function
    useEffect(() => {
        if (isAuth) {
            getUserSetting(dispatch)
            getBankDetail(dispatch)
            getAssetData(dispatch)
            viewUserProfile(dispatch)
            getPriceConversion(dispatch)
            getANNC(dispatch)
            unReadNotice(dispatch)
        }
    }, [isAuth])

    useEffect(() => {
        getMedia(dispatch)
        if (!(currencyOption && currencyOption.length > 0)) {
            getCurrency(dispatch);
        }

        socketContext.socket.on('notice', (result) => {
            FetchunReadNotice(dispatch, result)
        })

        socketContext.socket.on('FORCE_LOGOUT', (result) => {
            let token = localStorage.getItem('user_token');
            if(result && token != result){
                logout(history, dispatch)
            }
        })
    }, [])

    return <div />
}

export default HelperRoute;