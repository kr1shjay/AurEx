import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch } from 'react-redux';

// import action
import { setTradeTheme, setTheme } from '../../actions/commonAction';

// import lib
import isLogin from '../../lib/isLogin';
import {
    getTheme as getThemeLocal,
    changeTheme as changeThemeLocal
} from '../../lib/localStorage';

const ConditionRoute = ({ component: Component, layout: Layout, auth, type, ...rest }) => {
    const dispatch = useDispatch();

    return (
  
        <Route
            {...rest}
            render={props => {
                console.log('default theme ', getThemeLocal())
                // if (['/spot/:tikerRoot?', '/derivative/:tikerRoot?'].includes(props.match.path)) {
                setTheme(dispatch, getThemeLocal())
                // } else {
                //     changeThemeLocal('light')
                // }


                if (type == 'auth' && isLogin() == true) {
                    return <Redirect to="/profile" />
                } else if (type == 'private' && isLogin() != true) {
                    return <Redirect to="/login" />
                }

                return <Component {...props} />
            }}
        />
    )

};

export default ConditionRoute;