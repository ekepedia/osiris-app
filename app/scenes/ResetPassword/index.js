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
            username: "",
            password: "",
            reset: false
        };
    }

    componentDidMount() {

    }

    reset() {
        let { match: { params } } = this.props;

        const { new_password_confirm, new_password } = this.state;

        if (!params.reset_password_code || !new_password || !new_password_confirm)
            alert("Missing fields");

        if (new_password !== new_password_confirm)
            alert("Passwords do not match");

        axios.post("/api/reset-password-by-code", {new_password: new_password, reset_password_code: params.reset_password_code }).then((data) => {

            if (data && data.data) {
                console.log("RESET PASSWORD", data.data);

                if (data.data.success) {
                    // let user_id = data.data.data.user_login.user_id;
                    // alert("Successfully updated password! Please login with the same password");
                    this.setState({
                        reset: true
                    })
                    // window.location.pathname = `/login`;
                    // AuthService.setCurrentUser({user_id})
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

        const { username, new_password, new_password_confirm } = this.state;

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

                                            {this.state.reset ? <div>
                                                <div className={mc(classes.headerIcon)}>
                                                    <img className={mc(classes.headerIconImg)} src={"/img/success-icon.png"}/>
                                                </div>

                                                <div className={mc(classes.headerTitle)} style={{marginBottom: "0px"}}>Password Reset</div>
                                                <div className={mc(classes.headerSubTitle)}>
                                                    <Link to={"/login"}>Login now →</Link>
                                                </div>
                                            </div> : <div>
                                                <div className={mc(classes.headerIcon)}>
                                                    <img className={mc(classes.headerIconImg)} src={"/img/reset-icon.png"}/>
                                                </div>

                                                <div className={mc(classes.headerTitle)}>Reset Password</div>

                                                <div className={mc(classes.inputLabel)}>Password</div>
                                                <StandardInput type="password" value={new_password} placeholder={"Input Password"} update={(v) => (this.setState({new_password: v}))}/>

                                                <div className={mc(classes.inputLabel)}>Confirm Password</div>
                                                <StandardInput type="password" value={new_password_confirm} placeholder={"Confirm Password"} update={(v) => (this.setState({new_password_confirm: v}))}/>

                                                <div className={mc(classes.buttonContainer)}>
                                                    <StandardButton label={"Reset Password"} fullWidth={true} onClick={() => (this.reset())}/>
                                                </div>
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

