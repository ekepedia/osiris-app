import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link, useHistory} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';
import {COLOR_WHITE, PIE_CHART_WHITE} from "../../common/colors";
import COMMON from "../../common";
import CompanyService from "../../services/CompanyService";
import { PieChart } from 'react-minimal-pie-chart';
import CompanyDemographicService from "../../services/CompanyDemographicService";
import {formatLargeNumber, mc} from "../../common/helpers";
import CompanyHeader from "./components/CompanyHeader";
import NavBar from "../../components/NavBar";
import RacePieChart from "../../components/charts/RacePieChart";
import GenderPieChart from "../../components/charts/GenderPieChart";
import StandardBadge from "../../components/StandardBadge";
import JobsService from "../../services/JobsService";
import CoverImageHolder from "../../components/CoverImageHolder";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0 20px",
        },
    },
    jobCardContainer: {height: "68px", cursor: "pointer", borderRadius: "4px", border: `1px solid ${COMMON.COLORS.N400}`, padding: "15px"},
    jobCardImgContainer: {
        flex: "0 0 38px", overflow: "hidden", height: "38px", marginRight: "8px", borderRadius: "4px", border: `1px solid ${COMMON.COLORS.N400}`
    },
    jobCardTitle: {
        ...COMMON.FONTS.H400,
        color: COMMON.COLORS.N900,
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
    },
    jobCardCompany: {
        ...COMMON.FONTS.P100,
        color: COMMON.COLORS.N700,
        marginTop: "-2px"
    },
    ...COMMON.STYLES.COMPANY.CompanyPageStyles,
    ...COMMON.STYLES.COMPANY.CompanyProfilePageStyles,
    ...COMMON.STYLES.GENERAL.NavigationStyles,
    racePieChartHolder: {
        marginTop: "20px"
    }
};


class CompanyPage extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            selectedState: 1,
        };
    }

    componentDidMount() {
        this.loadCompanies();
        this.loadCompanyDemographics();
        this.loadCompanyJobs();
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
        let { client, match: { params } } = this.props;

        CompanyService.getCompanies({
            client,
            company_id: params.company_id
        }).then((companies) => {
            console.log("LOADED COMPANY", companies);

            let company = null;

            if (companies && companies.length) {
                company = companies[0]
            }

            this.setState({
                company
            })
        })
    }

    loadCompanyJobs() {
        let { client, match: { params } } = this.props;

        JobsService.getJobs({
            client,
            company_id: params.company_id
        }).then((jobs) => {
            console.log("LOADED JOBS", jobs);

            this.setState({
                jobs: jobs || []
            })
        })
    }

    render() {
        let { classes, client, match: { params }, history } = this.props;

        let { company, company_demographics_map, selectedState, jobs } = this.state;

        company_demographics_map = company_demographics_map || {};
        company = company || {};


        const {
            company_id
        } = company;

        const company_demographics = company_demographics_map[company_id] || {};
        const has_demographics = company_demographics && company_demographics.employees_male;
        const has_jobs = jobs && jobs.length;

        let job_1 = {};
        let job_2 = {};
        if (has_jobs) {
            if (jobs[0]) {
                job_1 = jobs[0];
            }
            if (jobs[1]) {
                job_2 = jobs[1];
            }
        }

        return (

            <div className={classes.masterContainer}>
                <div className={classes.masterNavContainer}>
                    <NavBar />
                </div>
                <div className={classes.masterBodyContainer}>
                    <div className={classes.container}>

                        <div className={classes.mainContainer}>

                            <div className={mc(classes.headerContainer)}>
                                <CompanyHeader {...{company, selectedState: this.state.selectedState}} has_demographics={has_demographics} has_jobs={has_jobs} setSelectedState={(selectedState) => {
                                    this.setState({selectedState})
                                }}/>
                            </div>

                            <div style={{display: selectedState === 1 ? null : "none"}} className={mc(classes.sectionContainer)}>
                                <div className={mc(classes.sectionMainTitle)}>About Company</div>
                                <div className={mc(classes.sectionSubHeader)}>Identified by OSIRIS from {company.company_name}</div>
                                <div className={mc(classes.aboutBody)}>{company.company_about}</div>
                            </div>

                            <div style={{display: (selectedState === 3 || selectedState === 1) && has_demographics ? null : "none", paddingBottom: selectedState === 1 ? "12px" : null}} className={mc(classes.sectionContainer)}>
                                <div className={mc(classes.sectionMainTitle)}>Representation by race / ethnicity</div>
                                <div className={mc(classes.sectionSubHeader)}>Identified by OSIRIS from {company.company_name}</div>

                                <div className={mc(classes.racePieChartHolder)}>
                                    <RacePieChart company_demographics={company_demographics}/>
                                </div>

                                <div className={mc(classes.seeMoreDetails)} onClick={() => {this.setState({selectedState: 3})}} style={{display: selectedState === 1 ? null : "none"}}>
                                    <div>See all details</div>
                                </div>
                            </div>

                            <div style={{display: selectedState === 3 && has_demographics ? null : "none"}} className={mc(classes.sectionContainer)}>
                                <div className={mc(classes.sectionMainTitle)}>Representation by gender binary</div>
                                <div className={mc(classes.sectionSubHeader)}>Identified by OSIRIS from {company.company_name}</div>
                                <div className={mc(classes.racePieChartHolder)}>
                                    <GenderPieChart company_demographics={company_demographics}/>
                                </div>
                            </div>


                            <div  style={{display: selectedState === 2 ? null : "none"}} className={mc(classes.sectionContainer)}>
                                <div className={mc(classes.sectionMainTitle)}>Overview</div>
                                <div className={mc(classes.sectionSubHeader)}>Identified by OSIRIS from {company.company_name}</div>
                                <div className={mc(classes.aboutBody)}>{company.company_about}</div>
                                <div className={mc(classes.sectionSubtitle)}>Website</div>
                                <div className={mc(classes.companyWebsite)}><a target={"_blank"} href={company.company_website}>{company.company_website}</a></div>
                                <div className={mc(classes.sectionSubtitle)}>Industry</div>
                                <div className={mc(classes.overviewSection)}>{company.company_industry_group}</div>
                                {company.company_size ? <div>
                                    <div className={mc(classes.sectionSubtitle)}>Company Size</div>
                                    <div className={mc(classes.overviewSection)}>{formatLargeNumber(company.company_size)} employees</div>
                                </div> : null}
                                <div className={mc(classes.sectionSubtitle)}>Headquarters</div>
                                <div className={mc(classes.overviewSection)}>{company.company_city || ""}{company.company_city && company.company_state ? "," : ""} {company.company_state || ""}</div>

                                <div className={mc(classes.sectionSubtitle)}>Founded</div>
                                <div className={mc(classes.overviewSection)}>{company.company_founded_year || "--"}</div>

                                <div className={mc(classes.sectionSubtitle)}>Specialties</div>
                                <div className={mc(classes.overviewSection)}>
                                    <StandardBadge style={{marginTop: "15px"}} label={company.company_industry}/>
                                </div>
                            </div>

                            <div style={{display: selectedState === 4 ? null : "none", paddingBottom: "12px"}} className={mc(classes.sectionContainer)}>
                                <div className={mc(classes.sectionMainTitle)}>Recent Job Postings</div>
                                <div style={{marginTop: "15px"}}>
                                    <div style={{display: "flex"}}>
                                        <div style={{flex: 1, paddingRight: "10px", overflow: "hidden"}}>
                                            <div className={classes.jobCardContainer} onClick={() => {history.push(`/jobs?j=${job_1.job_id}&c=${company_id}`);}}>
                                                <div style={{display: "flex", overflow: "hidden"}}>
                                                    <div className={classes.jobCardImgContainer}>
                                                        <CoverImageHolder url={company.company_logo_url || "https://i.imgur.com/tM97NWQ.png"}/>
                                                    </div>
                                                    <div style={{flex: 1, overflow: "hidden"}}>
                                                        <div className={classes.jobCardTitle}>
                                                            {job_1.job_title}
                                                        </div>
                                                        <div className={classes.jobCardCompany}>
                                                            {company.company_name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{flex: 1, overflow: "hidden"}}>
                                            <div style={{display: job_2 && job_2.job_title ? null : "none"}} className={classes.jobCardContainer} onClick={() => {history.push(`/jobs?j=${job_2.job_id}&c=${company_id}`);}}>
                                                <div style={{display: "flex", overflow: "hidden"}}>
                                                    <div className={classes.jobCardImgContainer}>
                                                        <CoverImageHolder url={company.company_logo_url || "https://i.imgur.com/tM97NWQ.png"}/>
                                                    </div>
                                                    <div style={{flex: 1, overflow: "hidden"}}>
                                                        <div className={classes.jobCardTitle}>
                                                            {job_2.job_title}
                                                        </div>
                                                        <div className={classes.jobCardCompany}>
                                                            {company.company_name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                </div>
                                <div className={mc(classes.seeMoreDetails)} onClick={() => {
                                    history.push(`/jobs?c=${company_id}`);
                                }}>
                                    <div>See all jobs</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(CompanyPage)));

