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
import StandardBadge from "../../../components/StandardBadge";

const Styles = {
    container: {
        padding: "17px 20px",
        '@media (max-width: 768px)': {
            padding: "15px 20px",
        },
        background: COMMON.COLORS.COLOR_WHITE,
        borderBottom: `1px solid ${COMMON.COLORS.N400}`,
        display: "flex",
        ...COMMON.FONTS.H400,
        color: COMMON.COLORS.N900,
        overflow: "hidden"
    },
    companyLogo: {
        height: "40px",
        flex: "0 0 40px",
        marginRight: "10px",
        border: `1px solid ${COMMON.COLORS.N300}`,
        borderRadius: "6px",
        overflow: "hidden"
    },
    companyNameContainer: {
        flex: "0 0 233px"
    },
    companyEmployeeContainer: {
        flex: "0 0 95px",
        "& i": {
            color: COMMON.COLORS.N600,
            marginRight: "4px",
            fontSize: "12px"
        }
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
        ...COMMON.FONTS.H100,
        padding: "2px 4px",
        background: COMMON.COLORS.N100,
        color: COMMON.COLORS.N700,
        display: "inline-block",
        borderRadius: "4px",
        whiteSpace: "nowrap",
        textTransform: "uppercase"
    },
    companyHeader: {
        ...COMMON.FONTS.H400,
        color: COMMON.COLORS.N900,
    },
    companySubHeader: {
        ...COMMON.FONTS.H100,
        color: COMMON.COLORS.N700,
    },
    companyLocation: {
        extend: 'companySubHeader',
        ...COMMON.FONTS.H300,
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
                    <div className={mc(classes.companyLocation)}>
                        {company.company_city || "San Diego"}, {company.company_state || "CA"}
                    </div>
                </Link>
            </div>
            <div className={mc(classes.companyEmployeeContainer)}>
                <div className={mc(classes.companyHeader)}>
                    <i className="fa-solid fa-user-group"/>{company.company_size  ?formatLargeNumber(company.company_size) : "--"}
                </div>
                <div className={mc(classes.companySubHeader)}>
                    EMPLOYEES
                </div>
            </div>

            <div className={mc(classes.companyGenderContainer)}>
                <div className={mc(classes.companyHeader)}>
                    {company_demographics.employees_female ||company_demographics.employees_male ? <div>
                        {company_demographics.employees_male || "--"}% Male / {company_demographics.employees_female || "--"}% Female
                    </div> : <div>—</div> }
                </div>
                <div className={mc(classes.companySubHeader)}>
                    —
                </div>
            </div>

            <div className={mc(classes.companyRaceContainer)}>
                <div className={mc(classes.companyHeader)}>
                    {bipoc_respresentation ? <div>
                        {bipoc_respresentation}% BIPOC
                    </div> : <div>—</div>}
                </div>
                <div className={mc(classes.companySubHeader)}>
                    —
                </div>
            </div>

            <div className={mc(classes.companyIndustryContainer)}>
                <StandardBadge style={{marginLeft: "5px", marginRight: "0px", marginTop: "5.5px"}} label={company.company_industry}/>
            </div>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(CompanyIndexRow)));

