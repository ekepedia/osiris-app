import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../services/DataService';

import { COLOR_WHITE } from "../common/colors";
import { FONT_BODY_BOLD, FONT_TITLE_3_BOLD, FONT_TITLE_3 } from "../common/fonts";

import JobCard from "./JobCard";

const Styles = {
    container: {
        padding: "0",
        marginBottom: "200px",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    cardPadding: {
        marginBottom: "10px"
    }
};

class JobCards extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    filterJobs(jobs) {
        let {
            selectedLocations,
            selectedCompanies,
            selectedIndustries,
            selectedDegreeRequirements,
            selectedRoles,
            selectedAffinities
        } = this.props;

        let filteredJobs = [];
        let unFilteredJobs = [];

        jobs = jobs || [];

        jobs.forEach((job) => {

            let validLocation = true;

            if (selectedLocations && selectedLocations.length) {
                validLocation = false;
                let found = false;

                if (job && job.locations) {
                    job.locations.forEach((location) => {
                        if (selectedLocations.indexOf(location.location_id) !== -1) {
                            found = true
                        }
                    })
                }
                if (found) {
                    validLocation = true;
                }
            }

            let validCompany = true;

            if (selectedCompanies && selectedCompanies.length) {
                validCompany = false;
                let found = false;

                if (job && job.companies) {
                    job.companies.forEach((company) => {
                        if (selectedCompanies.indexOf(company.company_id) !== -1) {
                            found = true
                        }
                    })
                }
                if (found) {
                    validCompany = true;
                }
            }

            let validIndustry = true;

            if (selectedIndustries && selectedIndustries.length) {
                validIndustry = false;
                let found = false;

                if (job && job.industries) {
                    job.industries.forEach((industry) => {
                        if (selectedIndustries.indexOf(industry.industry_id) !== -1) {
                            found = true
                        }
                    })
                }
                if (found) {
                    validIndustry = true;
                }
            }


            let validDegreeRequirement = true;

            if (selectedDegreeRequirements && selectedDegreeRequirements.length) {
                validDegreeRequirement = false;
                let found = false;

                if (job && job.industries) {
                    job.degree_requirements.forEach((degree_requirement) => {
                        if (selectedDegreeRequirements.indexOf(degree_requirement.degree_requirement_id) !== -1) {
                            found = true
                        }
                    })
                }
                if (found) {
                    validDegreeRequirement = true;
                }
            }


            let validRole = true;

            if (selectedRoles && selectedRoles.length) {
                validRole = false;
                let found = false;

                if (job && job.job_types) {
                    job.job_types.forEach((job_type) => {
                        if (selectedRoles.indexOf(job_type.job_type_id) !== -1) {
                            found = true
                        }
                    })
                }
                if (found) {
                    validRole = true;
                }
            }

            let validAffinity = true;

            if (selectedAffinities && selectedAffinities.length) {
                validAffinity = false;
                let found = false;

                if (job && job.affinities) {
                    job.affinities.forEach((affinity) => {
                        if (selectedAffinities.indexOf(affinity.affinity_id) !== -1) {
                            found = true
                        }
                    })
                }
                if (found) {
                    validAffinity = true;
                }
            }

            let valid = validLocation && validCompany && validIndustry && validDegreeRequirement && validRole && validAffinity;

            if (job && job.companies && job.companies.length && job.companies[0] ) {
                if (valid) {
                    filteredJobs.push(job);
                } else {
                    unFilteredJobs.push(job);
                }
            } else {
                console.log(job.companies.length, job.companies, job.companies[0])
            }
        });

        return {
            filteredJobs,
            unFilteredJobs,
            usingFilters: (selectedLocations && selectedLocations.length) ||
                (selectedCompanies && selectedCompanies.length) ||
                (selectedIndustries && selectedIndustries.length) ||
                (selectedDegreeRequirements && selectedDegreeRequirements.length) ||
                (selectedRoles && selectedRoles.length) ||
                (selectedAffinities && selectedAffinities.length)
        }
    }

    render() {
        let { classes, client, match: { params }, jobs, selectedJobId, setSelectedJob, mobile} = this.props;


        const { filteredJobs, unFilteredJobs, usingFilters } = this.filterJobs(jobs);



        return (<div className={classes.container}>

            <div style={{...FONT_TITLE_3_BOLD, marginBottom: mobile ? null : "20px"}}>{usingFilters ? "Filtered": ""} Jobs</div>
            {mobile && <div style={{...FONT_TITLE_3, marginBottom: "20px", fontSize: "16px"}}>Mobile Coming Soon!</div>}

            {filteredJobs.map((job) => {
                return (<div className={classes.cardPadding} key={job.job_id} onClick={() => (setSelectedJob(job.job_id))}>
                    <JobCard job={job} selectedJobId={selectedJobId}/>
                </div>);
            })}

            {(filteredJobs && filteredJobs.length >= 1 && unFilteredJobs && unFilteredJobs.length >= 1) && <div style={{...FONT_TITLE_3_BOLD, margin: "20px 0"}}>Additional Opportunities</div>}

            {unFilteredJobs.map((job) => {
                return (<div className={classes.cardPadding} key={job.job_id} onClick={() => (setSelectedJob(job.job_id))}>
                    <JobCard job={job} selectedJobId={selectedJobId}/>
                </div>);
            })}
        </div>);
    }

}

export default withApollo(withRouter(injectSheet(Styles)(JobCards)));

