// import package
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux'

const IconButton = (props) => {
    // props
    const { eventKey } = props;

    // redux
    const { supportBtn } = useSelector(state => state.iconBtn)

    return (
        <Fragment>
            {
                supportBtn != eventKey && <i className="fa fa-plus" aria-hidden="true" />
            }
            {
                supportBtn == eventKey && <i className="fa fa-minus" aria-hidden="true" />
            }
        </Fragment>
    )
}

export default IconButton;