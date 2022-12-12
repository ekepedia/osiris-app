import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';

import COMMON from "../../common/index";
import { mc } from "../../common/helpers";
import StandardButton from "../StandardButton";
import StandardSelect from "../StandardSelect";
import UserService from "../../services/UserService";
import AuthService from "../../services/AuthService";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    headerIcon: {
        height: "60px",
        width: "60px",
        marginBottom: "15px",
    },
    headerIconImg: {
        width: "100%",
    },
    headerTitle: {
        ...COMMON.FONTS.H500,
        color: COMMON.COLORS.N900
    },
    headerSubTitle: {
        ...COMMON.FONTS.H300,
        color: COMMON.COLORS.N700,
        marginBottom: "20px"
    },
    headerLabel: {
        extend: 'headerSubTitle',
        marginBottom: "5px"
    },
    buttonContainer: {
        marginTop: "20px"
    },
    backButton: {
        ...COMMON.FONTS.H300,
        color: COMMON.COLORS.N700,
        height: "32px",
        lineHeight: "32px",
        marginRight: "10px",
        display: "inline-block",
        cursor: "pointer"
    }
};

class DateOfBirth extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dob_month: null,
            dob_day: null,
            dob_year: null,
        };
    }

    componentDidMount() {
        this.syncWithAPI();
    }

    syncWithAPI() {
        const { client } = this.props;
        AuthService.getCurrentUserId().then((user_id) => {
            UserService.getUser({client, user_id}).then((user) => {
                console.log("Loaded from API", user);
                user = user || {};
                this.setState({
                    dob_month: user.dob_month,
                    dob_day: user.dob_day,
                    dob_year: user.dob_year,
                });
            })
        })

    }

    handleBack() {
        let { back } = this.props;
        back = back || (() => {});
        back();
    }

    handleNext() {
        let { next } = this.props;
        next = next || (() => {});
        next();
    }

    render() {
        let { classes, client, match: { params } } = this.props;
        const { dob_month, dob_day, dob_year } = this.state;

        return (<div className={classes.container}>
            <div className={mc(classes.headerIcon)}>
                <img className={mc(classes.headerIconImg)} src={"/img/dob-icon.png"}/>
            </div>
            <div className={mc(classes.headerTitle)}>Date of Birth</div>
            <div className={mc(classes.headerSubTitle)}>What is your date of birth?</div>

            <div>
                <div style={{display: "flex"}}>
                    <div style={{flex: 1, paddingRight: "5px"}}>
                        <div className={mc(classes.headerLabel)}>Month</div>
                        <StandardSelect placeholder={"Month"} value={dob_month} options={COMMON.CONSTS.MONTHS} update={(value) => {
                            this.setState({dob_month: value});
                            AuthService.getCurrentUserId().then((user_id) => {
                                user_id = user_id + "";
                                UserService.editUser({client, user_id, dob_month: parseFloat(value)}).then(() => {});
                            })
                        }}/>
                    </div>
                    <div style={{flex: 1, paddingRight: "5px"}}>
                        <div className={mc(classes.headerLabel)}>Day</div>
                        <StandardSelect placeholder={"Day"} value={dob_day} options={COMMON.CONSTS.DAYS} update={(value) => {
                            this.setState({dob_day: value});
                            AuthService.getCurrentUserId().then((user_id) => {
                                user_id = user_id + "";
                                UserService.editUser({client, user_id, dob_day: parseFloat(value)}).then(() => {});
                            })
                        }}/>
                    </div>
                    <div style={{flex: 1}}>
                        <div className={mc(classes.headerLabel)}>Year</div>
                        <StandardSelect placeholder={"Year"} value={dob_year} options={COMMON.CONSTS.YEARS} update={(value) => {
                            this.setState({dob_year: value});
                            AuthService.getCurrentUserId().then((user_id) => {
                                user_id = user_id + "";
                                UserService.editUser({client, user_id, dob_year: parseFloat(value)}).then(() => {});
                            })
                        }}/>
                    </div>
                </div>
            </div>

            <div>
                <div className={mc(classes.buttonContainer)}>
                    <div className={mc(classes.backButton)} onClick={() => (this.handleBack())}>Back</div>
                    <div style={{display: "inline-block"}}>
                        <StandardButton label={"Next"} fullWidth={false} onClick={() => (this.handleNext())}/>
                    </div>
                </div>
            </div>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(DateOfBirth)));

