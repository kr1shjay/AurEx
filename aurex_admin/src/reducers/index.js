import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducer from "./errorReducers";

import authentication from './authentication';

export default combineReducers({
    isRun: authentication,
    auth: authReducer,
    errors: errorReducer,
});