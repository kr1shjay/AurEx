import axios from "axios";
import {
    GET_ERRORS,
    TEMPLATE_ADD,
    TEMPLATE_UPDATE
} from "./types";
import keys from "./config";
const url = keys.baseUrl;
export const addTemplate = (templateData) => dispatch => {
    axios
        .post(url+"api/template-add", templateData)
        .then(res =>
            dispatch({
                type: TEMPLATE_ADD,
                payload: res,
            })
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};


export const updateTemplate = (templateData) => dispatch => {
    axios
        .post(url+"api/template-update", templateData)
        .then(res =>
            dispatch({
                type: TEMPLATE_UPDATE,
                payload: res,
            })
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};
