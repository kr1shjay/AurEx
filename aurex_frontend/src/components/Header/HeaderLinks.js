// import package
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, Select, Hidden } from "@material-ui/core";
import { useTranslation } from 'react-i18next';

// import action
import { logout } from '../../actions/users';
import { setTradeTheme, setTheme } from '../../actions/commonAction'

// import lib
import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import isEmpty from "../../lib/isEmpty";
import { setLang, getLang } from '../../lib/localStorage';
import { upperCase } from '../../lib/stringCase'
const useStyles = makeStyles(styles);

const HeaderLinks = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  // state
  const [langOption, setLangOption] = useState([])
  const [selLang, setSelLang] = useState('')

  // redux-state
  const { isAuth } = useSelector(state => state.auth);
  const language = useSelector(state => state.language);
  const themeData = useSelector(state => state.theme)

  // function
  const handleLanguage = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setSelLang(value)
    setLang(value)
    i18n.changeLanguage(value);
  }

  useEffect(() => {
    if (!isEmpty(language)) {
      setLangOption(language);
      let lang = getLang();
      if (isEmpty(lang)) {
        let primaryData = language && language.length > 0 && language.find((el => el.isPrimary == true))
        if (primaryData) {
          setSelLang(primaryData.code)
          setLang(primaryData.code)
          i18n.changeLanguage(primaryData.code);
        }
      } else {
        setSelLang(lang)
      }
    }
  }, [language])

  return (
    <div className="home_page_menu">
      <Hidden lgUp>
        <div className="showOnlyforUsers">
          {/* <Link to="/spot">{t('SPOT')}</Link> */}
           {/* <Link to="/derivative">{t('DERIVATIVE')}</Link>
          <Link to="/p2p">{t('P2P')}</Link> */}
        </div>
      </Hidden>      

      <List className={classes.list + " menu_main_navbar"}>
        {/* <ListItem className={classes.listItem}>
          <Select
            name="language"
            value={selLang}
            onChange={handleLanguage}
          >
            {
              langOption && langOption.length > 0 && langOption.map((item, key) => {
                return (
                  <option key={key} value={item.code}>{upperCase(item.code)}</option>
                )
              })
            }
          </Select>
        </ListItem> */}

        {
          isAuth && <ListItem className={classes.listItem}>
            <Link to="/wallet" color="transparent" className="nav-link">Wallet</Link>
          </ListItem>
        }
         {
         <ListItem className={classes.listItem}>
          <Link to="/spot" color="transparent" className="nav-link">{t('MARKET')}</Link>
        </ListItem>
        }
        {
          isAuth && <ListItem className={classes.listItem}>
            <Link onClick={() => logout(history, dispatch)} color="transparent" className="nav-link home_menu_btn">{t('LOGOUT')}</Link>
          </ListItem>
        }
        {
          !isAuth && <ListItem className={classes.listItem}>
            <Link to="/login" color="transparent" className="nav-link home_menu_btn1">{t('LOGIN')}</Link>
          </ListItem>
        }

        {
          !isAuth && <ListItem className={classes.listItem}>
            <Link to="/register" color="transparent" className="nav-link home_menu_btn">{t('REGISTER')}</Link>
          </ListItem>
        }

      {/* <ListItem className={classes.listItem}>
        <div className="toggleMode" title="toggle dark mode">
          <label>
            <input type="checkbox" checked={themeData == 'light' ? true : false} name="" onClick={() => setTheme(dispatch, themeData == 'light' ? 'dark' : 'light')} />
            <span></span>
          </label>
        </div>
      </ListItem> */}

      </List>
    </div>
  );
}

export default HeaderLinks;