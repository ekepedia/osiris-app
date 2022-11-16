import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import AuthService from '../../services/AuthService';
import COMMON from "../../common/index";
import axios from "axios";
import {mc} from "../../common/helpers";
import StandardInput from "../../components/StandardInput";
import StandardButton from "../../components/StandardButton";
import NavBar from "../../components/NavBar";
import SignOnHero from "../../components/SignOnHero";
import TrackingService from "../../services/TrackingService";

const Styles = {
    container: {
        padding: "0",
        background: COMMON.COLORS.N0,
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    ...COMMON.STYLES.GENERAL.InputStyles,
    headerTitle: {
        ...COMMON.FONTS.H600,
        marginBottom: "20px",
        textAlign: "center",
        color: COMMON.COLORS.N900
    },
    subContainer: {
        maxWidth: "330px",
        margin: "auto",
    },
    buttonContainer: {
        marginTop: "20px"
    },
    RHSContainer: {
        flex: 1,
        '@media (max-width: 750px)': {
            display: "none"
        },
    },
    disclaimer: {
        ...COMMON.FONTS.FONT_CAPTION_2,
        color: COMMON.COLORS.DARK_GREY,
        maxWidth: "241px",
        margin: "auto",
        marginTop: "20px",
        textAlign: "center"
    },
    disclaimerBold: {
        extend: "disclaimer",
        ...COMMON.FONTS.FONT_CAPTION_2_BOLD,
    },
    ...COMMON.STYLES.GENERAL.NavigationStyles,
    ...COMMON.STYLES.GENERAL.AlignmentStyles,

};

class SignUp extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            user_email: "",
            password: ""
        };
    }

    componentDidMount() {

    }

    signup() {
        const { first_name, last_name, user_email, password } = this.state;

        axios.post("/api/v2/sign-up", {user: {first_name, last_name}, user_email, password}).then((data) => {

            if (data && data.data) {
                console.log("SIGN UP", data.data);

                if (data.data.success) {
                    let user_id = data.data.data.user_id;
                    // window.location.pathname = `/edit/${user_id}`;
                    window.location.pathname = `/companies`;
                    AuthService.setCurrentUser({user_id});
                    TrackingService.trackSubmit({type: 4, page: "sign-up", value: user_email, user_id, custom: `${first_name} ${last_name}`});
                } else {
                    alert("That email is already taken!");
                }
            } else {
                alert("An error has occured while attempting to sign up");
            }

        })
    }

    render() {
        let { classes, client, match: { params } } = this.props;

        const { first_name, last_name, user_email, password } = this.state;

        return (
            <div className={classes.masterContainer}>
                <div className={classes.masterNavContainer}>
                    <NavBar />
                </div>
                <div className={classes.masterBodyContainer}>
                    <div className={classes.container}>
                        <div style={{display: "flex", height: "100%"}}>
                            <div style={{flex: 1, height: "100%"}}>
                                <div className={classes.centerAlignContainerFill}>
                                    <div className={classes.verticalAlignObjectFill}>
                                        <div className={mc(classes.subContainer)}>
                                            <div className={mc(classes.headerTitle)}>Welcome to OSIRIS</div>

                                            <div style={{display: "flex"}}>
                                                <div style={{flex: 1, paddingRight: "10px"}}>
                                                    <div className={mc(classes.inputLabel)}>First Name</div>
                                                    <StandardInput value={first_name} placeholder={"First Name"} update={(v) => (this.setState({first_name: v}))}/>
                                                </div>
                                                <div style={{flex: 1}}>
                                                    <div className={mc(classes.inputLabel)}>Last Name</div>
                                                    <StandardInput value={last_name} placeholder={"Last Name"} update={(v) => (this.setState({last_name: v}))}/>
                                                </div>
                                            </div>

                                            <div className={mc(classes.inputLabel)}>Email</div>
                                            <StandardInput value={user_email} placeholder={"Input Email"} update={(v) => (this.setState({user_email: v}))}/>

                                            <div className={mc(classes.inputLabel)}>Password</div>
                                            <StandardInput type="password" value={password} placeholder={"Input Password"} update={(v) => (this.setState({password: v}))}/>

                                            <div className={mc(classes.buttonContainer)}>
                                                <StandardButton label={"Sign Up"} fullWidth={true} onClick={() => (this.signup())}/>
                                            </div>

                                            <div className={mc(classes.disclaimer)}>
                                                By continuing, you agree to OSIRIS’ <span className={classes.disclaimerBold}>Terms of Service, User Agreement, and Privacy Policy</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={mc(classes.RHSContainer)}>
                                <SignOnHero />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(SignUp)));

