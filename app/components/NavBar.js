import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../services/DataService';

import {COLOR_BLACK, COLOR_BORDER_GREY, COLOR_GOLD, COLOR_GREEN, COLOR_WHITE, OSIRIS_GREEN} from "../common/colors";
import {FONT_BODY_BOLD, FONT_SUBHEADER_BOLD, FONT_TITLE_2_BOLD} from "../common/fonts";
import UserService from "../services/UserService";
import CoverImageHolder from "./CoverImageHolder";

const NAV_HEIGHT = 60;

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
        ...FONT_SUBHEADER_BOLD,
        color: COLOR_BLACK,
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
        background: COLOR_GREEN,
        borderRadius: "2px 2px 0 0"
    },
    profileContainer: {
        marginTop: "12.5px",
        height: "40px",
        width: "40px",
        borderRadius: "100%",
        border: `2px solid ${OSIRIS_GREEN}`,
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
    }

    loadUser() {
        let {  client, } = this.props;
        let {  user } = this.state;

        if (!user || !user.user_id)
            return;

        UserService.getUser({client, user_id: user.user_id + ""}).then((user) => {
            console.log("NAV USER", user);
            localStorage.user = JSON.stringify(user);
            this.setState({
                user
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
                <div style={{flex: 1}} className={classes.logoStyle}>
                    <Link to={"/"} style={{color: COLOR_GREEN}}>
                        <img src={"/img/osiris-logo.png"} style={{height: "29px", marginTop: "15px"}}/>
                    </Link>
                </div>
                <div style={{flex: 1, textAlign: "right",}}>
                    <Link to={"/jobs"}>
                        <div className={classes.linkStyle} style={{color: this.state.selected ? COLOR_GREEN : null}}>
                            Jobs
                            {path === "/jobs" && <div className={classes.selectedLink}/>}
                        </div>
                    </Link>
                    <Link to={"/companies"}>
                        <div className={classes.linkStyle} style={{color: this.state.selected ? COLOR_GREEN : null}}>
                            Companies
                            {path === "/companies" && <div className={classes.selectedLink}/>}
                        </div>
                    </Link>
                    <Link to={"/saved-jobs/" + user.user_id }>
                        <div className={classes.linkStyle} style={{color: this.state.selected ? COLOR_GREEN : null}}>
                            <div>
                                <i className="fa-solid fa-briefcase"/>
                                <span style={{fontSize: "0px", opacity: 0}}>.</span>
                            </div>
                            {path === "/saved-jobs/" + user.user_id && <div style={{bottom: 5}} className={classes.selectedLink}/>}
                        </div>
                    </Link>
                    <Link to={"/login"} style={{display: "none"}}>
                        <div className={classes.linkStyle}>
                            Logout
                        </div>
                    </Link>
                </div>

                <div style={{flex: "0 0 40px"}}>
                    <Link to={"/edit/" + user.user_id}>
                        <div  className={classes.profileContainer}>
                            <div style={{border: `2px solid ${COLOR_WHITE}`, borderRadius: "100%", height: "100%", width: "100%", overflow: "hidden"}}>
                                <CoverImageHolder url={user.profile_photo_url}/>
                            </div>
                        </div>
                    </Link>
                </div>

            </div>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(NavBar)));

