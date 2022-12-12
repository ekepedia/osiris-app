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
import DateOfBirth from "../../components/onboarding/DateOfBirth";
import Gender from "../../components/onboarding/Gender";
import Race from "../../components/onboarding/Race";
import Role from "../../components/onboarding/Role";
import Priorities from "../../components/onboarding/Priorities";
import Industries from "../../components/onboarding/Industries";
import Passions from "../../components/onboarding/Passions";

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

const PAGES = {
    DOB: 1,
    GENDER: 2,
    RACE: 3,
    ROLE: 4,
    PRIORITIES: 5,
    INDUSTRIES: 6,
    PASSIONS: 7,
}

class Onboarding extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            current_page: PAGES.DOB
            // current_page: PAGES.INDUSTRIES
        };

        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    componentDidMount() {

    }

    handleNext() {
        const { current_page } = this.state;
        let new_page = PAGES.DOB;

        if (current_page === PAGES.DOB) {
            new_page = PAGES.GENDER;
        }

        if (current_page === PAGES.GENDER) {
            new_page = PAGES.RACE;
        }

        if (current_page === PAGES.RACE) {
            new_page = PAGES.ROLE;
        }

        if (current_page === PAGES.ROLE) {
            new_page = PAGES.PRIORITIES;
        }

        if (current_page === PAGES.PRIORITIES) {
            new_page = PAGES.INDUSTRIES;
        }

        if (current_page === PAGES.INDUSTRIES) {
            new_page = PAGES.PASSIONS;
        }

        if (current_page === PAGES.PASSIONS) {
            new_page = PAGES.PASSIONS;

            console.log("Onboarding is complete, redirecting to companies");
            window.location.pathname = `/companies`;
            return;
        }

        console.log("NEXT: Setting new_page =", new_page, "old_page=", current_page);
        this.setState({current_page: new_page})
    }

    handleBack() {
        const { current_page } = this.state;
        let new_page = PAGES.DOB;

        if (current_page === PAGES.DOB) {
            new_page = PAGES.DOB;
        }

        if (current_page === PAGES.GENDER) {
            new_page = PAGES.DOB;
        }

        if (current_page === PAGES.RACE) {
            new_page = PAGES.GENDER;
        }

        if (current_page === PAGES.ROLE) {
            new_page = PAGES.RACE;
        }

        if (current_page === PAGES.PRIORITIES) {
            new_page = PAGES.ROLE;
        }

        if (current_page === PAGES.INDUSTRIES) {
            new_page = PAGES.PRIORITIES;
        }

        if (current_page === PAGES.PASSIONS) {
            new_page = PAGES.INDUSTRIES;
        }

        console.log("BACK: Setting new_page =", new_page, "old_page=", current_page);
        this.setState({current_page: new_page})
    }

    render() {
        let { classes, client, match: { params } } = this.props;

        const { current_page } = this.state;

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
                                            <div>

                                                {current_page === PAGES.DOB ?
                                                    <DateOfBirth next={this.handleNext} back={this.handleBack}/>
                                                    : null}

                                                {current_page === PAGES.GENDER ?
                                                    <Gender next={this.handleNext} back={this.handleBack}/>
                                                    : null}

                                                {current_page === PAGES.RACE ?
                                                    <Race next={this.handleNext} back={this.handleBack}/>
                                                    : null}

                                                {current_page === PAGES.ROLE ?
                                                    <Role next={this.handleNext} back={this.handleBack}/>
                                                    : null}

                                                {current_page === PAGES.PRIORITIES ?
                                                    <Priorities next={this.handleNext} back={this.handleBack}/>
                                                    : null}

                                                {current_page === PAGES.INDUSTRIES ?
                                                    <Industries next={this.handleNext} back={this.handleBack}/>
                                                    : null}

                                                {current_page === PAGES.PASSIONS ?
                                                    <Passions next={this.handleNext} back={this.handleBack}/>
                                                    : null}

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

export default withApollo(withRouter(injectSheet(Styles)(Onboarding)));

