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
import StandardButton from "./StandardButton";
import CoverImageHolder from "./CoverImageHolder";
import {mc} from "../common/helpers";
import SavedJobService from "../services/SavedJobService";

const Styles = {
    container: {
        padding: "25px 35px",
        '@media (max-width: 768px)': {
            padding: "0",
            display: "none",
            height: "0px",
            overflow: "hidden"
        },
        marginBottom: "200px",
        border: `1px solid ${COMMON.COLORS.N300}`,
        background: COMMON.COLORS.N0,
        borderRadius: "4px",
        height: "100%",
        overflowY: "scroll"
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
    },
    sectionHeader: {
        ...COMMON.FONTS.H600,
        color: COMMON.COLORS.N900
    },
    sectionSubHeader: {
        ...COMMON.FONTS.H100,
        color: COMMON.COLORS.N800,
        textTransform: "uppercase",
        marginBottom: "15px"
    },
    bodyText: {
        ...COMMON.FONTS.P200,
        color: COMMON.COLORS.N800
    },
    jobHighlightsSubHeader: {
        ...COMMON.FONTS.H500,
        color: COMMON.COLORS.N800,
        marginBottom: "5px"
    }
};

const SECTION_BUFFER = "32px";

class JobDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    updateSavedJob() {
        let {  client, job, user, saved_jobs, saved_jobs_ids, updateSavedJobIds } = this.props;
        const is_saved_job = saved_jobs_ids && saved_jobs_ids.length && saved_jobs_ids.indexOf(job.job_id + "") !== -1;

        if (is_saved_job) {
            let yes = confirm("Are you sure you want to unsave this job?");
            if (yes) {
                saved_jobs_ids = _.without(saved_jobs_ids, job.job_id + "");
                updateSavedJobIds(saved_jobs_ids);

                let saved_job_id = null;
                saved_jobs.forEach((saved_job) => {
                    if (saved_job.job_id + "" === job.job_id + "") {
                        saved_job_id = saved_job.saved_job_id
                    }
                })

                SavedJobService.deleteSavedJob({client, saved_job_id}).then(() =>{
                    console.log("REMOVED SAVED JOB:", saved_job_id);
                });


            }
        } else {
            saved_jobs_ids.push(job.job_id + "")
            updateSavedJobIds(saved_jobs_ids)
            SavedJobService.addSavedJob({
                client,
                job_id: job.job_id + "",
                user_id: user.user_id + "",
                status_id: "1"
            }).then((saved_job_id) => {
                console.log("CREATED NEW SAVED JOB:", saved_job_id);
            })
        }
    }

    render() {
        let { classes, onApply, job, forceCompany, saved_jobs_ids, user } = this.props;

        console.log("saved_jobs_ids", saved_jobs_ids, job)
        job = job || {};

        let company = job.companies && job.companies.length ? job.companies[0] : {};
        let job_type = job.job_types && job.job_types.length ? job.job_types[0] : {};
        let qualification = job.qualifications && job.qualifications.length ? job.qualifications[0] : {};
        let responsibility = job.responsibilities && job.responsibilities.length ? job.responsibilities[0] : {};
        let degree_requirement = job.degree_requirements && job.degree_requirements.length ? job.degree_requirements[0] : {};



        if (qualification && qualification.name) {
            try {
                qualification.name = qualification.name.replace(/- /g, '• ').trim();
                // qualification.name = qualification.name.replace(/- /g, '<br/><br/><i class="fa-solid fa-period"></i> ').trim();
                // console.log(qualification.name, qualification.name.slice(0,10))
                // if (qualification.name.slice(0,10) === '<br/><br/>') {
                //     qualification.name = qualification.name.slice(10)
                // }
            } catch (e) {
                console.error(e)
            }
        }

        if (responsibility && responsibility.name) {
            try {
                responsibility.name = responsibility.name.replace(/- /g, '• ').trim();
                // console.log(responsibility.name, responsibility.name.slice(0,10))
                // if (responsibility.name.slice(0,10) === '<br/><br/>') {
                //     responsibility.name = responsibility.name.slice(10)
                // }
            } catch (e) {
                console.error(e)
            }

        }

        const is_saved_job = saved_jobs_ids && saved_jobs_ids.length && saved_jobs_ids.indexOf(job.job_id + "") !== -1;

        let salary = "";
        let salary_tooltip = "";
        if (job && job.job_salary_estimate) {
            salary = job.job_salary_estimate;

            if (salary.indexOf("(Employer est.)") !== -1) {
                salary = salary.replace("(Employer est.)", "").trim()
                salary_tooltip = "This estimate was provided by the employer via Glassdoor";
            }

            if (salary.indexOf("(Glassdoor est.)") !== -1) {
                salary = salary.replace("(Glassdoor est.)", "").trim()
                salary_tooltip = "This estimate was provided by Glassdoor";
            }
        }

        return (<div className={classes.container} id={"job-description"}>
            <div >
                <div style={{display: "flex", marginBottom: "20px"}}>
                    <div style={{flex: "0 0 45px", marginRight: "10px"}}>
                        <div onClick={() => {
                            window.open(`/companies/${company.company_id}`);
                        }} style={{borderRadius: "4px", cursor: "pointer", border: `1px solid ${COMMON.COLORS.N300}`, overflow: "hidden", width: "100%"}}>
                            <CoverImageHolder url={company.company_logo_url}/>
                        </div>
                    </div>

                    <div style={{flex: 1, overflow: "hidden"}}>
                        <div style={{marginBottom: "0"}}>
                            <div style={{marginBottom: "0px", ...COMMON.FONTS.H700, color: COMMON.COLORS.N900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{job.job_title}</div>
                            <div onClick={() => {
                                window.open(`/companies/${company.company_id}`);
                            }} style={{...COMMON.FONTS.P200,cursor:"pointer", color: COMMON.COLORS.N700}}>{company.company_name}</div>
                        </div>
                    </div>
                    <div style={{flex: "0 0 157px", textAlign: "right"}} id="job-share-section">
                        <div style={{display: user && user.user_id ? "inline-block" : "none", marginRight: "5px"}}>
                            <StandardButton label={""} icon={`${is_saved_job ? "fa-solid" : "fa-regular"} fa-bookmark`} secondary={!is_saved_job} onClick={() => {this.updateSavedJob()}}/>
                        </div>
                        <div style={{display: "inline-block"}}>
                            <StandardButton label={"Apply Now"} secondary={true} onClick={() => {onApply()}}/>
                        </div>
                    </div>
                </div>

                <div style={{marginBottom: SECTION_BUFFER}}>

                    <div style={{marginBottom: "0"}}>
                        {(job.locations && job.locations.length) && (job.locations).map((location) =>{
                            return (<StandardBadge iconLeft={true} icon={"fa-solid fa-location-dot"} style={{background: COMMON.COLORS.Y100, color: COMMON.COLORS.Y600, marginBottom: "5px"}} key={location.location_id} label={location.label}/>)
                        })}
                        <StandardBadge iconLeft={true} icon={"fa-solid fa-briefcase"} label={job_type.name}/>
                        {job.job_seniority ? <StandardBadge iconLeft={true} icon={"fa-solid fa-briefcase"} label={job.job_seniority}/> : null }
                        {(salary && salary.length) ? <StandardBadge tooltip={salary_tooltip} label={`${salary}`} style={{background: COMMON.COLORS.B200, color: COMMON.COLORS.B500}} icon={"fa-solid fa-money-bill"} iconLeft={true}/> : null}
                        {company.glassdoor_overall ? <StandardBadge tooltip={`Employees rate ${company.company_name} ${company.glassdoor_overall}/5 on<br/>Glassdoor overall`} label={`${company.glassdoor_overall} OVERALL`} icon={"fa-solid fa-star"} iconLeft={true} style={{background: COMMON.COLORS.G200, color: COMMON.COLORS.G600}}/> : null}
                        {company.glassdoor_work_life ? <StandardBadge tooltip={`Employees rate ${company.company_name} ${company.glassdoor_work_life}/5 on<br/>Glassdoor for work/life`} label={`${company.glassdoor_work_life} WORK-LIFE`} icon={"fa-solid fa-bed"} iconLeft={true} style={{background: COMMON.COLORS.V100, color: COMMON.COLORS.V600}}/> : null}
                        {company.glassdoor_culture ? <StandardBadge tooltip={`Employees rate ${company.company_name} ${company.glassdoor_culture}/5 on<br/>Glassdoor for culture`} label={`${company.glassdoor_culture} CULTURE`} icon={"fa-solid fa-gavel"} iconLeft={true} style={{background: COMMON.COLORS.B200, color: COMMON.COLORS.B500}}/> : null}
                        {company.glassdoor_compensation ? <StandardBadge tooltip={`Employees rate ${company.company_name} ${company.glassdoor_compensation}/5 on<br/>Glassdoor for compensation`} label={`${company.glassdoor_compensation} COMPENSATION`} icon={"fa-solid fa-dollar-sign"} iconLeft={true} style={{background: COMMON.COLORS.O100, color: COMMON.COLORS.O600}}/> : null}
                    </div>

                    <div style={{display: "none"}}>
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

                {job.job_html ? <div style={{marginBottom: company.company_about ? SECTION_BUFFER : null}}>
                    <div dangerouslySetInnerHTML={(() => ({__html: job.job_html}))()}/>
                </div> : <div>
                    <div style={{marginBottom: SECTION_BUFFER}}>
                        <div className={mc(classes.sectionHeader)}>Role Overview</div>
                        <div className={mc(classes.sectionSubHeader)}>Identified by OSIRIS from the original job post</div>
                        <div className={mc(classes.bodyText)} style={{marginBottom: SECTION_BUFFER}}>{job.job_overview}</div>
                    </div>

                    <div style={{marginBottom: SECTION_BUFFER}}>
                        <div className={mc(classes.sectionHeader)}>Job Highlights</div>
                        <div className={mc(classes.sectionSubHeader)}>Identified by OSIRIS from the original job post</div>

                        <div style={{marginBottom: SECTION_BUFFER}}>
                            <div>
                                <div className={mc(classes.jobHighlightsSubHeader)}>Qualifications</div>
                                <div className={mc(classes.bodyText)} style={{whiteSpace: "pre-line"}} dangerouslySetInnerHTML={{
                                    __html: qualification.name
                                }}/>
                            </div>

                            <div style={{marginTop: "25px"}}>
                                <div className={mc(classes.jobHighlightsSubHeader)}>Responsibilities</div>
                                <div className={mc(classes.bodyText)} style={{whiteSpace: "pre-line"}} dangerouslySetInnerHTML={{
                                    __html: responsibility.name
                                }} />
                            </div>
                        </div>

                    </div>
                </div>}



                <div style={{ marginBottom: "20px", display: !company.company_about ? "none" : null}}>


                    <div style={{display: "flex", marginBottom: "15px",}}>
                        <div style={{flex: 1}}>
                            <div style={{display: "flex"}}>
                                <div style={{flex: 1}}>
                                    <div className={mc(classes.sectionHeader)}>About Company</div>
                                    <div className={mc(classes.sectionSubHeader)}>Identified by OSIRIS from Wikipedia</div>
                                </div>
                                <div style={{flex: "0 0 140px"}}>
                                    <StandardButton onClick={() => {
                                        window.open(`/companies/${company.company_id}`);
                                    }} secondary={true} label={"More Company Info"}/>
                                </div>

                            </div>

                            <div className={mc(classes.bodyText)}>{company.company_about}</div>

                        </div>
                    </div>
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

            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(JobDetails)));

