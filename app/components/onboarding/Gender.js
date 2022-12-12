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

class Gender extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gender_id: null,
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
                    gender_id: user.gender_id,
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
        const { gender_id } = this.state;

        return (<div className={classes.container}>
            <div className={mc(classes.headerIcon)}>
                <img className={mc(classes.headerIconImg)} src={"/img/gender-icon.png"}/>
            </div>
            <div className={mc(classes.headerTitle)}>Gender</div>
            <div className={mc(classes.headerSubTitle)}>What is your gender?</div>

            <div>
                <div style={{display: "flex"}}>
                    <div style={{flex: 1, paddingRight: "5px"}}>
                        <StandardSelect placeholder={"Select your gender"} value={gender_id} options={COMMON.CONSTS.GENDERS} update={(value) => {
                            this.setState({gender_id: value});
                            AuthService.getCurrentUserId().then((user_id) => {
                                user_id = user_id + "";
                                UserService.editUser({client, user_id, gender_id: parseFloat(value)}).then(() => {});
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

export default withApollo(withRouter(injectSheet(Styles)(Gender)));

