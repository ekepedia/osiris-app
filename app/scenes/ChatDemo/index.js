import React from "react";
import _ from "lodash";
import moment from "moment";

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
        maxWidth: "330px",
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
    VIEW_SKILLS: 3,
}

let DREAM_JOBS = [
    {
        job_title: "Creative Director",
        id: 1,
    },
    {
        job_title: "Chief Technology Officer",
        id: 2,
    },
    {
        job_title: "General Counsel",
        id: 3,
    }
];

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
}

let SKILLS = {
    "Paralegal": [
        {
            skill_title: "Microsoft Word"
        },
        {
            skill_title: "Excel"
        }
    ],
    "Software Engineer": [
        {
            skill_title: "git"
        },
        {
            skill_title: "javascript"
        }
    ],
    "Graphic Designer": [
        {
            skill_title: "photoshop"
        },
        {
            skill_title: "illustrator"
        }
    ]
}

class ChatDemo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            dream_job: {},
            dream_job_id: null,
            current_page: PAGES.SELECT_DREAM_JOB,
            job_id: null
        };
    }

    componentDidMount() {

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

        if (current_page === PAGES.VIEW_SKILLS) {
            new_page = PAGES.VIEW_SKILLS;

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
            new_page = PAGES.SELECT_JOB;
        }

        console.log("BACK: Setting new_page =", new_page, "old_page=", current_page);
        this.setState({current_page: new_page})
    }
    render() {
        let { classes, client, match: { params } } = this.props;

        let { current_page, dream_job, dream_job_id, job_id } = this.state;

        dream_job = dream_job || {};
        let skills = SKILLS[job_id] || [];
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

                                            <div className={mc(classes.headerTitle)}>What do you dream of doing ten years from now?</div>
                                            <div className={mc(classes.inputLabel)}>Research shows that having a clear vision for the future increases your chances of success!</div>


                                            <StandardSelect value={dream_job_id} options={DREAM_JOBS.map((job) => {
                                                return {value: job.job_title, label: job.job_title}
                                            })} placeholder={"Input Email"} update={(v) => (this.setState({dream_job_id: v}))}/>

                                            {current_page === PAGES.SELECT_DREAM_JOB ?
                                                <div>
                                                    DREAM
                                                </div>
                                                : null}

                                            {current_page === PAGES.SELECT_JOB ?
                                                <div>
                                                    job {dream_job_id}
                                                    {jobs.map((job) => {
                                                        return (<div onClick={() => {
                                                            this.setState({job_id: job.job_title})
                                                        }}>{job.job_title}</div>)
                                                    })}
                                                </div>
                                                : null}

                                            {current_page === PAGES.VIEW_SKILLS ?
                                                <div>
                                                    skills {this.state.job_id}
                                                    {skills.map((skill) => {
                                                        return (<div>{skill.skill_title}</div>)
                                                    })}
                                                </div>
                                                : null}


                                            <div className={mc(classes.buttonContainer)}>
                                                <StandardButton label={"Next"} fullWidth={true} onClick={() => (this.handleNext())}/>
                                            </div>
                                            <div className={mc(classes.buttonContainer)}>
                                                <StandardButton label={"Back"} secondary={true} fullWidth={true} onClick={() => (this.handleBack())}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={mc(classes.RHSContainer)}>
                                <SignOnHero />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(ChatDemo)));

