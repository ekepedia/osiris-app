import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';
import async from 'async';
import Lottie from 'react-lottie';
import loadingCircles from "../../common/lottie/loading-circles.js";

import DataService from '../../services/DataService';
import COMMON from "../../common";
import CompanyService from "../../services/CompanyService";
import CompanyDemographicService from "../../services/CompanyDemographicService";
import {mc, formatLargeNumber } from "../../common/helpers";
import CompanyIndexRow from "./components/CompanyIndexRow";
import StandardInput from "../../components/StandardInput";
import NavBar from "../../components/NavBar";
import StandardMultiSelect from "../../components/StandardMultiSelect";
import TrackingService from "../../services/TrackingService";
import InfiniteScroll from 'react-infinite-scroll-component';
import RatingFilter from "../../components/RatingFilter";
import DoubleSlider from "../../components/DoubleSlider";
import StandardCheckbox from "../../components/StandardCheckbox";
import UserUniversityService from "../../services/UserUniversityService";
import UserPreferenceService from "../../services/UserPreferenceService";
import AuthService from "../../services/AuthService";
import axios from "axios";

const SORTS = {
    BIPOC: 1,
    FEMALE: 2,
    SIZE: 3,
    NAME: 4,
    OVERALL: 5,
    WORKLIFE: 6,
    PAY: 7,
    RANK: 8,
}

const Styles = {
    container: {
        padding: "0 50px",
        '@media (max-width: 768px)': {
            padding: "0 20px",
        },
    },
    ...COMMON.STYLES.COMPANY.CompanyPageStyles,
    ...COMMON.STYLES.COMPANY.CompanyRowStyles,
    ...COMMON.STYLES.GENERAL.NavigationStyles,
};

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingCircles,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

class CompanyIndex extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            minEmployees: 0,
            employeeFilter: 0,
            maxEmployees: 20000,
            femaleEmployeeFilter: 0,
            bipocEmployeeFilter: 0,
            locations: [],
            locationsOptions: [],
            selectedLocations: [],
            industries: [],
            industriesOptions: [],
            selectedIndustries: [],
            companyNameFilter: "",
            MAX_RESULTS: 10,
            sort_param: SORTS.RANK,
            reverse: false,
            glassdoorOverallFilter: null,
            glassdoorWorkLifeFilter: null,
            glassdoorPayFilter: null,
            only_jobs: false
        };
    }

    componentDidMount() {
        let counts = {};
        async.parallel([
            (cb) =>  {
                this.loadCompanies().then(() => {
                    cb();
                });
            },
            (cb) => {
                this.loadUserPreferences().then(() => {
                    cb();
                });
            },
            (cb) => {
                this.loadCompanyDemographics().then(() => {
                    cb();
                });
            },
            (cb) => {
                CompanyService.getJobCounts({}).then((job_counts) => {
                    counts = job_counts;
                    cb();
                });
            },
        ], (err) => {
            console.log("BOTH DONE!!!", err);
            console.time("PROCESS COMPANIES");

            let { processed_companies } = this.processCompanies(this.state);
            console.timeEnd("PROCESS COMPANIES");

            this.setState({
                companies: processed_companies,
                job_counts: counts
            })

        })
    }

    loadUserPreferences() {
        let { client } = this.props;

        return new Promise((resolve) => {
            const user_id = AuthService.getCurrentUserIdSync();
            if (user_id) {
                axios.get("/api/cities").then((response) => {
                    if (response && response.data && response.data.cities) {
                        let CITIES = response.data.cities;
                        let CITIES_MAP = {};
                        CITIES.forEach((c) => {
                            CITIES_MAP[c.value] = c;
                        });

                        UserPreferenceService.getUserPreference({client, user_id}).then((user_preferences) => {
                            console.log("user_preferences", user_preferences);

                            let selectedIndustries = [];
                            let selectedLocations = [];
                            user_preferences = user_preferences || [];
                            user_preferences.forEach((user_preference) => {
                                if (user_preference.type_id === COMMON.CONSTS.PREFERENCE_TYPES.INDUSTRIES) {
                                    let industry = COMMON.CONSTS.INDUSTRIES_MAP[user_preference.preference_id];
                                    console.log("user_preference industry", industry );

                                    if (industry && industry.label) {
                                        selectedIndustries.push(industry.label)
                                    }
                                }

                                if (user_preference.type_id === COMMON.CONSTS.PREFERENCE_TYPES.LOCATIONS) {
                                    let location = CITIES_MAP[user_preference.preference_id];
                                    console.log("user_preference location", location );

                                    if (location && location.label) {
                                        selectedLocations.push(location.label)
                                    }
                                }
                            })

                            this.setState({
                                selectedIndustries,
                                selectedLocations
                            })
                            resolve();
                        });
                    }
                })

            } else {
                return resolve();
            }
        });
    }

    loadCompanies() {
        let { client } = this.props;

        let overall_sum = 0;
        let overall_count = 0;

        let worklife_sum = 0;
        let worklife_count = 0;

        let pay_sum = 0;
        let pay_count = 0;

        return new Promise((resolve) => {
            console.time("LOAD COMPANIES");
            CompanyService.getCompanies({client}).then((companies) => {
                // console.log("LOADED COMPANIES", companies);
                console.timeEnd("LOAD COMPANIES");

                let max = 0;

                companies = companies.sort((a, b) => {

                    max = Math.max(a.company_size, Math.max(b.company_size, max))

                    let nameA = a.company_name || "";
                    let nameB = b.company_name || "";

                    return nameA.localeCompare(nameB);
                });

                companies.forEach((company) => {
                    if (company.glassdoor_overall) {
                        overall_sum += parseFloat(company.glassdoor_overall);
                        overall_count += 1;
                    }

                    if (company.glassdoor_work_life) {
                        worklife_sum += parseFloat(company.glassdoor_work_life);
                        worklife_count += 1;
                    }

                    if (company.glassdoor_compensation) {
                        pay_sum += parseFloat(company.glassdoor_compensation);
                        pay_count += 1;
                    }
                })

                const overall_average = overall_sum/overall_count;
                const worklife_average = worklife_sum/worklife_count;
                const pay_average = pay_sum/pay_count;

                this.setState({
                    unprocessed_companies: companies,
                    overall_average,
                    worklife_average,
                    pay_average
                    // maxEmployees: max
                });

                this.loadCompanyLocations(companies);
                this.loadCompanyIndustries(companies);

                resolve({companies,
                    overall_average,
                    worklife_average,
                    pay_average});
            })

        })
    }

    loadCompanyLocations(companies) {
        let locations = [];
        let locationsOptions = [];
        // {company.company_city || "San Diego"}, {company.company_state || "CA"}
        companies.forEach((company) => {
            if (company.company_city && company.company_state){
                locations.push(`${company.company_city}, ${company.company_state}`);
            }
        });

        locations = _.uniq(locations);
        locations = locations.sort();
        locationsOptions = locations.map((location) => {
            return {
                value: location,
                label: location
            }
        })
        // console.log("new locations,", locations);
        // console.log("new locationsOptions,", locationsOptions);
        // console.log("new locationsOptions,", locationsOptions);

        setTimeout(() => {
            console.log("this.state.selectedLocations", this.state.selectedLocations)

            if (this.state.selectedLocations && this.state.selectedLocations.length) {
                let selectedLocations = this.state.selectedLocations;
                console.log("this.state.selectedLocations", this.state.selectedLocations)
                this.state.selectedLocations.forEach((location) => {
                    if (locations.indexOf(location) === -1) {
                        selectedLocations = _.filter(selectedLocations, (l) => (l !== location))
                    }
                })
                this.setState({selectedLocations})
            }
        }, 2000);


        this.setState({
            locations,
            locationsOptions
        })

        return {
            locations,
            locationsOptions
        }

    }

    loadCompanyIndustries(companies) {
        let industries = [];
        let industriesOptions = [];
        // {company.company_city || "San Diego"}, {company.company_state || "CA"}
        companies.forEach((company) => {
            industries.push(company.company_industry);
        });

        industries = _.uniq(industries);
        industries = industries.sort();
        industriesOptions = industries.map((industry) => {
            return {
                value: industry,
                label: industry
            }
        })
        // console.log("new locations,", industries);
        // console.log("new locationsOptions,", industriesOptions);
        this.setState({
            industries,
            industriesOptions
        })

    }

    loadCompanyDemographics() {
        let { client } = this.props;

        return new Promise((resolve) => {
            CompanyDemographicService.getCompanyDemographics({client}).then((company_demographics) => {
                // console.log("LOADED COMPANY DEMOGRAPHICS", company_demographics);

                let company_demographics_map = {};
                let company_demographics_yearly_map = {};

                if (company_demographics && company_demographics.length) {
                    company_demographics.map((company_demographic) => {
                        company_demographics_map[company_demographic.company_id] = company_demographic;

                        company_demographics_yearly_map[company_demographic.company_id] = company_demographics_yearly_map[company_demographic.company_id] || {};
                        company_demographics_yearly_map[company_demographic.company_id][company_demographic.year] = company_demographic;
                    })
                }

                // console.log(company_demographics_yearly_map)

                this.setState({
                    company_demographics,
                    company_demographics_map,
                    company_demographics_yearly_map
                });

                resolve({
                    company_demographics,
                    company_demographics_map,
                    company_demographics_yearly_map
                });
            })

        })
    }


    findLabel(options, id) {
        if (!options || !options.length || !id)
            return null

        let label = null;

        // console.log(options, id)
        options.map((option) => {
            if (option.value + "" === id + "")
                label = option.label
        })

        // console.log("FOUND THE LABEL", label)
        return label;
    }

    resetMaxResults() {
        this.setState({
            MAX_RESULTS: 10
        })
    }

    processCompanies({companies, unprocessed_companies, company_demographics_map, company_demographics_yearly_map,}) {

        companies = companies || unprocessed_companies || [];
        company_demographics_map = company_demographics_map || {};
        company_demographics_yearly_map = company_demographics_yearly_map || {};

        const getBipocRepresentation = (company_demographics) => {
            let bipoc_numbers = parseFloat(company_demographics.employees_asian || "0") +
                parseFloat(company_demographics.employees_black || "0") +
                parseFloat(company_demographics.employees_latinx || "0") +
                parseFloat(company_demographics.employees_indigenous || "0");

            let white_numbers = parseFloat(company_demographics.employees_white || "0")

            let bipoc_respresentation = Math.round((bipoc_numbers/(white_numbers + bipoc_numbers)) * 1000)/10;

            return company_demographics.employees_bipoc || bipoc_respresentation;
        };

        const getYearAndComparisonYear = (company_id) => {
            let mapping = company_demographics_yearly_map[company_id];
            if (!mapping || !Object.keys(mapping) || !Object.keys(mapping).length) return {};

            let years = (Object.keys(mapping).map((v) => (parseFloat(v))) || []).sort((a,b) => (b-a));

            if (years.length <= 1) {
                return {
                    currentYear: years[0],
                    previousYear: null
                }
            }

            return {
                currentYear: years[0],
                previousYear: years[1],
            }
        };

        let processed_companies = companies.map((company) => {
            const { company_id } = company;

            const {currentYear, previousYear} = getYearAndComparisonYear(company_id);

            const company_demographics = company_demographics_yearly_map[company_id] ? (company_demographics_yearly_map[company_id][currentYear] || {}) : {};
            const previous_company_demographics = company_demographics_yearly_map[company_id] ? (company_demographics_yearly_map[company_id][previousYear] || {}) : {};

            const bipoc_respresentation = getBipocRepresentation(company_demographics);
            const previous_bipoc_respresentation = previousYear ? getBipocRepresentation(previous_company_demographics) : null;
            const bipoc_respresentation_change = previousYear ? Math.round((bipoc_respresentation - previous_bipoc_respresentation)*100)/100 : null;

            const female_respresentation = company_demographics.employees_female;
            const previous_female_respresentation = previousYear ? previous_company_demographics.employees_female : null;
            const female_respresentation_change = previousYear ? Math.round((female_respresentation - previous_female_respresentation)*100)/100 : null;

            return {
                ...company,
                company_demographics,
                previous_company_demographics,
                bipoc_respresentation,
                female_respresentation,
                bipoc_respresentation_change,
                female_respresentation_change,
                currentYear,
                previousYear,
                rank_value: 1 - (((100 - (bipoc_respresentation || 0))*2 + (100 - (female_respresentation || 0)))/300)
            }
        })

        processed_companies = processed_companies.sort((a, b) => {
            return b.rank_value - a.rank_value
        });

        processed_companies = processed_companies.map((company, i) =>{
            return {
                ...company,
                rank: i + 1
            }
        });

        return {
            processed_companies
        };
    }

    filterCompanies(companies) {
        let {
            company_demographics_map,
            company_demographics_yearly_map,
            companyNameFilter,
            selectedLocations,
            selectedIndustries,
            employeeFilter,
            femaleEmployeeFilter,
            bipocEmployeeFilter,
            MAX_RESULTS,
            overall_average,
            worklife_average,
            pay_average,
            glassdoorOverallFilter,
            glassdoorWorkLifeFilter,
            glassdoorPayFilter,
            job_counts,
            only_jobs,
        } = this.state;

        const { history } = this.props;

        if (!companies || !companies.length)
            return {
                filtered_companies: [],
                available: 0
            }

        let filtered_companies = companies.map((company, i) => {
            const { company_id,
                bipoc_respresentation,
                bipoc_respresentation_change,
                female_respresentation,
                company_demographics,
                female_respresentation_change,
                currentYear,
                previousYear
            } = company;


            if (only_jobs) {
                if (!job_counts[company.company_id])
                    return null;
            }

            if (companyNameFilter && companyNameFilter.length) {
                const filter = companyNameFilter.toLowerCase();
                const name = (company.company_name || "").toLowerCase();

                if (name.indexOf(filter) === -1)
                    return null;
            }

            if (employeeFilter) {
                if (parseFloat(company.company_size) < parseFloat(employeeFilter))
                    return null;

                if (parseFloat(employeeFilter) >= 1 && !company.company_size)
                    return null;
            }

            if (femaleEmployeeFilter) {
                if (parseFloat(company_demographics.employees_female) < parseFloat(femaleEmployeeFilter))
                    return null;

                if (parseFloat(femaleEmployeeFilter) >= 1 && !company_demographics.employees_female)
                    return null;
            }

            if (bipocEmployeeFilter) {
                if (bipoc_respresentation < parseFloat(bipocEmployeeFilter))
                    return null;

                if (parseFloat(bipocEmployeeFilter) >= 1 && !bipoc_respresentation)
                    return null;
            }

            if (selectedLocations && selectedLocations.length) {
                const company_location = `${company.company_city}, ${company.company_state}`;
                let found = false;
                selectedLocations.forEach((location) => {
                    if (company_location === location)
                        found = true
                });

                if (!found)
                    return null;
            }

            if (selectedIndustries && selectedIndustries.length) {
                let found = false;
                selectedIndustries.forEach((industry) => {
                    if (company.company_industry === industry)
                        found = true
                });

                if (!found)
                    return null;
            }

            if (glassdoorOverallFilter) {
                if (!company.glassdoor_overall || parseFloat(company.glassdoor_overall) < parseFloat(glassdoorOverallFilter))
                    return null;
            }

            if (glassdoorWorkLifeFilter) {
                if (!company.glassdoor_work_life || parseFloat(company.glassdoor_work_life) < parseFloat(glassdoorWorkLifeFilter))
                    return null;
            }

            if (glassdoorPayFilter) {
                if (!company.glassdoor_compensation || parseFloat(company.glassdoor_compensation) < parseFloat(glassdoorPayFilter))
                    return null;
            }

            if (!company.company_logo_url)
                return null;

            return (<CompanyIndexRow only_jobs={only_jobs} job_counts={job_counts} history={history} id={`company-index-row-${i}`} index={i + 1} key={company_id} {...{company, overall_average, worklife_average, pay_average, company_demographics, bipoc_respresentation, bipoc_respresentation_change, female_respresentation_change, currentYear, previousYear}}/>);
        })

        filtered_companies = _.without(filtered_companies, null);

        return {
            filtered_companies: filtered_companies.slice(0, MAX_RESULTS),
            available: filtered_companies.length
        }
    }

    resetScrollPosition() {
        document.querySelector("#scrollableDiv").scrollTop = 0;
    }

    sortCompanies(companies, sort_param, reverse) {
        let sorted_companies = [];
        companies = companies || [];

        if (sort_param === SORTS.SIZE) {
            sorted_companies = companies.sort((a, b) => {
                let sizeA = a.company_size || 0;
                let sizeB = b.company_size || 0;

                return reverse ? sizeB - sizeA : sizeA - sizeB
            });
        } else if (sort_param === SORTS.BIPOC) {
            sorted_companies = companies.sort((a, b) => {
                let sizeA = a.bipoc_respresentation || 0;
                let sizeB = b.bipoc_respresentation || 0;

                return reverse ? sizeB - sizeA : sizeA - sizeB
            });
        }  else if (sort_param === SORTS.FEMALE) {
            sorted_companies = companies.sort((a, b) => {
                let sizeA = a.female_respresentation || 0;
                let sizeB = b.female_respresentation || 0;

                return reverse ? sizeB - sizeA : sizeA - sizeB
            });
        } else if (sort_param === SORTS.RANK) {
            sorted_companies = companies.sort((a, b) => {
                let sizeA = a.rank || 0;
                let sizeB = b.rank || 0;

                return reverse ? sizeB - sizeA : sizeA - sizeB
            });
        } else if (sort_param === SORTS.OVERALL) {
            sorted_companies = companies.sort((a, b) => {
                let sizeA = a.glassdoor_overall || 0;
                let sizeB = b.glassdoor_overall || 0;

                return reverse ? sizeB - sizeA : sizeA - sizeB
            });
        } else if (sort_param === SORTS.WORKLIFE) {
            sorted_companies = companies.sort((a, b) => {
                let sizeA = a.glassdoor_work_life || 0;
                let sizeB = b.glassdoor_work_life || 0;

                return reverse ? sizeB - sizeA : sizeA - sizeB
            });
        } else if (sort_param === SORTS.PAY) {
            sorted_companies = companies.sort((a, b) => {
                let sizeA = a.glassdoor_compensation || 0;
                let sizeB = b.glassdoor_compensation || 0;

                return reverse ? sizeB - sizeA : sizeA - sizeB
            });
        }  else {
            sorted_companies = companies.sort((a, b) => {
                let nameA = a.company_name || "";
                let nameB = b.company_name || "";

                return reverse ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
            });
        }

        return sorted_companies
    }

    render() {
        let { classes, client, match: { params } } = this.props;
        let { MAX_RESULTS, only_jobs, sort_param, reverse, companies, selectedLocations, locationsOptions, selectedIndustries, industriesOptions,  minEmployees, maxEmployees, employeeFilter, femaleEmployeeFilter, bipocEmployeeFilter} = this.state;

        companies = this.sortCompanies(companies, sort_param, reverse);

        let {filtered_companies, available} = this.filterCompanies(companies);

        console.log("CURRENT MAX:", this.state.MAX_RESULTS);

        return (
            <div className={classes.masterContainer}>
                <div className={classes.masterNavContainer}>
                    <NavBar />
                </div>
                <div className={classes.masterBodyContainer}>
                    <div className={classes.container}>
                        {/*<div className={mc(classes.pageTitle)}>Filter</div>*/}

                        <div className={mc(classes.mainContainer)}>
                            <div className={mc(classes.LHSContainer)}>
                                <div className={mc(classes.companyFilterContainer)}>

                                    <div style={{
                                        ...COMMON.FONTS.H600,
                                        color: COMMON.COLORS.N900,
                                        paddingBottom: "10px",
                                        marginBottom: "20px",
                                        borderBottom: `1px solid ${COMMON.COLORS.N400}`
                                    }}>
                                        Filters
                                    </div>

                                    <div style={{display: "none"}}>
                                        <DoubleSlider />
                                    </div>

                                    <StandardInput placeholder={"Search..."} value={this.state.companyNameFilter} update={(v) => {
                                        this.resetMaxResults();

                                        this.setState({
                                            companyNameFilter: v,
                                            MAX_RESULTS: 10
                                        });
                                        TrackingService.trackSubmit({page: "company-search", sub_page: "company-name", value: v});
                                    }}/>

                                    <div style={{marginTop: "20px"}} className={mc(classes.companyFilterLabel)}>Company Details</div>
                                    <div style={{marginTop: "10px"}} className={mc(classes.companySubFilterLabel)}>Industry</div>

                                    <StandardMultiSelect
                                        value={(selectedIndustries || []).map((id) => ({value: id, label: this.findLabel(industriesOptions, id)}))}
                                        options={industriesOptions}
                                        onChange={(ids) => {
                                            this.setState({
                                                selectedIndustries: ids
                                            });
                                            if (ids && ids.length) {
                                                TrackingService.trackSubmit({page: "company-search", sub_page: "company-industries", value: JSON.stringify(ids)});
                                            }
                                        }}
                                        hideIndicator={true}
                                    />
                                    <div style={{marginTop: "10px"}} className={mc(classes.companySubFilterLabel)}>HQ Location</div>

                                    <StandardMultiSelect
                                        value={(selectedLocations || []).map((id) => ({value: id, label: this.findLabel(locationsOptions, id)}))}
                                        options={locationsOptions}
                                        onChange={(ids) => {
                                            this.setState({
                                                selectedLocations: ids
                                            });
                                            if (ids && ids.length) {
                                                TrackingService.trackSubmit({page: "company-search", sub_page: "company-locations", value: JSON.stringify(ids)});
                                            }
                                        }}
                                        hideIndicator={true}
                                    />

                                    <div>
                                        <div style={{marginTop: "10px"}}  className={mc(classes.companySubFilterLabel)}>Employee Count</div>
                                        <input type="range" min={minEmployees} max={maxEmployees} value={employeeFilter} className="slider" onChange={(e) =>{
                                            this.resetScrollPosition();
                                            this.setState({employeeFilter: e.target.value, MAX_RESULTS: 10});
                                            TrackingService.trackSubmit({page: "company-search", sub_page: "company-employees", value: e.target.value});
                                        }}/>
                                        <div style={{marginTop: "-6px"}} className={mc(classes.companySubFilterLabel)}>{formatLargeNumber(employeeFilter)} - {formatLargeNumber(maxEmployees)}+</div>
                                    </div>

                                    <div style={{marginTop: "15px"}}>
                                        <StandardCheckbox label={"Toggle Companies Actively Hiring"} value={only_jobs} padded={true} update={(checked) => {
                                            this.setState({only_jobs: checked });
                                            TrackingService.trackSubmit({page: "company-search", sub_page: "company-active-hire", value: checked});
                                        }}/>
                                    </div>


                                    <div style={{marginTop: "20px"}}  className={mc(classes.companyFilterLabel)}>Company Ratings</div>

                                    <div style={{marginTop: "15px"}}  className={mc(classes.companySubFilterLabel)}>Overall</div>
                                    <RatingFilter value={this.state.glassdoorOverallFilter} update={(value) => {
                                        this.resetScrollPosition();
                                        this.setState({MAX_RESULTS: 10, glassdoorOverallFilter: value});
                                        TrackingService.trackSubmit({page: "company-search", sub_page: "company-glassdoor-overall", value: value});
                                    }}/>

                                    <div style={{marginTop: "15px"}}  className={mc(classes.companySubFilterLabel)}>Work-Life Balance</div>
                                    <RatingFilter value={this.state.glassdoorWorkLifeFilter} update={(value) => {this.resetScrollPosition();
                                        this.setState({MAX_RESULTS: 10, glassdoorWorkLifeFilter: value});
                                        TrackingService.trackSubmit({page: "company-search", sub_page: "company-glassdoor-work-life", value: value});

                                    }}/>

                                    <div style={{marginTop: "15px"}}  className={mc(classes.companySubFilterLabel)}>Pay</div>
                                    <RatingFilter value={this.state.glassdoorPayFilter} update={(value) => {this.resetScrollPosition();
                                        this.setState({MAX_RESULTS: 10, glassdoorPayFilter: value});
                                        TrackingService.trackSubmit({page: "company-search", sub_page: "company-glassdoor-pay", value: value});

                                    }}/>


                                    <div style={{marginTop: "20px"}}  className={mc(classes.companyFilterLabel)}>Representation</div>

                                    <div>
                                        <div className={mc(classes.companySubFilterLabel)}>Female Representation</div>
                                        <input type="range" min={0} max={100} value={femaleEmployeeFilter} className="slider" onChange={(e) =>{
                                            this.resetScrollPosition();
                                            this.setState({femaleEmployeeFilter: e.target.value, MAX_RESULTS: 10});
                                            TrackingService.trackSubmit({page: "company-search", sub_page: "company-employee-female", value: e.target.value});

                                        }}/>
                                        <div style={{marginTop: "-6px"}} className={mc(classes.companySubFilterLabel)}>{formatLargeNumber(femaleEmployeeFilter)}%</div>
                                    </div>

                                    <div>
                                        <div className={mc(classes.companySubFilterLabel)}>BIPOC Representation</div>
                                        <input type="range" min={0} max={100} value={bipocEmployeeFilter} className="slider" onChange={(e) =>{
                                            this.resetScrollPosition();
                                            this.setState({bipocEmployeeFilter: e.target.value, MAX_RESULTS: 10});
                                            TrackingService.trackSubmit({page: "company-search", sub_page: "company-employee-bipoc", value: e.target.value});

                                        }}/>
                                        <div style={{marginTop: "-6px"}} className={mc(classes.companySubFilterLabel)}>{formatLargeNumber(bipocEmployeeFilter)}%</div>
                                    </div>

                                </div>
                            </div>
                            <div className={mc(classes.RHSContainer)} style={{border: companies && companies.length ? null : "none"}}>
                                <div id="sort-bar" style={{...COMMON.FONTS.H100, textTransform: "uppercase", display: "flex", padding: "12px 20px", marginBottom: "10px", border: `1px solid ${COMMON.COLORS.N400}`, borderRadius: "4px", color: COMMON.COLORS.N700, background: COMMON.COLORS.N50}}>
                                    <div className={mc(classes.companyNameContainer)} style={{cursor: "pointer"}} onClick={() => {this.setState({MAX_RESULTS: 10, sort_param: SORTS.NAME, reverse: sort_param === SORTS.NAME && !reverse})}}>Company Name<i style={{marginLeft: "5.7px"}} className={`fa-solid fa-angle-${sort_param === SORTS.NAME && reverse ? 'up' : 'down'}`}/></div>
                                    <div className={mc(classes.companyLogo)} style={{height: "0px", border: "none"}}/>
                                    <div className={mc(classes.companyEmployeeContainer)} style={{ cursor: "pointer"}} onClick={() => {this.setState({MAX_RESULTS: 10, sort_param: SORTS.SIZE, reverse: !(sort_param === SORTS.SIZE && reverse)})}}>Employees<i style={{marginLeft: "5.7px"}} className={`fa-solid fa-angle-${sort_param === SORTS.SIZE && reverse ? 'up' : 'down'}`}/></div>
                                    <div className={mc(classes.companyGenderContainer)} style={{cursor: "pointer"}} onClick={() => {this.setState({MAX_RESULTS: 10, sort_param: SORTS.FEMALE, reverse: !(sort_param === SORTS.FEMALE && reverse)})}}>Gender (%)<i style={{marginLeft: "5.7px"}} className={`fa-solid fa-angle-${sort_param === SORTS.FEMALE && reverse ? 'up' : 'down'}`}/></div>

                                    <div className={mc(classes.companyRaceContainer)} style={{cursor: "pointer"}} onClick={() => {this.setState({MAX_RESULTS: 10, sort_param: SORTS.BIPOC, reverse: !(sort_param === SORTS.BIPOC && reverse)})}}>Ethnicity (%)<i style={{marginLeft: "5.7px"}} className={`fa-solid fa-angle-${sort_param === SORTS.BIPOC && reverse ? 'up' : 'down'}`}/></div>

                                    <div className={mc(classes.companyRankContainer)} style={{ cursor: "pointer"}} onClick={() => {this.setState({MAX_RESULTS: 10, sort_param: SORTS.RANK, reverse: !(sort_param === SORTS.RANK && reverse)})}}>Rank<i style={{marginLeft: "5.7px"}} className={`fa-solid fa-angle-${sort_param === SORTS.RANK && reverse ? 'up' : 'down'}`}/></div>
                                    <div className={mc(classes.companyOverallGlassdoorContainer)} style={{cursor: "pointer"}} onClick={() => {this.setState({MAX_RESULTS: 10, sort_param: SORTS.OVERALL, reverse: !(sort_param === SORTS.OVERALL && reverse)})}}>Overall<i style={{marginLeft: "5.7px"}} className={`fa-solid fa-angle-${sort_param === SORTS.OVERALL && reverse ? 'up' : 'down'}`}/></div>
                                    <div className={mc(classes.companyWorkGlassdoorContainer)} style={{cursor: "pointer"}} onClick={() => {this.setState({MAX_RESULTS: 10, sort_param: SORTS.WORKLIFE, reverse: !(sort_param === SORTS.WORKLIFE && reverse)})}}>Work-life<i style={{marginLeft: "5.7px"}} className={`fa-solid fa-angle-${sort_param === SORTS.WORKLIFE && reverse ? 'up' : 'down'}`}/></div>
                                    <div className={mc(classes.companyPayGlassdoorContainer)} style={{cursor: "pointer"}} onClick={() => {this.setState({MAX_RESULTS: 10, sort_param: SORTS.PAY, reverse: !(sort_param === SORTS.PAY && reverse)})}}>Pay<i style={{marginLeft: "5.7px"}} className={`fa-solid fa-angle-${sort_param === SORTS.PAY && reverse ? 'up' : 'down'}`}/></div>
                                    <div className={mc(classes.companyExpandContainer)}/>
                                </div>
                                <div className={mc(classes.RHSScrollContainer)} id="scrollableDiv">
                                    <InfiniteScroll
                                        dataLength={MAX_RESULTS}
                                        next={() => {
                                            console.log("loading more!", MAX_RESULTS);
                                            this.setState({
                                                MAX_RESULTS: MAX_RESULTS + 10
                                            })
                                        }}
                                        hasMore={available > MAX_RESULTS}
                                        scrollThreshold={"200px"}
                                        scrollableTarget="scrollableDiv"
                                        loader={<div className="loader" key={0}></div>}
                                        endMessage={
                                            <div style={{ textAlign: 'center' }}>

                                            </div>
                                        }
                                    >
                                        {filtered_companies && filtered_companies.length ? filtered_companies : <div>
                                            <div style={{textAlign: "center", background: COMMON.COLORS.N0, padding: "15px"}}>
                                                {companies && companies.length ? <div>
                                                    We couldn't find a company that fit your exact criteria, but we are actively adding more!
                                                </div> : <div style={{...COMMON.FONTS.H100, textTransform: "uppercase"}}>
                                                    <div style={{textAlign: "center"}}>
                                                        <Lottie options={defaultOptions}
                                                                height={96}
                                                                width={96}/>
                                                    </div>
                                                    <div>Loading Companies</div>
                                                    <div>One Moment Please</div>
                                                </div>}

                                            </div>
                                        </div>}
                                    </InfiniteScroll>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>



            )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(CompanyIndex)));

