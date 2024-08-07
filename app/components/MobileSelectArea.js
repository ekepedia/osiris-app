import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../services/DataService';

import {COLOR_GREEN, COLOR_WHITE, COLOR_BORDER_GREY} from "../common/colors";
import {STYLE_BORDER_LINE, STYLE_BUTTON_FOOTNOTE, STYLE_BUTTON_FOOTNOTE_OUTLINE, STYLE_INPUT} from "../common/styles";
import {
    FONT_CAPTION_2_BOLD,
    FONT_SUBHEADER_BOLD,
    FONT_FOOTNOTE_BOLD
} from "../common/fonts";

import COMMON from "../common/index";
import {mc, str} from "../common/helpers";
import StandardInput from "./StandardInput";
import TrackingService from "../services/TrackingService";
import StandardSelect from "./StandardSelect";

const Styles = {
    container: {
        padding: "0 12px",
        '@media (max-width: 768px)': {
            padding: "0",
        },
        width: "100%",
        color: COMMON.COLORS.N600,
        cursor: "pointer",
        position: "relative",
    },
    selectedFilters: {
        ...COMMON.FONTS.H100,
        height: "20px",
        lineHeight: "20px",
        width: "20px",
        borderRadius: "100%",
        textAlign: "center",
        background: COMMON.COLORS.N100,
        color: COMMON.COLORS.N800,
        border: `1px solid ${COMMON.COLORS.N600}`,
        marginLeft: "8px"
    },
    input: {
        height: "100%",
        border: "none",
        width: "100%",
        outline: "none",
        paddingLeft: "32px",
        background: COMMON.COLORS.N50,
        color: COMMON.COLORS.N700
    },
    selectOption: {
        border: `1px solid ${COMMON.COLORS.N400}`,
        padding: "8px 12px",
        color: COMMON.COLORS.N700,
        transition: "all 0.1s",
        display: "inline-block",
        marginRight: "5px",
        marginBottom: "5px",
        borderRadius: "4px",
        whiteSpace: "nowrap",
        ...COMMON.FONTS.P100,
    },

};


class MobileSelectArea extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false,
            checked: false,
            filter: "",
        }

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

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
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({show: false})
        }
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

    filterOptions(options) {

        if (!options || !options.length) return options;

        let set = options.map((option, i) => {
            if (!option) return ;

            const { filter } = this.state;

            let label = (option.label || "").toLowerCase();

            if (filter && filter.length) {
                if (label.indexOf(filter.toLowerCase()) === -1) {
                    return null;
                }
            }

            if (!label || !label.length)
                return null;

            return option;

        })

        return _.without(set, null);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let { payload } = this.props;

        if (!payload)
            return;

        if (payload.options !== (prevProps.payload || {}).options) {
            console.log("WE GOT A NEW PAYLOAD!!!");
            this.setState({filter: ""})
        }
    }

    render() {
        let { classes, label, placeholder, onClear, disableSearch,

            payload,
            addToField,
            removeFromField,
            update,

            state,

        } = this.props;

        selectedOptions = selectedOptions || [];

        let hasSelected = selectedOptions.length >= 1;

        this.locations = this.constructLocationOptions();
        this.companies = this.constructCompanyOptions();
        this.job_titles = this.constructJobTitleOptionsOptions();
        this.company_industries = this.constructCompanyIndustryOptions();
        this.seniorities = this.constructSeniorityOptions();

        payload = payload || {};

        let options = this[payload.options] || [];

        let min_value_label = payload.min_value_label;
        let max_value_label = payload.max_value_label;
        let minMax = payload.minMax;
        let min_options = payload.min_options;
        let max_options = payload.max_options;

        let min_value = state[min_value_label]
        let max_value = state[max_value_label]

        options = this.filterOptions(options);
        let original_length = options.length;
        options = options.slice(0, 75);
        let new_length = options.length;

        let diff = original_length - new_length;

        let selectedOptions = state[payload.selectedOptions];

        let onAdd = (id) => (addToField(payload.selectedOptions, id));
        let onRemove = (id) => (removeFromField(payload.selectedOptions, id));

        return (<div className={classes.container} style={{
            border: hasSelected ? `1px solid ${COMMON.COLORS.N600}` : null,
            color: hasSelected ? COMMON.COLORS.N800 : null,
        }} ref={this.setWrapperRef}>


            <div>
                <div style={{display: "flex", height: "100%", flexDirection: "column"}}>
                    <div style={{flex: "0 0 48px", padding: "8px 0", position: "relative", display: minMax || disableSearch ? "none" : null}}>
                        <StandardInput placeholder={"Filter Options"} value={this.state.filter} update={(v) => {
                            this.setState({filter: v});
                            console.log("update filter", v, payload.options);
                            TrackingService.trackSubmit({page: "job-board", sub_page: "job-filter-search", custom: payload.options, value: v});
                            TrackingService.trackSubmit({page: "job-board", sub_page: "job-filter-mobile-search", custom: payload.options, value: v});

                        }}/>
                    </div>

                    {minMax ?
                        <div style={{flex: 1, padding: "8px 0px", overflowY: "scroll"}}>
                            <div className={classes.ratingsContainer}>
                                <div className={classes.ratingsLabel}>Min</div>
                                <StandardSelect value={min_value} options={min_options} update={(val) => update(min_value_label, val)} />
                                <div style={{height: "8px", width: "100%"}}/>
                                <div className={classes.ratingsLabel}>Max</div>
                                <StandardSelect value={max_value} options={max_options} update={(val) => update(max_value_label, val)} />
                            </div>
                        </div>
                        : <div style={{flex: 1, padding: "0", paddingTop: disableSearch ? "12px" : "0px", overflowY: "scroll",}}>


                            {options.map((option, i) => {

                                option = option || {};
                                const { filter } = this.state;

                                const selected = selectedOptions && selectedOptions.indexOf(option.id) !== -1;

                                let label = (option.label || "").toLowerCase();

                                if (filter && filter.length) {
                                    if (label.indexOf(filter.toLowerCase()) === -1) {
                                        return null;
                                    }
                                }

                                if (!label || !label.length)
                                    return null;

                                return (
                                    <div key={option.id} className={mc(classes.selectOption)} style={{color: selected ? COMMON.COLORS.B400 : null, background: selected ? COMMON.COLORS.B100 : null, border: selected ? `1px solid ${COMMON.COLORS.B400}`: null}} onClick={() => {
                                        selected ? onRemove(option.id) : onAdd(option.id);
                                        this.setState({filter: ""});
                                    }}>
                                        <div style={{display: "flex"}}>
                                            <div style={{flex: 1}}>{option.label}</div>
                                            <div style={{flex: "0 0 10px", paddingLeft: "10px", display: selected ? null : "none"}}><i style={{cursor: "pointer",  fontSize: "13.5px", lineHeight: "16px"}} className="fa-solid fa-xmark"/></div>
                                        </div>
                                    </div>
                                );

                            })}

                            {diff && diff > 0 ? <div style={{margin: "20px 0", textAlign: "center"}}>
                                {diff} Additional Options Available to Filter On
                            </div>: null}
                        </div>
                    }



                </div>
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(MobileSelectArea)));

