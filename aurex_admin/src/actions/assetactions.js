import axios from "axios";
import {
    GET_ERRORS,
    PERPETUAL_ADD,
    PERPETUAL_UPDATE
} from "./types";
import keys from "./config";
const url = keys.baseUrl;

export const addasset = (onAssetadd) => dispatch => {
    axios
        .post(url+"api/asset-add", onAssetadd)
        .then(res =>
            dispatch({
                type: PERPETUAL_ADD,
                payload: res,
            })
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};


export const updateasset = (onAssetUpdate) => dispatch => {
    axios
        .post(url+"api/asset-update", onAssetUpdate)
        .then(res =>
            dispatch({
                type: PERPETUAL_UPDATE,
                payload: res,
            })
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};
