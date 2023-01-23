import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../services/DataService';

import {COLOR_BLACK, COLOR_BORDER_GREY, COLOR_GOLD, COLOR_GREEN, COLOR_WHITE} from "../common/colors";
import {FONT_BODY_BOLD, FONT_HEADLINE, FONT_SUBHEADER_BOLD, FONT_TITLE_2_BOLD} from "../common/fonts";
import {STYLE_BUTTON_HEADLINE, STYLE_BUTTON_SUBHEADER} from "../common/styles";

import FilterDropdown from "./FilterDropdown";
import StandardButton from "./StandardButton";
import RatingsDropdown from "./RatingsDropdown";
import {str} from "../common/helpers";

const NAV_HEIGHT = 65;

const Styles = {
    container: {
        padding: "15px 50px",
        height: `${NAV_HEIGHT}px`,
        '@media (max-width: 768px)': {
            padding: "0",
            display: "none",
            height: "0px",
            overflow: "hidden"
        },
        background: COLOR_WHITE,
        borderTop: `1px solid ${COLOR_BORDER_GREY}`,
        borderBottom: `1px solid ${COLOR_BORDER_GREY}`,
    },
    filterContainer: {
        display: "inline-block",
        marginRight: "10px"
    }
};

class FilterBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: true
        };

        this.locations = [];
        DataService.getLocations().then((locations) => {
            this.locations = locations;
            this.setState({ locations});
        })

        this.companies = [];
        DataService.getCompanies().then((companies) => {
            console.log("companies", companies)
            this.companies = companies;
            this.setState({ companies });
        })

        this.seniorities = [];
        DataService.getSeniorities().then((seniorities) => {
            this.seniorities = seniorities;
            this.setState({ seniorities });
        })

        this.job_titles = [];
        DataService.getJobTitles().then((job_titles) => {
            this.job_titles = job_titles;
            this.setState({ job_titles });
        })

        this.company_industries = [];
        DataService.getIndustries().then((company_industries) => {
            this.company_industries = company_industries;
            this.setState({ company_industries });
        })

        this.degree_requirements = [];
        DataService.getDegreeRequirements().then(({degree_requirements}) => {
            this.degree_requirements = degree_requirements;
            this.setState({ degree_requirements});
        })

        this.roles = [];
        DataService.getRoles().then(({roles}) => {
            console.log("this.roles", roles);
            this.roles = roles;
            this.setState({ roles});
        })

        this.affinities = [];
        DataService.getAffinities().then(({affinities}) => {
            affinities = affinities.map((affinity) => {
                if (!affinity) return affinity;
                if (affinity.label && affinity.label.indexOf("dates") === -1)
                    return null
                return affinity
            });

            affinities = _.without(affinities, null);

            this.affinities = affinities;
            this.setState({ affinities});
        })
    }

    componentDidMount() {

    }

    constructLocationOptions () {
        const { state } = this.props;

        this.locations = this.state.locations || [];

        if (this.locations && this.locations.length) {
            this.locations = this.locations.sort((a, b) => {
                let a_label = (a.label || "");
                let b_label = (b.label || "");

                if (state["selectedLocations"] &&
                    state["selectedLocations"].length &&
                    state["selectedLocations"].indexOf(a_label) !== -1) {
                    a_label = "0000" + a_label;
                }

                if (state["selectedLocations"] &&
                    state["selectedLocations"].length &&
                    state["selectedLocations"].indexOf(b_label) !== -1) {
                    b_label = "0000" + b_label;
                }

                return a_label.localeCompare(b_label);
            });
        }

        return this.locations
    }

    //job_board_category
    constructJobTitleOptionsOptions () {
        const { state } = this.props;

        this.job_titles = this.state.job_titles || [];

        if (this.job_titles && this.job_titles.length) {
            this.job_titles = this.job_titles.sort((a, b) => {
                let a_label = (a.label || "");
                let b_label = (b.label || "");

                if (state["selectedIndustries"] &&
                    state["selectedIndustries"].length &&
                    state["selectedIndustries"].indexOf(a_label) !== -1) {
                    a_label = "0000" + a_label;
                }

                if (state["selectedIndustries"] &&
                    state["selectedIndustries"].length &&
                    state["selectedIndustries"].indexOf(b_label) !== -1) {
                    b_label = "0000" + b_label;
                }

                return a_label.localeCompare(b_label);
            });
        }
        return this.job_titles
    }

    constructCompanyIndustryOptions() {
        const { state } = this.props;

        this.company_industries = this.state.company_industries

        if (this.company_industries && this.company_industries.length) {
            this.company_industries = this.company_industries.sort((a, b) => {
                let a_label = (a.label || "");
                let b_label = (b.label || "");

                if (state["selectedCompanyIndustries"] &&
                    state["selectedCompanyIndustries"].length &&
                    state["selectedCompanyIndustries"].indexOf(a_label) !== -1) {
                    a_label = "0000" + a_label;
                }

                if (state["selectedCompanyIndustries"] &&
                    state["selectedCompanyIndustries"].length &&
                    state["selectedCompanyIndustries"].indexOf(b_label) !== -1) {
                    b_label = "0000" + b_label;
                }

                return a_label.localeCompare(b_label);
            });
        }

        return this.company_industries
    }

    constructSeniorityOptions () {
         if (this.seniorities && this.seniorities.length) {
             this.seniorities = this.seniorities.sort((a, b) => {
                 return (a.label || "").localeCompare(b.label || "");
             });
         }
        return this.seniorities
    }

    constructCompanyOptions () {
        const { state } = this.props;

        let companies = this.state.companies || [];
        let dedup_map = {};

        companies.forEach((company) => {
            if (!company) return;
            dedup_map[company.company_id] = {
                ...company,
                id: company.company_id + "",
                label: company.company_name,
                company_id: company.company_id
            }
        });

        this.companies = Object.values(dedup_map);

        if (this.companies && this.companies.length) {
            this.companies = this.companies.sort((a, b) => {
                let a_label = (a.label || "");
                let b_label = (b.label || "");

                if (state["selectedCompanies"] &&
                    state["selectedCompanies"].length &&
                    state["selectedCompanies"].indexOf(str(a.company_id)) !== -1) {
                    a_label = "0000" + a_label;
                }

                if (state["selectedCompanies"] &&
                    state["selectedCompanies"].length &&
                    state["selectedCompanies"].indexOf(str(b.company_id)) !== -1) {
                    b_label = "0000" + b_label;
                }

                return a_label.localeCompare(b_label);
            });
        }
        return this.companies
    }

    render() {
        let { classes, client, match: { params },
            addToField,
            removeFromField,
            clearField,
            update,

            state,
            jobs,

            onAssistant
        } = this.props;

        this.locations = this.constructLocationOptions();
        this.companies = this.constructCompanyOptions();
        this.job_titles = this.constructJobTitleOptionsOptions();
        this.company_industries = this.constructCompanyIndustryOptions();
        this.seniorities = this.constructSeniorityOptions();

        return (<div className={classes.container} id="jobs-filter-bar">
            <div style={{display: "flex"}}>
                <div style={{flex: 1}}>
                    <div className={classes.filterContainer}>
                        <FilterDropdown
                            label="Job Title"
                            placeholder="Select Job Title"
                            options={this.job_titles}
                            selectedOptions={state["selectedIndustries"]}
                            onAdd={(id) => (addToField("selectedIndustries", id))}
                            onRemove={(id) => (removeFromField("selectedIndustries", id))}
                            onClear={() => (clearField("selectedIndustries"))}
                        />
                    </div>
                    <div className={classes.filterContainer}>
                        <FilterDropdown
                            label="Industry"
                            placeholder="Select Industry"
                            options={this.company_industries}
                            selectedOptions={state["selectedCompanyIndustries"]}
                            onAdd={(id) => (addToField("selectedCompanyIndustries", id))}
                            onRemove={(id) => (removeFromField("selectedCompanyIndustries", id))}
                            onClear={() => (clearField("selectedCompanyIndustries"))}
                        />
                    </div>
                    <div className={classes.filterContainer}>
                        <FilterDropdown
                            label="Seniority"
                            placeholder="Select Seniority"
                            options={this.seniorities}
                            selectedOptions={state["selectedSeniorities"]}
                            onAdd={(id) => (addToField("selectedSeniorities", id))}
                            onRemove={(id) => (removeFromField("selectedSeniorities", id))}
                            onClear={() => (clearField("selectedSeniorities"))}
                            disableSearch={true}
                        />
                    </div>
                    <div className={classes.filterContainer} style={{display: "none"}}>
                        <FilterDropdown
                            label="Affinity Tags"
                            placeholder="Add an affinity"
                            options={this.affinities}
                            selectedOptions={state["selectedAffinities"]}
                            onAdd={(id) => (addToField("selectedAffinities", id))}
                            onRemove={(id) => (removeFromField("selectedAffinities", id))}
                            onClear={() => (clearField("selectedAffinities"))}
                            disableSearch={true}
                        />
                    </div>
                    <div className={classes.filterContainer}>
                        <FilterDropdown
                            label="Location"
                            placeholder="Select location"
                            options={this.locations}
                            selectedOptions={state["selectedLocations"]}
                            onAdd={(id) => (addToField("selectedLocations", id))}
                            onRemove={(id) => (removeFromField("selectedLocations", id))}
                            onClear={() => (clearField("selectedLocations"))}
                        />
                    </div>
                    <div className={classes.filterContainer}>
                        <FilterDropdown
                            label="Company"
                            placeholder="Select company"
                            options={this.companies}
                            selectedOptions={state["selectedCompanies"]}
                            onAdd={(id) => (addToField("selectedCompanies", id))}
                            onRemove={(id) => (removeFromField("selectedCompanies", id))}
                            onClear={() => (clearField("selectedCompanies"))}
                        />
                    </div>
                    <div className={classes.filterContainer}>
                        <FilterDropdown
                            label="Role"
                            placeholder="Select Role"
                            options={this.roles}
                            selectedOptions={state["selectedRoles"]}
                            onAdd={(id) => (addToField("selectedRoles", id))}
                            onRemove={(id) => (removeFromField("selectedRoles", id))}
                            onClear={() => (clearField("selectedRoles"))}
                            disableSearch={true}
                        />
                    </div>
                    <div className={classes.filterContainer}>
                        <RatingsDropdown
                            label="Ratings"
                            selectedOptions={[]}
                            glassdoor_overall={state["glassdoor_overall"]}
                            glassdoor_work_life={state["glassdoor_work_life"]}
                            glassdoor_compensation={state["glassdoor_compensation"]}
                            glassdoor_culture={state["glassdoor_culture"]}
                            update={update}
                            onAdd={(id) => (addToField("selectedRoles", id))}
                            onRemove={(id) => (removeFromField("selectedRoles", id))}
                            onClear={() => (clearField("selectedRoles"))}
                            disableSearch={true}
                        />
                    </div>
                    <div className={classes.filterContainer} style={{display: "none"}}>
                        <FilterDropdown
                            label="Degree"
                            placeholder="Add a Requirement"
                            options={this.degree_requirements}
                            selectedOptions={state["selectedDegreeRequirements"]}
                            onAdd={(id) => (addToField("selectedDegreeRequirements", id))}
                            onRemove={(id) => (removeFromField("selectedDegreeRequirements", id))}
                            onClear={() => (clearField("selectedDegreeRequirements"))}
                            disableSearch={true}
                        />
                    </div>
                </div>
                <div style={{flex: "0 0 100px", textAlign: "right"}}>
                    <StandardButton secondary={true} onClick={onAssistant} label={"Job Assistant"}/>
                </div>
            </div>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(FilterBar)));

