import React, { Component ,useState , useEffect} from "react";
import {useSelector} from 'react-redux'
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect} from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Link,NavLink } from "react-router-dom";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import { Scrollbars } from 'react-custom-scrollbars';
import store from '../../store'
//lib
import nav from './nav'
import isEmpty from '../../lib/isEmpty'

//action
import { SingleAdmin } from '../../actions/admin'


const initialFormValue = {
    'show' : (window.innerWidth > 991) ? true : false
 }
const Sidebar = (props) => {
    
    // state 
    const [ formValue, setFormValue ] = useState(initialFormValue);
    const [ type, setType ] = useState('down');
    const { show } = formValue;
    
    // redux-state
    let { restriction , role } = useSelector((state) => state.isRun);

    const onLogoutClick = (e) => {
        e.preventDefault();
        // this.props.logoutUser();
    };


    // componentDidMount() {
    //     window.addEventListener("resize", this.changestate);
    // }

    // componentWillUnmount() {
    //     window.removeEventListener("resize", this.changestate);
    // }

    const changestate = (e) => {
        setFormValue({ show: show ? false : true });
        document.getElementsByTagName('body')[0].classList.toggle("shrink_whole");
    }

    // const handleIcon = (type) =>{
    //     setType(type)
    //onClick={()=>handleIcon(type == 'down' ? 'up':'down')}
    // }


    return (
        <div>
            <button className="btn" onClick={changestate} id="menu-toggle"><FontAwesomeIcon icon={faList} /></button>
            { show ?
                <div className="border-right sidebar_whole" >

                    <div className="list-group list-group-flush">
                        <Scrollbars style={{ width: 250, height: "88.5vh" }}  renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}>
                                    <div>
                                      
                                      {
                                          
                                         nav && nav.length > 0 && nav.map((item,i) => {
                                            if(item.sidemenu){
                                                
                                                    let filterData = restriction && restriction.length > 0 && restriction.find(item => item == '/dashboard');
      
                                                     if(!filterData){
                                                      restriction && restriction.length > 0 && restriction.push('/dashboard')
                                                     }
                                                  if(
                                                      (role && role == 'superadmin') || 
                                                      (role && role == 'admin' && restriction && restriction.length > 0 && restriction.includes(item.path))
                                                  ){ 
                                                      
                                                      return(
                                                        <>
                                                        {
                                                            item && item.childItem  ?
                                                            <>
                                                                 <a href={item && item.href}  data-toggle="collapse" aria-expanded="false" class="list-group-item list-group-item-action flex-column align-items-start list_grp_active">
                                                             <div class="d-flex w-100 justyfy-content-start align-items-center">
                                                             <span class="menu-collapsed">{item && item.header}</span>
                                                                 {
                                                                     type == 'up' ?
                                                                     <>
             
                                                                 <span className='ml-auto' ><i class="fa fa-angle-up" aria-hidden="true"></i></span>
                                                                     </> :
                                                                 <span className='ml-auto' ><i class="fa fa-angle-down" aria-hidden="true"></i></span>
             
                                                                 }
                                                             </div>
                                                         </a>

                                                            {
                                                                item&&item.childItem.map((items) =>{ 
                                                                    if(items.sidemenu){
                                                                        return(
                                                                            <>
                                                             <div id={items && items.id} class="collapse sidebar-submenu">
                                                                 <NavLink to={items&&items.path } class="list-group-item list-group-item-action">
                                                                     <span class="menu-collapsed">{items &&items.name}</span>
                                                                 </NavLink>
                                                             </div>
                                                                            </>
                                                                        )
                                                                    }
                                                                })
                                                            }
                                                       </> :
                                                  <NavLink to={item.path} className="list-group-item list-group-item-action">{item.name}</NavLink>
                                    

                                                        }
                                                        </>
                                                      )
                                                   }
                                                   if(isEmpty(restriction)){
                                                 return(
                                                  <Link to={item.path} className="list-group-item list-group-item-action">{item.name}</Link>
                                                 )
                                                   }
                                                 
                                                }
                                         })
                                      }
                                        {/*<Link to="/dashboard" className="list-group-item list-group-item-action">Dashboard</Link>
                                        <Link to="/users" className="list-group-item list-group-item-action">Users</Link>
                                        <Link to="/Userbalance" className="list-group-item list-group-item-action">User Balance</Link>
                                        <Link to="/currency" className="list-group-item list-group-item-action">Currency</Link>
                                        <Link to="/Pairmanagement" className="list-group-item list-group-item-action">Spot Pair</Link>
                                        <Link to="/site-setting" className="list-group-item list-group-item-action">Site Setting</Link>
                                        <Link to="/faq-category" className="list-group-item list-group-item-action">FAQ Category</Link>
                                        <Link to="/faq" className="list-group-item list-group-item-action">FAQ</Link>
                                        <Link to="/support" className="list-group-item list-group-item-action">Support</Link>
                                        <Link to="/P2PPairmanagement" className="list-group-item list-group-item-action">P2p Trade Pair</Link>
                                        <Link to="/p2pdispute" className="list-group-item list-group-item-action">P2p Dispute Trade</Link>
                                        <Link to="/p2ptrade" className="list-group-item list-group-item-action"> P2p Trade</Link>
                                        <Link to="/adminrevenue" className="list-group-item list-group-item-action">P2p Admin Revenue</Link>
                                        <Link to="/emailtemplates" className="list-group-item list-group-item-action">Email Templates</Link>
                                        <Link to="/cms" className="list-group-item list-group-item-action">CMS Pages</Link>
                                        <Link to="/kyc" className="list-group-item list-group-item-action">KYC</Link>
                                        <Link to="/withdraw" className="list-group-item list-group-item-action">Withdraw List</Link>
                                        <Link to="/deposit" className="list-group-item list-group-item-action">Deposit List</Link>
                                        <Link to="/contactus" className="list-group-item list-group-item-action">Contact Us</Link>
                                        <Link to="/orderhistory" className="list-group-item list-group-item-action">Spot Order History</Link>
                                        <Link to="/tradehistory" className="list-group-item list-group-item-action">Spot Trade History</Link>
                                        <Link to="/priceCNVlist" className="list-group-item list-group-item-action">Price Conversion</Link>*/}
                                       

                                       
                                    </div>
                        </Scrollbars>

                    </div>

                </div> : ''}
        </div>
    );
}

export default Sidebar;



// class Sidebar extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             show: (window.innerWidth > 768) ? true : false,
//             record: ''
//         }
//     }
//     onLogoutClick = e => {
//         e.preventDefault();
//         this.props.logoutUser();
//     };

//     componentDidMount() {
//         window.addEventListener("resize", this.changestate);
//     }

//     componentWillUnmount() {
//         window.removeEventListener("resize", this.changestate);
//     }

//     changestate = e => {
//         this.setState({ show: (this.state.show) ? false : true });
//     }


//     FetchPath = async () => {
//         let token = localStorage.getItem('admin_token')
//         let { status, result } = await SingleAdmin(token)
//         if (status) {
//             if (!isEmpty(result)) {
//                 this.setState({ record: result.restriction })
//             }
//         }
//     }

//     componentDidMount() {
       

//         // this.FetchPath()
//     }

//     render() {
        
//         const { user } = this.props.auth.user;
        
//         return (
//             <div>
//                 <button className="btn" onClick={this.changestate} id="menu-toggle"><FontAwesomeIcon icon={faList} /></button>
//                 {this.state.show ?
//                     <div className="border-right" >

//                         <div className="list-group list-group-flush">
//                             <Scrollbars style={{ width: 250, height: "88.5vh" }} >

//                                 {
//                                     (this.props.auth.user.moderator == '1') ?
//                                         <div>
//                                             <Link to="/users" className="list-group-item list-group-item-action">Users</Link>
//                                             <Link to="/chat" className="list-group-item list-group-item-action">Chat</Link> */}
//                                         </div> :

//                                         <div>
//                                             {

//                                                 nav && nav.length > 0 && nav.map((item) => {
//                                                     if (item.sidemenu === true) {
//                                                         return <Link to={item.path} className="list-group-item list-group-item-action">{item.name}</Link>

//                                                     }
//                                                 })
//                                             }
//                                             {/* <Link to="/dashboard" className="list-group-item list-group-item-action">Dashboard</Link>
//                                             <Link to="/sub-admin" className="list-group-item list-group-item-action">Add Admin</Link>

//                                             <Link to="/users" className="list-group-item list-group-item-action">Users</Link>
//                                             <Link to="/kyc" className="list-group-item list-group-item-action">User KYC</Link>
//                                             <Link to="/currency" className="list-group-item list-group-item-action">Currency</Link>
//                                             <Link to="/Pairmanagement" className="list-group-item list-group-item-action">Spot Pair</Link>
//                                             <Link to="/perpetual" className="list-group-item list-group-item-action">Perpetual Pair</Link>

//                                             <Link to="/p2p-pair" className="list-group-item list-group-item-action">P2P Pair</Link>
//                                             <Link to="/p2p-order" className="list-group-item list-group-item-action"> P2p Trade</Link>
//                                             <Link to="/p2p-dispute" className="list-group-item list-group-item-action">P2p Dispute Trade</Link>


//                                             <Link to="/withdraw" className="list-group-item list-group-item-action">Withdraw List</Link>
//                                             <Link to="/deposit" className="list-group-item list-group-item-action">Deposit List</Link>

//                                             <Link to="/priceCNVlist" className="list-group-item list-group-item-action">Price Conversion</Link>
//                                             <Link to="/security" className="list-group-item list-group-item-action">Google 2FA</Link>



//                                             <Link to="/staking" className="list-group-item list-group-item-action">Staking</Link>
//                                             <Link to="/staking-History" className="list-group-item list-group-item-action">Staking History</Link>

//                                             <Link to="/emailtemplates" className="list-group-item list-group-item-action">Email Templates</Link>
//                                             <Link to="/cms" className="list-group-item list-group-item-action">CMS Pages</Link>
//                                             <Link to="/faq-category" className="list-group-item list-group-item-action">FAQ Category</Link>
//                                             <Link to="/faq" className="list-group-item list-group-item-action">FAQ</Link>
//                                             <Link to="/support-category" className="list-group-item list-group-item-action">Support Category</Link>
//                                             <Link to="/support" className="list-group-item list-group-item-action">Support</Link>
//                                             <Link to="/site-setting" className="list-group-item list-group-item-action">Site Setting</Link>    */}

//                                             {/* <Link to="/chat" className="list-group-item list-group-item-action">Chat</Link> 



//                                             {/* <Link to="/Bonus" className="list-group-item list-group-item-action">Bonus</Link>

//                                             <Link to="/liquidated" className="list-group-item list-group-item-action">Liquidated List</Link>
//                                             <Link to="/contactus" className="list-group-item list-group-item-action">Contact Us</Link>
//                                             <Link to="/newsletter" className="list-group-item list-group-item-action">Newsletter</Link>
//                                             <Link to="/anouncement" className="list-group-item list-group-item-action">Anouncement</Link> */}

//                                             {/* <Link to="/launchpad" className="list-group-item list-group-item-action">Launchpad</Link>
//                                             <Link to="/token-purchase" className="list-group-item list-group-item-action">Purchase Token History</Link>

//                                             <Link to="/language" className="list-group-item list-group-item-action">Language</Link> */}

//                                             {/* <Link to="/orderhistory" className="list-group-item list-group-item-action">'Spot Order History'</Link>
//                                             <Link to="/tradehistory" className="list-group-item list-group-item-action">Spot Trade History</Link>
//                                             <Link to="/perpetual-Trade-History" className="list-group-item list-group-item-action">perpetual Trade History</Link>
//                                             <Link to="/perpetual-Order-History" className="list-group-item list-group-item-action">perpetual Order History</Link> */}

//                                             {/* <Link to="/Tradingbot" className="list-group-item list-group-item-action">Trading bot</Link>
//                                             <Link to="/closedpositions" className="list-group-item list-group-item-action">Closed positions</Link>
//                                             <Link to="/feesettings" className="list-group-item list-group-item-action">Fee Settings</Link>
//                                             <Link to="/category" className="list-group-item list-group-item-action">Blog Category</Link>
//                                             <Link to="/article" className="list-group-item list-group-item-action">Blog Article</Link>
//                                             <Link to="/HelpCentreCategory" className="list-group-item list-group-item-action">HelpCentreCategory</Link>
//                                             <Link to="/subcategory" className="list-group-item list-group-item-action">Help Center Sub Category</Link>
//                                             <Link to="/HelpCentreArticle" className="list-group-item list-group-item-action">Help Center Article</Link>  */}

//                                         </div>
//                                 }
//                             </Scrollbars>

//                         </div>

//                     </div> : ''}
//             </div>
//         );
//     }
// }

// Sidebar.propTypes = {
//     logoutUser: PropTypes.func.isRequired,
//     auth: PropTypes.object.isRequired
// };

// const mapStateToProps = state => ({
//     auth: state.auth
// });

// export default connect(
//     mapStateToProps,
//     { logoutUser }
// )(Sidebar);


