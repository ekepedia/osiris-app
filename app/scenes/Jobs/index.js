import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';

import { COLOR_WHITE } from "../../common/colors";
import { FONT_BODY_BOLD } from "../../common/fonts";

import NavBar from "../../components/NavBar"
import FilterBar from "../../components/FilterBar"
import JobAlertSignUp from "../../components/JobAlertSignUp";
import JobCards from "../../components/JobCards";
import JobDetails from "../../components/JobDetails";
import JobAlertBanner from "../../components/JobAlertBanner";
import ApplyNowModal from "../../components/ApplyNowModal";
import JobAssistantModal from "../../components/JobAssistantModal";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    mainContainer: {
        padding: "20px 50px",
        '@media (max-width: 768px)': {
            padding: "20px",
        },
    },
    hideOnMobile: {
        '@media (max-width: 768px)': {
            display: "none"
        },
    },
    showOnMobile: {
        display: "none",
        '@media (max-width: 768px)': {
            display: "block"
        },
    }
};

class Jobs extends React.Component {

    constructor(props) {
        super(props);

        this.jobs = [
            {
                job_id: 1,
                date_created: new Date("4/2/2022"),
                date_created_label: "1 day ago",
                job_title: "Test Job 1",
                job_overview: "Thhis is the overview",
                job_salary_estimate: "$50K - $100K/yr",
                degree_requirements: [{
                    degree_requirement_id: 1,
                    name: "Bachelors"
                }],
                job_types: [{
                    job_type_id: 1,
                    name: "Internship"
                }],
                qualifications: [{
                    qualification_id: 1,
                    name: "THIS IS QUAL"
                }],
                responsibilities: [{
                    responsibility_id: 1,
                    name: "THIS IS RESPON"
                }],
                companies: [{
                    company_id: 1,
                    company_name: "Microsoft",
                    company_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png?20210729021049",
                }],
                locations: [{
                    location_id: 1,
                    city: "",
                    state: "",
                    label: "Remote"
                }]
            },
            {
                job_id: 2,
                date_created: new Date("4/2/2022"),
                date_created_label: "2 days ago",
                job_title: "Test Job 2",
                job_overview: "Thhis is the overview 2",
                job_salary_estimate: "$50K - $120K/yr",
                degree_requirements: [{
                    degree_requirement_id: 2,
                    name: "Masters"
                }],
                job_types: [{
                    job_type_id: 1,
                    name: "Internship"
                }],
                industries: [{
                    industry_id: 1,
                    name: "Internship"
                }],
                affinities: [{
                    affinity_id: 1,
                    name: "Internship"
                }],
                qualifications: [{
                    qualification_id: 1,
                    name: "THIS IS QUAL 2"
                }],
                responsibilities: [{
                    responsibility_id: 1,
                    name: "THIS IS RESPON 2"
                }],
                companies: [{
                    company_id: 1,
                    company_name: "Microsoft",
                    company_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png?20210729021049",
                    company_about: "Morgan Stanley mobilizes capital to help governments, corporations, institutions and individuals around the world achieve their financial goals. For over 85 years, the firm’s reputation for using innovative thinking to solve complex problems has been well earned and rarely matched. A consistent industry leader throughout decades of dramatic change in modern finance, Morgan Stanley will continue to break new ground in advising, serving and providing new opportunities for its clients."
                }],
                locations: [{
                    location_id: 2,
                    city: "Boston",
                    state: "MA",
                    label: "Boston, MA",
                    id: 2,
                }]
            },
            {
                job_id: 3,
                date_created: new Date("4/2/2022"),
                date_created_label: "3 days ago",
                job_title: "Test Job 3",
                job_overview: "Thhis is the overview 3",
                job_salary_estimate: "$50K - $130K/yr",
                degree_requirements: [{
                    degree_requirement_id: 1,
                    name: "Bachelors"
                }],
                job_types: [{
                    job_type_id: 1,
                    name: "Internship"
                }],
                qualifications: [{
                    qualification_id: 1,
                    name: "THIS IS QUAL 3"
                }],
                responsibilities: [{
                    responsibility_id: 1,
                    name: "THIS IS RESPON 3"
                }],
                companies: [{
                    company_id: 1,
                    company_name: "Microsoft",
                    company_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png?20210729021049",
                }],
                locations: [{
                    location_id: 3,
                    city: "New York",
                    state: "NY",
                    label: "New York, NY",
                    id: 3,
                }]
            }
        ];

        DataService.getJobs().then(({jobs}) => {
            console.log("jobs", jobs);
            this.jobs = jobs;


            this.setState({
                jobs,
                selectedJobId: jobs[0].job_id,
                selectedJob: jobs[0],
            })
        })

        this.state = {
            showJobAlerts: false,
            showApplyNow: false,
            showJobAssistant: false,
            selectedLocations: [],
            selectedCompanies: [],
            selectedIndustries: [],
            selectedAffinities: [],
            selectedRoles: [],
            selectedDegreeRequirements: [],
            selectedJobId: this.jobs[0].job_id,
            selectedJob: this.jobs[0],
        };
    }

    componentDidMount() {

    }

    addToField(field, id) {
        let selected = this.state[field];
        selected.push(id);
        selected = _.uniq(selected);
        this.setState({[field]: selected})
    }

    removeFromField(field, id) {
        let selected = this.state[field];

        const index = selected.indexOf(id);
        if (index > -1) {
            selected.splice(index, 1);
        }
        selected = _.uniq(selected);
        this.setState({[field]: selected})
    }

    clearField(field) {this.setState({[field]: []})}

    openJobAlerts() {
        this.setState({showJobAlerts: true})
    }

    closeJobAlerts() {
        this.setState({showJobAlerts: false})
    }

    openApplyModal() {
        this.setState({showApplyNow: true})
    }

    closeApplyModal() {
        this.setState({showApplyNow: false})
    }

    openJobAssistant() {
        this.setState({showJobAssistant: true})
    }

    closeJobAssistant() {
        this.setState({showJobAssistant: false})
    }

    submitJobAssistant() {
        this.closeJobAssistant();
        this.openJobAlerts();
    }

    setSelectedJob(job_id) {
        let job = this.getJob(job_id);

        this.setState({
            selectedJobId: job_id,
            selectedJob: job
        })
    }

    getJob(job_id) {
        let foundJob = null;

        if (!this.jobs || !this.jobs.length)
            return foundJob;

        this.jobs.map((job) => {
            if (job.job_id === job_id)
                foundJob = job
        })

        return foundJob
    }

    forceCompany(company_id) {

        this.setState({
            selectedLocations: [],
            selectedCompanies: [company_id],
            selectedIndustries: [],
            selectedAffinities: [],
            selectedRoles: [],
            selectedDegreeRequirements: [],
        })
    }

    render() {
        let { classes, client, match: { params } } = this.props;

        const SCROLL_PAD = "100px";

        return (<div className={classes.container}>

            <div style={{display: "flex", flexDirection: "column", height: "100%", overflow: "hidden"}}>
                <div style={{flex: "0 0 50px"}}>
                    <NavBar/>
                </div>
                <div style={{flex: "0 0 50px"}} className={classes.hideOnMobile}>
                    <FilterBar
                        addToField={this.addToField.bind(this)}
                        removeFromField={this.removeFromField.bind(this)}
                        clearField={this.clearField.bind(this)}

                        state={this.state}

                        onAssistant={this.openJobAssistant.bind(this)}
                    />
                </div>

                {!this.state.hideBanner && <div style={{flex: "0 0 44px"}} className={classes.hideOnMobile}>
                    <JobAlertBanner
                        onSignUp={this.openJobAlerts.bind(this)}
                        onDismiss={() => {
                            this.setState({
                                hideBanner: true
                            })
                        }}
                    />
                </div>}

                <div style={{flex: 1,  height: "100%",}}>
                    <div style={{ height: "100%",}}>
                        <div className={classes.mainContainer} style={{display: "flex", height: "100%",}}>
                            <div className={classes.showOnMobile} style={{flex: 1, marginRight: "0", height: "100%", overflowY: "scroll"}}>
                                <JobCards
                                    jobs={this.jobs}
                                    selectedJobId={this.state.selectedJobId}
                                    selectedLocations={this.state.selectedLocations}
                                    selectedCompanies={this.state.selectedCompanies}
                                    selectedIndustries={this.state.selectedIndustries}
                                    selectedAffinities={this.state.selectedAffinities}
                                    selectedRoles={this.state.selectedRoles}
                                    selectedDegreeRequirements={this.state.selectedDegreeRequirements}
                                    setSelectedJob={this.setSelectedJob.bind(this)}
                                    mobile={true}
                                />
                            </div>
                            <div className={classes.hideOnMobile} style={{flex: "0 0 356px", marginRight: "49px", height: "100%", overflowY: "scroll"}}>
                                <JobCards
                                    jobs={this.jobs}
                                    selectedJobId={this.state.selectedJobId}
                                    selectedLocations={this.state.selectedLocations}
                                    selectedCompanies={this.state.selectedCompanies}
                                    selectedIndustries={this.state.selectedIndustries}
                                    selectedAffinities={this.state.selectedAffinities}
                                    selectedRoles={this.state.selectedRoles}
                                    selectedDegreeRequirements={this.state.selectedDegreeRequirements}
                                    setSelectedJob={this.setSelectedJob.bind(this)}
                                />
                            </div>
                            <div className={classes.hideOnMobile} style={{flex: 1, height: "100%", overflowY: "scroll"}}>
                                <JobDetails
                                    job={this.state.selectedJob}
                                    onApply={this.openApplyModal.bind(this)}

                                    forceCompany={this.forceCompany.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <JobAlertSignUp
                open={this.state.showJobAlerts}
                onClose={this.closeJobAlerts.bind(this)}
                state={this.state}
            />

            <ApplyNowModal
                open={this.state.showApplyNow}
                job={this.state.selectedJob}
                onClose={this.closeApplyModal.bind(this)}
            />

            <JobAssistantModal
                open={this.state.showJobAssistant}
                job={this.state.selectedJob}
                onClose={this.closeJobAssistant.bind(this)}
                onSubmit={this.submitJobAssistant.bind(this)}

                addToField={this.addToField.bind(this)}
                removeFromField={this.removeFromField.bind(this)}

                state={this.state}
            />


        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(Jobs)));

