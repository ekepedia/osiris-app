import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import COMMON from "../../../common/index";
import { mc, formatLargeNumber } from "../../../common/helpers";
import CoverImageHolder from "../../../components/CoverImageHolder";
import {TAG_GREY} from "../../../common/colors";

const Styles = {
    container: {
        padding: "15px 20px",
        '@media (max-width: 768px)': {
            padding: "15px 20px",
        },
        background: COMMON.COLORS.COLOR_WHITE,
        borderBottom: `1px solid ${COMMON.COLORS.LIGHT_GREY}`,
        display: "flex"
    },
    companyLogo: {
        height: "36px",
        flex: "0 0 36px",
        marginRight: "10px",
        border: `1px solid ${COMMON.COLORS.LIGHT_GREY}`,
        borderRadius: "6px",
        overflow: "hidden"
    },
    companyNameContainer: {
        flex: "0 0 233px"
    },
    companyEmployeeContainer: {
        flex: "0 0 95px"
    },
    companyGenderContainer: {
        flex: "0 0 220px"
    },
    companyRaceContainer: {
        flex: "0 0 130px"
    },
    companyIndustryContainer: {
        flex: 1,
        textAlign: "right"
    },
    companyIndustry: {
        marginLeft: "5px",
        marginTop: "5.5px",
        height: "25px",
        lineHeight: "25px",
        ...COMMON.FONTS.FONT_CAPTION_2_BOLD,
        padding: "0 8px",
        background: COMMON.COLORS.TAG_GREY,
        color: COMMON.COLORS.OSIRIS_BLACK,
        display: "inline-block",
        borderRadius: "6px"
    },
    companyHeader: {
        ...COMMON.FONTS.FONT_SUBHEADER_BOLD,
        color: COMMON.COLORS.OSIRIS_BLACK,
        lineHeight: "19px"
    },
    companySubHeader: {
        ...COMMON.FONTS.FONT_FOOTNOTE,
        marginTop: "1px",
        color: COMMON.COLORS.DARK_GREY,
        lineHeight: "16px"
    }
};

class CompanyIndexRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, company, company_demographics, bipoc_respresentation} = this.props;

        company_demographics = company_demographics || {};
        company = company || {};
        bipoc_respresentation = bipoc_respresentation || 0;

        return (<div className={classes.container}>
            <div className={mc(classes.companyLogo)}>
                <CoverImageHolder url={company.company_logo_url} />
            </div>
            <div className={mc(classes.companyNameContainer)}>
                <Link to={`/companies/${company.company_id}`}>
                    <div className={mc(classes.companyHeader)}>
                        {company.company_name}
                    </div>
                    <div className={mc(classes.companySubHeader)}>
                        {company.company_city || "San Diego"}, {company.company_state || "CA"}
                    </div>
                </Link>
            </div>
            <div className={mc(classes.companyEmployeeContainer)}>
                <div className={mc(classes.companyHeader)}>
                    {company.company_size  ?formatLargeNumber(company.company_size) : "--"}
                </div>
                <div className={mc(classes.companySubHeader)}>
                    Employees
                </div>
            </div>

            <div className={mc(classes.companyGenderContainer)}>
                <div className={mc(classes.companyHeader)}>
                    {company_demographics.employees_female ||company_demographics.employees_male ? <div>
                        {company_demographics.employees_male || "--"}% Male / {company_demographics.employees_female || "--"}% Female
                    </div> : <div>No Data</div> }
                </div>
                <div className={mc(classes.companySubHeader)}>
                    No 2021 Data
                </div>
            </div>

            <div className={mc(classes.companyRaceContainer)}>
                <div className={mc(classes.companyHeader)}>
                    {bipoc_respresentation ? <div>
                        {bipoc_respresentation}% BIPOC
                    </div> : <div>No Data</div>}
                </div>
                <div className={mc(classes.companySubHeader)}>
                    No 2021 Data
                </div>
            </div>

            <div className={mc(classes.companyIndustryContainer)}>
                <div className={mc(classes.companyIndustry)}>{company.company_industry}</div>
                {/*<div className={mc(classes.companyIndustry)}>{company.company_industry_group}</div>*/}
            </div>


        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(CompanyIndexRow)));

