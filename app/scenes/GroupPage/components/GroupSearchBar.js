import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import COMMON from "../../../common";
import EventService from "../../../services/EventService";
import AuthService from "../../../services/AuthService";
import TrackingService from "../../../services/TrackingService";
import CoverImageHolder from "../../../components/CoverImageHolder";
import {mc} from "../../../common/helpers";
import StandardInput from "../../../components/StandardInput";


const Styles = {
    groupSearchBarContainer: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
        width: "100%"
    },
    groupSearchBar: {
        display: "flex",
        width: "100%",
        marginBottom: "20px"
    },
    groupProfileContainer: {
        marginRight: "15px",
        height: "30px",
        width: "30px",
        borderRadius: "100%",
        border: `2px solid ${COMMON.COLORS.N900}`,
        overflow: "hidden",
        cursor: "pointer"
    },
    groupPostOptions: {
        height:"100%",
        width:"33%",
        cursor: "pointer",
        textAlign:"center"
    }
};

class GroupSearchBar extends React.Component {

    constructor(props) {
        super(props);

        let user = {};
        let userstring = localStorage.user;

        if (userstring && userstring !== "undefined") {
            user = JSON.parse(userstring)
        }

        this.state = {
            selected: true,
            newPostInSearchBar:null,
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

        const {
            newPostInSearchBar,
        } = this.state

        user = user || {};

        return (<div className={mc(classes.groupSearchBarContainer)} style={{width:"100%"}}>
                <div className={mc(classes.groupSearchBar)}>
                    <div style={{flex: user && user.user_id ? "0 0 30px" : 0}}>
                        {user && user.user_id ? <Link to={"/profile"} onClick={() => {
                            TrackingService.trackClick({page: "navbar", value: "profile"});
                        }}>
                            <div title="Profile" id="profile-link" className={classes.groupProfileContainer}>
                                <div style={{border: `1px solid ${COMMON.COLORS.N0}`, borderRadius: "100%", height: "100%", width: "100%", overflow: "hidden"}}>
                                    <CoverImageHolder url={user.profile_photo_url || "/img/generic-user.jpeg"}/>
                                </div>
                            </div>
                        </Link> : null}
                    </div>
                    <StandardInput style={{width: "100%"}} placeholder={"What's on your mind?"} value={this.state.newPostInSearchBar} update={(v) => {
                        this.setState({
                            companyNameFilter: v,
                        });
                        TrackingService.trackSubmit({page: "groups", sub_page: "new-post", value: v});
                    }}/>
                </div>
                <div className={classes.postOptions} style={{display:"flex", height: "20px", width: "100%"}}>
                    <div className={classes.groupPostOptions} onClick={() => {setSelectedState ? setSelectedState(1) : null}}>
                        <i className="fa-regular fa-pen-to-square" style={{marginRight: "5px"}}/>Post a Job
                    </div>
                    <div className={classes.groupPostOptions} onClick={() => {setSelectedState ? setSelectedState(2) : null}}>
                        <i className="fa-regular fa-pen-to-square" style={{marginRight: "5px"}}/>Ask a Question
                    </div>
                    <div className={classes.groupPostOptions} onClick={() => {setSelectedState ? setSelectedState(3) : null}}>
                        <i className="fa-light fa-microphone" style={{marginRight: "5px"}}/>Create Event
                    </div>
                </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(GroupSearchBar)));

