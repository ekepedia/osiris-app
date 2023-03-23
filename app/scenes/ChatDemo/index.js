import React from "react";
import _ from "lodash";
import moment from "moment";

import FadeIn from 'react-fade-in';

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import AuthService from '../../services/AuthService';
import COMMON from "../../common/index";
import axios from "axios";
import {mc} from "../../common/helpers";
import StandardInput from "../../components/StandardInput";
import StandardButton from "../../components/StandardButton";
import NavBar from "../../components/NavBar";
import CoverImageHolder from "../../components/CoverImageHolder";
import SignOnHero from "../../components/SignOnHero";
import TrackingService from "../../services/TrackingService";
import StandardSelect from "../../components/StandardSelect";
import Welcome from "../../components/onboarding/Welcome";
import OnboardingHero from "../../components/OnboardingHero";
import DataService from "../../services/DataService";
import StandardBadge from "../../components/StandardBadge";

const Styles = {
    container: {
        padding: "0",
        background: COMMON.COLORS.N0,
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    ...COMMON.STYLES.GENERAL.InputStyles,
    headerTitle: {
        ...COMMON.FONTS.H600,
        marginBottom: "20px",
        textAlign: "left",
        color: COMMON.COLORS.N900
    },
    subContainer: {
        maxWidth: "425px",
        margin: "auto",
    },
    buttonContainer: {
        marginTop: "30px"
    },
    RHSContainer: {
        flex: 1,
        '@media (max-width: 750px)': {
            display: "none"
        },
    },
    disclaimer: {
        ...COMMON.FONTS.FONT_CAPTION_2,
        color: COMMON.COLORS.DARK_GREY,
        maxWidth: "241px",
        margin: "auto",
        marginTop: "20px",
        textAlign: "center"
    },
    disclaimerBold: {
        extend: "disclaimer",
        ...COMMON.FONTS.FONT_CAPTION_2_BOLD,
    },
    companyProfileContainer: {
        height: "40px",
        marginRight: "25px",
        color: COMMON.COLORS.N0,
        marginBottom: "25px"
    },
    companyProfileImgContainer: {
        flex: "0 0 40px",
        marginRight: "10px",
        borderRadius: "4px",
        textAlign: "left"
    },
    companyProfileTitle: {
        marginTop: "0",
        ...COMMON.FONTS.H500
    },
    companyProfileBody: {
        marginTop: "0",
        ...COMMON.FONTS.H300,
    },
    ...COMMON.STYLES.GENERAL.NavigationStyles,
    ...COMMON.STYLES.GENERAL.AlignmentStyles,

};

let PAGES = {
    SELECT_DREAM_JOB: 1,
    SELECT_JOB: 2,
    CHOOSE: 3,
    VIEW_SKILLS: 4,
    VIEW_JOBS: 5,
    SHOW_SKILLS: 6,
}


let JOB_DESCRIPTIONS = {};
let JOB_PATHS = {
    "Creative Director": [
        {
            job_title: "Graphic Designer",
        },
        {
            job_title: "Art Director",
        },
        {
            job_title: "Senior Art Director",
        },
        {
            job_title: "Creative Director",
        },
    ],
    "Chief Financial Officer": [
        {
            job_title: "Financial Analyst",
        },
        {
            job_title: "Senior Financial Analyst",
        },
        {
            job_title: "Accounting Manager",
        },
        {
            job_title: "Financial Controller",
        },
        {
            job_title: "Finance Director",
        },
        {
            job_title: "Chief Financial Officer",
        },
    ],
    "Chief Human Resources Officer": [
        {
            job_title: "Human Resources Manager",
        },
        {
            job_title: "Human Resources Director",
        },
        {
            job_title: "Human Resources Vice President",
        },
        {
            job_title: "Chief Human Resources Officer",
        },
    ],
    "Chief Investment Officer": [
        {
            job_title: "Investment Banking Analyst",
        },
        {
            job_title: "Investment Manager",
        },
        {
            job_title: "Portfolio Manager",
        },
        {
            job_title: "Director of Investment",
        },
        {
            job_title: "Chief Investment Officer",
        },
    ],
    "Chief Marketing Officer": [
        {
            job_title: "Marketing Assistant",
        },
        {
            job_title: "Marketing Coordinator",
        },
        {
            job_title: "Marketing Manager",
        },
        {
            job_title: "Director of Marketing",
        },
        {
            job_title: "Vice President of Marketing",
        },
        {
            job_title: "Chief Marketing Officer",
        },
    ],
    "Chief Operating Officer": [
        {
            job_title: "Business Analyst",
        },
        {
            job_title: "Project Manager",
        },
        {
            job_title: "Operations Director",
        },
        {
            job_title: "Senior Operations Manager",
        },
        {
            job_title: "Vice President of Operations",
        },
        {
            job_title: "Chief Operating Officer",
        },
    ],
    "Chief Technology Officer": [
        {
            job_title: "Software Engineer",
        },
        {
            job_title: "Senior Software Engineer",
        },
        {
            job_title: "Software Architect",
        },
        {
            job_title: "Lead Software Architect",
        },
        {
            job_title: "Technical Director",
        },
        {
            job_title: "Chief Technology Officer (CTO)",
        },
    ],
    "General Counsel": [
        {
            job_title: "Paralegal",
        },
        {
            job_title: "Legal Assistant",
        },
        {
            job_title: "Law Clerk",
        },
        {
            job_title: "Associate Attorney",
        },
        {
            job_title: "Senior Associate Attorney",
        },
        {
            job_title: "General Counsel",
        },
    ],
    "Managing Director": [
        {
            job_title: "Junior Analyst",
        },
        {
            job_title: "Analyst",
        },
        {
            job_title: "Senior Analyst",
        },
        {
            job_title: "Associate",
        },
        {
            job_title: "Senior Associate",
        },
        {
            job_title: "Manager",
        },
        {
            job_title: "Senior Manager",
        },
        {
            job_title: "Director",
        },
        {
            job_title: "Senior Director",
        },
        {
            job_title: "Managing Director",
        },
    ],
    "VP of Engineering": [
        {
            job_title: "Software Engineer",
        },
        {
            job_title: "Senior Software Engineer",
        },
        {
            job_title: "Team Lead",
        },
        {
            job_title: "Engineering Manager",
        },
        {
            job_title: "Engineering Director",
        },
        {
            job_title: "VP of Engineering",
        },
    ],
}

let SKILLS = {};

class ChatDemo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            dream_job: {},
            dream_job_id: null,
            current_page: PAGES.SELECT_DREAM_JOB,
            job_id: null,
            jobs: [],
            selected_skills: []
        };
    }

    addToField(field, id) {
        let selected = this.state[field];
        selected.push(id);
        selected = _.uniq(selected);
        this.setState({[field]: selected});
    }

    removeFromField(field, id) {
        let selected = this.state[field];
        const index = selected.indexOf(id);
        if (index > -1) {
            selected.splice(index, 1);
        }
        selected = _.uniq(selected);
        this.setState({[field]: selected})
    }

    componentDidMount() {
        axios.get("/api/job-descriptions").then((response) => {
            console.log("response.data", response.data);
            SKILLS = response.data.SKILLS;
            JOB_DESCRIPTIONS = response.data.JOB_DESCRIPTIONS;
        });

        this.loadJobs({});
    }

    loadJobs({job_title}) {
        DataService.getJobs({
            job_titles: [job_title || "Software Engineer"],
            seniorities: ["Entry Level", "Mid Senior Level", "Internship"],
            max: 10
        }).then(({jobs}) => {
            console.log("LOADED JOBS:", jobs);
            this.setState({
                jobs
            })
        })
    }

    handleNext() {
        const { current_page } = this.state;
        let new_page = PAGES.SELECT_DREAM_JOB;

        if (current_page === PAGES.SELECT_DREAM_JOB) {
            new_page = PAGES.SELECT_JOB;
        }

        if (current_page === PAGES.SELECT_JOB) {
            new_page = PAGES.VIEW_SKILLS;
        }

        if (current_page === PAGES.SELECT_JOB) {
            new_page = PAGES.CHOOSE;
        }

        if (current_page === PAGES.VIEW_JOBS) {
            new_page = PAGES.CHOOSE;
        }

        if (current_page === PAGES.VIEW_SKILLS) {
            new_page = PAGES.SHOW_SKILLS;
        }

        if (current_page === PAGES.SHOW_SKILLS) {
            new_page = PAGES.SHOW_SKILLS;
        }

        if (current_page === PAGES.CHOOSE) {
            new_page = PAGES.CHOOSE;

            // console.log("Onboarding is complete, redirecting to companies");
            // window.location.pathname = `/companies`;
            // return;
        }

        console.log("NEXT: Setting new_page =", new_page, "old_page=", current_page);
        this.setState({current_page: new_page})
    }

    handleBack() {
        const { current_page } = this.state;
        let new_page = PAGES.SELECT_DREAM_JOB;

        if (current_page === PAGES.SELECT_DREAM_JOB) {
            new_page = PAGES.SELECT_DREAM_JOB;
        }

        if (current_page === PAGES.SELECT_JOB) {
            new_page = PAGES.SELECT_DREAM_JOB;
        }

        if (current_page === PAGES.VIEW_SKILLS) {
            new_page = PAGES.CHOOSE;
        }

        if (current_page === PAGES.VIEW_JOBS) {
            new_page = PAGES.CHOOSE;
        }

        if (current_page === PAGES.CHOOSE) {
            new_page = PAGES.SELECT_JOB;
        }

        if (current_page === PAGES.SHOW_SKILLS) {
            new_page = PAGES.VIEW_SKILLS;
        }


        console.log("BACK: Setting new_page =", new_page, "old_page=", current_page);
        this.setState({current_page: new_page})
    }
    render() {
        let { classes, client, match: { params } } = this.props;

        let { current_page, dream_job, dream_job_id, job_id, selected_skills } = this.state;

        dream_job = dream_job || {};
        let skills = (JOB_DESCRIPTIONS[job_id] || {}).skills || [];
        let jobs = JOB_PATHS[dream_job_id] || [];

        return (
            <div className={classes.masterContainer}>
                <div className={classes.masterNavContainer}>
                    <NavBar />
                </div>
                <div className={classes.masterBodyContainer}>
                    <div className={classes.container}>
                        <div style={{display: "flex", height: "100%"}}>
                            <div style={{flex: 1, height: "100%"}}>
                                <div className={classes.centerAlignContainerFill}>
                                    <div className={classes.verticalAlignObjectFill}>
                                        <div className={mc(classes.subContainer)}>
                                            <div className={mc(classes.inputLabel)}>Plan Your Future</div>



                                            {current_page === PAGES.SELECT_DREAM_JOB ?
                                                <div>
                                                    <div className={mc(classes.headerTitle)}>What do you dream of doing ten years from now?</div>
                                                    <div className={mc(classes.inputLabel)}>Research shows that having a clear vision for the future increases your chances of success!</div>
                                                    <StandardSelect value={dream_job_id} options={Object.keys(JOB_PATHS).map((job_title) => {
                                                        return {value: job_title, label: job_title}
                                                    })} placeholder={"Choose Career Path"} update={(v) => (this.setState({dream_job_id: v}))}/>
                                                </div>
                                                : null}

                                            {current_page === PAGES.SELECT_JOB ?
                                                <div>
                                                    <div className={mc(classes.headerTitle)}>Your Career Path</div>
                                                    <div className={mc(classes.inputLabel)}>To become a {dream_job_id} we recommend the following roles; select the job appropriate for your skill levels</div>

                                                    <div>
                                                        <div style={{maxHeight: "400px", overflow: "scroll"}}>
                                                            <FadeIn>
                                                            {jobs.map((job, i) => {

                                                                let job_description = JOB_DESCRIPTIONS[job.job_title] || {};

                                                                return (<div onClick={() => {
                                                                    this.setState({job_id: job.job_title});
                                                                    this.loadJobs({job_title: job.job_title});
                                                                }}>
                                                                    <div style={{
                                                                        border: `1px solid ${COMMON.COLORS.N500}`,
                                                                        padding: "15px",
                                                                        borderRadius: "4px",
                                                                        marginTop: "15px",
                                                                        cursor: "pointer",
                                                                        color: this.state.job_id === job.job_title ? COMMON.COLORS.N0 : COMMON.COLORS.N700,
                                                                        background: this.state.job_id === job.job_title ? COMMON.COLORS.N700 : COMMON.COLORS.N0,
                                                                    }} >
                                                                        <div style={{...COMMON.FONTS.H500}}>{i + 1} - {job.job_title}</div>
                                                                        <div style={{...COMMON.FONTS.H300}}>{job_description.job_about}</div>
                                                                    </div>
                                                                </div>)
                                                            })}
                                                            </FadeIn>
                                                        </div>
                                                    </div>
                                                </div>
                                                : null}

                                            {current_page === PAGES.CHOOSE ?
                                                <div>
                                                    <div className={mc(classes.headerTitle)}>Let's Land the Job!</div>
                                                    <div className={mc(classes.inputLabel)}>Let's help you land a {this.state.job_id} role! Select the appropriate next step based on where you are in your journey</div>

                                                    <div>

                                                        <FadeIn>
                                                            <div onClick={() => {
                                                                this.setState({current_page: PAGES.VIEW_SKILLS})
                                                            }}>
                                                                <div style={{
                                                                    border: `1px solid ${COMMON.COLORS.N500}`,
                                                                    padding: "15px",
                                                                    borderRadius: "4px",
                                                                    marginTop: "15px",
                                                                    cursor: "pointer",
                                                                    color:  COMMON.COLORS.N700,
                                                                    background:  COMMON.COLORS.N0,
                                                                }} >
                                                                    <div style={{...COMMON.FONTS.H500}}>Help Me Prepare for the Role</div>
                                                                    <div style={{...COMMON.FONTS.H300}}>Show me the skill sets I need to be successful in this role</div>
                                                                </div>
                                                            </div>
                                                            <div onClick={() => {
                                                                this.setState({current_page: PAGES.VIEW_JOBS})
                                                            }}>
                                                                <div style={{
                                                                    border: `1px solid ${COMMON.COLORS.N500}`,
                                                                    padding: "15px",
                                                                    borderRadius: "4px",
                                                                    marginTop: "15px",
                                                                    cursor: "pointer",
                                                                    color:  COMMON.COLORS.N700,
                                                                    background:  COMMON.COLORS.N0,
                                                                }} >
                                                                    <div style={{...COMMON.FONTS.H500}}>Show Me Open Opportunities</div>
                                                                    <div style={{...COMMON.FONTS.H300}}>Show me the companies that are actively hiring for this position</div>
                                                                </div>
                                                            </div>
                                                        </FadeIn>

                                                    </div>
                                                </div>
                                                : null}

                                            {current_page === PAGES.VIEW_SKILLS ?
                                                <div>
                                                    <div className={mc(classes.headerTitle)}>Recommended Skills</div>

                                                    <div className={mc(classes.inputLabel)}>To become a {this.state.job_id} we recommend learning the following skills; Select the ones you'd like to learn more about</div>

                                                    <div>
                                                        <FadeIn childClassName={"gpt-skill-bubble"}>
                                                            {skills.map((skill) => {
                                                                return (<div onClick={() => {
                                                                    if (selected_skills.indexOf(skill) === -1) {
                                                                        this.addToField("selected_skills", skill);
                                                                    } else {
                                                                        this.removeFromField("selected_skills", skill);
                                                                    }
                                                                }} style={{
                                                                    display: "inline-block",
                                                                    borderRadius: "45px",
                                                                    padding: "8px 10px",
                                                                    border: `1px solid ${COMMON.COLORS.N700}`,
                                                                    ...COMMON.FONTS.H300,
                                                                    lineHeight: "initial",
                                                                    marginRight: "5px",
                                                                    marginTop: "5px",
                                                                    cursor: "pointer",
                                                                    textTransform: "capitalize",
                                                                    color: selected_skills.indexOf(skill) !== -1 ? COMMON.COLORS.N0: COMMON.COLORS.N700,
                                                                    background: selected_skills.indexOf(skill) !== -1 ? COMMON.COLORS.N700: COMMON.COLORS.N0
                                                                }}>{skill}</div>)
                                                            })}
                                                        </FadeIn>
                                                    </div>

                                                </div>
                                                : null}

                                            {current_page === PAGES.VIEW_JOBS ?
                                                <div>
                                                    <div className={mc(classes.headerTitle)}>Recommended Roles</div>

                                                    <div>
                                                        <div style={{maxHeight: "400px", overflow: "scroll"}}>

                                                            <FadeIn>
                                                            {(this.state.jobs || []).map((job) => {

                                                                job = job || {};

                                                                let company = job.companies && job.companies.length ? job.companies[0] : {};
                                                                let job_type = job.job_types && job.job_types.length ? job.job_types[0] : {};
                                                                let industry = job.industries && job.industries.length ? job.industries[0].name : "";
                                                                let qualification = job.qualifications && job.qualifications.length ? job.qualifications[0] : {};
                                                                let responsibility = job.responsibilities && job.responsibilities.length ? job.responsibilities[0] : {};
                                                                let degree_requirement = job.degree_requirements && job.degree_requirements.length ? job.degree_requirements[0] : {};

                                                                let salary = "";
                                                                let salary_tooltip = "";
                                                                if (job && job.job_salary_estimate) {
                                                                    salary = job.job_salary_estimate;

                                                                    if (salary.indexOf("(Employer est.)") !== -1) {
                                                                        salary = salary.replace("(Employer est.)", "").trim()
                                                                        salary_tooltip = "This estimate was provided by the employer via Glassdoor";
                                                                    }

                                                                    if (salary.indexOf("(Glassdoor est.)") !== -1) {
                                                                        salary = salary.replace("(Glassdoor est.)", "").trim()
                                                                        salary_tooltip = "This estimate was provided by Glassdoor";
                                                                    }
                                                                }


                                                                console.log(job.companies, company)

                                                                if (job.is_fill)
                                                                    return null;
                                                                return (<div>
                                                                    <div style={{
                                                                        border: `1px solid ${COMMON.COLORS.N500}`,
                                                                        padding: "15px",
                                                                        borderRadius: "4px",
                                                                        marginTop: "15px",
                                                                        cursor: "pointer",
                                                                        color: COMMON.COLORS.N700,
                                                                        background: COMMON.COLORS.N0,
                                                                    }} onClick={() =>{
                                                                        window.open(`/jobs?j=${job.job_id}&t=${job_id}`, "_blank");
                                                                    }}>
                                                                        <div style={{display: "flex", marginBottom: "7px"}}>

                                                                            <div style={{flex: "0 0 38px", marginRight: "8px", height: "38px"}}>
                                                                                <div style={{borderRadius: "4px", border: `1px solid ${COMMON.COLORS.N300}`, overflow: "hidden"}}>
                                                                                    <CoverImageHolder url={company.company_logo_url} />
                                                                                </div>
                                                                            </div>

                                                                            <div style={{flex: 1, overflow: "hidden"}}>
                                                                                <div>
                                                                                    <div style={{...COMMON.FONTS.H400, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>{job.job_title}</div>
                                                                                    <div style={{color: COMMON.COLORS.DARK_GREY, ...COMMON.FONTS.P100, marginTop: "-2px",}}>{company.company_name}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <div>
                                                                                <div style={{marginBottom: "13px", maxHeight: "20px", overflow: "hidden"}}>
                                                                                    {industry ? <StandardBadge label={industry}/> : null}
                                                                                    {company.company_industry ? <StandardBadge label={company.company_industry}/> : null}
                                                                                </div>

                                                                                <div style={{marginBottom: "0", maxHeight: "20px", overflow: "hidden"}}>

                                                                                    {(job.locations && job.locations.length) && (job.locations.slice(0,1)).map((location) =>{
                                                                                        return (<StandardBadge iconLeft={true} icon={"fa-solid fa-location-dot"} style={{background: COMMON.COLORS.Y100, color: COMMON.COLORS.Y600}} key={location.location_id} label={location.label}/>)
                                                                                    })}

                                                                                    {(job.locations && job.locations.length > 1) && <div style={{display: "inline-block", ...COMMON.FONTS.H100, color: COMMON.COLORS.Y600 ,marginRight: "5px"}}>{`+${job.locations.length - 1}`}</div>}

                                                                                    {/*{job.job_seniority ? <StandardBadge iconLeft={true} icon={"fa-solid fa-briefcase"} label={job.job_seniority}/> : null }*/}
                                                                                    {(salary && salary.length) ? <StandardBadge tooltip={salary_tooltip} label={`${salary}`} style={{background: COMMON.COLORS.B200, color: COMMON.COLORS.B500}} icon={"fa-solid fa-money-bill"} iconLeft={true}/> : null}

                                                                                    {/*<StandardBadge label={job_type.name} iconLeft={true} icon={"fa-sharp fa-solid fa-briefcase"}/>*/}
                                                                                    {company.glassdoor_overall ? <StandardBadge tooltip={`Employees rate ${company.company_name} ${company.glassdoor_overall}/5 on<br/>Glassdoor overall`} label={`${company.glassdoor_overall}`} icon={"fa-solid fa-star"} iconLeft={false} iconStyle={{color: COMMON.COLORS.Y400}} style={{background: COMMON.COLORS.N100, color: COMMON.COLORS.N900}}/> : null}
                                                                                    {company.glassdoor_culture ? <StandardBadge tooltip={`Employees rate ${company.company_name} ${company.glassdoor_culture}/5 on<br/>Glassdoor for culture`} label={`${company.glassdoor_culture}`} icon={"fa-sharp fa-solid fa-basketball"} iconLeft={false} iconStyle={{color: COMMON.COLORS.P400}} style={{background: COMMON.COLORS.N100, color: COMMON.COLORS.N900}}/> : null}
                                                                                    {company.glassdoor_work_life ? <StandardBadge tooltip={`Employees rate ${company.company_name} ${company.glassdoor_work_life}/5 on<br/>Glassdoor for work-life balance`} label={`${company.glassdoor_work_life}`} icon={"fa-solid fa-scale-balanced"} iconLeft={false} iconStyle={{color: COMMON.COLORS.R400}} style={{background: COMMON.COLORS.N100, color: COMMON.COLORS.N900}}/> : null}
                                                                                    {/*{company.glassdoor_culture ? <StandardBadge label={`${company.glassdoor_culture} CULTURE`} tooltip={`Employees rate ${company.company_name} ${company.glassdoor_culture}/5 on<br/>Glassdoor for culture`} icon={"fa-solid fa-gavel"} iconLeft={true} style={{background: COMMON.COLORS.B200, color: COMMON.COLORS.B500}}/> : null}*/}

                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>)
                                                            })}
                                                            </FadeIn>
                                                        </div>
                                                    </div>
                                                </div>
                                                : null}

                                            {current_page === PAGES.SHOW_SKILLS ?
                                                <div>
                                                    <div className={mc(classes.headerTitle)}>Recommended Skills</div>

                                                    <div style={{maxHeight: "400px", overflow: "scroll"}}>
                                                        <FadeIn>
                                                            {skills.map((skill) => {

                                                                let skill_description = SKILLS[skill] || {};

                                                                if (selected_skills.indexOf(skill) === -1)
                                                                    return null;

                                                                return (<div>
                                                                    <div style={{
                                                                        border: `1px solid ${COMMON.COLORS.N500}`,
                                                                        padding: "15px",
                                                                        borderRadius: "4px",
                                                                        marginTop: "15px",
                                                                        color: COMMON.COLORS.N700,
                                                                        background: COMMON.COLORS.N0,
                                                                    }} >
                                                                        <div style={{...COMMON.FONTS.H500, textTransform: "capitalize"}}>{skill}</div>
                                                                        <div style={{...COMMON.FONTS.H300}}>{skill_description.skill_about}</div>
                                                                        <div style={{...COMMON.FONTS.H300}}><a target={"_blank"} href={skill_description.youtube_link}>YouTube Videos</a> • <a target={"_blank"}  href={skill_description.skillshare_link}>Skillshare Classes</a></div>
                                                                    </div>
                                                                </div>)
                                                            })}
                                                        </FadeIn>
                                                    </div>

                                                </div>
                                                : null}


                                            <div className={mc(classes.buttonContainer)}>
                                                <StandardButton label={"Continue"} fullWidth={true} onClick={() => (this.handleNext())}/>
                                            </div>
                                            {
                                                current_page !== PAGES.SELECT_DREAM_JOB ? <div style={{marginTop: "5px"}} className={mc(classes.buttonContainer)}>
                                                    <StandardButton label={"Back"} secondary={true} fullWidth={true} onClick={() => (this.handleBack())}/>
                                                </div> : null
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={mc(classes.RHSContainer)}>
                                <OnboardingHero />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(ChatDemo)));

