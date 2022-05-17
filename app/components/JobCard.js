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

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
        background: COLOR_WHITE,
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
        let qualification = job.qualifications && job.qualifications.length ? job.qualifications[0] : {};
        let responsibility = job.responsibilities && job.responsibilities.length ? job.responsibilities[0] : {};
        let degree_requirement = job.degree_requirements && job.degree_requirements.length ? job.degree_requirements[0] : {};

        return (<div className={classes.container} style={{background: selectedJobId === job.job_id ? COLOR_GREEN_LIGHT: null}}>
            <div style={{padding: "15px", border: `1px solid ${selectedJobId === job.job_id ? COLOR_GREEN : COLOR_BORDER_GREY}`, borderRadius: "6px", overflow: "hidden"}}>
                <div style={{display: "flex"}}>
                    <div style={{flex: "0 0 45px", paddingRight: "15px"}}>
                        <div style={{borderRadius: "4px", border: `1px solid ${COLOR_BORDER_GREY}`, overflow: "hidden"}}>
                            <img
                                width={"100%"}
                                src={company.company_logo}
                            />
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{marginBottom: "10px"}}>
                            <div style={{marginBottom: "2px", ...FONT_SUBHEADER_BOLD}}>{job.job_title}</div>
                            <div style={{color: COLOR_TEXT_GREY, ...FONT_FOOTNOTE}}>{company.company_name} • {job.date_created_label}</div>
                        </div>
                        <div style={{marginBottom: "15px", ...FONT_FOOTNOTE}}>
                            {(job.locations && job.locations.length) && (job.locations.slice(0,2)).map((location) =>{
                                return (<div key={location.location_id} className={classes.locationStyle}>{location.label}</div>)
                            })}
                            {(job.locations && job.locations.length > 2) && <div style={{display: "inline-block"}}>{`+${job.locations.length - 2}`}</div>}
                        </div>
                        <div>
                            <div style={{display: "inline-block", marginRight: "10px"}}>
                                <div style={{display: "flex"}} className={classes.requirementsStyle}>
                                    <div style={{flex: "0 0 15px", paddingRight: "5px"}}>
                                        <i style={{lineHeight: "17px"}} className="fa-solid fa-briefcase"/>
                                    </div>
                                    <div style={{flex: 1}}>
                                        {job_type.name}
                                    </div>
                                </div>
                            </div>
                            <div style={{display: "inline-block"}}>
                                <div style={{display: "flex"}} className={classes.requirementsStyle}>
                                    <div style={{flex: "0 0 15px", paddingRight: "5px"}}>
                                        <i style={{lineHeight: "17px"}} className="fa-solid fa-inbox"/>
                                    </div>
                                    <div style={{flex: 1}}>
                                        {degree_requirement.name}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(JobCard)));

