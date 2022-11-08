import jwt_decode from "jwt-decode";

// import constant
import {
    SET_AUTHENTICATION
} from '../constant';

export const decodeJwt = (token, dispatch) => {
    if (token) {
        token = token.replace('Bearer ', '')
        const decoded = jwt_decode(token);
        if (decoded) {
            dispatch({
                type: SET_AUTHENTICATION,
                authData: {
                    isAuth: true,
                    userId: decoded._id,
                    restriction: decoded.restriction,
                    role: decoded.role,
                }
            })
        }
    }
}
