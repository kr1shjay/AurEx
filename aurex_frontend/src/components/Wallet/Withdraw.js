// import react
import React, { useState } from 'react';
import { MenuItem, Select } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

const Withdraw = (props) => {
    const { t, i18n } = useTranslation();

    // props
    const { assetData } = props

    // state
    const [bankData, setBankData] = useState([])

    return (
        

        </div>
    )
}

export default Withdraw;