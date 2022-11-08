
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
    GET_ERRORS,
    SET_CURRENT_USER,
    FORGOT,
    USER_LOADING
} from "./types";
import keys from "./config";

// import config
import axios from '../config/axios';

const url = keys.baseUrl;
export const registerUser = (userData, history) => dispatch => {
    axios
        .post(url + "api/user-add", userData)
        .then(res => history.push("/login"))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const loginUser = userData => dispatch => {
    axios.post("api/login", userData)
        .then(res => {
            const { token } = res.data;
            // localStorage.setItem("jwtToken", token);
            localStorage.setItem("adminJwtToken", token);
            setAuthToken(token);
            const decoded = jwt_decode(token);
            dispatch(setCurrentUser(decoded));
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.code
            })
        );
};
export const forgotUser = (forgotData, history) => dispatch => {
    axios
        .post(url + "api/forgot", forgotData)
        .then(res => history.push("/login"))
    // .catch(err =>
    //     dispatch({
    //         type: GET_ERRORS,
    //         payload: err.response.data
    //     })
    // );
};

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

export const logoutUser = () => dispatch => {
    localStorage.removeItem("admin_token");
    setAuthToken(false);
    dispatch(setCurrentUser({}));
};
