import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';
import COMMON from "../../common";
import {mc} from "../../common/helpers";
import NavBar from "../../components/NavBar";
import StandardInput from "../../components/StandardInput";
import StandardButton from "../../components/StandardButton";
import axios from "axios";
import AuthService from "../../services/AuthService";
import UserService from "../../services/UserService";

const Styles = {
    container: {
        padding: "0px",
        '@media (max-width: 768px)': {
            padding: "0",
        },
        background: COMMON.COLORS.N0
    },
    menuContainer: {
        display: "flex",
        height: "40px",
        lineHeight: "40px",
        padding: "0 8px",
        borderRadius: "4px",
        cursor: "pointer"
    },
    menuContainerSelected: {
        extend: 'menuContainer',
        background: COMMON.COLORS.N100
    },
    menuIcon: {
        flex: "0 0 16px",
        marginRight: "8px",
        fontSize: "16px",
        marginTop: "12px"
    },
    ...COMMON.STYLES.GENERAL.InputStyles,
    inputLabel: {
        ...COMMON.FONTS.H400,
        color: COMMON.COLORS.N900
    },
    inputSubLabel: {
        ...COMMON.FONTS.P100,
        color: COMMON.COLORS.N700
    },
    ...COMMON.STYLES.GENERAL.NavigationStyles,
};

class Settings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            old_password: "",
            new_password: "",
            new_password_confirm: "",
            page: 1
        };
    }

    componentDidMount() {
        this.loadUser();

    }

    reset_password(){
        let { match: { params } } = this.props;

        const { old_password, new_password, new_password_confirm  } = this.state;

        if (!old_password || !new_password || !new_password_confirm)
            alert("Missing fields");

        if (new_password !== new_password_confirm)
            alert("Passwords do not match");

        axios.post("/api/reset-password", {user_id: params.user_id, old_password, new_password}).then((data) => {

            if (data && data.data) {
                console.log("RESET PASSWORD", data.data);

                if (data.data.success) {
                    alert("Password successfully changed");
                    this.setState({
                        new_password: "",
                        new_password_confirm: "",
                        old_password: ""
                    })
                } else {
                    alert(data.data.error);
                }
            } else {
                alert("An error has occured while attempting to login");
            }

        })
    }

    setPage(page) {
        this.setState({
            page
        })
    }

    loadUser() {
        let { client, match: { params } } = this.props;

        UserService.getUser({client, user_id: params.user_id}).then((user) => {
            console.log("loaded user,", user);
            user = user || {};
            this.setState({
                user,
                first_name: user.first_name,
                last_name: user.last_name,
                bio: user.bio,
                username: user.username,
                profile_photo_url: user.profile_photo_url,
                cover_photo_url: user.cover_photo_url,

                user_twitter_link: user.user_twitter_link,
                user_clubhouse_link: user.user_clubhouse_link,
                user_instagram_link: user.user_instagram_link,
                user_website_link: user.user_website_link,
                user_tiktok_link: user.user_tiktok_link,
                user_youtube_link: user.user_youtube_link,
                user_vimeo_link: user.user_vimeo_link,
                user_main_contact_email: user.user_main_contact_email,
            })
        })
    }

    saveName() {
        let { client, match: { params } } = this.props;

        const user = this.state.user || {};
        const { user_id } = user;

        const {
            first_name,
            last_name,
        } = this.state;

        UserService.editUser({
            client,
            user_id,
            first_name,
            last_name,
        }).then((success) => {
            console.log("successfully updated user", success);
            alert("Saved!")
        });
    }

    render() {
        let { classes, client, match: { params } } = this.props;

        let { page, first_name, last_name, old_password, new_password, new_password_confirm } = this.state;

        return (<div className={classes.masterContainer}>
            <div className={classes.masterNavContainer}>
                <NavBar />
            </div>
            <div className={classes.masterBodyContainer}>
                <div className={classes.container}>


                    <div style={{display: "flex", height: "100%"}}>
                        <div style={{flex: "0 0 365px", padding: "50px", height: "100%", borderRight: `1px solid ${COMMON.COLORS.N400}`}}>
                            <div style={{...COMMON.FONTS.H600, color: COMMON.COLORS.N900, paddingBottom: "10px", borderBottom: `1px solid ${COMMON.COLORS.N400}`, marginBottom: "20px"}}>Settings</div>
                            <div>
                                <div className={page === 1 ? classes.menuContainerSelected : classes.menuContainer}
                                     onClick={() => {this.setPage(1)}}
                                >
                                    <div className={classes.menuIcon}>
                                        <i className="fa-solid fa-circle-user"/>
                                    </div>
                                    <div style={{flex: 1}}>My Details</div>
                                </div>
                                <div className={page === 2 ? classes.menuContainerSelected : classes.menuContainer}
                                     onClick={() => {this.setPage(2)}}
                                >
                                    <div className={classes.menuIcon}>
                                        <i className="fa-solid fa-key"/>
                                    </div>
                                    <div style={{flex: 1}}>Password</div>
                                </div>
                            </div>
                        </div>
                        <div style={{flex: 1, padding: "50px", height: "100%", overflow: "scroll"}}>

                            {page === 1 ? <div>
                                <div style={{...COMMON.FONTS.H700, color: COMMON.COLORS.N900}}>My Details</div>
                                <div style={{...COMMON.FONTS.P300, color: COMMON.COLORS.N700, marginBottom: "20px", paddingBottom: "20px", borderBottom: `1px solid ${COMMON.COLORS.N400}`}}>Edit your general profile settings</div>

                                <div style={{display: "flex", paddingBottom: "20px", marginBottom: "20px", borderBottom: `1px solid ${COMMON.COLORS.N400}`}}>
                                    <div style={{flex: "0 0 210px", marginRight: "50px"}}>
                                        <div className={mc(classes.inputLabel)}>Name</div>
                                        <div className={mc(classes.inputSubLabel)}>This will be displayed on your profile.</div>
                                    </div>
                                    <div style={{flex: 1, paddingTop: "8px"}}>
                                        <div style={{display: "flex"}}>
                                            <div style={{flex: "0 0 150px", marginRight: "10px"}}>
                                                <StandardInput value={first_name} update={(v) => (this.setState({first_name: v}))} placeholder={"First Name"} />
                                            </div>
                                            <div style={{flex: "0 0 150px"}}>
                                                <StandardInput value={last_name} update={(v) => (this.setState({last_name: v}))} placeholder={"Last Name"} />
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{flex: "0 0 58px", paddingTop: "8px"}}>
                                        <StandardButton label={"Save"} fullWidth={false} onClick={() => (this.saveName())}/>
                                    </div>
                                </div>

                            </div> : null}

                            {page === 2 ? <div>
                                <div style={{...COMMON.FONTS.H700, color: COMMON.COLORS.N900}}>Password</div>
                                <div style={{...COMMON.FONTS.P300, color: COMMON.COLORS.N700, marginBottom: "20px", paddingBottom: "20px", borderBottom: `1px solid ${COMMON.COLORS.N400}`}}>Please enter your current password to change your password.</div>

                                <div style={{display: "flex", paddingBottom: "20px", marginBottom: "20px", borderBottom: `1px solid ${COMMON.COLORS.N400}`}}>
                                    <div style={{flex: "0 0 300px"}}>
                                        <div className={mc(classes.inputLabel)}>Current Password</div>
                                    </div>
                                    <div style={{flex: 1}}>
                                        <StandardInput value={old_password} update={(v) => (this.setState({old_password: v}))} type="password" placeholder={"Current Password"} />
                                    </div>
                                </div>

                                <div style={{display: "flex", paddingBottom: "20px", marginBottom: "20px",}}>
                                    <div style={{flex: "0 0 300px"}}>
                                        <div className={mc(classes.inputLabel)}>New Password</div>
                                    </div>
                                    <div style={{flex: 1}}>
                                        <StandardInput subLabel="You new password must be more than 8 characters." value={new_password} update={(v) => (this.setState({new_password: v}))} type="password" placeholder={"New Password"} />
                                    </div>
                                </div>

                                <div style={{display: "flex", paddingBottom: "20px", marginBottom: "20px", borderBottom: `1px solid ${COMMON.COLORS.N400}`}}>
                                    <div style={{flex: "0 0 300px"}}>
                                        <div className={mc(classes.inputLabel)}>Confirm New Password</div>
                                    </div>
                                    <div style={{flex: 1}}>
                                        <StandardInput value={new_password_confirm} update={(v) => (this.setState({new_password_confirm: v}))} type="password" placeholder={"Confirm New Password"} />
                                    </div>
                                </div>

                                <div className={mc(classes.buttonContainer)}>
                                    <StandardButton label={"Update Password"} fullWidth={false} onClick={() => (this.reset_password())}/>
                                </div>
                            </div> : null}
                        </div>
                    </div>


                </div>
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(Settings)));

