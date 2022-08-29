import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';
import {COLOR_WHITE, PIE_CHART_WHITE} from "../../common/colors";
import COMMON from "../../common";
import CompanyService from "../../services/CompanyService";
import { PieChart } from 'react-minimal-pie-chart';
import CompanyDemographicService from "../../services/CompanyDemographicService";
import {mc} from "../../common/helpers";
import CompanyHeader from "./components/CompanyHeader";
import NavBar from "../../components/NavBar";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    ...COMMON.STYLES.COMPANY.CompanyPageStyles,
    ...COMMON.STYLES.COMPANY.CompanyProfilePageStyles,
    ...COMMON.STYLES.GENERAL.NavigationStyles,
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

    render() {
        let { classes, client, match: { params } } = this.props;

        let { company, company_demographics_map, selectedState } = this.state;

        company_demographics_map = company_demographics_map || {};
        company = company || {};


        const {
            company_id
        } = company;

        const company_demographics = company_demographics_map[company_id] || {}


        return (

            <div className={classes.masterContainer}>
                <div className={classes.masterNavContainer}>
                    <NavBar />
                </div>
                <div className={classes.masterBodyContainer}>
                    <div className={classes.container}>

                        <div className={classes.mainContainer}>

                            <div className={mc(classes.headerContainer)}>
                                <CompanyHeader {...{company, selectedState: this.state.selectedState}} setSelectedState={(selectedState) => {
                                    this.setState({selectedState})
                                }}/>
                            </div>

                            <div style={{display: selectedState === 1 ? null : "none"}} className={mc(classes.sectionContainer)}>
                                <div className={mc(classes.sectionTitle)}>About</div>
                                <div className={mc(classes.aboutBody)}>{company.company_about}</div>
                            </div>

                            <div style={{display: selectedState === 2 ? "none" : null}} className={mc(classes.sectionContainer)}>
                                <div className={mc(classes.sectionTitle)}>Representation by race / ethnicity</div>
                                <div className={mc(classes.sectionSubHeader)}>Identified by OSIRIS from {company.company_name}</div>
                                <div className={mc(classes.diversityStatsContainer)}>
                                    <div className={mc(classes.pieChartHolder)}>
                                        <div style={{height: "125px", width: "125px"}}>
                                            <PieChart
                                                lineWidth={30}
                                                startAngle={270}
                                                data={[
                                                    { title: 'Asian', value: company_demographics.employees_asian, color: COMMON.COLORS.COLOR_GOLD },
                                                    { title: 'Black', value: company_demographics.employees_black, color: COMMON.COLORS.OSIRIS_GREEN },
                                                    { title: 'White', value: company_demographics.employees_white, color: COMMON.COLORS.PIE_CHART_WHITE },
                                                    { title: 'Native American', value: company_demographics.employees_indigenous, color: COMMON.COLORS.PIE_CHART_GREY },
                                                    { title: 'Latinx', value: company_demographics.employees_latinx, color: COMMON.COLORS.OSIRIS_BLACK },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                    <div style={{flex: "0 0 140px", maxWidth: "140px", marginTop: "8.5px", marginRight: "40px"}}>

                                        <div className={mc(classes.pieChartLabelHolder)}>
                                            <div className={mc(classes.pieChartLabelColor)} style={{background: COMMON.COLORS.COLOR_GOLD}}/>
                                            <div className={mc(classes.pieChartLabelName)}>Asian</div>
                                            <div className={mc(classes.pieChartLabelPercentage)}>{company_demographics.employees_asian}%</div>
                                        </div>

                                        <div className={mc(classes.pieChartLabelHolder)}>
                                            <div className={mc(classes.pieChartLabelColor)} style={{background: COMMON.COLORS.OSIRIS_GREEN}}/>
                                            <div className={mc(classes.pieChartLabelName)}>Black</div>
                                            <div className={mc(classes.pieChartLabelPercentage)}>{company_demographics.employees_black}%</div>
                                        </div>

                                        <div className={mc(classes.pieChartLabelHolder)}>
                                            <div className={mc(classes.pieChartLabelColor)} style={{background: COMMON.COLORS.PIE_CHART_WHITE}}/>
                                            <div className={mc(classes.pieChartLabelName)}>White</div>
                                            <div className={mc(classes.pieChartLabelPercentage)}>{company_demographics.employees_white}%</div>
                                        </div>

                                    </div>
                                    <div style={{flex: "0 0 195px", marginTop: "24.5px"}}>

                                        <div className={mc(classes.pieChartLabelHolder)}>
                                            <div className={mc(classes.pieChartLabelColor)} style={{background: COMMON.COLORS.PIE_CHART_GREY}}/>
                                            <div className={mc(classes.pieChartLabelName)}>Indigenous</div>
                                            <div className={mc(classes.pieChartLabelPercentage)}>{company_demographics.employees_indigenous || "--"}%</div>
                                        </div>

                                        <div className={mc(classes.pieChartLabelHolder)}>
                                            <div className={mc(classes.pieChartLabelColor)} style={{background: COMMON.COLORS.OSIRIS_BLACK}}/>
                                            <div className={mc(classes.pieChartLabelName)}>Hispanic/Latinx</div>
                                            <div className={mc(classes.pieChartLabelPercentage)}>{company_demographics.employees_latinx}%</div>
                                        </div>
                                    </div>
                                </div>

                                <div onClick={() => {this.setState({selectedState: 3})}} style={{display: selectedState === 1 ? null : "none", cursor: "pointer", marginTop: "25px", textAlign: "center", paddingTop: "14.5px", borderTop: `1px solid ${COMMON.COLORS.LIGHT_GREY}`, color: COMMON.COLORS.DARK_GREY, ...COMMON.FONTS.FONT_SUBHEADER_BOLD}}>
                                    <div>See all details</div>
                                </div>
                            </div>

                            <div style={{display: selectedState === 3 ? null : "none"}} className={mc(classes.sectionContainer)}>
                                <div className={mc(classes.sectionTitle)}>Representation by gender</div>
                                <div className={mc(classes.sectionSubHeader)}>Identified by OSIRIS from {company.company_name}</div>
                                <div className={mc(classes.diversityStatsContainer)}>
                                    <div className={mc(classes.pieChartHolder)}>
                                        <div style={{height: "125px", width: "125px"}}>
                                            <PieChart
                                                lineWidth={30}
                                                startAngle={270}
                                                data={[
                                                    { title: 'Female', value: company_demographics.employees_female, color: COMMON.COLORS.COLOR_GOLD },
                                                    { title: 'Male', value: company_demographics.employees_male, color: COMMON.COLORS.OSIRIS_GREEN }
                                                    ]
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div style={{flex: "0 0 140px", maxWidth: "140px", marginTop: "38.5px", marginRight: "40px"}}>
                                        <div className={mc(classes.pieChartLabelHolder)}>
                                            <div className={mc(classes.pieChartLabelColor)} style={{background: COMMON.COLORS.COLOR_GOLD}}/>
                                            <div className={mc(classes.pieChartLabelName)}>Female</div>
                                            <div className={mc(classes.pieChartLabelPercentage)}>{company_demographics.employees_female}%</div>
                                        </div>
                                    </div>
                                    <div style={{flex: "0 0 140px", marginTop: "38.5px"}}>
                                        <div className={mc(classes.pieChartLabelHolder)}>
                                            <div className={mc(classes.pieChartLabelColor)} style={{background: COMMON.COLORS.OSIRIS_GREEN}}/>
                                            <div className={mc(classes.pieChartLabelName)}>Male</div>
                                            <div className={mc(classes.pieChartLabelPercentage)}>{company_demographics.employees_male}%</div>
                                        </div>
                                    </div>
                                </div>

                            </div>


                            <div  style={{display: selectedState === 2 ? null : "none"}} className={mc(classes.sectionContainer)}>
                                <div className={mc(classes.sectionTitle)}>Overview</div>
                                <div className={mc(classes.aboutBody)}>{company.company_about}</div>
                                <div className={mc(classes.sectionSubtitle)}>Website</div>
                                <div className={mc(classes.companyWebsite)}><a target={"_blank"} style={{color: COMMON.COLORS.COLOR_GOLD}} href={company.company_website}>{company.company_website}</a></div>
                                {/*<div className={mc(classes.sectionSubtitle)}>Industry</div>*/}
                                {/*<div className={mc(classes.overviewSection)}>Tech</div>*/}
                                {company.company_size ? <div>
                                    <div className={mc(classes.sectionSubtitle)}>Company Size</div>
                                    <div className={mc(classes.overviewSection)}>{company.company_size} employees</div>
                                </div> : null}


                                <div className={mc(classes.sectionSubtitle)}>Headquarters</div>
                                <div className={mc(classes.overviewSection)}>{company.company_city || "Boston"}, {company.company_state || "MA"}</div>

                                <div className={mc(classes.sectionSubtitle)}>Company Founded</div>
                                <div className={mc(classes.overviewSection)}>{company.company_founded_year || 1984}</div>
                            </div>


                        </div>


                    </div>
                </div>
            </div>

            )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(CompanyPage)));

