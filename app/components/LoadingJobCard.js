import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../services/DataService';

import {COLOR_BORDER_GREY, COLOR_WHITE, COLOR_TEXT_GREY, COLOR_GREEN_LIGHT, COLOR_GREEN} from "../common/colors";
import {FONT_SUBHEADER_BOLD, FONT_FOOTNOTE} from "../common/fonts";
import {STYLE_BUTTON_FOOTNOTE, STYLE_BUTTON_FOOTNOTE_OUTLINE} from "../common/styles";

import COMMON from "../common/index";
import CoverImageHolder from "./CoverImageHolder";
import StandardBadge from "./StandardBadge";
import {mc} from "../common/helpers";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
        background: COMMON.COLORS.N0,
        overflow: "hidden",
        cursor: "pointer"
    },
    locationStyle: {
        ...STYLE_BUTTON_FOOTNOTE_OUTLINE,
        display: "inline-block",
        marginRight: "5px"
    },
    requirementsStyle: {
        ...FONT_FOOTNOTE,
        color: COLOR_TEXT_GREY
    },
    loadingBackground: {
        background: COMMON.COLORS.N200,
        borderRadius: "6px"
    }
};

class JobCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, job, selectedJobId, client, match: { params } } = this.props;

        job = job || {};

        let company = job.companies && job.companies.length ? job.companies[0] : {};
        let job_type = job.job_types && job.job_types.length ? job.job_types[0] : {};
        let industry = job.industries && job.industries.length ? job.industries[0].name : "";
        let qualification = job.qualifications && job.qualifications.length ? job.qualifications[0] : {};
        let responsibility = job.responsibilities && job.responsibilities.length ? job.responsibilities[0] : {};
        let degree_requirement = job.degree_requirements && job.degree_requirements.length ? job.degree_requirements[0] : {};

        return (<div className={classes.container} style={{background: selectedJobId === job.job_id ? COMMON.COLORS.N50 : null}}>
            <div style={{padding: "15px", border: `1px solid ${COMMON.COLORS.N300}`, borderRadius: "4px", overflow: "hidden"}}>
                <div style={{display: "flex", marginBottom: "7px"}}>

                    <div style={{flex: "0 0 38px", marginRight: "8px", height: "38px"}}>
                        <div style={{borderRadius: "4px", border: `1px solid ${COMMON.COLORS.N300}`, overflow: "hidden"}}>
                            <div style={{height: "100%", width: "100%"}} className={mc("animate-flicker", classes.loadingBackground)}/>
                        </div>
                    </div>

                    <div style={{flex: 1, overflow: "hidden"}}>
                        <div>
                            <div style={{height: "16px", width: "75px", marginBottom: "4px", marginTop: "4px"}} className={mc("animate-flicker", classes.loadingBackground)}/>
                            <div style={{height: "16px", width: "125px", marginBottom: "0"}} className={mc("animate-flicker", classes.loadingBackground)}/>

                        </div>

                    </div>
                </div>
                <div>
                    <div>
                        <div style={{marginBottom: "13px"}}>
                            <div style={{height: "20px", width: "53px", marginRight: "5px", display: "inline-block"}} className={mc("animate-flicker", classes.loadingBackground)}/>
                            <div style={{height: "20px", width: "53px", marginRight: "5px", display: "inline-block"}} className={mc("animate-flicker", classes.loadingBackground)}/>
                            <div style={{height: "20px", width: "53px", marginRight: "5px", display: "inline-block"}} className={mc("animate-flicker", classes.loadingBackground)}/>
                        </div>

                        <div style={{marginBottom: "0"}}>
                            <div style={{height: "20px", width: "80px", marginRight: "5px", display: "inline-block"}} className={mc("animate-flicker", classes.loadingBackground)}/>
                            <div style={{height: "20px", width: "80px", marginRight: "5px", display: "inline-block"}} className={mc("animate-flicker", classes.loadingBackground)}/>
                            <div style={{height: "20px", width: "80px", marginRight: "5px", display: "inline-block"}} className={mc("animate-flicker", classes.loadingBackground)}/>
                        </div>

                    </div>
                </div>
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(JobCard)));

