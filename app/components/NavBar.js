import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../services/DataService';
import AuthService from '../services/AuthService';
import EventService from '../services/EventService';

import {
    COLOR_BLACK,
    COLOR_BORDER_GREY,
    COLOR_GOLD,
    COLOR_GREEN,
    COLOR_WHITE,
    N900,
    OSIRIS_GREEN
} from "../common/colors";

import COMMON from "../common/index";

import {FONT_BODY_BOLD, FONT_SUBHEADER_BOLD, FONT_TITLE_2_BOLD, H300} from "../common/fonts";
import UserService from "../services/UserService";
import CoverImageHolder from "./CoverImageHolder";
import TrackingService from "../services/TrackingService";

const NAV_HEIGHT = 48;

const Styles = {
    container: {
        padding: "0px 50px",
        height: `${NAV_HEIGHT}px`,
        '@media (max-width: 768px)': {
            padding: "0 20px",
        },
        background: COLOR_WHITE
    },
    logoStyle: {
        ...FONT_TITLE_2_BOLD,
        color: COLOR_GREEN,
        lineHeight: `${NAV_HEIGHT}px`,
    },
    linkStyle: {
        ...H300,
        color: N900,
        lineHeight: `${NAV_HEIGHT}px`,
        position: "relative",
        width: "fit-content",
        marginLeft: "auto",
        cursor: "pointer",
        marginRight: "20px",
        display: "inline-block"
    },
    selectedLink: {
        position: "absolute",
        width: "100%",
        height: "4px",
        bottom: 0,
        background: COMMON.COLORS.B400,
        borderRadius: "2px 2px 0 0"
    },
    profileContainer: {
        marginTop: "9px",
        height: "30px",
        width: "30px",
        borderRadius: "100%",
        border: `2px solid ${COMMON.COLORS.N900}`,
        overflow: "hidden",
        cursor: "pointer"
    },
    ...COMMON.STYLES.GENERAL.MobileScalingStyles
};

class NavBar extends React.Component {

    constructor(props) {
        super(props);

        let user = {};
        let userstring = localStorage.user;

        if (userstring && userstring !== "undefined") {
            user = JSON.parse(userstring)
        }

        console.log("LOC", userstring, user)
        this.state = {
            selected: true,
            user
        };
    }

    componentDidMount() {
        this.loadUser();
        EventService.on(EventService.events.UPDATE_USER, () => {
            this.loadUser();
        })
    }

    loadUser() {
        let {  client, } = this.props;

        AuthService.getCurrentUser().then((user) => {
            this.setState({
                user: user || {}
            })
        })
    }

    render() {
        let { classes, client, match: { params } } = this.props;
        let { user } = this.state;

        user = user || {};
        let path = window.location.pathname || "";

        return (<div className={classes.container}>
            <div style={{display: "flex"}}>
                <div style={{flex: "0 0 100px"}} className={classes.logoStyle}>
                    <Link to={user && user.user_id ? "/companies" : "/"} style={{color: COMMON.COLORS.N900}} onClick={() => {
                        TrackingService.trackClick({page: "navbar", value: "logo"});
                    }}>
                        <img src={"/img/osiris-logo.png"} style={{height: "29px", marginTop: "9.5px"}}/>
                    </Link>
                </div>
                <div style={{flex: 1, textAlign: "right",}}>
                    <Link style={{display: "none"}} to={"/"} className={classes.hide600} onClick={() => {
                        TrackingService.trackClick({page: "navbar", value: "home"});
                    }}>
                        <div className={classes.linkStyle} style={{color: path === "/" ? COMMON.COLORS.B400 : null}}>
                            Home
                            {path === "/" && <div className={classes.selectedLink}/>}
                        </div>
                    </Link>
                    {user && user.user_id ? <Link to={"/jobs"} onClick={() => {
                        TrackingService.trackClick({page: "navbar", value: "jobs"});
                    }}>
                        <div id="jobs-link" className={classes.linkStyle} style={{color: path === "/jobs" ? COMMON.COLORS.B400 : null}}>
                            Jobs
                            {path === "/jobs" && <div className={classes.selectedLink}/>}
                        </div>
                    </Link> : null}
                    {user && user.user_id ?<Link to={"/companies"} onClick={() => {
                        TrackingService.trackClick({page: "navbar", value: "companies"});
                    }}>
                        <div id="companies-link" className={classes.linkStyle} style={{color: path.indexOf("/companies") !== -1  ? COMMON.COLORS.B400 : null}}>
                            Companies
                            {path.indexOf("/companies") !== -1 && <div className={classes.selectedLink}/>}
                        </div>
                    </Link> : null}
                    {user && user.user_id ? <Link onClick={() => {
                        TrackingService.trackClick({page: "navbar", value: "saved-jobs"});
                    }} className={classes.hide500} to={"/saved-jobs/" + user.user_id }>
                        <div id="saved-jobs-link" className={classes.linkStyle} style={{color: path === ("/saved-jobs/" + user.user_id) ? COMMON.COLORS.B400 : null}}>
                            <div>
                                <i className="fa-solid fa-briefcase" style={{marginRight: "5px"}}/>Saved Jobs
                                <span style={{fontSize: "0px", opacity: 0}}>.</span>
                            </div>
                            {path === "/saved-jobs/" + user.user_id && <div style={{bottom: 5}} className={classes.selectedLink}/>}
                        </div>
                    </Link> : <Link to={"/login"} className={classes.hide450} onClick={() => {
                        TrackingService.trackClick({page: "navbar", value: "login"});
                    }}>
                        <div className={classes.linkStyle} style={{color: path.indexOf("/login") !== -1  ? COMMON.COLORS.B400 : null}}>
                            Sign In
                            {path.indexOf("/login") !== -1 && <div className={classes.selectedLink}/>}
                        </div>
                    </Link>}
                    {user && user.user_id ? <Link onClick={() => {
                        TrackingService.trackClick({page: "navbar", value: "settings"});
                    }} to={"/settings/" + user.user_id }>
                        <div className={classes.linkStyle} style={{marginRight: "5px", color: path === ("/settings/" + user.user_id) ? COMMON.COLORS.B400 : COMMON.COLORS.N900}}>
                            <div style={{height: "22px", width: "22px", background: "none", borderRadius: "100%"}}>
                            </div>
                            <div style={{height: "22px", width: "22px", background: COMMON.COLORS.N200, top: 7, paddingTop: "5px", paddingRight: "1px", position:"absolute", borderRadius: "100%"}}>
                                <i className="fa-solid fa-gear" style={{marginRight: "4px"}}/>
                            </div>
                            {path === "/settings/" + user.user_id && <div style={{bottom: -20}} className={classes.selectedLink}/>}
                        </div>
                    </Link> : null}
                    {user && user.user_id ? <Link to={"#"} onClick={() => {
                        let yes = confirm("Are you sure you want to log out?");
                        if (yes) {
                            TrackingService.trackClick({page: "navbar", value: "logout"});
                            TrackingService.trackSubmit({page: "navbar", sub_page: "logout", value: "logout"});
                            AuthService.logoutUser();
                            window.location.pathname = `/login`;
                        }
                    }}>
                        <div className={classes.linkStyle} style={{color: path === ("/logout/" + user.user_id) ? COMMON.COLORS.B400 : COMMON.COLORS.N900}}>
                            <div style={{height: "22px", width: "22px", background: "none", borderRadius: "100%"}}>
                            </div>
                            <div style={{height: "22px", width: "22px", background: COMMON.COLORS.N200, top: 7, paddingTop: "5px", paddingRight: "1px", position:"absolute", borderRadius: "100%"}}>
                                <i className="fa-solid fa-right-from-bracket" style={{marginRight: "4px"}}/>
                            </div>
                        </div>
                    </Link> : <Link to={"#"} onClick={() =>{
                        TrackingService.trackClick({page: "navbar", value: "sign-up"});
                        window.open("https://osiris-works.typeform.com/sign-up", "_blank");
                    }}>
                        <div className={classes.linkStyle} style={{color: path.indexOf("/sign-up") !== -1  ? COMMON.COLORS.B400 : null}}>
                            <span style={{background: COMMON.COLORS.B400, color: COMMON.COLORS.N0, padding: "8px 10px", borderRadius: "4px"}}>Request Invite</span>
                        </div>
                    </Link>}
                </div>
                <div style={{flex: user && user.user_id ? "0 0 30px" : 0}}>
                    {user && user.user_id ? <Link to={"/edit/" + user.user_id} onClick={() => {
                        TrackingService.trackClick({page: "navbar", value: "profile"});
                    }}>
                        <div id="profile-link" className={classes.profileContainer}>
                            <div style={{border: `1px solid ${COMMON.COLORS.N0}`, borderRadius: "100%", height: "100%", width: "100%", overflow: "hidden"}}>
                                <CoverImageHolder url={user.profile_photo_url || "/img/generic-user.jpeg"}/>
                            </div>
                        </div>
                    </Link> : null}

                </div>
            </div>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(NavBar)));

