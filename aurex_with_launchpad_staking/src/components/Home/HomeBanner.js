// import package
import React from 'react';
import { Button } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom'
import { NavLink } from 'react-router-dom';

const HomeBanner = () => {
    const { t, i18n } = useTranslation();
    const history = useHistory();

    return (
        <div className='banner_ad_wrapper'>
        </div>       
    )
}

export default HomeBanner;