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

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    ...COMMON.STYLES.GENERAL.InputStyles,
    headerTitle: {
        ...COMMON.FONTS.FONT_TITLE_2_BOLD,
        marginBottom: "20px",
        textAlign: "center",
        color: COMMON.COLORS.OSIRIS_GREEN
    },
    subContainer: {
        maxWidth: "330px",
        margin: "auto",
        marginTop: "calc(50vh - 182px)"
    },
    buttonContainer: {
        marginTop: "20px"
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

};

class ResetPassword extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user_email: ""
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
                    alert("We've sent an email to this account. Please click the link to reset your password");
                    // window.location.pathname = `/login`;
                    this.setState({
                        user_email: ""
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

                        <div className={mc(classes.subContainer)}>
                            <div className={mc(classes.headerTitle)}>Forgot Password</div>

                            <div className={mc(classes.inputLabel)}>Email</div>
                            <StandardInput value={user_email} placeholder={"Input Email"} update={(v) => (this.setState({user_email: v}))}/>

                            <div className={mc(classes.buttonContainer)}>
                                <StandardButton label={"Send Reset Password Link"} fullWidth={true} onClick={() => (this.forgot())}/>
                            </div>

                            <div className={mc(classes.disclaimer)}>
                                By continuing, you agree to OSIRIS’ <span className={classes.disclaimerBold}>Terms of Service, User Agreement, and Privacy Policy</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(ResetPassword)));

