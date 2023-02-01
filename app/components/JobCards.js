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
import JobDetails from "./JobDetails";

const Styles = {
    container: {
        padding: "0",
        marginBottom: "200px",
        '@media (max-width: 768px)': {
            padding: "0",
            marginBottom: "20px",

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

        let params = (new URL(document.location)).searchParams;
        let job_id = params.get("j");

        console.log("job_id", job_id, !!job_id)

        this.state = {
            showMobileJob: !!job_id
        };
    }

    componentDidMount() {

    }

    filterJobs(jobs) {
        let {
            selectedLocations,
            selectedCompanies,
            selectedIndustries,
            selectedCompanyIndustries,
            selectedDegreeRequirements,
            selectedRoles,
            selectedAffinities,
            selectedSeniorities,
            glassdoor_overall,
            glassdoor_work_life,
            glassdoor_culture,
            glassdoor_compensation,
        } = this.props;

        let filteredJobs = [];
        let unFilteredJobs = [];

        jobs = jobs || [];

        jobs.forEach((job) => {

            let validLocation = true;

            // if (selectedLocations && selectedLocations.length) {
            //     validLocation = false;
            //     let found = false;
            //
            //     if (job && job.locations) {
            //         job.locations.forEach((location) => {
            //             if (selectedLocations.indexOf(location.location_id) !== -1) {
            //                 found = true
            //             }
            //         })
            //     }
            //     if (found) {
            //         validLocation = true;
            //     }
            // }

            let validCompany = true;

            // if (selectedCompanies && selectedCompanies.length) {
            //     validCompany = false;
            //     let found = false;
            //
            //     if (job && job.companies) {
            //         job.companies.forEach((company) => {
            //             if (company && company.company_id && selectedCompanies.indexOf(company.company_id + "") !== -1) {
            //                 found = true
            //             }
            //         })
            //     }
            //     if (found) {
            //         validCompany = true;
            //     }
            // }

            let validIndustry = true;

            // if (selectedIndustries && selectedIndustries.length) {
            //     validIndustry = false;
            //     let found = false;
            //
            //     if (job && job.industries) {
            //         job.industries.forEach((industry) => {
            //             if (selectedIndustries.indexOf(industry.industry_id) !== -1) {
            //                 found = true
            //             }
            //         })
            //     }
            //     if (found) {
            //         validIndustry = true;
            //     }
            // }

            let validCompanyIndustry = true;

            // if (selectedCompanyIndustries && selectedCompanyIndustries.length) {
            //     validCompanyIndustry = false;
            //     let found = false;
            //
            //     if (job && job.companies) {
            //         job.companies.forEach((company) => {
            //             if (company.company_industry && company.company_industry.length) {
            //                 if (selectedCompanyIndustries.indexOf(company.company_industry) !== -1) {
            //                     found = true;
            //                 }
            //             }
            //         })
            //     }
            //
            //     if (found) {
            //         validCompanyIndustry = true;
            //     }
            // }

            let validSeniority = true;

            // if (selectedSeniorities && selectedSeniorities.length) {
            //     validSeniority = false;
            //     let found = false;
            //
            //     if (job && job.job_seniority) {
            //         if (selectedSeniorities.indexOf(job.job_seniority) !== -1) {
            //             found = true
            //         }
            //     }
            //     if (found) {
            //         validSeniority = true;
            //     }
            // }


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

            // if (selectedRoles && selectedRoles.length) {
            //     validRole = false;
            //     let found = false;
            //
            //     if (job && job.job_types) {
            //         job.job_types.forEach((job_type) => {
            //             if (selectedRoles.indexOf(job_type.job_type_id) !== -1) {
            //                 found = true
            //             }
            //         })
            //     }
            //     if (found) {
            //         validRole = true;
            //     }
            // }

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

            let validGlassdoorOverall = true;

            if (glassdoor_overall) {

                if (job.companies && job.companies.length) {
                    let company = job.companies[0];
                    if (!company.glassdoor_overall || parseFloat(company.glassdoor_overall) < parseFloat(glassdoor_overall))
                        validGlassdoorOverall = false
                } else {
                    validGlassdoorOverall = false
                }
            }

            let validGlassdoorCompensation = true;

            if (glassdoor_compensation) {

                if (job.companies && job.companies.length) {
                    let company = job.companies[0];
                    if (!company.glassdoor_compensation || parseFloat(company.glassdoor_compensation) < parseFloat(glassdoor_compensation))
                        validGlassdoorCompensation = false
                } else {
                    validGlassdoorCompensation = false
                }
            }

            let validGlassdoorCulture = true;

            if (glassdoor_culture) {

                if (job.companies && job.companies.length) {
                    let company = job.companies[0];
                    if (!company.glassdoor_culture || parseFloat(company.glassdoor_culture) < parseFloat(glassdoor_culture))
                        validGlassdoorCulture = false
                } else {
                    validGlassdoorCulture = false
                }
            }

            let validGlassdoorWorkLife = true;

            if (glassdoor_work_life) {

                if (job.companies && job.companies.length) {
                    let company = job.companies[0];
                    if (!company.glassdoor_work_life || parseFloat(company.glassdoor_work_life) < parseFloat(glassdoor_work_life))
                        validGlassdoorWorkLife = false
                } else {
                    validGlassdoorWorkLife = false
                }
            }

            let valid = validGlassdoorOverall && validGlassdoorCompensation && validGlassdoorCulture && validGlassdoorWorkLife &&
                validLocation && validCompany && validIndustry && validCompanyIndustry && validDegreeRequirement && validSeniority && validRole && validAffinity;

            if (job && job.companies && job.companies.length && job.companies[0] ) {
                if (valid && !job.is_fill) {
                    filteredJobs.push(job);
                } else {
                    unFilteredJobs.push(job);
                }
            } else {
                // console.log(job.companies.length, job.companies, job.companies[0])
            }
        });

        // console.log(filteredJobs);
        return {
            filteredJobs: filteredJobs,
            unFilteredJobs: unFilteredJobs,
            usingFilters: (glassdoor_overall || glassdoor_culture || glassdoor_work_life || glassdoor_compensation) || (selectedLocations && selectedLocations.length) ||
                (selectedCompanies && selectedCompanies.length) ||
                (selectedIndustries && selectedIndustries.length) ||
                (selectedCompanyIndustries && selectedCompanyIndustries.length) ||
                (selectedSeniorities && selectedSeniorities.length) ||
                (selectedDegreeRequirements && selectedDegreeRequirements.length) ||
                (selectedRoles && selectedRoles.length) ||
                (selectedAffinities && selectedAffinities.length)
        }
    }

    render() {
        let { classes, client, match: { params }, resetMax, resetScrollPosition, updateSavedJobIds, forceCompany, onApply, user, saved_jobs, saved_jobs_ids, job, jobs, selectedJobId, setSelectedJob, handleScroll, mobile, loading, MAX_RESULTS} = this.props;

        console.time("done filtering");
        let { filteredJobs, unFilteredJobs, usingFilters } = this.filterJobs(jobs);
        console.timeEnd("done filtering");

        filteredJobs = filteredJobs.slice(0, MAX_RESULTS);
        unFilteredJobs = unFilteredJobs.slice(0, MAX_RESULTS);
        // console.log("lengths:", filteredJobs.length, unFilteredJobs.length, usingFilters);


        return (<div className={classes.container}>

            <div style={{...FONT_TITLE_3_BOLD, marginBottom: "20px", display: mobile && this.state.showMobileJob ? "none" : null}}>{usingFilters ? "Filtered": "All"} Jobs</div>
            <div onClick={() => {
                this.setState({showMobileJob: !this.state.showMobileJob});
                resetScrollPosition ? resetScrollPosition() : null;
                resetMax ? resetMax() : null;
            }} className={classes.showOnMobile} style={{...COMMON.FONTS.P200, display: this.state.showMobileJob ? null : "none", marginBottom: "20px", fontSize: "13px"}}>
                <i className="fa-solid fa-arrow-left-long"/> View all Jobs
            </div>

            <div style={{display: this.state.showMobileJob ? null : "none"}} className={classes.showOnMobile}>
                <JobDetails
                    job={job}
                    saved_jobs_ids={saved_jobs_ids}
                    saved_jobs={saved_jobs}
                    user={user}
                    onApply={onApply}

                    forceCompany={forceCompany}
                    updateSavedJobIds={updateSavedJobIds}
                />
            </div>

            {!mobile || !this.state.showMobileJob ? <InfiniteScroll
                style={{display: mobile && this.state.showMobileJob ? "none" : null}}
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
                        return (<div className={classes.cardPadding} key={job.job_id} onClick={() => {
                            setSelectedJob(job.job_id);
                            this.setState({showMobileJob: true});
                            resetScrollPosition ? resetScrollPosition() : null;
                            resetMax ? resetMax() : null;
                        }}>
                            <JobCard mobile={mobile} job={job} selectedJobId={selectedJobId}/>
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
                        return (<div className={classes.cardPadding} key={job.job_id} onClick={() => {
                            setSelectedJob(job.job_id);
                            this.setState({showMobileJob: true});
                            resetScrollPosition ? resetScrollPosition() : null;
                            resetMax ? resetMax() : null;

                        }}>
                            <JobCard mobile={mobile} job={job} selectedJobId={selectedJobId}/>
                        </div>);
                    })}
                </div>}
            </InfiniteScroll> : null}





        </div>);
    }

}

export default withApollo(withRouter(injectSheet(Styles)(JobCards)));

