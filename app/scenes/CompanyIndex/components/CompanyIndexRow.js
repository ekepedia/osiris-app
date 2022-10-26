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
        padding: 0,
        background: COMMON.COLORS.COLOR_WHITE,
        borderBottom: `1px solid ${COMMON.COLORS.N400}`,
        ...COMMON.FONTS.H400,
        color: COMMON.COLORS.N900,
        overflow: "hidden"
    },
    subContainer: {
        display: "flex",
        padding: "17px 20px",
        '@media (max-width: 768px)': {
            padding: "15px 20px",
        },
    },
    expandedContainer: {
        display: "flex",
        padding: "17px 20px",
        '@media (max-width: 768px)': {
            padding: "15px 20px",
        },
        borderTop: `1px solid ${COMMON.COLORS.N300}`,
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
        flex: "0 0 180px"
    },
    companyEmployeeContainer: {
        flex: 1,
        "& i": {
            color: COMMON.COLORS.N600,
            marginRight: "4px",
            fontSize: "12px"
        }
    },
    companyGenderContainer: {
        flex: 1.5
    },
    companyRaceContainer: {
        flex: 1.5
    },
    companyGlassdoorContainer: {
        flex: 1,
    },
    companyIndustryContainer: {
        flex: "0 0 30px",
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
        ...COMMON.FONTS.P100,
        color: COMMON.COLORS.N700,
    },
    companyLocation: {
        extend: 'companySubHeader',
        ...COMMON.FONTS.H300,
    },
    toolTipIcon: {
        fontSize: "9.66px"
    }
};

class CompanyIndexRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };
    }

    generateStars(num) {
        num = parseFloat(num) || 0;
        return (<div style={{display: "inline-block"}}>
            <i style={{color: num > 0 ? COMMON.COLORS.Y400 : COMMON.COLORS.N200, marginLeft: "2.5px"}} className={`fa-solid ${ num >= 0.5 ? 'fa-star' : 'fa-star-half-stroke'}`}/>
            <i style={{color: num > 1 ? COMMON.COLORS.Y400 : COMMON.COLORS.N200, marginLeft: "2.5px"}} className={`fa-solid ${ num <= 1 || num > 1.5 ? 'fa-star' : 'fa-star-half-stroke'}`}/>
            <i style={{color: num > 2 ? COMMON.COLORS.Y400 : COMMON.COLORS.N200, marginLeft: "2.5px"}} className={`fa-solid ${ num <= 2 || num > 2.5 ? 'fa-star' : 'fa-star-half-stroke'}`}/>
            <i style={{color: num > 3 ? COMMON.COLORS.Y400 : COMMON.COLORS.N200, marginLeft: "2.5px"}} className={`fa-solid ${ num <= 3 || num > 3.5 ? 'fa-star' : 'fa-star-half-stroke'}`}/>
            <i style={{color: num > 4 ? COMMON.COLORS.Y400 : COMMON.COLORS.N200, marginLeft: "2.5px"}} className={`fa-solid ${ num <= 4 || num > 4.5 ? 'fa-star' : 'fa-star-half-stroke'}`}/>
        </div>)
    }

    generateAverageTag(num, average) {
        num = parseFloat(num) || 0;
        average = parseFloat(average) || 0;
        return (<div style={{display: "inline-block"}}><StandardBadge style={{
            marginLeft: "10px",
            marginRight: "0px",
            color: num > average ? COMMON.COLORS.G600 : COMMON.COLORS.R600,
            background: num > average ? COMMON.COLORS.G200 : COMMON.COLORS.R100,
        }} label={`${num > average ? 'ABOVE' : 'BELOW'} AVERAGE`}/></div>)
    }

    render() {
        let { classes, id, company, company_demographics, overall_average, worklife_average, pay_average, bipoc_respresentation, bipoc_respresentation_change, female_respresentation_change, currentYear, previousYear} = this.props;

        let { expanded } = this.state
        company_demographics = company_demographics || {};
        company = company || {};
        bipoc_respresentation = bipoc_respresentation || 0;

        let bipoc_respresentation_change_label = "";
        let female_respresentation_change_label = "";

        let id1 = Math.random() + "";
        let id2 = Math.random() + "";
        let id_overall = Math.random() + "";
        let id_worklife = Math.random() + "";
        let id_pay = Math.random() + "";

        let default_reviews = "1.1K";

        const convertYear = (year) => {
            if (!year) return year;

            return (year + "").slice(2);
        }

        if (bipoc_respresentation_change) {
            // bipoc_respresentation_change_label = `${bipoc_respresentation_change > 0 ? '+' : ''}${bipoc_respresentation_change}% BIPOC \`${convertYear(previousYear)}-\`${convertYear(currentYear)}`;
            bipoc_respresentation_change_label = `${bipoc_respresentation_change > 0 ? '+' : ''}${bipoc_respresentation_change}% change`;
        }

        if (female_respresentation_change) {
            // female_respresentation_change_label = `${female_respresentation_change > 0 ? '+' : ''}${female_respresentation_change}% FEMALE \`${convertYear(previousYear)}-\`${convertYear(currentYear)}`;
            female_respresentation_change_label = `${female_respresentation_change > 0 ? '+' : ''}${female_respresentation_change}% change`;
        }

        return (<div className={classes.container} id={id}>
            <div className={classes.subContainer}>
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
                        Employees
                    </div>
                </div>

                <div className={mc(classes.companyGenderContainer)}>
                    <div className={mc(classes.companyHeader)}>
                        {company_demographics.employees_female ||company_demographics.employees_male ? <div>
                            {company_demographics.employees_female || "--"}% Female
                        </div> : <div>No Gender Data</div> }
                    </div>
                    <div className={mc(classes.companySubHeader)}>
                        {female_respresentation_change ? <span style={{
                            marginLeft: "0",
                            marginRight: "0px",
                            marginTop: "0",
                            color: female_respresentation_change > 0 ? COMMON.COLORS.G600 : COMMON.COLORS.R600,
                        }}>{female_respresentation_change_label}</span> : <span>No Data</span>}<i className={mc(classes.toolTipIcon, "fa-solid fa-circle-info")} data-tip data-for={id2} style={{marginLeft: "3px", color: COMMON.COLORS.N500}}/>
                    </div>
                </div>
                <div className={mc(classes.companyRaceContainer)}>
                    <div className={mc(classes.companyHeader)}>
                        {bipoc_respresentation ? <div>
                            {bipoc_respresentation}% BIPOC
                        </div> : <div>No Ethnicity Data</div>}
                    </div>
                    <div className={mc(classes.companySubHeader)}>
                        {bipoc_respresentation_change ? <span style={{
                            marginLeft: "0",
                            marginRight: "0px",
                            marginTop: "0",
                            color: bipoc_respresentation_change > 0 ? COMMON.COLORS.G600 : COMMON.COLORS.R600,
                        }}>{bipoc_respresentation_change_label}</span> : <span>No Data</span>}<i className={mc(classes.toolTipIcon, "fa-solid fa-circle-info")} data-tip data-for={id1} style={{marginLeft: "3px", color: COMMON.COLORS.N500}}/>
                    </div>
                </div>

                <div className={mc(classes.companyGlassdoorContainer)}>
                    <div className={mc(classes.companyHeader)}>
                        {company.glassdoor_overall ? <span>{company.glassdoor_overall}</span> : "--"}<i style={{color: COMMON.COLORS.Y400, marginLeft: "2.5px"}} className="fa-solid fa-star"/>
                    </div>
                    <div className={mc(classes.companySubHeader)}>
                        Overall <i className={mc(classes.toolTipIcon, "fa-solid fa-circle-info")} data-tip data-for={id_overall} style={{marginLeft: "3px", fontSize: "9.66px", color: COMMON.COLORS.N500}}/>
                    </div>
                </div>

                <div className={mc(classes.companyGlassdoorContainer)}>
                    <div className={mc(classes.companyHeader)}>
                        {company.glassdoor_work_life ? <span>{company.glassdoor_work_life}</span> : "--"}<i style={{color: COMMON.COLORS.R400, marginLeft: "2.5px"}} className="fa-solid fa-scale-balanced"/>
                    </div>
                    <div className={mc(classes.companySubHeader)}>
                        Work-Life <i className={mc(classes.toolTipIcon, "fa-solid fa-circle-info")} data-tip data-for={id_worklife} style={{marginLeft: "3px", fontSize: "9.66px", color: COMMON.COLORS.N500}}/>
                    </div>
                </div>

                <div className={mc(classes.companyGlassdoorContainer)}>
                    <div className={mc(classes.companyHeader)}>
                        {company.glassdoor_compensation ? <span>{company.glassdoor_compensation}</span> : "--"}<i style={{color: COMMON.COLORS.G600, marginLeft: "2.5px"}} className="fa-solid fa-dollar-sign"/>
                    </div>
                    <div className={mc(classes.companySubHeader)}>
                        Pay <i className={mc(classes.toolTipIcon, "fa-solid fa-circle-info")} data-tip data-for={id_pay} style={{marginLeft: "3px", fontSize: "9.66px", color: COMMON.COLORS.N500}}/>
                    </div>
                </div>

                <div className={mc(classes.companyIndustryContainer)} onClick={() => {this.setState({expanded: !expanded})}}>
                    <i style={{fontSize: "13px", marginTop: "13.5px"}} className={`fa-solid fa-angle-${expanded ? 'up' : 'down'}`}/>
                </div>
            </div>

            <div style={{display: expanded ? "block" : "none"}}>
                <div className={classes.expandedContainer}>
                    <div style={{flex: 3, paddingRight: "35px"}}>
                        <div style={{...COMMON.FONTS.H200, marginBottom: "5px",}}>ABOUT COMPANY</div>
                        <div style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitBoxOrient: "vertical"
                        }}>{company.company_about}</div>
                    </div>
                    <div style={{flex: 1, paddingRight: "20px"}}>
                        <div style={{color: COMMON.COLORS.N800, display: "-webkit-box",
                            WebkitLineClamp: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitBoxOrient: "vertical"}}><span style={{color: COMMON.COLORS.N900}}>Industry</span>: {company.company_industry}</div>
                        <div style={{color: COMMON.COLORS.N800}}><span style={{color: COMMON.COLORS.N900}}>HQ</span>: {company.company_city || ""}{company.company_city && company.company_state ? "," : ""} {company.company_state || ""}</div>
                        <div style={{color: COMMON.COLORS.N800}}><span style={{color: COMMON.COLORS.N900}}>Company Size</span>: {company.company_size ? formatLargeNumber(company.company_size) : "--"}</div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{color: COMMON.COLORS.N800}}><span style={{color: COMMON.COLORS.N900}}><i style={{width: "23px"}} className="fa-solid fa-star"/>Overall</span>: {company.glassdoor_overall ?  company.glassdoor_overall : "--"}</div>
                        <div style={{color: COMMON.COLORS.N800}}><span style={{color: COMMON.COLORS.N900}}><i style={{width: "23px"}} className="fa-solid fa-scale-balanced"/>Work-Life</span>: {company.glassdoor_work_life ?  company.glassdoor_work_life : "--"}</div>
                        <div style={{color: COMMON.COLORS.N800}}><span style={{color: COMMON.COLORS.N900}}><i style={{width: "23px"}} className="fa-solid fa-dollar-sign"/>Compensation</span>: {company.glassdoor_compensation ?  company.glassdoor_compensation : "--"}</div>
                        <div style={{color: COMMON.COLORS.N800}}><span style={{color: COMMON.COLORS.N900}}><i style={{width: "23px"}} className="fa-solid fa-heart"/>Culture & Values</span>: {company.glassdoor_culture ?  company.glassdoor_culture : "--"}</div>

                    </div>
                </div>
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

            <ReactTooltip multiline={true} className={"tool-tip-styles"} id={id_overall} place={"bottom"} padding={"0px"} textColor={COMMON.COLORS.N800} backgroundColor={COMMON.COLORS.N0}>
                <div style={{...COMMON.FONTS.H400, color: COMMON.COLORS.N900}}>Overall Company Rating</div>
                <div style={{marginTop: "5px"}}>{company.glassdoor_overall} {this.generateStars(company.glassdoor_overall)} {this.generateAverageTag(company.glassdoor_overall, overall_average)}</div>
                <div style={{...COMMON.FONTS.H300, color: COMMON.COLORS.N800, marginTop: "5px"}}>Total Reviews: {company.glassdoor_reviews || default_reviews}</div>
                <div style={{...COMMON.FONTS.H300, textAlign: "right", marginTop: "12.5px"}}>Data from <img style={{height: "11px"}} src={"/img/glassdoor-logo.svg"}/></div>
            </ReactTooltip>

            <ReactTooltip multiline={true} className={"tool-tip-styles"} id={id_worklife} place={"bottom"} padding={"0px"} textColor={COMMON.COLORS.N800} backgroundColor={COMMON.COLORS.N0}>
                <div style={{...COMMON.FONTS.H400, color: COMMON.COLORS.N900}}>Work-Life Balance Rating</div>
                <div style={{marginTop: "5px"}}>{company.glassdoor_work_life} {this.generateStars(company.glassdoor_work_life)} {this.generateAverageTag(company.glassdoor_work_life, worklife_average)}</div>
                <div style={{...COMMON.FONTS.H300, color: COMMON.COLORS.N800, marginTop: "5px"}}>Total Reviews: {company.glassdoor_reviews || default_reviews}</div>
                <div style={{...COMMON.FONTS.H300, textAlign: "right", marginTop: "12.5px"}}>Data from <img style={{height: "11px"}} src={"/img/glassdoor-logo.svg"}/></div>
            </ReactTooltip>

            <ReactTooltip multiline={true} className={"tool-tip-styles"} id={id_pay} place={"bottom"} padding={"0px"} textColor={COMMON.COLORS.N800} backgroundColor={COMMON.COLORS.N0}>
                <div style={{...COMMON.FONTS.H400, color: COMMON.COLORS.N900}}>Pay Rating</div>
                <div style={{marginTop: "5px"}}>{company.glassdoor_compensation} {this.generateStars(company.glassdoor_compensation)} {this.generateAverageTag(company.glassdoor_compensation, pay_average)}</div>
                <div style={{...COMMON.FONTS.H300, color: COMMON.COLORS.N800, marginTop: "5px"}}>Total Reviews: {company.glassdoor_reviews || default_reviews}</div>
                <div style={{...COMMON.FONTS.H300, textAlign: "right", marginTop: "12.5px"}}>Data from <img style={{height: "11px"}} src={"/img/glassdoor-logo.svg"}/></div>
            </ReactTooltip>

        </div>)
    }

}

export default injectSheet(Styles)(CompanyIndexRow);

