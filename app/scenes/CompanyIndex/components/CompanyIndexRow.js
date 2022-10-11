import React from "react";

import { Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import COMMON from "../../../common/index";
import { mc, formatLargeNumber } from "../../../common/helpers";
import CoverImageHolder from "../../../components/CoverImageHolder";
import StandardBadge from "../../../components/StandardBadge";
import ReactTooltip from "react-tooltip";

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
        flex: "0 0 140px"
    },
    companyRaceContainer: {
        flex: "0 0 120px"
    },
    companyGlassdoorContainer: {
        flex: "0 0 260px",
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

class CompanyIndexRow extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        let { classes, company, company_demographics, bipoc_respresentation, bipoc_respresentation_change, female_respresentation_change, currentYear, previousYear} = this.props;

        company_demographics = company_demographics || {};
        company = company || {};
        bipoc_respresentation = bipoc_respresentation || 0;

        let bipoc_respresentation_change_label = "";
        let female_respresentation_change_label = "";

        let id1 = Math.random() + "";
        let id2 = Math.random() + "";

        const convertYear = (year) => {
            if (!year) return year;

            return (year + "").slice(2);
        }

        if (bipoc_respresentation_change) {
            bipoc_respresentation_change_label = `${bipoc_respresentation_change > 0 ? '+' : ''}${bipoc_respresentation_change}% BIPOC \`${convertYear(previousYear)}-\`${convertYear(currentYear)}`;
        }

        if (female_respresentation_change) {
            female_respresentation_change_label = `${female_respresentation_change > 0 ? '+' : ''}${female_respresentation_change}% FEMALE \`${convertYear(previousYear)}-\`${convertYear(currentYear)}`;
        }

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
                        {company.company_city || ""}{company.company_city && company.company_state ? "," : ""} {company.company_state || ""}
                    </div>
                </Link>
            </div>
            <div className={mc(classes.companyEmployeeContainer)}>
                <div className={mc(classes.companyHeader)}>
                    <i className="fa-solid fa-user-group"/>{company.company_size ? formatLargeNumber(company.company_size) : "--"}
                </div>
                <div className={mc(classes.companySubHeader)}>
                    EMPLOYEES
                </div>
            </div>

            <div className={mc(classes.companyGenderContainer)}>
                <div className={mc(classes.companyHeader)}>
                    {company_demographics.employees_female ||company_demographics.employees_male ? <div>
                        {company_demographics.employees_male || "--"}% M / {company_demographics.employees_female || "--"}% F<i className="fa-solid fa-circle-info" data-tip data-for={id2} style={{marginLeft: "3px", color: COMMON.COLORS.N500}}/>
                    </div> : <div>—</div> }
                </div>
                <div className={mc(classes.companySubHeader)}>
                    {female_respresentation_change ? <StandardBadge style={{
                        marginLeft: "0",
                        marginRight: "0px",
                        marginTop: "0",
                        background: female_respresentation_change > 0 ? COMMON.COLORS.G200 : COMMON.COLORS.R100,
                        color: female_respresentation_change > 0 ? COMMON.COLORS.G600 : COMMON.COLORS.R600,
                    }} label={female_respresentation_change_label}/> : <div>—</div>}
                </div>
            </div>

            <div className={mc(classes.companyRaceContainer)}>
                <div className={mc(classes.companyHeader)}>
                    {bipoc_respresentation ? <div>
                        {bipoc_respresentation}% BIPOC<i className="fa-solid fa-circle-info" data-tip data-for={id1} style={{marginLeft: "3px", color: COMMON.COLORS.N500}}/>
                    </div> : <div>—</div>}
                </div>
                <div className={mc(classes.companySubHeader)}>
                    {bipoc_respresentation_change ? <StandardBadge style={{
                        marginLeft: "0",
                        marginRight: "0px",
                        marginTop: "0",
                        background: bipoc_respresentation_change > 0 ? COMMON.COLORS.G200 : COMMON.COLORS.R100,
                        color: bipoc_respresentation_change > 0 ? COMMON.COLORS.G600 : COMMON.COLORS.R600,
                    }} label={bipoc_respresentation_change_label}/> : <div>—</div>}
                </div>
            </div>

            <div className={mc(classes.companyGlassdoorContainer)}>
                {company.glassdoor_overall ? <StandardBadge tooltip={`Employees rate ${company.company_name} ${company.glassdoor_overall}/5 on<br/>Glassdoor overall`} label={`${company.glassdoor_overall}`} icon={"fa-solid fa-star"} iconLeft={true} style={{background: COMMON.COLORS.G200, color: COMMON.COLORS.G600, marginTop: "5.5px"}}/> : null}
                {company.glassdoor_work_life ? <StandardBadge tooltip={`Employees rate ${company.company_name} ${company.glassdoor_work_life}/5 on<br/>Glassdoor for work/life`} label={`${company.glassdoor_work_life} WORK-LIFE`} icon={"fa-solid fa-bed"} iconLeft={true} style={{background: COMMON.COLORS.V100, color: COMMON.COLORS.V600, marginTop: "5.5px"}}/> : null}
                {company.glassdoor_culture ? <StandardBadge tooltip={`Employees rate ${company.company_name} ${company.glassdoor_culture}/5 on<br/>Glassdoor for culture`} label={`${company.glassdoor_culture} CULTURE`} icon={"fa-solid fa-gavel"} iconLeft={true} style={{background: COMMON.COLORS.B200, color: COMMON.COLORS.B500, marginTop: "5.5px"}}/> : null}
            </div>

            <div className={mc(classes.companyIndustryContainer)}>
                <StandardBadge style={{marginLeft: "5px", marginRight: "0px", marginTop: "5.5px"}} label={company.company_industry}/>
            </div>



            <ReactTooltip multiline={true} className={"tool-tip-styles"} id={id1} place={"bottom"} padding={"0px"} backgroundColor={COMMON.COLORS.N800}>
                Black, Indigenous, (and)<br/> People of Color
            </ReactTooltip>

            <ReactTooltip multiline={true} className={"tool-tip-styles"} id={id2} place={"bottom"} padding={"0px"} backgroundColor={COMMON.COLORS.N800}>
                To align with U.S. government reporting<br/>
                requirements, data on this website uses<br/>
                the traditional gender categories of male<br/>
                and female. OSIRIS deeply respects that<br/>
                gender is not binary.
            </ReactTooltip>

        </div>)
    }

}

export default injectSheet(Styles)(CompanyIndexRow);

