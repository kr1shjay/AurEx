/*eslint-disable*/
import React, { Fragment } from "react";
import PropTypes from "prop-types";

// import component
import BeforeLogin from './BeforeLogin';
import AfterLogin from './AfterLogin';

export default function Footer(props) {
  const { type } = props;

  return (
    <Fragment>
      {type == 'beforeLogin' && <BeforeLogin />}
      {type == 'afterLogin' && <AfterLogin />}
    </Fragment>
  )
}

Footer.propTypes = {
  type: PropTypes.string
};

Footer.defaultProps = {
  type: 'beforeLogin'
};
