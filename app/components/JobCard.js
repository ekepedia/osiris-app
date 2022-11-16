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

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
        background: COMMON.COLORS.N0,
        overflow: "hidden",
        cursor: "pointer",
        borderRadius: "4px"
    },
    locationStyle: {
        ...STYLE_BUTTON_FOOTNOTE_OUTLINE,
        display: "inline-block",
        marginRight: "5px"
    },
    requirementsStyle: {
        ...FONT_FOOTNOTE,
        color: COLOR_TEXT_GREY
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
            <div style={{padding: "15px", border: `1px solid ${selectedJobId === job.job_id ? COMMON.COLORS.B400 : COMMON.COLORS.N300}`, borderRadius: "4px", overflow: "hidden"}}>
                <div style={{display: "flex", marginBottom: "7px"}}>

                    <div style={{flex: "0 0 38px", marginRight: "8px", height: "38px"}}>
                        <div style={{borderRadius: "4px", border: `1px solid ${COMMON.COLORS.N300}`, overflow: "hidden"}}>
                            <CoverImageHolder url={company.company_logo_url} />
                        </div>
                    </div>

                    <div style={{flex: 1, overflow: "hidden"}}>
                        <div>
                            <div style={{...COMMON.FONTS.H400, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>{job.job_title}</div>
                            <div style={{color: COMMON.COLORS.DARK_GREY, ...COMMON.FONTS.P100, marginTop: "-2px",}}>{company.company_name}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <div style={{marginBottom: "13px"}}>
                            {industry ? <StandardBadge label={industry}/> : null}
                            {company.company_industry ? <StandardBadge label={company.company_industry}/> : null}
                        </div>

                        <div style={{marginBottom: "0"}}>

                            {(job.locations && job.locations.length) && (job.locations.slice(0,1)).map((location) =>{
                                return (<StandardBadge iconLeft={true} icon={"fa-solid fa-location-dot"} style={{background: COMMON.COLORS.Y100, color: COMMON.COLORS.Y600}} key={location.location_id} label={location.label}/>)
                            })}

                            {(job.locations && job.locations.length > 1) && <div style={{display: "inline-block", ...COMMON.FONTS.H100, color: COMMON.COLORS.Y600 ,marginRight: "5px"}}>{`+${job.locations.length - 1}`}</div>}

                            <StandardBadge label={job_type.name} iconLeft={true} icon={"fa-sharp fa-solid fa-briefcase"}/>

                            {company.glassdoor_culture ? <StandardBadge label={`${company.glassdoor_culture} CULTURE`} tooltip={`Employees rate ${company.company_name} ${company.glassdoor_culture}/5 on<br/>Glassdoor for culture`} icon={"fa-solid fa-gavel"} iconLeft={true} style={{background: COMMON.COLORS.B200, color: COMMON.COLORS.B500}}/> : null}

                        </div>

                    </div>
                </div>
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(JobCard)));

