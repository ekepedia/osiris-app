import React from "react";
import _ from "lodash";
import moment from "moment";
import Select from 'react-select/creatable'

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';
import "./style.css";

import DataService from '../../services/DataService';
import {COLOR_WHITE, N_700, TAG_GREEN, TAG_GREY, TAG_ORANGE, TAG_RED, TAG_YELLOW} from "../../common/colors";
import CompanyService from "../../services/CompanyService";
import SavedJobService from "../../services/SavedJobService";
import SavedJobNoteService from "../../services/SavedJobNoteService";
import StandardSelect from "../../components/StandardSelect";
import COMMON from "../../common";
import JobsService from "../../services/JobsService";
import StandardInput from "../../components/StandardInput";
import StandardButton from "../../components/StandardButton";
import {mc} from "../../common/helpers";
import AddSavedJobModal from "./components/AddSavedJobModal";
import EditSavedJobModal from "./components/EditSavedJobModal";
import UserLinkService from "../../services/UserLinkService";
import NavBar from "../../components/NavBar";
import CoverImageHolder from "../../components/CoverImageHolder";
import CompanyDemographicService from "../../services/CompanyDemographicService";

const Styles = {
    container: {
        padding: "0 50px",
        '@media (max-width: 768px)': {
            padding: "0 20px",
        },
    },
    ...COMMON.STYLES.SAVED_JOBS.SavedJobPageStyles,
    ...COMMON.STYLES.GENERAL.NavigationStyles,
};

class SavedJobs extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            options: [
                { value: 'chocolate', label: 'Chocolate' },
                { value: 'strawberry', label: 'Strawberry' },
                { value: 'vanilla', label: (<div><img src={"/img/jayson.png"} style={{height: "20px", width: "20px", borderRadius: "4px", marginRight: "5px"}}/>Chocolate </div>) }
            ],
            openAddSavedJobModal: false,
            openEditSavedJobModal: false,
            selectedSavedJob: null,
            selectedJob: null,
        };

        this.updateSelectedSavedJob = this.updateSelectedSavedJob.bind(this)
        this.updateSelectedJob = this.updateSelectedJob.bind(this)
    }

    componentDidMount() {
        this.loadSavedJobs();
        this.loadJobs();
        this.loadCompanies();
        this.loadCompanyDemographics();
        this.loadSavedJobNotes();
    }

    loadCompanyDemographics() {
        let { client, match: { params } } = this.props;

        CompanyDemographicService.getCompanyDemographics({
            client,
            company_id: params.company_id
        }).then((company_demographics) => {
            console.log("LOADED COMPANY DEMOGRAPHICS", company_demographics);

            let company_demographics_map = {};

            if (company_demographics && company_demographics.length) {
                company_demographics.map((company_demographic) => {
                    company_demographics_map[company_demographic.company_id] = company_demographic;
                })
            }
            this.setState({
                company_demographics,
                company_demographics_map
            })
        })
    }


    loadCompanies() {
        let { client } = this.props;

        CompanyService.getCompanies({client}).then((companies) => {
            // console.log("LOADED COMPANIES", companies);

            companies = companies.sort((a, b) => {

                let nameA = a.company_name || "";
                let nameB = b.company_name || "";

                return nameA.localeCompare(nameB);
            });

            let options = [];
            let company_map = {};
            let option_map = {};

            companies.forEach((company) => {
                options.push({
                    value: company.company_id,
                    company: company,
                    label: (<div><img src={company.company_logo_url} style={{
                        height: "20px",
                        width: "20px",
                        borderRadius: "4px",
                        marginRight: "5px",
                        border: `1px solid ${COMMON.COLORS.N300}`
                    }}/><span style={{...COMMON.FONTS.P100}}>{company.company_name}</span></div>)
                });
                company_map[company.company_id] = company;
            });

            options.forEach((option) => {
                option_map[option.value] = option
            })

            this.setState({
                companies,
                options,
                company_map,
                option_map
            })
        })
    }

    loadSavedJobs() {
        let { client, match: { params } } = this.props;

        SavedJobService.getSavedJobs({
            client,
            user_id: params.user_id
        }).then((saved_jobs) => {
            // console.log("LOADED SAVED", saved_jobs);

            saved_jobs = saved_jobs.sort((a, b) => {

                let nameA = a.status_id || "";
                let nameB = b.status_id || "";

                return nameA.localeCompare(nameB);
            });

            this.setState({
                saved_jobs
            })
        })
    }

    loadSavedJobNotes() {
        let { client, match: { params } } = this.props;

        SavedJobNoteService.getSavedJobNotes({
            client,
            user_id: params.user_id
        }).then((saved_job_notes) => {
            console.log("LOADED SAVED NOTES", saved_job_notes);

            saved_job_notes = saved_job_notes.sort((a, b) => {

                let nameA = a.date_created || "";
                let nameB = b.date_created || "";

                return nameA.localeCompare(nameB);
            });

            this.setState({
                saved_job_notes
            })
        })
    }

    returnColor(status_id) {
        status_id = status_id ? parseFloat(status_id) : status_id;

        if (status_id === 1)
            return COMMON.COLORS.TAG_GREY;
        if (status_id === 2)
            return COMMON.COLORS.TAG_YELLOW;
        if (status_id === 3)
            return COMMON.COLORS.TAG_ORANGE;
        if (status_id === 4)
            return COMMON.COLORS.TAG_GREEN;
        if (status_id === 5)
            return COMMON.COLORS.TAG_RED;
        if (status_id === 6)
            return COMMON.COLORS.TAG_RED;

        return COMMON.COLORS.TAG_GREY;
    }

    loadJobs() {
        let { client } = this.props;

        JobsService.getJobs({client}).then((jobs) => {
            // console.log("LOADED JOBS", jobs);

            let jobs_map = {};

            jobs.forEach((job) => {
                jobs_map[job.job_id] = job;
            })

            jobs = jobs.sort((a, b) => {

                let nameA = a.job_title || "";
                let nameB = b.job_title || "";

                return nameA.localeCompare(nameB);
            });

            this.setState({
                jobs,
                jobs_map
            })
        })
    }

    updateSelectedSavedJob(field, value) {
        let { selectedSavedJob } = this.state;
        selectedSavedJob[field] = value;
        this.setState({
            selectedSavedJob
        })
    }

    updateSelectedJob(field, value) {
        let { selectedJob } = this.state;
        selectedJob[field] = value;
        this.setState({
            selectedJob
        })
    }


    submitEditSavedJob() {
        let { classes, client, match: { params } } = this.props;
        const { selectedSavedJob } = this.state;

        SavedJobService.editSavedJob({client, ...selectedSavedJob}).then((success) => {
            console.log("successfully edited saved job", success);
            this.loadSavedJobs();
        })
    }

    submitEditJob() {
        let { classes, client, match: { params } } = this.props;
        const { selectedJob } = this.state;

        JobsService.editJob({client, ...selectedJob}).then((success) => {
            console.log("successfully edited job", success);
            this.loadJobs();
        })
    }

    render() {

        let { classes, client, match: { params } } = this.props;
        let { saved_jobs, jobs_map, saved_job_notes, options, option_map, company_map, openAddSavedJobModal, openEditSavedJobModal, selectedSavedJob, selectedJob, company_demographics_map, selectedcompany_demographics} = this.state;


        return (
            <div className={classes.masterContainer}>
                <div className={classes.masterNavContainer}>
                    <NavBar />
                </div>
                <div className={classes.masterBodyContainer}>
                    <div className={classes.container}>
                        <div className={mc(classes.filterBarContainer)}>
                            <div style={{display: "flex"}}>
                                <div style={{flex: 1, ...COMMON.FONTS.FONT_SUBHEADER_BOLD,}}>
                                    <div className={mc(classes.filterHolder)} style={{background: "none", color:"#696F8C",}}>
                                        Board
                                    </div>
                                    <div className={mc(classes.filterHolder)}>
                                        Table
                                    </div>
                                </div>
                                <div style={{flex: "0 0 12px", marginRight: "16.5px"}}>

                                </div>
                                <div style={{flex: "0 0 58x", lineHeight: "initial", marginTop: "6px"}}>
                                    <StandardButton label={"Add Job"} onClick={() => (this.setState({openAddSavedJobModal: true}))}/>
                                </div>
                            </div>
                        </div>
                        <div className={mc(classes.mainContainer)}>
                            <div className={mc(classes.rowHeaderSuperContainer)}>
                                <div className={mc(classes.rowContainerHeader)} style={{flex: 1}}>
                                    Role
                                </div>
                                <div className={mc(classes.rowContainerHeader)} style={{flex: 1}}>
                                    Company
                                </div>
                                <div className={mc(classes.rowContainerHeader)} style={{flex: 0.5}}>
                                    Role Type
                                </div>
                                <div className={mc(classes.rowContainerHeader)} style={{flex: "0 0 150px", color: COMMON.COLORS.N_700, }}>
                                    Salary
                                </div>
                                <div className={mc(classes.rowContainerHeader)} style={{flex: "0 0 150px", color: COMMON.COLORS.N_700, }}>
                                    Deadline
                                </div>
                                <div className={mc(classes.rowContainerHeader)} style={{flex: "0 0 200px", color: COMMON.COLORS.N_700,}}>
                                    Application Status
                                </div>
                            </div>
                            <div>{saved_jobs && saved_jobs.length ? <div>

                                {saved_jobs.map((saved_job) => {

                                    let job = jobs_map ? ((jobs_map[saved_job.job_id] || {})) : {};
                                    let company_demographics = company_demographics_map ? ((company_demographics_map[job.company_id] || {})) : {};
                                    let company_name = job.company_id && company_map ? (company_map[job.company_id] || {}).company_name : job.company_name
                                    let company_logo = job.company_id && company_map ? (company_map[job.company_id] || {}).company_logo_url : null;

                                    if (!jobs_map)
                                        return;
                                    return (<div className={mc(classes.savedJobRow)}>
                                        <div className={mc(classes.jobTitle)}
                                             style={{flex: 1}}
                                             onClick={() => {this.setState({selectedSavedJob: saved_job, selectedJob: job, selectedcompany_demographics: company_demographics, openEditSavedJobModal: true});}}
                                        >
                                            {(jobs_map[saved_job.job_id] || {}).job_title}
                                        </div>

                                        <div className={mc(classes.rowContainer)} style={{flex: 1}}>
                                            <div style={{height: "100%", width: "100%", position: "relative", paddingLeft: "25px"}}>
                                                <div className={mc(classes.companyLogoContainer)}>
                                                    <CoverImageHolder url={company_logo}/>
                                                </div>{company_name}
                                            </div>
                                        </div>
                                        <div className={mc(classes.rowContainer)} style={{flex: 0.5}}>
                                            <span className={mc(classes.roleTypeContainer)}><i className="fa-solid fa-briefcase"/>Full Time</span>
                                        </div>

                                        <div className={mc(classes.rowContainer)} style={{flex: "0 0 150px"}}>
                                            {saved_job.job_salary || "--"}
                                        </div>
                                        <div className={mc(classes.rowContainer)} style={{flex: "0 0 150px"}}>
                                            {saved_job.job_deadline && parseFloat(saved_job.job_deadline) ? moment(parseFloat(saved_job.job_deadline)).format("MMM D YYYY") : "--"}
                                        </div>
                                        <div className={mc(classes.rowContainer)} style={{flex: "0 0 200px", lineHeight: "initial"}}>
                                            <StandardSelect style={{...COMMON.STYLES.SAVED_JOBS.SavedJobPageStyles.statusSelectStyle}} color={this.returnColor(saved_job.status_id)} value={saved_job.status_id} options={COMMON.CONSTS.STATUSES} update={(v) => {
                                                console.log("updating status:", v);
                                                SavedJobService.editSavedJob({client, saved_job_id: saved_job.saved_job_id, status_id: v}).then((d) => {
                                                    console.log("Edited Saved Job:", d);
                                                    this.loadSavedJobs();
                                                })
                                            }}/>
                                        </div>

                                    </div>)
                                })}
                            </div> : null}</div>
                        </div>

                        <EditSavedJobModal refetch={() => {this.loadSavedJobs();}} onSubmit={() => {this.submitEditSavedJob(); this.submitEditJob();}} company_map={company_map}  company_demographics={selectedcompany_demographics} option_map={option_map} jobs_map={jobs_map} options={options} job={selectedJob} saved_job={selectedSavedJob} updateField={this.updateSelectedSavedJob} updateJobField={this.updateSelectedJob} open={openEditSavedJobModal} onClose={() => (this.setState({openEditSavedJobModal: false}))}/>
                        <AddSavedJobModal open={openAddSavedJobModal} options={options} onSubmit={({job_title, apply_link, status_id, company_id,}) => {
                            console.log("SUBMIT", job_title, apply_link, status_id, company_id);

                            JobsService.addJob({
                                client,
                                job_title,
                                apply_link,
                                company_id,
                                user_id: params.user_id,
                                submitted_by_id: params.user_id,
                                date_created: new Date().getTime() + "",
                                is_user_submitted: true,
                                is_public: false
                            }).then((job_id) => {
                                console.log("CREATE NEW JOB:", job_id);
                                console.log("params", params)
                                console.log("params.user)id", params.user_id)

                                this.loadJobs();
                                console.log("USER ID:", params.user_id);
                                SavedJobService.addSavedJob({client,
                                    job_id,
                                    user_id: params.user_id,
                                    status_id: status_id + ""
                                }).then((saved_job_id) => {
                                    console.log("CREATED NEW SAVED JOB:", saved_job_id);
                                    this.loadSavedJobs();
                                })
                            })


                        }} onClose={() => (this.setState({openAddSavedJobModal: false}))}/>
                    </div>
                </div>
            </div>
        );
    }

}

export default withApollo(withRouter(injectSheet(Styles)(SavedJobs)));

