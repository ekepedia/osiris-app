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
import COMMON from "../common/index";

import JobCard from "./JobCard";
import LoadingJobCard from "./LoadingJobCard";
import InfiniteScroll from "react-infinite-scroll-component";

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
    },
    ...COMMON.STYLES.MOBILE_STYLES
};

class JobCards extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
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
            selectedAffinities,
            selectedSeniorities
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
                        if (company && company.company_id && selectedCompanies.indexOf(company.company_id) !== -1) {
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

            let validSeniority = true;

            if (selectedSeniorities && selectedSeniorities.length) {
                validSeniority = false;
                let found = false;

                if (job && job.job_seniority) {
                    if (selectedSeniorities.indexOf(job.job_seniority) !== -1) {
                        found = true
                    }
                }
                if (found) {
                    validSeniority = true;
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

            let valid = validLocation && validCompany && validIndustry && validDegreeRequirement && validSeniority && validRole && validAffinity;

            if (job && job.companies && job.companies.length && job.companies[0] ) {
                if (valid) {
                    filteredJobs.push(job);
                } else {
                    unFilteredJobs.push(job);
                }
            } else {
                // console.log(job.companies.length, job.companies, job.companies[0])
            }
        });

        console.log(filteredJobs);
        return {
            filteredJobs: filteredJobs,
            unFilteredJobs: unFilteredJobs,
            usingFilters: (selectedLocations && selectedLocations.length) ||
                (selectedCompanies && selectedCompanies.length) ||
                (selectedIndustries && selectedIndustries.length) ||
                (selectedSeniorities && selectedSeniorities.length) ||
                (selectedDegreeRequirements && selectedDegreeRequirements.length) ||
                (selectedRoles && selectedRoles.length) ||
                (selectedAffinities && selectedAffinities.length)
        }
    }

    render() {
        let { classes, client, match: { params }, jobs, selectedJobId, setSelectedJob, handleScroll, mobile, loading, MAX_RESULTS} = this.props;

        console.time("done filtering");
        let { filteredJobs, unFilteredJobs, usingFilters } = this.filterJobs(jobs);
        console.timeEnd("done filtering");

        filteredJobs = filteredJobs.slice(0, MAX_RESULTS);
        unFilteredJobs = unFilteredJobs.slice(0, MAX_RESULTS);
        // console.log("lengths:", filteredJobs.length, unFilteredJobs.length, usingFilters);


        return (<div className={classes.container}>

            <div style={{...FONT_TITLE_3_BOLD, marginBottom: mobile ? null : "20px"}}>{usingFilters ? "Filtered": "All"} Jobs</div>
            <div className={classes.showOnMobile} style={{...COMMON.FONTS.P200, marginBottom: "20px", fontSize: "13px"}}>We are actively developing the mobile version of the job board and can't wait to share it with you once it's complete!</div>

            <InfiniteScroll
                dataLength={MAX_RESULTS}
                next={() => {
                    console.log("loading more!", MAX_RESULTS);
                    handleScroll();
                }}
                hasMore={true}
                scrollThreshold={"100px"}
                scrollableTarget="mobile-cards-container"
                loader={<div className="loader" key={0}></div>}
                endMessage={
                    <div style={{ textAlign: 'center' }}>

                    </div>
                }
            >
                {loading ? [1,2,3,4,5].map((k) => {
                    return (<div className={classes.cardPadding} key={k}>
                        <LoadingJobCard />
                    </div>);
                }) : <div>
                    {filteredJobs.map((job) => {
                        return (<div className={classes.cardPadding} key={job.job_id} onClick={() => (setSelectedJob(job.job_id))}>
                            <JobCard job={job} selectedJobId={selectedJobId}/>
                        </div>);
                    })}

                    {(usingFilters && !filteredJobs.length) ? <div style={{
                        padding: "15px",
                        border: `1px solid ${COMMON.COLORS.N400}`,
                        borderRadius: "4px",
                        background: COMMON.COLORS.N0
                    }}>
                        <div style={{...COMMON.FONTS.H400}}>No Perfect Matches</div>
                        <div style={{...COMMON.FONTS.P100}}>
                            We are actively adding jobs to our board, but in the meantime, check out these additional opportunities!
                        </div>
                    </div>: null}

                    {(usingFilters && unFilteredJobs && unFilteredJobs.length >= 1) ? <div style={{...FONT_TITLE_3_BOLD, margin: "20px 0"}}>Additional Opportunities</div> : null}

                    {unFilteredJobs.map((job) => {
                        return (<div className={classes.cardPadding} key={job.job_id} onClick={() => (setSelectedJob(job.job_id))}>
                            <JobCard job={job} selectedJobId={selectedJobId}/>
                        </div>);
                    })}
                </div>}
            </InfiniteScroll>



        </div>);
    }

}

export default withApollo(withRouter(injectSheet(Styles)(JobCards)));

