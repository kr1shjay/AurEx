// import package
import React, { useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Hidden, Button, Menu, MenuItem } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TimeAgo } from "@n1ru4l/react-time-ago";
import SocketContext from "../Context/SocketContext";

// import action
import { logout } from "../../actions/users";
import { setTradeTheme, setTheme } from "../../actions/commonAction";
import {
  readNotification,
  FetchunReadNotice,
  noticePopup,
} from "../../actions/notificationAction";

//lib
import { momentFormat } from "../../lib/dateTimeHelper";
import isEmpty from "lib/isEmpty";

export default function HeaderLinks(props) {
  const dispatch = useDispatch();
  const socketContext = useContext(SocketContext);
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const { t, i18n } = useTranslation();

  // state
  const [anchorEl, setAnchorEl] = React.useState(null);

  // redux state
  const themeData = useSelector((state) => state.theme);
  const { isAuth } = useSelector((state) => state.auth);
  const { unread, isOpen } = useSelector((state) => state.notice);

  // function
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const readAllMsg = async () => {
    let { staus, message } = await readNotification();
    noticePopup(dispatch, false);
  };

  const closeBox = () => {
    noticePopup(dispatch, true);
  };

  useEffect(() => {
    socketContext.socket.on("notice", (result) => {
      FetchunReadNotice(dispatch, result);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (isOpen) {
        readAllMsg();
      }
    };
  }, [isOpen]);

  return (
    <div className="inner_page_menu">
      <div className="dashboard_login">
        <Hidden smDown>
          <ul className="list-iline">
            {isAuth && (
              <li>
                <Link to="/dashboard">{t("DASHBOARD")}</Link>
              </li>
            )}
            {
              <li>
                <Link to="/spot">{t("MARKET")}</Link>
              </li>
            }
            {isAuth && (
              <li>
                <Link to="/wallet">{t("WALLET")}</Link>
                {/* <Link to="/walletnew">Wallet</Link> */}
              </li>
            )}
            {isAuth && (
              <li>
                <Link to="/orders">{t("SPOT_ORDERS")}</Link>
                {/* <Link to="/walletnew">Wallet</Link> */}
              </li>
            )}
            {/*{
              isAuth && <li>
                <Link to="/staking-list">{t('STAKING')}</Link>
              </li>
            }*/}

            {isAuth && (
              <li>
                {unread && unread.length > 0 ? (
                  <span className="notify_count">
                    {unread && unread.length}
                  </span>
                ) : null}
                {isOpen == false ? (
                  <Button
                    class="btn btnNotification"
                    type="button"
                    data-toggle="collapse"
                    data-target="#notificationDropdown"
                    onClick={closeBox}
                    aria-expanded="false"
                    aria-controls="notificationDropdown"
                  >
                    <i className="fas fa-bell"></i>
                  </Button>
                ) : (
                  <Button
                    class="btn btnNotification"
                    type="button"
                    data-toggle="collapse"
                    data-target="#notificationDropdown"
                    aria-expanded="false"
                    onClick={readAllMsg}
                    aria-controls="notificationDropdown"
                  >
                    <i className="fas fa-bell"></i>
                  </Button>
                )}

                <div class="collapse" id="notificationDropdown">
                  <div className="notificationDropdown">
                    {!isEmpty(unread) && unread.length > 0 ? (
                      <>
                        <ul>
                          {unread &&
                            unread.length > 0 &&
                            unread.map((item) => {
                              return (
                                <li>
                                  <p>
                                    <TimeAgo date={new Date(item.createdAt)}>
                                      {({ value }) => value}
                                    </TimeAgo>
                                  </p>
                                  <h5>{item.description}</h5>
                                </li>
                              );
                            })}
                        </ul>
                      </>
                    ) : (
                      <>
                        <ul>
                          <li>
                            <h5>No more unread Notifications ...</h5>
                          </li>
                        </ul>
                      </>
                    )}

                    <p className="text-center pb-3 pt-2">
                      <Link to="/notification">All Notifications</Link>
                    </p>
                  </div>
                </div>
              </li>
            )}

            {isAuth && (
              <li className="li_ellipse_menu">
                <Button
                  aria-controls="profile_menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  {/* <i className="fas fa-user"></i> */}
                  <i class="fas fa-ellipsis-h"></i>
                </Button>
                <Menu
                  id="profile_menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem>
                    <Link to="/profile">Profile</Link>
                  </MenuItem>
                  {/* <MenuItem><Link to="/launchpad">Launchpad</Link></MenuItem> */}
                  {/* <MenuItem><Link to="/profile">KYC</Link></MenuItem> */}
                  <MenuItem>
                    <Link to="/security">Security</Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/setting">Settings</Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/support-ticket">Support</Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/referral">Referral</Link>
                  </MenuItem>
                  {/* <MenuItem><Link to="/notification">Notifications</Link></MenuItem> */}
                  <MenuItem>
                    <Link to="/history">History</Link>
                  </MenuItem>
                  {/* <MenuItem>
                    <Link to="/orders">Orders</Link>
                  </MenuItem> */}
                  {/* <MenuItem><Link to="/api-management">API Management</Link></MenuItem> */}
                  <MenuItem>
                    <Link to="#" onClick={() => logout(history, dispatch)}>
                      Logout
                    </Link>
                  </MenuItem>
                </Menu>
              </li>
            )}

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
          </ul>
        </Hidden>
        <Hidden only={["md", "lg", "xl"]}>
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

            <li>
              <Link to="/spot">Spot</Link>
            </li>
            {/*<li>
              <Link to="/derivative">Derivative</Link>
            </li>*/}

            {isAuth && (
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            )}
            {/*{
              isAuth && <li>
                <Link to="/p2p">P2P</Link>
              </li>
            }*/}
            {isAuth && (
              <li>
                <Link to="/wallet">Wallet</Link>
                {/* <Link to="/walletnew">Wallet</Link> */}
              </li>
            )}

            {/*{
              isAuth && <li>
                <Link to="/staking-list">Staking</Link>
              </li>
            }
            {
              isAuth && <li>
                <Link to="/launchpad">Launchpad</Link>
              </li>
            }*/}
            {isAuth && (
              <li>
                <Link to="/notification">Notifications</Link>
              </li>
            )}

            {isAuth && (
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            )}
            {/* {
              isAuth && <li>
                <Link to="/profile">KYC</Link>
              </li>
            } */}

            {isAuth && (
              <li>
                <Link to="/security">Security</Link>
              </li>
            )}

            {isAuth && (
              <li>
                <Link to="setting">Settings</Link>
              </li>
            )}

            {isAuth && (
              <li>
                <Link to="/support-ticket">Support</Link>
              </li>
            )}

            {isAuth && (
              <li>
                <Link to="/referral">Referral</Link>
              </li>
            )}

            {isAuth && (
              <li>
                <Link to="/history">History</Link>
              </li>
            )}

            {isAuth && (
              <li>
                <Link to="/orders">Orders</Link>
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
  );
}
