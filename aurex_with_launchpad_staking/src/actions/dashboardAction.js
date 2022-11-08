// import config
import axios,{  handleResp} from '../config/axios';

// import action
import { setUserSetting } from './users';

export const getRecentTransaction = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/recentTransaction`,
        });
        return {
            status: 'success',
            loading: false,
            result: respData.data.result,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
        }
    }
}

export const getLoginHistory = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/loginHistory`,
        });
        return {
            status: 'success',
            loading: false,
            result: respData.data.result,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
        }
    }
}
export const gettradeHistory = async (filter) => {
    try {
      let respData = await axios({
        method: "get",
        url: `/api/gettradehistory_dash`,
        params: filter,
      });
      return {
        status: "success",
        loading: false,
        result: respData.data.result,
        count: respData.data.count,
        reportData: respData.data.reportData,
      };
    } catch (err) {
        handleResp(err, 'error')
      return {
        status: "failed",
        loading: false,
      };
    }
  };
export const getNotificationHistory = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/notificationHistory`,
        });
        return {
            status: 'success',
            loading: false,
            result: respData.data.result,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
        }
    }
}

/** 
 * Get User Balance
*/
export const getDashBal = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/getDashBal`,
        });
        return {
            status: 'success',
            loading: false,
            result: respData.data.result,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
        }
    }
}

/** 
 * Update notification
*/
export const editNotif = async (data, dispatch) => {
    try {
        let respData = await axios({
            'method': 'put',
            'url': `/api/editNotif`,
            data
        });
        dispatch(setUserSetting(respData.data.result))
        console.log(respData.data.message,'respDatarespData')
        return {
            status: 'success',
            loading: false,
            message: respData.data.message,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return false
    }
}