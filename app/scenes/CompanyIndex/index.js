import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';
import COMMON from "../../common";
import CompanyService from "../../services/CompanyService";
import CompanyDemographicService from "../../services/CompanyDemographicService";
import {mc, formatLargeNumber } from "../../common/helpers";
import CompanyIndexRow from "./components/CompanyIndexRow";
import StandardInput from "../../components/StandardInput";
import NavBar from "../../components/NavBar";

const Styles = {
    container: {
        padding: "0 50px",
        '@media (max-width: 768px)': {
            padding: "0 20px",
        },
    },
    ...COMMON.STYLES.COMPANY.CompanyPageStyles,
    ...COMMON.STYLES.GENERAL.NavigationStyles,
};

class CompanyIndex extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            minEmployees: 0,
            employeeFilter: 0,
            maxEmployees: 10000,
            femaleEmployeeFilter: 0,
            bipocEmployeeFilter: 0,
        };
    }

    componentDidMount() {
        this.loadCompanies();
        this.loadCompanyDemographics();
    }

    loadCompanies() {
        let { client } = this.props;

        CompanyService.getCompanies({client}).then((companies) => {
            console.log("LOADED COMPANIES", companies);

            let max = 0;

            companies = companies.sort((a, b) => {

                max = Math.max(a.company_size, Math.max(b.company_size, max))

                let nameA = a.company_name || "";
                let nameB = b.company_name || "";

                return nameA.localeCompare(nameB);
            });

            this.setState({
                companies,
                // maxEmployees: max
            })
        })
    }

    loadCompanyDemographics() {
        let { client } = this.props;

        CompanyDemographicService.getCompanyDemographics({client}).then((company_demographics) => {
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

    render() {
        let { classes, client, match: { params } } = this.props;
        let { companies, company_demographics_map, companyNameFilter, minEmployees, maxEmployees, employeeFilter, femaleEmployeeFilter, bipocEmployeeFilter} = this.state;

        company_demographics_map = company_demographics_map || {};

        return (
            <div className={classes.masterContainer}>
                <div className={classes.masterNavContainer}>
                    <NavBar />
                </div>
                <div className={classes.masterBodyContainer}>
                    <div className={classes.container}>
                        <div className={mc(classes.pageTitle)}>Filter</div>

                        <div className={mc(classes.mainContainer)}>
                            <div className={mc(classes.LHSContainer)}>
                                <div className={mc(classes.companyFilterContainer)}>
                                    <div className={mc(classes.companyFilterLabel)}><i className="fa-solid fa-magnifying-glass"/>Company Search</div>
                                    <StandardInput placeholder={"Search..."} value={this.state.companyNameFilter} update={(v) => (this.setState({companyNameFilter: v}))}/>

                                    <div style={{marginTop: "20px"}} className={mc(classes.companyFilterLabel)}><i className="fa-solid fa-building"/>Company Details</div>

                                    <div>
                                        <div className={mc(classes.companySubFilterLabel)}>Employee Count</div>
                                        <input type="range" min={minEmployees} max={maxEmployees} value={employeeFilter} className="slider" onChange={(e) =>{
                                            this.setState({employeeFilter: e.target.value})
                                        }}/>
                                        <div style={{marginTop: "-6px"}} className={mc(classes.companySubFilterLabel)}>{formatLargeNumber(employeeFilter)} - {formatLargeNumber(maxEmployees)}+</div>
                                    </div>
                                    <div style={{marginTop: "20px"}}  className={mc(classes.companyFilterLabel)}><i className="fa-solid fa-user-group"/>Representation</div>
                                    <div>
                                        <div className={mc(classes.companySubFilterLabel)}>Female Representation</div>
                                        <input type="range" min={0} max={100} value={femaleEmployeeFilter} className="slider" onChange={(e) =>{
                                            this.setState({femaleEmployeeFilter: e.target.value})
                                        }}/>
                                        <div style={{marginTop: "-6px"}} className={mc(classes.companySubFilterLabel)}>{formatLargeNumber(femaleEmployeeFilter)}%</div>
                                    </div>
                                    <div>
                                        <div className={mc(classes.companySubFilterLabel)}>BIPOC Representation</div>
                                        <input type="range" min={0} max={100} value={bipocEmployeeFilter} className="slider" onChange={(e) =>{
                                            this.setState({bipocEmployeeFilter: e.target.value})
                                        }}/>
                                        <div style={{marginTop: "-6px"}} className={mc(classes.companySubFilterLabel)}>{formatLargeNumber(bipocEmployeeFilter)}%</div>
                                    </div>

                                </div>
                            </div>
                            <div className={mc(classes.RHSContainer)}>
                                <div>{companies && companies.length ? <div>

                                    {companies.map((company) => {

                                        const { company_id } = company;

                                        const company_demographics = company_demographics_map[company_id] || {};

                                        let bipoc_numbers = parseFloat(company_demographics.employees_asian || "0") +
                                            parseFloat(company_demographics.employees_black || "0") +
                                            parseFloat(company_demographics.employees_latinx || "0") +
                                            parseFloat(company_demographics.employees_indigenous || "0");

                                        let white_numbers = parseFloat(company_demographics.employees_white || "0")

                                        let bipoc_respresentation = Math.round((bipoc_numbers/(white_numbers + bipoc_numbers)) * 1000)/10;

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

                                        if (!company.company_logo_url)
                                            return null;

                                        return (<CompanyIndexRow {...{company, company_demographics, bipoc_respresentation}}/>);

                                    })}
                                </div> : null}</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>



            )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(CompanyIndex)));

