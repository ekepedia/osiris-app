import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../services/DataService';

import {COLOR_BORDER_GREY, COLOR_GREEN, COLOR_TEXT_GREY, COLOR_WHITE} from "../common/colors";

import {
    FONT_BODY_BOLD,
    FONT_FOOTNOTE,
    FONT_HEADLINE_BOLD, FONT_SUBHEADER,
    FONT_SUBHEADER_BOLD,
    FONT_TITLE_2_BOLD
} from "../common/fonts";

import {
    STYLE_BUTTON_FOOTNOTE,
    STYLE_BUTTON_FOOTNOTE_OUTLINE,
    STYLE_BUTTON_HEADLINE,
    STYLE_BUTTON_HEADLINE_OUTLINE,
    STYLE_BUTTON_SUBHEADER
} from "../common/styles";
import JobCard from "./JobCard";
import COMMON from "../common";
import StandardBadge from "./StandardBadge";

const Styles = {
    container: {
        padding: "50px",
        '@media (max-width: 768px)': {
            padding: "0",
            display: "none",
            height: "0px",
            overflow: "hidden"
        },
        marginBottom: "200px",
        border: `1px solid ${COLOR_BORDER_GREY}`,
        background: COLOR_WHITE,
        borderRadius: "6px"
    },
    actionButton: {
        ...STYLE_BUTTON_SUBHEADER,
        display: "inline-block",
        marginLeft: "5px",
    },
    locationStyle: {
        ...STYLE_BUTTON_FOOTNOTE_OUTLINE,
        display: "inline-block",
        marginRight: "5px",
    },
    requirementsStyle: {
        ...FONT_SUBHEADER_BOLD,
        color: COLOR_TEXT_GREY
    },
    borderLine: {
        background: COLOR_BORDER_GREY,
        width: "100%",
        height: "1px"
    }
};

const SECTION_BUFFER = "40px";

class JobDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.varSection1.clientHeight);
        console.log("PREP", prevProps.job);
        let { job} = this.props;

        if (job && prevProps.job && job.job_id !== prevProps.job.job_id) {
            console.log("SETTING SATe")
            // this.setState({
            //     this.varSection1.clientHeight
            // });

        }
    }

    render() {
        let { classes, onApply, job, forceCompany } = this.props;

        job = job || {};

        let company = job.companies && job.companies.length ? job.companies[0] : {};
        let job_type = job.job_types && job.job_types.length ? job.job_types[0] : {};
        let qualification = job.qualifications && job.qualifications.length ? job.qualifications[0] : {};
        let responsibility = job.responsibilities && job.responsibilities.length ? job.responsibilities[0] : {};
        let degree_requirement = job.degree_requirements && job.degree_requirements.length ? job.degree_requirements[0] : {};



        if (qualification && qualification.name) {
            try {
                qualification.name = qualification.name.replace(/- /g, '<br/><br/><i class="fa-solid fa-check-double"></i> ').trim();
                console.log(qualification.name, qualification.name.slice(0,10))
                if (qualification.name.slice(0,10) === '<br/><br/>') {
                    qualification.name = qualification.name.slice(10)
                }
            } catch (e) {
                console.error(e)
            }
        }

        if (responsibility && responsibility.name) {
            try {
                responsibility.name = responsibility.name.replace(/- /g, '<br/><br/><i class="fa-solid fa-check-double"></i> ').trim();
                console.log(responsibility.name, responsibility.name.slice(0,10))
                if (responsibility.name.slice(0,10) === '<br/><br/>') {
                    responsibility.name = responsibility.name.slice(10)
                }
            } catch (e) {
                console.error(e)
            }

        }

        return (<div className={classes.container}>
            <div>
                <div style={{display: "flex", marginBottom: "25px"}}>

                    <div style={{flex: "0 0 100px"}}>
                        <div style={{borderRadius: "4px", border: `1px solid ${COLOR_BORDER_GREY}`, overflow: "hidden", width: "100%"}}>
                            <img
                                width={"100%"}
                                src={company.company_logo}
                            />
                        </div>
                    </div>

                    <div style={{flex: 1, textAlign: "right"}}>
                        {/*<div className={classes.actionButton} onClick={onApply}>*/}
                        {/*    <div style={{display: "flex"}}>*/}
                        {/*        <div style={{flex: 1}}>*/}
                        {/*            Share*/}
                        {/*        </div>*/}
                        {/*        <div style={{flex: 1}}>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*<div className={classes.actionButton}>*/}
                        {/*    <div style={{display: "flex"}}>*/}
                        {/*        <div style={{flex: 1}}>*/}
                        {/*            Save*/}
                        {/*        </div>*/}
                        {/*        <div style={{flex: 1}}>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div className={classes.actionButton} onClick={onApply}>
                            Apply Now
                        </div>
                    </div>



                </div>

                <div style={{marginBottom: SECTION_BUFFER}}>
                    <div style={{marginBottom: "10px"}}>
                        <div style={{marginBottom: "0px", ...FONT_TITLE_2_BOLD}}>{job.job_title}</div>
                        <div style={{color: COLOR_TEXT_GREY, ...FONT_SUBHEADER}}>{company.company_name} • {job.date_created_label}</div>
                    </div>
                    <div style={{marginBottom: "15px", ...FONT_HEADLINE_BOLD}}>
                        {(job.locations && job.locations.length) && (job.locations).map((location) =>{
                            return (<StandardBadge iconLeft={true} icon={"fa-solid fa-location-dot"} style={{background: COMMON.COLORS.Y100, color: COMMON.COLORS.Y600}} key={location.location_id} label={location.label}/>)
                        })}
                    </div>
                    <div>

                        <div style={{display: "inline-block", marginRight: "10px"}}>
                            <div style={{display: "flex"}} className={classes.requirementsStyle}>
                                <div style={{flex: "0 0 15px", paddingRight: "5px"}}>
                                    <i style={{lineHeight: "20px"}} className="fa-solid fa-briefcase"></i>
                                </div>
                                <div style={{flex: 1}}>

                                    {job_type.name}
                                </div>
                            </div>
                        </div>
                        <div style={{display: "inline-block", marginRight: "10px"}}>
                            <div style={{display: "flex"}} className={classes.requirementsStyle}>
                                <div style={{flex: "0 0 15px", paddingRight: "5px"}}>
                                    <i style={{lineHeight: "20px"}} className="fa-solid fa-inbox"/>
                                </div>
                                <div style={{flex: 1}}>
                                    {degree_requirement.name}
                                </div>
                            </div>
                        </div>
                        {(job.job_salary_estimate && job.job_salary_estimate.length) ? <div style={{display: "inline-block"}}>
                            <div style={{display: "flex"}} className={classes.requirementsStyle}>
                                <div style={{flex: "0 0 15px", paddingRight: "5px"}}>
                                    <i style={{lineHeight: "20px"}} className="fa-solid fa-money-bill"></i>
                                </div>
                                <div style={{flex: 1}}>
                                    {job.job_salary_estimate} Glassdoor est.
                                </div>
                            </div>
                        </div> : null}

                    </div>
                </div>

                <div style={{marginBottom: SECTION_BUFFER}}>
                    <div style={{marginBottom: "0px", ...FONT_TITLE_2_BOLD, color: COLOR_GREEN}}>Role Overview</div>
                    <div style={{marginBottom: "15px", ...FONT_SUBHEADER, color: COLOR_TEXT_GREY}}>Identified by OSIRIS from the original job post</div>
                    <div style={{marginBottom: SECTION_BUFFER, ...FONT_SUBHEADER}}>{job.job_overview}</div>
                    <div className={classes.borderLine}/>
                </div>

                <div style={{marginBottom: SECTION_BUFFER}}>
                    <div style={{marginBottom: "0px", ...FONT_TITLE_2_BOLD, color: COLOR_GREEN}}>Job Highlights</div>
                    <div style={{marginBottom: "15px", ...FONT_SUBHEADER, color: COLOR_TEXT_GREY}}>Identified by OSIRIS from the original job post</div>

                    <div style={{display: "flex", marginBottom: SECTION_BUFFER}}
                         ref={ (div) => { this.varSection1 = div } }>
                        <div style={{flex: 1, paddingRight: "20px"}}>
                            <div style={{...FONT_BODY_BOLD, marginBottom: "10px"}}>Qualifications</div>
                            <div dangerouslySetInnerHTML={{
                                __html: qualification.name
                            }}/>
                        </div>

                        <div style={{flex: 1}}>
                            <div style={{...FONT_BODY_BOLD, marginBottom: "10px"}}>Responsibilities</div>
                            <div dangerouslySetInnerHTML={{
                                __html: responsibility.name
                            }} />
                        </div>
                    </div>
                    <div className={classes.borderLine}/>
                </div>

                <div style={{ marginBottom: "20px", display: !company.company_about ? "none" : null}}>


                    <div style={{display: "flex", marginBottom: "15px",}}>
                        <div style={{flex: "0 0 45px", marginRight: "15px"}}>
                            <div style={{borderRadius: "4px", border: `1px solid ${COLOR_BORDER_GREY}`, overflow: "hidden", width: "100%"}}>
                                <img
                                    width={"100%"}
                                    src={company.company_logo}
                                />
                            </div>
                        </div>
                        <div style={{flex: 1}}>
                            <div style={{marginBottom: "0px", ...FONT_TITLE_2_BOLD, color: COLOR_GREEN}}>About Company</div>
                            <div style={{...FONT_SUBHEADER, color: COLOR_TEXT_GREY}}>Identified by OSIRIS from Wikipedia</div>
                        </div>

                    </div>

                    <div style={{marginBottom: SECTION_BUFFER}}>
                        <div>{company.company_about}</div>
                    </div>

                    <div className={classes.borderLine}/>
                </div>

                {/*<div style={{marginBottom: "20px"}}>*/}
                {/*    <div style={{marginBottom: "15px", ...FONT_TITLE_2_BOLD, color: COLOR_GREEN}}>Similar Jobs</div>*/}
                {/*    <div style={{marginBottom: SECTION_BUFFER,}}>*/}
                {/*        <div style={{display: "flex", height: "144px", overflow: "hidden"}}>*/}
                {/*            <div style={{flex: 1}}>*/}
                {/*                <div style={{width: "356px", marginRight: "35px", display: "inline-block"}}>*/}
                {/*                    <JobCard job={job}/>*/}
                {/*                </div>*/}
                {/*                <div style={{width: "356px", marginRight: "35px", display: "inline-block"}}>*/}
                {/*                    <JobCard job={job}/>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div style={{flex: "0 0 155px", cursor: "pointer", lineHeight: "155px", textAlign: "center", ...FONT_BODY_BOLD, color: COLOR_GREEN}}>*/}
                {/*                See More <i className="fa-solid fa-arrow-right"></i>*/}
                {/*            </div>*/}
                {/*        </div>*/}

                {/*    </div>*/}
                {/*    <div className={classes.borderLine}/>*/}
                {/*</div>*/}

                <div>
                    <div style={{...FONT_BODY_BOLD, color: COLOR_GREEN, display: "flex", margin: "20px 0", cursor: "pointer"}} onClick={() =>{
                        forceCompany(company.company_id)
                    }
                    }>
                        <div style={{flex: "0 0 20px", marginRight: "15px"}}>
                            <i style={{lineHeight: "20px", fontSize: "20px"}} className="fa-solid fa-briefcase"></i>
                        </div>
                        <div style={{flex: 1}}>
                            <div style={{color: COLOR_GREEN}}>See More {company.company_name} Jobs <i className="fa-solid fa-arrow-right"></i></div>
                        </div>
                    </div>
                    <div className={classes.borderLine}/>
                </div>
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(JobDetails)));

