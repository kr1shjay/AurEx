// import package
import React from 'react';
import PropTypes from "prop-types";

// import component
import GlobalLayout from './GlobalLayout';

const Layout = (props) => {
    const { layoutType } = props;

    return (
        <>
            {
                layoutType == 'global' && <GlobalLayout {...props} />
            }
        </>
    )
}

Layout.propTypes = {
    layoutType: PropTypes.string
};

Layout.defaultProps = {
    layoutType: "global",
};

export default Layout;