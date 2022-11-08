// import package
import jwt from "jsonwebtoken";

// import constant
import {
    SET_AUTHENTICATION,
    REMOVE_AUTHENTICATION
} from '../constant';

// import config
import config from '../config';
import { createSocketUser } from '../config/socketConnectivity';
import { removeAuthorization } from '../config/axios'
import { removeAuthToken } from '../lib/localStorage'

// import lib
import isEmpty from "../lib/isEmpty";

export const decodeJwt = (token, dispatch) => {
    try {
        if (!isEmpty(token)) {
            token = token.replace('Bearer ', '')
            const decoded = jwt.verify(token, config.secretOrKey);
            if (decoded) {
                createSocketUser(decoded._id)
                dispatch({
                    type: SET_AUTHENTICATION,
                    authData: {
                        isAuth: true,
                        userId: decoded._id,
                        uniqueId: decoded.uniqueId
                    }
                })
            }
        }
    } catch (err) {
        removeAuthToken()
        removeAuthorization()
        // history.push('/login')
        dispatch({
            type: REMOVE_AUTHENTICATION,
            authData: {
                isAuth: false,
            }
        })
    }
}

export const tokenVerify = (token) => {
    try {
        if (!isEmpty(token)) {
            token = token.replace('Bearer ', '')
            const decoded = jwt.verify(token, config.secretOrKey);
            if (decoded) {
                return true
            }
        }
        return false
    } catch (err) {
        return false
    }
}