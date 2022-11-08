import { tokenVerify } from '../actions/jsonWebToken';

const isLogin = () => {
    if (tokenVerify(localStorage.getItem('user_token'))) {
        return true;
    }
    return false;
}

export default isLogin;