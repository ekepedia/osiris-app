import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';
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

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {

    }

    login() {
        const { username, password } = this.state;

        axios.post("/api/login", {username, password}).then((data) => {
            console.log("LOGIN", data.data);

            if (data.data.success) {
                window.location.pathname = `/edit/${data.data.data.user_login.user_id}`;
                localStorage.user_id = data.data.data.user_login.user_id;
            }
        })
    }

    render() {
        let { classes, client, match: { params } } = this.props;

        const { username, password } = this.state;

        return (
            <div className={classes.masterContainer}>
                <div className={classes.masterNavContainer}>
                    <NavBar />
                </div>
                <div className={classes.masterBodyContainer}>
                    <div className={classes.container}>

                        <div className={mc(classes.subContainer)}>
                            <div className={mc(classes.headerTitle)}>Welcome to OSIRIS</div>

                            <div className={mc(classes.inputLabel)}>Username</div>
                            <StandardInput value={username} placeholder={"Input Username"} update={(v) => (this.setState({username: v}))}/>

                            <div className={mc(classes.inputLabel)}>Password</div>
                            <StandardInput value={password} placeholder={"Input Password"} update={(v) => (this.setState({password: v}))}/>

                            <div className={mc(classes.buttonContainer)}>
                                <StandardButton label={"Sign in"} fullWidth={true} onClick={() => (this.login())}/>
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

export default withApollo(withRouter(injectSheet(Styles)(Login)));

