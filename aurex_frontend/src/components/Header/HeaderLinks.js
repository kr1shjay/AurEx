// import package
import React, { useState, useEffect } from "react";
import { Link, useHistory, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, Select, Hidden } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem } from "@material-ui/core";
import Profileicon from "../../assets/images/circle_card_section.png"

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

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // state
  const [langOption, setLangOption] = useState([])
  const [selLang, setSelLang] = useState('')

  // redux-state
  const { isAuth } = useSelector(state => state.auth);
  const language = useSelector(state => state.language);
  const themeData = useSelector(state => state.theme)


  // redux-state
  const accountData = useSelector(state => state.account);
  const { firstName, lastName, email, blockNo, address, state, city, postalCode, country } = accountData;

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
      <Hidden smDown>

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
            <ListItem className={classes.listItem}>
              <NavLink to="/spot" color="transparent" className="nav-link">{t('MARKET')}</NavLink>
            </ListItem>

          }

          {/* {
            <ListItem className={classes.listItem}>
              <NavLink to="/api-management" color="transparent" className="nav-link">API Key</NavLink>
            </ListItem>

          } */}
          {/* <ListItem className={classes.listItem}>
            <NavLink to="/launchpad" color="transparent" className="nav-link">Launchpad</NavLink>
          </ListItem> */}
          {/* <ListItem className={classes.listItem}>
            <NavLink to="/staking" color="transparent" className="nav-link">Staking</NavLink>
          </ListItem> */}
          {
            isAuth && <ListItem className={classes.listItem}>
              <NavLink to="/wallet" color="transparent" className="nav-link">Wallet</NavLink>
            </ListItem>
          }
          {
            isAuth && <ListItem className={classes.listItem}>
              <li className="li_ellipse_menu login_header1 ">
                <Button
                  aria-controls="profile_menu1"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  {/* <div className="d-flex prof_icon_header"> */}
                  {/* <div> */}
                  <img src={Profileicon} className="prof_icon_header" alt="profileicon" />
                  {/* </div> */}
                  {/* </div> */}

                  {/* <i className="fas fa-user"></i> */}
                  {/* <i class="fas fa-ellipsis-h"></i> */}
                </Button>
                <Menu
                  id="profile_menu1"
                  className="afterlogin_hr"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <NavLink to="/profile"><MenuItem className="px-2">
                    <div className="d-flex afterlogin_profile"><div><img src={Profileicon} alt="profileicon" /> </div><div><p className="mx-3 mb-0 first">{`${firstName} ${lastName}`}</p>
                      <p className="second mb-0 mx-3">{email}</p></div> </div>
                  </MenuItem></NavLink>
                  <NavLink to="/profile">
                    <MenuItem>
                      <i className="fa fa-user" aria-hidden="true"></i><span>Profile</span>
                    </MenuItem>
                  </NavLink>
                  <hr />

                  {/* <NavLink to="/launchpad"><MenuItem><i className="fa fa-rocket" aria-hidden="true"></i><span>Launchpad</span></MenuItem></NavLink>
                  <hr />
                  <NavLink to="/staking"><MenuItem><i class="fab fa-stack-exchange"></i><span>Staking</span></MenuItem></NavLink>
                  <hr /> */}
                  <NavLink to="/security"><MenuItem>
                    <i className="fa fa-lock" aria-hidden="true"></i><span>Security</span>
                  </MenuItem></NavLink>

                  <hr />
                  <NavLink to="/setting">
                    <MenuItem>
                      <i className="fa fa-cog" aria-hidden="true"></i><span>Settings</span>
                    </MenuItem>
                  </NavLink>
                  <hr />
                  {/* <NavLink to="/api-management">
                    <MenuItem>
                      <i className="fa fa-key" aria-hidden="true"></i><span>API Key</span>
                    </MenuItem>
                  </NavLink> */}
                  <hr />
                  <NavLink to="/orders">
                    <MenuItem>
                      <i className="fa fa-list" aria-hidden="true"></i><span>Orders</span>
                    </MenuItem>
                  </NavLink>
                  {/* <hr/> 
                  <MenuItem>
                    <Link to="/referral"><i className="fa fa-users" aria-hidden="true"></i><span>Referral</span></Link>
                  </MenuItem> */}
                  <hr />
                  {/* <MenuItem><Link to="/notification">Notifications</Link></MenuItem> */}
                  <NavLink to="/history"><MenuItem>
                    <i className="far fa-clock"></i><span>History</span>
                  </MenuItem>
                  </NavLink>
                  <hr />
                  <NavLink to="/support-ticket">
                    <MenuItem>
                      <i className="fa fa-question-circle" aria-hidden="true"></i><span>Support</span>
                    </MenuItem>
                  </NavLink>
                  {/* <MenuItem>
                    <Link to="/orders">Orders</Link>
                  </MenuItem> */}
                  {/* <MenuItem><Link to="/api-management">API Management</Link></MenuItem> */}
                  <Link to="#" onClick={() => logout(history, dispatch)}>
                    <MenuItem>

                      <i className="fas fa-sign-out-alt"></i> <span> Logout</span>

                    </MenuItem>
                  </Link>
                </Menu>
              </li>
            </ListItem>
          }
          {
            !isAuth && <ListItem className={classes.listItem}>
              <NavLink to="/login" color="transparent" className="nav-link home_menu_btn1">{t('LOGIN')}</NavLink>
            </ListItem>
          }

          {
            !isAuth && <ListItem className={classes.listItem}>
              <NavLink to="/register" color="transparent" className="nav-link home_menu_btn">{t('REGISTER')}</NavLink>
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
      </Hidden>
      <div className="inner_page_menu">
        <div className="dashboard_login login_header2">
          <Hidden only={["md", "lg", "xl"]}  >
            <ul className="list-iline">
              {/* {
             <li>
                <div className="toggleMode" title="toggle dark mode">
                  <label>
                    <input type="checkbox" checked={themeData == 'light' ? true : false} name="" onClick={() => setTheme(dispatch, themeData == 'light' ? 'dark' : 'light')} />
                    <span></span>
                  </label>
                </div>
              </li>
            } */}


              {/*<li>
              <Link to="/derivative">Derivative</Link>
            </li>*/}

              {isAuth && (
                <li>
                  <NavLink to="/wallet" color="transparent">Wallet</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/spot" color="transparent" >{t('MARKET')}</NavLink>
              </li>
              {/* <li>
                <NavLink to="/api-management" color="transparent" >API Key</NavLink>
              </li> */}
              {!isAuth && (
                <li>
                  <NavLink to="/login" color="transparent" className="nav-link home_menu_btn1">{t('LOGIN')}</NavLink>
                </li>
              )}
              {!isAuth && (
                <li>
                  <NavLink to="/register" color="transparent" className="nav-link home_menu_btn">{t('REGISTER')}</NavLink>
                </li>
              )}















              {isAuth && (
                <li>
                  <NavLink to="/profile">Profile</NavLink>
                </li>
              )}
              {/* {
                isAuth && <li>
                  <NavLink to="/launchpad">Launchpad</NavLink>
                </li>
              }
              {
                isAuth &&
                <li>
                  <NavLink to="/staking">Staking</NavLink>
                </li>
              } */}

              {/* {
              isAuth && <li>
                <Link to="/profile">KYC</Link>
              </li>
            } */}

              {isAuth && (
                <li>
                  <NavLink to="/security">Security</NavLink>
                </li>
              )}

              {isAuth && (
                <li>
                  <NavLink to="setting">Settings</NavLink>
                </li>
              )}

              {isAuth && (
                <li>
                  <NavLink to="/support-ticket">Support</NavLink>
                </li>
              )}

              {/* {isAuth && (
              <li>
                <NavLink to="/referral">Referral</NavLink>
              </li>
            )} */}

              {isAuth && (
                <li>
                  <NavLink to="/history">History</NavLink>
                </li>
              )}

              {isAuth && (
                <li>
                  <NavLink to="/orders">Orders</NavLink>
                </li>
              )}

              {/* {
              isAuth && <li>
                <Link to="/api-management">API Management</Link>
              </li>
            } */}

              {isAuth && (
                <li>
                  <Link to="#" onClick={() => logout(history, dispatch)}>
                    Logout
                  </Link>
                </li>
              )}
            </ul>
          </Hidden>
        </div>
      </div>
    </div>
  );
}

export default HeaderLinks;