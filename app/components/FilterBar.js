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
        DataService.getLocations().then(({locations}) => {
            this.locations = locations;
            this.setState({ locations});
        })

        this.companies = [];
        DataService.getCompanies().then(({companies}) => {
            this.companies = companies;
            this.setState({ companies});
        })

        this.industries = [];
        DataService.getIndustries().then(({industries}) => {
            this.industries = industries;
            this.setState({ industries});
        })

        this.degree_requirements = [];
        DataService.getDegreeRequirements().then(({degree_requirements}) => {
            this.degree_requirements = degree_requirements;
            this.setState({ degree_requirements});
        })

        this.roles = [];
        DataService.getRoles().then(({roles}) => {
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

    constructLocationOptions (jobs) {
        jobs = jobs || [];
        let dedup_map = {};
        jobs.forEach((job) => {
            if (job.locations && job.locations.length) {
                job.locations.forEach((location) => {
                    dedup_map[location.location_id] = location
                })
            }
        });

        this.locations = Object.values(dedup_map);
        return this.locations
    }

    constructIndustryOptions (jobs) {
        jobs = jobs || [];
        let dedup_map = {};
        jobs.forEach((job) => {
            if (job.industries && job.industries.length) {
                job.industries.forEach((industry) => {
                    dedup_map[industry.id] = industry
                })
            }
        });


        this.industries = Object.values(dedup_map);

        return this.industries
    }

    constructCompanyOptions (jobs) {
        jobs = jobs || [];
        let dedup_map = {};
        jobs.forEach((job) => {
            if (job.companies && job.companies.length) {
                job.companies.forEach((company) => {
                    if (!company) return;
                    dedup_map[company.company_id] = {
                        ...company,
                        id: company.company_id,
                        label: company.company_name,
                        company_id: company.company_id
                    }
                })
            }
        });

        this.companies = Object.values(dedup_map);
        return this.companies
    }

    render() {
        let { classes, client, match: { params },
            addToField,
            removeFromField,
            clearField,

            state,
            jobs,

            onAssistant
        } = this.props;

        this.locations = this.constructLocationOptions(jobs);
        this.companies = this.constructCompanyOptions(jobs);
        this.industries = this.constructIndustryOptions(jobs);

        return (<div className={classes.container}>
            <div style={{display: "flex"}}>
                <div style={{flex: 1}}>
                    <div className={classes.filterContainer}>
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
                        <FilterDropdown
                            label="Industry"
                            placeholder="Select Industry"
                            options={this.industries}
                            selectedOptions={state["selectedIndustries"]}
                            onAdd={(id) => (addToField("selectedIndustries", id))}
                            onRemove={(id) => (removeFromField("selectedIndustries", id))}
                            onClear={() => (clearField("selectedIndustries"))}
                        />
                    </div>
                    <div className={classes.filterContainer}>
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

