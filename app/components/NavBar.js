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
    }
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
                    <Link to={"/"} style={{color: COMMON.COLORS.N900}}>
                        <img src={"/img/osiris-logo.png"} style={{height: "29px", marginTop: "9.5px"}}/>
                    </Link>
                </div>
                <div style={{flex: 1, textAlign: "right",}}>
                    <Link to={"/"}>
                        <div className={classes.linkStyle} style={{color: path === "/" ? COMMON.COLORS.B400 : null}}>
                            Home
                            {path === "/" && <div className={classes.selectedLink}/>}
                        </div>
                    </Link>
                    <Link to={"/jobs"}>
                        <div className={classes.linkStyle} style={{color: path === "/jobs" ? COMMON.COLORS.B400 : null}}>
                            Jobs
                            {path === "/jobs" && <div className={classes.selectedLink}/>}
                        </div>
                    </Link>
                    <Link to={"/companies"}>
                        <div className={classes.linkStyle} style={{color: path.indexOf("/companies") !== -1  ? COMMON.COLORS.B400 : null}}>
                            Companies
                            {path.indexOf("/companies") !== -1 && <div className={classes.selectedLink}/>}
                        </div>
                    </Link>
                    {user && user.user_id ? <Link to={"/saved-jobs/" + user.user_id }>
                        <div className={classes.linkStyle} style={{color: path === ("/saved-jobs/" + user.user_id) ? COMMON.COLORS.B400 : null}}>
                            <div>
                                <i className="fa-solid fa-briefcase" style={{marginRight: "5px"}}/>Saved Jobs
                                <span style={{fontSize: "0px", opacity: 0}}>.</span>
                            </div>
                            {path === "/saved-jobs/" + user.user_id && <div style={{bottom: 5}} className={classes.selectedLink}/>}
                        </div>
                    </Link> : <Link to={"/login"}>
                        <div className={classes.linkStyle} style={{color: path.indexOf("/login") !== -1  ? COMMON.COLORS.B400 : null}}>
                            Login
                            {path.indexOf("/login") !== -1 && <div className={classes.selectedLink}/>}
                        </div>
                    </Link>}
                    {user && user.user_id ? <Link to={"/login/"} onClick={() => {
                        AuthService.logoutUser()
                    }}>
                        <div className={classes.linkStyle}>
                            <div>
                                Logout
                            </div>
                        </div>
                    </Link> : <Link to={"/sign-up"}>
                        <div className={classes.linkStyle} style={{color: path.indexOf("/sign-up") !== -1  ? COMMON.COLORS.B400 : null}}>
                            Sign Up
                            {path.indexOf("/sign-up") !== -1 && <div className={classes.selectedLink}/>}
                        </div>
                    </Link>}
                </div>
                <div style={{flex: user && user.user_id ? "0 0 30px" : 0}}>
                    {user && user.user_id ? <Link to={"/edit/" + user.user_id}>
                        <div  className={classes.profileContainer}>
                            <div style={{border: `1px solid ${COMMON.COLORS.N0}`, borderRadius: "100%", height: "100%", width: "100%", overflow: "hidden"}}>
                                <CoverImageHolder url={user.profile_photo_url}/>
                            </div>
                        </div>
                    </Link> : null}

                </div>
            </div>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(NavBar)));

