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

const Styles = {
    container: {
        padding: "0",
        background: COMMON.COLORS.N0,
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    ...COMMON.STYLES.GENERAL.InputStyles,
    headerIcon: {
        height: "60px",
        width: "60px",
        marginBottom: "15px",
    },
    headerIconImg: {
        width: "100%",
    },
    headerTitle: {
        ...COMMON.FONTS.H600,
        marginBottom: "30px",
        textAlign: "left",
        color: COMMON.COLORS.N900
    },
    headerSubTitle: {
        ...COMMON.FONTS.H300,
        color: COMMON.COLORS.N700,
        marginBottom: "20px"
    },
    subContainer: {
        maxWidth: "330px",
        margin: "auto",
    },
    buttonContainer: {
        marginTop: "30px"
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

class ResetPassword extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user_email: "",
            sent: false
        };
    }

    componentDidMount() {

    }

    forgot() {
        let { match: { params } } = this.props;

        const { user_email } = this.state;

        if (!user_email)
            alert("Missing email!");

        axios.post("/api/forgot-password", {user_email }).then((data) => {

            if (data && data.data) {
                console.log("FORGOT PASSWORD", data.data);

                if (data.data.success) {
                    // alert("We've sent an email to this account. Please click the link to reset your password");
                    // window.location.pathname = `/login`;
                    this.setState({
                        user_email: "",
                        sent: true
                    });

                } else {
                    alert(data.data.error);
                }
            } else {
                alert("An error has occured while attempting to reset password");
            }

        })
    }

    render() {
        let { classes, client, match: { params } } = this.props;

        const { user_email, } = this.state;

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

                                            {this.state.sent ? <div>
                                                <div className={mc(classes.headerIcon)}>
                                                    <img className={mc(classes.headerIconImg)} src={"/img/email-icon.png"}/>
                                                </div>

                                                <div className={mc(classes.headerTitle)} style={{marginBottom: "0px"}}>Email Sent</div>
                                                <div className={mc(classes.headerSubTitle)}>Check your email and open the link we sent to continue</div>
                                            </div> : <div>
                                                <div className={mc(classes.headerIcon)}>
                                                    <img className={mc(classes.headerIconImg)} src={"/img/forgot-icon.png"}/>
                                                </div>

                                                <div className={mc(classes.headerTitle)}>Forgot Password</div>

                                                <div className={mc(classes.inputLabel)}>Email Address</div>
                                                <StandardInput value={user_email} placeholder={"Enter your email address..."} update={(v) => (this.setState({user_email: v}))}/>

                                                <div className={mc(classes.buttonContainer)}>
                                                    <StandardButton label={"Send reset link"} fullWidth={true} onClick={() => (this.forgot())}/>
                                                </div>

                                                <div style={{...COMMON.FONTS.P100, textAlign: "center", marginTop: "10px", color: COMMON.COLORS.N700}}>Don't have an account? <Link to={"/osiris-onboarding"}><span>Sign up for free</span></Link></div>


                                            </div>}

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

export default withApollo(withRouter(injectSheet(Styles)(ResetPassword)));

