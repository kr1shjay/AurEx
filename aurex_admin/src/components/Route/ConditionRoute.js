import React from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { useSelector } from 'react-redux'


// import lib
import isLogin from '../../lib/isLogin';

const ConditionRoute = ({ component: Component, layout: Layout, type, store, ...rest }) => {

    // redux-state
    const { role, restriction } = useSelector(state => state.isRun)

    // return (
    //     <Route
    //         {...rest}
    //         render={props => {
    //             if (type == 'auth' && isLogin() == true) {
    //                 return <Redirect to="/dashboard" />
    //             } else if (type == 'private' && isLogin() != true) {
    //                 return <Redirect to="/login" />
    //             }

    //             return <Component {...props} />
    //         }}
    //     />
    // )


    return (
        <Route
            {...rest}
            render={props => {

                if (type == 'auth' && isLogin() == true) {
                    return <Redirect to="/dashboard" />
                } else if (type == 'private' && isLogin() != true) {
                    return <Redirect to="/login" />
                }
                else if (role != 'superadmin') {
                    if ( restriction && restriction.length > 0) {
                        let restrictionData = props.match.path == "/dashboard" ? true :restriction.includes(props.match.path)
                        if (!restrictionData) {
                            return <Redirect to={'/dashboard'} />
                        }
                        return <Component {...props} />
                    }

                }

                return <Component {...props} />
            }}
        />
    )

};

export default ConditionRoute;