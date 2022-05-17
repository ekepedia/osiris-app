import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import {Mutation, Query} from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';

import { COLOR_WHITE } from "../../common/colors";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    sectionHeading: {
        fontSize: "17px",
        marginBottom: "20px",
        fontWeight: "600"
    },
    heading: {
        fontSize: "30px",
        marginBottom: "10px",
        fontWeight: "600"
    },
    osirisPill: {
        background: "#1F3D3B",
        display: "inline-block",
        color: "#F2EFEC",
        padding: "3px 9px",
        fontWeight: 600,
        fontSize: "12px",
        borderRadius: "15px",
        marginRight: "5px"
    },
    submitButtom: {
        background: "#1F3D3B",
        height: "50px",
        lineHeight: "50px",
        letterSpacing: 0,
        color: "#F2EFEC",
        fontWeight: 600,
        borderRadius: "7px",
        width: "100%",
        margin: "auto",
        textAlign: "center",
        cursor: "pointer",
        marginTop: "15px"
    },
    boxContainer: {
        border: "none",
        padding: "30px 20px",
        borderRadius: "10px",
        width: "100%",
        maxWidth: "650px",
        margin: "auto",
        marginTop: "0px",
        paddingBottom: "100px",
        '@media (max-width: 768px)': {
            padding: "0",
            paddingBottom: "100px",
        },
    },
    pageContainer: {
        flex: 1,
        padding: "20px 40px",
        overflow: "scroll",
        background: COLOR_WHITE,
        height: "100%",
        '@media (max-width: 768px)': {
            padding: "20px",
        }
    },
    inputStyle: {
        height: "50px",
        lineHeight: "50px",
        background: "white",
        borderRadius: "10px",
        padding: "0 15px",
        color:"black",
        fontSize: "15px",
        border: "1px solid #1F3D3B",
        fontWeight: 500,
        outline: "none",
        width: "100%"
    },
    textAreaStyle: {
        lineHeight: "50px",
        background: "white",
        borderRadius: "10px",
        color:"black",
        fontSize: "15px",
        border: "1px solid #1F3D3B",
        fontWeight: 500,
        outline: "none",
        width: "100%",

        height: "100px",
        padding: "10px 13px",
    }
};


const GENDER_OPTIONS = [
    {value: 1, label: "Man"},
    {value: 2, label: "Nonbinary"},
    {value: 3, label: "Transgender"},
    {value: 4, label: "Woman"},
    {value: 5, label: "Prefer Not to Respond"},
]

let GENDER_OPTIONS_MAP = {};

GENDER_OPTIONS.forEach((o) => {
    GENDER_OPTIONS_MAP[o.value] = o.label
});

const STAGE_OPTIONS = [
    {value: 1, label: "Employed, Full-Time"},
    {value: 2, label: "Employed, Part-Time"},
    {value: 3, label: "Undergraduate Student"},
    {value: 4, label: "Graduate Student"},
    {value: 5, label: "Self-Employed"},
    {value: 6, label: "Military"},
    {value: 7, label: "Unemployed"},
]

let STAGE_OPTIONS_MAP = {};

STAGE_OPTIONS.forEach((o) => {
    STAGE_OPTIONS_MAP[o.value] = o.label
});

class Feedback extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            full_name: "",
            email_address: "",
            first_name: "",
            last_name: "",
            race: "",
            state: 1,
            page: 1,
            submitted: false,
            type: null,
            stage_id: null,
            cities: [],
            colleges: [],
            adding_college: false,
            adding_city: false,
        };

        this.timeouts = {};

        this.changeState = this.changeState.bind(this);

        this.cities = [];

        // CITIES.forEach((city) => {
        //     this.cities.push(city.Location)
        // });

        this.colleges = [];

        // COLLEGES.forEach((college) => {
        //     this.colleges.push(college.University)
        // });
    }

    changeState(state) {
        this.setState({state})
    }

    componentDidMount() {

    }

    validEmail() {
        let { email_address } = this.state;

        if (!email_address)
            return false;

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email_address))){
            return false
        }

        return true;
    }

    isOnlyWhite() {
        const {
            is_native,
            is_asian,
            is_black,
            is_hispanic,
            is_middle_eastern,
            is_hawaiian,
            is_white,
            is_not_respond,
        } = this.state;

        return (
            !!is_white &&
            !is_native &&
            !is_asian &&
            !is_black &&
            !is_hispanic &&
            !is_middle_eastern &&
            !is_hawaiian &&
            !is_not_respond
        )
    }

    validRace() {
        const {
            is_native,
            is_asian,
            is_black,
            is_hispanic,
            is_middle_eastern,
            is_hawaiian,
            is_white,
            is_not_respond,
        } = this.state;

        return (
            !!is_native ||
            !!is_asian ||
            !!is_black ||
            !!is_hispanic ||
            !!is_middle_eastern ||
            !!is_hawaiian ||
            !!is_white ||
            !!is_not_respond
        )
    }

    validOption() {
        const {
            wants_mentors,
            wants_peers,
            wants_internships,
            wants_jobs,
            wants_other,
        } = this.state;

        return (
            !!wants_mentors ||
            !!wants_peers ||
            !!wants_internships ||
            !!wants_jobs ||
            !!wants_other
        )
    }

    validSchool() {
        const {
            school_1_id,
            school_2_id,
            school_3_id,
            school_4_id,
            school_5_id,
            school_6_id,
        } = this.state;

        return (
            !!school_1_id ||
            !!school_2_id ||
            !!school_3_id ||
            !!school_4_id ||
            !!school_5_id ||
            !!school_6_id
        )
    }

    getProgressBar() {
        const pages = 14;

        const { page } = this.state;
        if (page === 1) return 0;
        return Math.max(Math.min((page / pages), 1),0.1) * 100
    }

    answeredYesNo(field) {
        return this.state[field] === 1 || this.state[field] === 0
    }

    canGoNext() {
        const { page } = this.state;

        if (page === 1) {
            const { first_name, last_name, email_address } = this.state;
            return !!first_name && !!last_name && !!email_address
        }

        if (page === 2) {
            const { stage_id } = this.state;
            return !!stage_id
        }

        if (page === 3) {
            return this.validRace();
        }

        if (page === 4) {
            return this.answeredYesNo("question_1");
        }

        if (page === 5) {
            // return this.validOption();

            const { wants_other, other } = this.state;

            if (wants_other) {
                return other && other.length
            } else {
                return true
            }

        }

        if (page === 6) {
            return this.answeredYesNo("question_2");
        }

        if (page === 7) {
            return true;
        }

        if (page === 8) {
            return this.answeredYesNo("question_3");
        }

        if (page === 9) {
            return this.state.cities.length > 0;
        }

        if (page === 10) {
            return true;
            // return this.state.colleges.length > 0;
        }

        if (page === 11) {
            const { gender } = this.state;
            return !!gender
        }

        if (page === 12) {
            // const { phone_number } = this.state;
            // return !!phone_number
            return true;
        }

        if (page === 13) {
            // const { linkedin } = this.state;
            // return !!linkedin
            return true
        }
    }

    canGoBack() {
        const { page } = this.state;
        return !(page === 1);
    }

    goBack() {
        const { page } = this.state;

        if (this.canGoBack()) {

            if (this.isOnlyWhite()) {
                if (page <= 9 && page >= 4) {
                    this.setState({page: 3});
                } else {
                    this.setState({page: page - 1})
                }
            } else {
                this.setState({page: page - 1})
            }
            DataService.trackNavigation("go-back", "page", page - 1);
        }
    }

    goNext() {
        const { page } = this.state;
        let { client } = this.props;

        if (this.canGoNext()) {

            if (this.isOnlyWhite()) {
                if (page >= 3 && page <= 8) {
                    this.setState({page: 9});
                } else {
                    this.setState({page: page + 1})
                }
            } else {
                this.setState({page: page + 1})
            }

            DataService.trackPage(page);
            DataService.trackNavigation("go-next", "page", page + 1);

            if (page === 1) {
                DataService.createFeedback({client, email_address: this.state.email_address, first_name: this.state.first_name, last_name: this.state.last_name}).then((feedback_id) => {
                    console.log("Submitted feedback:", feedback_id);
                });
            }

            if (page === 2) {
                DataService.trackFormEntry("school_status", this.state.stage_id);

                if (this.user && this.user.feedback_id) {
                    DataService.updateFeedback({
                        client,
                        feedback_id: this.user.feedback_id,
                        stage: STAGE_OPTIONS_MAP[this.state.stage_id]
                    }).then((result) => {
                        console.log(result);
                    })
                }
            }

            if (page === 3) {
                DataService.trackFormEntry("race", this.convertToBoolean(this.state.is_black));

                const fields = [
                    "is_native",
                    "is_asian",
                    "is_black",
                    "is_hispanic",
                    "is_middle_eastern",
                    "is_hawaiian",
                    "is_white",
                    "is_not_respond"
                ];

                this.submitMultipleChoice(fields, true)
            }

            if (page === 4) {
                DataService.trackFormEntry("access_to_resources", this.convertToBoolean(this.state.question_1));
                this.submitBoolean("question_1");
            }

            if (page === 5) {
                DataService.trackFormEntry("more_access_to", this.state.wants_mentors);

                const fields = [
                    "wants_mentors",
                    "wants_peers",
                    "wants_internships",
                    "wants_jobs",
                    "wants_other",
                ];

                this.submitMultipleChoice(fields, true);

                if (this.user && this.user.feedback_id && this.state.other && this.state.other.length) {
                    DataService.updateFeedback({
                        client,
                        feedback_id: this.user.feedback_id,
                        other: this.state.other
                    }).then((result) => {
                        console.log(result);
                    })
                }
            }

            if (page === 6) {
                DataService.trackFormEntry("would_you_connect", this.convertToBoolean(this.state.question_2));
                this.submitBoolean("question_2");
            }

            if (page === 7) {
                DataService.trackFormEntry("heard_of", this.convertToBoolean(this.state.heard_seo));

                const fields = [
                    "heard_seo",
                    "heard_mlt",
                    "heard_jopwell",
                    "heard_valence",
                    "heard_yc",
                    "heard_elpha",
                    "heard_lh",
                ];

                this.submitMultipleChoice(fields, true)
            }

            if (page === 8) {
                DataService.trackFormEntry("would_you_slack", this.convertToBoolean(this.state.question_3));
                this.submitBoolean("question_3");
            }


            if (page === 9) {
                const city = this.state.cities && this.state.cities.length ? this.state.cities[0] : "";
                DataService.trackFormEntry("city", city);

                if (this.user && this.user.feedback_id) {
                    DataService.updateFeedback({
                        client,
                        feedback_id: this.user.feedback_id,
                        city: this.state.cities && this.state.cities.length ? this.state.cities[0] : ""
                    }).then((result) => {
                        console.log(result);
                    })
                }
            }

            if (page === 10) {
                const colleges = this.state.colleges && this.state.colleges.length ? this.state.colleges : [];

                let fields = [];

                colleges.forEach((college, i) => {
                    DataService.trackFormEntry("college", college);
                    const label = `school_${i + 1}`;
                    fields.push(label);
                    this.state[label] = college;
                });

                console.log(fields, this.state);

                for (let i = 0; i <= 5; i++) {
                    const label = `school_${i + 1}`;

                    if (fields.indexOf(label) === -1) {
                        fields.push(label);
                        this.state[label] = "";
                    }
                }

                if (this.user && this.user.feedback_id) {
                    this.submitMultipleChoice(fields, false)
                }
            }

            if (page === 11) {
                DataService.trackFormEntry("gender", this.state.gender);

                if (this.user && this.user.feedback_id) {
                    DataService.updateFeedback({
                        client,
                        feedback_id: this.user.feedback_id,
                        gender: GENDER_OPTIONS_MAP[this.state.gender]
                    }).then((result) => {
                        console.log(result);
                    })
                }
            }

            if (page === 12) {
                DataService.trackFormEntry("phone_number", this.state.phone_number);

                if (this.user && this.user.feedback_id) {
                    DataService.updateFeedback({
                        client,
                        feedback_id: this.user.feedback_id,
                        phone_number: this.state.phone_number
                    }).then((result) => {
                        console.log(result);
                    })
                }
            }

            if (page === 13) {
                DataService.trackFormEntry("linkedin", this.state.linkedin);

                if (this.user && this.user.feedback_id) {
                    DataService.updateFeedback({
                        client,
                        feedback_id: this.user.feedback_id,
                        linkedin: this.state.linkedin
                    }).then((result) => {
                        console.log(result);
                    })
                }
            }
        }
    }

    submitBoolean(field) {
        let { client } = this.props;

        const value = this.state[field];

        if (this.user && this.user.feedback_id) {

            DataService.updateFeedback({
                client,
                feedback_id: this.user.feedback_id,
                [field]: this.convertToBoolean(value),
            }).then((result) => {
                console.log(result);
            })
        }
    }

    submitMultipleChoice(fields, convert) {
        let { client } = this.props;

        if (this.user && this.user.feedback_id) {
            let payload = {
                client,
                feedback_id: this.user.feedback_id,
            }

            fields.forEach((field) => {
                const value = this.state[field];
                payload[field] = convert ? this.convertToBoolean(value) : value;
            });

            DataService.updateFeedback(payload).then((result) => {
                console.log(result);
            })
        }
    }

    convertToBoolean(value) {
        return (!!value ? 1 : 0) + "";
    }

    renderFormPage(page, prompt, required, render) {
        return (<div>
            <div style={{display: "flex", width: "100%", overflow: "hidden"}}>
                <div style={{flex: "0 0 20px", fontSize: "17px"}}>{page}</div>
                <div style={{flex: "0 0 25px", paddingRight: "5px"}}>
                    <i style={{lineHeight: "25px"}} className="fa-solid fa-right-long"/>
                </div>
                <div style={{flex: 1}}>
                    <div style={{fontSize: "17px", marginBottom: "5px"}}>{prompt} {required && <span style={{color: "#971515"}}>*</span>}</div>
                    <div>
                        {render()}
                    </div>
                </div>
            </div>
        </div>)
    }

    renderYesNo(field,) {

        let value = this.state[field]

        return (<div>
            <div style={{overflow: "hidden", width: "100%"}}>
                <div style={{
                    marginTop: "10px",
                    background: value === 1 ? "#1F3D3B" : "#FFFFFF",
                    border: value === 1 ? "1px solid #1F3D3B"  : "1px solid #1F3D3B",
                    borderRadius: "10px",
                    padding: "13px 10px",
                    color: value === 1 ? "#FFFFFF" : "#000000",
                    fontSize: "15px",
                    fontWeight: 500,
                    cursor: "pointer",
                    overflow: "hidden",
                }}
                     onClick={() => {
                         this.setState({[field]: 1})
                     }}>
                    <div style={{display: "flex"}}>
                        <div style={{flex: 1}}>
                            Yes
                        </div>
                        <div style={{flex: "0 0 50px", textAlign: "right", position: "relative"}}>
                            {value === 1 && <i style={{top: "3.25px", right: 0, position: "absolute"}} className="fa-solid fa-check"/>}
                        </div>
                    </div>
                </div>
            </div>
            <div style={{overflow: "hidden", width: "100%"}}>
                <div style={{
                    marginTop: "10px",
                    background: value === 0 ? "#1F3D3B" : "#FFFFFF",
                    border: value === 0 ? "1px solid #1F3D3B"  : "1px solid #1F3D3B",
                    borderRadius: "10px",
                    padding: "13px 10px",
                    color: value === 0 ? "#FFFFFF" : "#000000",
                    fontSize: "15px",
                    fontWeight: 500,
                    cursor: "pointer",
                    overflow: "hidden",
                }}
                     onClick={() => {
                         this.setState({[field]: 0})
                     }}>
                    <div style={{display: "flex"}}>
                        <div style={{flex: 1}}>
                            No
                        </div>
                        <div style={{flex: "0 0 50px", textAlign: "right", position: "relative"}}>
                            {value === 0 && <i style={{top: "3.25px", right: 0, position: "absolute"}} className="fa-solid fa-check"/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }

    renderMultipleChoice(field, options) {

        let value = this.state[field]

        return (<div>
            {options.map((option) => {
                return (<div key={option.label} style={{overflow: "hidden", width: "100%"}}>
                    <div style={{
                        marginTop: "10px",
                        background: value === option.value ? "#1F3D3B" : "#FFFFFF",
                        border: value === option.value ? "1px solid #1F3D3B" : "1px solid #1F3D3B",
                        borderRadius: "10px",
                        padding: "13px 10px",
                        color: value === option.value ? "#FFFFFF" : "#000000",
                        fontSize: "15px",
                        fontWeight: 500,
                        cursor: "pointer",
                        overflow: "hidden",
                    }}
                         onClick={() => {
                             this.setState({[field]: option.value})
                         }}>
                        <div style={{display: "flex"}}>
                            <div style={{flex: 1}}>
                                {option.label}
                            </div>
                             <div style={{flex: "0 0 50px", textAlign: "right", position: "relative"}}>
                                 {value === option.value && <i style={{top: "3.25px", right: 0, position: "absolute"}} className="fa-solid fa-check"/>}
                            </div>
                        </div>

                    </div>
                </div>)
            })}
        </div>)
    }

    renderSearch(field, options, clickEvent) {

        let searchTerm = this.state[field] || "";
        const MAX = 30;

        let renderedOptions = []

        options.forEach((option) => {
            if (option.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                renderedOptions.push(option);
            }
        })

        renderedOptions = renderedOptions.length > MAX ? renderedOptions.slice(0, MAX) : renderedOptions;


        return (<div>

            <div style={{
                width: "100%",
                marginBottom: "0",
                marginTop: field === "city_search" ? "20px" : "20px",
                fontSize: "15px",
                padding: "13px 15px",
                background: "#F1F1F2",
                borderRadius: "10px",
                border: "1px solid #E5E7E8",
                overflow: "hidden",
            }}>
                <div style={{display: "flex"}}>
                    <div style={{flex: 1}}>
                        <input style={{
                            fontSize: "15px",
                            height: "100%",
                            width: "100%",
                            border: "none",
                            background: "none",
                            outline: "none"
                        }}
                               value={searchTerm}
                               placeholder={"Type or select an option"}
                               onChange={(e) => {
                                   this.setState({[field]: e.target.value})
                               }}
                        />
                    </div>
                    <div style={{flex: "0 0 30px", position: "relative"}} onClick={() => {
                        this.setState({
                            adding_college: false,
                            adding_city: false,
                        });
                    }}>
                        {field !== "city_search" &&  <i style={{top: "6.25px", right: 0, position: "absolute"}} className="fa-solid fa-xmark"/>}
                    </div>
                </div>
            </div>

            {renderedOptions.length ? renderedOptions.map((option) => {
                return (<div key={option}>
                    <div style={{
                        marginTop: "10px",
                        padding: "13px 10px",
                        background: "#FFFFFF",
                        border: "1px solid #1F3D3B",
                        borderRadius: "10px",
                        color: "#000000",
                        fontSize: "15px",
                        fontWeight: 500,
                        cursor: "pointer",
                        overflow: "hidden",
                    }}
                         onClick={() => {
                             this.setState({[field]: "", adding_college: false, adding_city: false,});

                             if (clickEvent) clickEvent(option);
                         }}>
                        <div style={{display: "flex"}}>
                            <div style={{flex: 1}}>
                                {option}
                            </div>
                        </div>

                    </div>
                </div>)
            }): <div>
                <div style={{
                    marginTop: "10px",
                    height: "50px",
                    lineHeight: "50px",
                    background: "#FFFFFF",
                    border: "1px solid #1F3D3B",
                    borderRadius: "10px",
                    padding: "0 15px",
                    color: "#000000",
                    fontSize: "15px",
                    fontWeight: 500,
                    cursor: "pointer"
                }} onClick={() => {
                    this.setState({[field]: ""});

                    if (clickEvent) clickEvent(searchTerm);
                }}>
                    {searchTerm}
                </div>
            </div>}
        </div>)
    }

    renderOkButton(validator) {
        return (<div>
            <div style={{
                marginTop: "15px",
                height: "50px",
                lineHeight: "50px",
                background:  "#1F3D3B",
                borderRadius: "10px",
                padding: "0 15px",
                width: "77px",
                color: "#FFFFFF",
                fontSize: "15px",
                fontWeight: 500,
                cursor: "pointer",
                display: validator() ? null : "none"
            }}
                 onClick={() => {
                     this.goNext();
                 }}
            >
                <div style={{display: "flex"}}>
                    <div style={{flex: 1}}>
                        OK
                    </div>
                    <div style={{flex: "0 0 12px", textAlign: "right",}}>
                        <i style={{lineHeight: "50px",}} className="fa-solid fa-check"></i>
                    </div>
                </div>

            </div>
        </div>)
    }

    renderInput(application_id, field, data, label, updateFunction, refetch, type) {
        let { client, match: { params } } = this.props;
        const user_id = params ? params.user_id : null;

        const update = (e) => {
            this.setState({
                [field]: e.target.value
            });

            let payload = {
                client,
                user_id,
                application_id
            };

            payload[field] = e.target.value;

            clearTimeout(this.timeouts[field]);

            this.timeouts[field] = setTimeout(() => {
                if (updateFunction) updateFunction(payload).then(() => {
                    if (refetch) refetch();
                })

            }, 400);
        }

        return (<div>
            <div style={{
                fontSize: "15px",
                marginBottom: "5px"
            }}>{label}</div>

            {type && type === "textarea" ?
                <textarea
                    style={{
                        width: "100%",
                        marginBottom: "30px",
                        marginTop: "10px",
                        height: "300px",
                        padding: "20px",

                        background: "#F5F4F4",
                        border: "1px solid #EBE3D6"
                    }}
                    onChange={(e) => { update(e) }}
                    value={this.state[field] === undefined ? data[field] : this.state[field]}
                />
                :
                <input
                    style={{
                        width: "100%",
                        height: "50px",
                        marginBottom: "30px",
                        lineHeight: "50px",
                        fontSize: "15px",
                        padding: "0 10px",
                        background: "#F5F4F4",
                        border: "1px solid #EBE3D6",
                        outline: "none"
                    }}
                    onChange={(e) => { update(e) }}
                    value={this.state[field] === undefined ? data[field] : this.state[field]}
                />}

        </div>)
    }


    render() {
        let { classes, client, match: { params } } = this.props;

        const login = window.location.pathname === "/sign-in";

        const renderRace = (field, label) => {

            const selected = this.state[field];

            return (<div style={{ overflow: "hidden",
                width: "100%"}}>
                <div style={{
                    marginTop: "10px",
                    background: selected ? "#1F3D3B" : "#FFFFFF",
                    border: selected ? "1px solid #1F3D3B" : "1px solid #1F3D3B",
                    borderRadius: "10px",
                    padding: "13px 15px",
                    color: selected ? "#FFFFFF" : "#000000",
                    fontSize: "15px",
                    fontWeight: 500,
                    cursor: "pointer",
                    width: "100%",
                }}
                     onClick={() => {
                         this.setState({[field]: !selected})

                         if (field === "is_not_respond") {
                             if (!selected) {
                                 this.setState({
                                     is_native: null,
                                     is_asian: null,
                                     is_black: null,
                                     is_hispanic: null,
                                     is_middle_eastern: null,
                                     is_hawaiian: null,
                                     is_white: null,
                                 })
                             }
                         } else {
                             if (!selected) {
                                 this.setState({
                                     is_not_respond: null,
                                 })
                             }
                         }
                     }}>
                    <div style={{display: "flex"}}>
                        <div style={{flex: 1,}}>
                            {label}
                        </div>
                        <div  style={{flex: "0 0 50px", textAlign: "right", position: "relative"}}>
                            {selected && <i style={{top: "3.25px", right: 0, position: "absolute"}} className="fa-solid fa-check"/>}
                        </div>
                    </div>
                </div>

            </div>)
        }

        const renderOption = (field, label) => {

            const selected = this.state[field];

            return (<div style={{ overflow: "hidden",
                width: "100%"}}>
                <div style={{
                    marginTop: "10px",
                    background: selected ? "#1F3D3B" : "#FFFFFF",
                    border: selected ? "1px solid #1F3D3B" : "1px solid #1F3D3B",
                    borderRadius: "10px",
                    padding: "13px 10px",
                    color: selected ? "#FFFFFF" : "#000000",
                    fontSize: "15px",
                    fontWeight: 500,
                    cursor: "pointer",
                    width: "100%",
                }}
                     onClick={() => {
                         this.setState({[field]: !selected})
                     }}>
                    <div style={{display: "flex"}}>
                        <div style={{flex: 1,}}>
                            {label}
                        </div>
                        <div  style={{flex: "0 0 50px", textAlign: "right", position: "relative"}}>
                            {selected && <i style={{top: "3.25px", right: 0, position: "absolute"}} className="fa-solid fa-check"/>}
                        </div>
                    </div>
                </div>

            </div>)
        }

        return (<div className={classes.container}>
            <div>
                    <div>
                        <div style={{display: "flex", height: "100%", overflow: "hidden"}}>
                            <div className={classes.pageContainer}>

                                <div>
                                    <div className={classes.boxContainer}>
                                        <div  style={{ fontSize: "24px", marginBottom: "10px", color: "#1F3D3B"}} className={classes.sectionHeading}>OSIRIS Feedback</div>

                                        <div>
                                            <div style={{display: this.state.page === 1 ? null : "none", padding:"56.25% 0 0 0", position:"relative"}}>
                                                <iframe
                                                    src="https://player.vimeo.com/video/703774120?h=31c22f8350&title=0&byline=0&portrait=0&speed=0&badge=0&autopause=0&player_id=0&app_id=58479/embed"
                                                    allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
                                                    frameBorder="0"
                                                    style={{position:"absolute",
                                                        top:0,
                                                        left:0,
                                                        width:"100%",
                                                        height:"100%"
                                                    }}/>
                                            </div>
                                        </div>

                                        <div style={{display: this.state.page === 1 ? null : "none", fontSize: "15px", marginTop: "30px", marginBottom: "30px"}}>
                                            Hi there 👋🏾 We are building a community platform for people of color to demystify career journeys. We are building an app where people of color can ask questions and get feedback from their peers, connect with senior leaders and cultural figures, and find jobs. We would love your support in filling out this form so that we can build the best product possible. 🙏🏾
                                        </div>

                                        <div>

                                            {this.state.page === 1 && <div>

                                                <div>
                                                    <div style={{display: "flex"}}>
                                                        <div style={{flex: 1, paddingRight: "10px"}}>
                                                            <div style={{fontSize: "15px", marginBottom: "10px", display: "none"}}>
                                                                First Name
                                                            </div>
                                                            <input className={classes.inputStyle} style={{
                                                                width: "100%",
                                                            }}
                                                                   value={this.state.first_name}
                                                                   placeholder={"First Name"}
                                                                   onChange={(e) => {
                                                                       this.setState({first_name: e.target.value})
                                                                   }}
                                                            />
                                                        </div>
                                                        <div style={{flex: 1}}>
                                                            <div style={{fontSize: "15px", marginBottom: "10px", display: "none"}}>
                                                                Last Name
                                                            </div>
                                                            <input className={classes.inputStyle}
                                                                   value={this.state.last_name}
                                                                   placeholder={"Last Name"}

                                                                   onChange={(e) => {
                                                                       this.setState({last_name: e.target.value})
                                                                   }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{marginTop: "15px"}}>
                                                        <div style={{fontSize: "15px", marginBottom: "10px", display: "none"}}>
                                                            Email Address
                                                        </div>
                                                        <input className={classes.inputStyle}
                                                               value={this.state.email_address}
                                                               placeholder={"Email Address"}

                                                               onChange={(e) => {
                                                                   this.setState({email_address: e.target.value})
                                                               }}
                                                        />
                                                    </div>



                                                </div>


                                            </div>}

                                            {this.state.page === 2 && <div style={{padding: "20px 0"}}>
                                                {this.renderFormPage(1, "What is your current employment status?", true,() => {
                                                    return (<div>
                                                        {this.renderMultipleChoice("stage_id", STAGE_OPTIONS)}
                                                        {this.renderOkButton(() => (!!this.state.stage_id), 3)}
                                                    </div>)
                                                })}
                                            </div>}

                                            {this.state.page === 3 && <div style={{padding: "20px 0"}}>
                                                {this.renderFormPage(2, "Which racial or ethnic group(s) do you identify with?", true, () => {
                                                    return (<div>
                                                        {renderRace("is_native", "American Indian or Alaska Native")}
                                                        {renderRace("is_asian", "Asian")}
                                                        {renderRace("is_black", "Black or African American")}
                                                        {renderRace("is_hispanic", "Hispanic or Latino")}
                                                        {renderRace("is_middle_eastern", "Middle Eastern or North African Native")}
                                                        {renderRace("is_hawaiian", "Hawaiian or Other Pacific Islander")}
                                                        {renderRace("is_white", "White/Caucasian")}
                                                        {renderRace("is_not_respond", "Prefer not to respond")}

                                                        {this.renderOkButton(this.validRace.bind(this), 4)}

                                                    </div>)
                                                })}
                                            </div>}

                                            {this.state.page === 4 && <div style={{padding: "20px 0"}}>
                                                {this.renderFormPage(3, "As a person of color, do you wish you had more support and resources as you pursue your career?", true,() => {
                                                    return (<div>
                                                        {this.renderYesNo("question_1")}
                                                        {this.renderOkButton(this.canGoNext.bind(this))}
                                                    </div>)
                                                })}
                                            </div>}


                                            {this.state.page === 5 && <div style={{padding: "20px 0"}}>
                                                {this.renderFormPage(4, "As a person of color, which of the following do you wish you had more access to?", false, () => {
                                                    return (<div>
                                                        {renderOption("wants_mentors", "Access to senior mentors")}
                                                        {renderOption("wants_peers", "Access to peers of color to share knowledge")}
                                                        {renderOption("wants_internships", "Access to internships")}
                                                        {renderOption("wants_jobs", "Access to job offers")}
                                                        {renderOption("wants_other", "Other")}

                                                        {this.state.wants_other && <div>
                                                            <div style={{marginTop: "15px", marginBottom: "10px"}}>Other (please specify) </div>
                                                            <textarea className={classes.textAreaStyle} value={this.state.other} onChange={(e) => {
                                                                this.setState({other: e.target.value})
                                                            }}/>
                                                        </div>}

                                                        {this.renderOkButton(this.canGoNext.bind(this))}
                                                    </div>)
                                                })}
                                            </div>}

                                            {this.state.page === 6 && <div style={{padding: "20px 0"}}>
                                                {this.renderFormPage(5, "Would you join a platform that connected you with other people of color and provided you access to job opportunities?", true, () => {
                                                    return (<div>
                                                        {this.renderYesNo("question_2")}
                                                        {this.renderOkButton(this.canGoNext.bind(this))}
                                                    </div>)
                                                })}
                                            </div>}


                                            {this.state.page === 7 && <div style={{padding: "20px 0"}}>
                                                {this.renderFormPage(6, "Have you heard of or participated in any of the following?", false, () => {
                                                    return (<div>
                                                        {renderOption("heard_seo", "SEO")}
                                                        {renderOption("heard_mlt", "MLT")}
                                                        {renderOption("heard_jopwell", "Jopwell")}
                                                        {renderOption("heard_valence", "Valence")}
                                                        {renderOption("heard_yc", "Y-Combinator")}
                                                        {renderOption("heard_elpha", "Elpha")}
                                                        {renderOption("heard_lh", "Launch House")}

                                                        {this.renderOkButton(this.canGoNext.bind(this))}
                                                    </div>)
                                                })}
                                            </div>}

                                            {this.state.page === 8 && <div style={{padding: "20px 0"}}>
                                                {this.renderFormPage(7, "Would you be willing to join a Slack, WhatsApp, or Discord group to provide feedback on OSIRIS?", true, () => {
                                                    return (<div>

                                                        <div style={{margin: "10px 0"}}>We will periodically send screenshots and product demos to the group for feedback. There is no real commitment</div>
                                                        {this.renderYesNo("question_3")}
                                                        {this.renderOkButton(this.canGoNext.bind(this))}
                                                    </div>)
                                                })}
                                            </div>}

                                            {this.state.page === 9 && <div style={{padding: "20px 0"}}>
                                                {this.renderFormPage(8, "Where do you live?", true,() => {
                                                    return (<div>
                                                        {this.state.cities && this.state.cities.length ? this.state.cities.map((city) => {
                                                            return (<div style={{width: "100%", overflow: "hidden"}}>
                                                                <div style={{
                                                                    marginTop: "10px",
                                                                    height: "50px",
                                                                    lineHeight: "50px",
                                                                    background: "white",
                                                                    borderRadius: "10px",
                                                                    padding: "0 15px",
                                                                    color:"black",
                                                                    fontSize: "15px",
                                                                    border: "1px solid #1F3D3B",
                                                                    fontWeight: 500,
                                                                    cursor: "pointer"
                                                                }}
                                                                     onClick={() => {
                                                                         let c = this.state.cities;
                                                                         c = _.without(c, city);
                                                                         this.setState({cities: c});
                                                                     }}>
                                                                    <div style={{display: "flex"}}>
                                                                        <div style={{flex: 1}}>
                                                                            {city}
                                                                        </div>
                                                                        <div  style={{flex: "0 0 50px", textAlign: "right",}}>
                                                                            <i style={{lineHeight: "50px",}} className="fa-solid fa-xmark"/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>)
                                                        }): null}

                                                        {this.renderOkButton(this.canGoNext.bind(this))}

                                                        {!this.state.cities || this.state.cities.length < 1 ? this.renderSearch("city_search", this.cities, (city) => {
                                                            let c = this.state.cities;
                                                            c.push(city);
                                                            c = _.uniq(c);
                                                            this.setState({cities: c});
                                                        }) : null}
                                                    </div>)
                                                })}
                                            </div>}

                                            {this.state.page === 10 && <div style={{padding: "20px 0"}}>
                                                {this.renderFormPage(9, "Where did you go to college?", false,() => {
                                                    return (<div>

                                                        <div style={{margin: "10px 0"}}>Feel free to select as many institutions as you'd like. If you are currently in college, choose your current institution.</div>

                                                        {this.state.colleges && this.state.colleges.length ? this.state.colleges.map((college) => {
                                                            return (<div style={{width: "100%", overflow: "hidden"}}>
                                                                <div style={{
                                                                    marginTop: "10px",
                                                                    height: "50px",
                                                                    lineHeight: "50px",
                                                                    background: "white",
                                                                    borderRadius: "10px",
                                                                    padding: "0 15px",
                                                                    color:"black",
                                                                    fontSize: "15px",
                                                                    border: "1px solid #1F3D3B",
                                                                    fontWeight: 500,
                                                                    cursor: "pointer"
                                                                }}
                                                                     onClick={() => {
                                                                         let c = this.state.colleges;
                                                                         c = _.without(c, college);
                                                                         this.setState({colleges: c});
                                                                     }}>
                                                                    <div style={{display: "flex"}}>
                                                                        <div style={{flex: 1}}>
                                                                            {college}
                                                                        </div>
                                                                        <div  style={{flex: "0 0 50px", textAlign: "right",}}>
                                                                            <i style={{lineHeight: "50px",}} className="fa-solid fa-xmark"/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>)
                                                        }): null}

                                                        {!this.state.adding_college && <div style={{width: "100%", overflow: "hidden"}}>
                                                            <div style={{
                                                                marginTop: "10px",
                                                                height: "50px",
                                                                lineHeight: "50px",
                                                                background: "none",
                                                                borderRadius: "10px",
                                                                padding: "0 15px",
                                                                color:"black",
                                                                fontSize: "15px",
                                                                border: "1px solid #1F3D3B",
                                                                fontWeight: 500,
                                                                cursor: "pointer"
                                                            }}
                                                                 onClick={() => {
                                                                     const { adding_college } = this.state;

                                                                     this.setState({
                                                                         adding_college: !adding_college
                                                                     });
                                                                 }}>
                                                                <div style={{display: "flex"}}>
                                                                    <div style={{flex: 1}}>
                                                                        Add School
                                                                    </div>
                                                                    <div  style={{flex: "0 0 50px", textAlign: "right",}}>
                                                                        <i style={{lineHeight: "50px",}} className="fa-solid fa-plus"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>}

                                                        {this.state.adding_college && this.renderSearch("college_search", this.colleges, (college) => {
                                                            let c = this.state.colleges;
                                                            c.push(college);
                                                            c = _.uniq(c);
                                                            this.setState({colleges: c});
                                                        })}

                                                        {this.renderOkButton(this.canGoNext.bind(this))}
                                                    </div>)
                                                })}
                                            </div>}

                                            {this.state.page === 11 && <div style={{padding: "20px 0"}}>
                                                {this.renderFormPage(10, "What is your gender identity? ", true,() => {
                                                    return (<div>
                                                        {this.renderMultipleChoice("gender", GENDER_OPTIONS)}
                                                        {this.renderOkButton(this.canGoNext.bind(this))}
                                                    </div>)
                                                })}
                                            </div>}

                                            {this.state.page === 12 && <div style={{padding: "20px 0"}}>
                                                {this.renderFormPage(11, "What is your phone number?", false,() => {
                                                    return (<div>
                                                        <input
                                                            placeholder={"Phone number"}
                                                            className={classes.inputStyle}
                                                            style={{
                                                                marginTop: "10px",
                                                                width: "100%",
                                                            }}
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    phone_number: e.target.value
                                                                })
                                                            }}/>
                                                        {this.renderOkButton(this.canGoNext.bind(this))}
                                                    </div>)
                                                })}
                                            </div>}

                                            {this.state.page === 13 && <div style={{padding: "20px 0"}}>
                                                {this.renderFormPage(12, "What is your LinkedIn?", false,() => {
                                                    return (<div>

                                                        <div style={{margin: "10px 0"}}>Please provide a URL link to your LinkedIn profile <br/>(e.g. www.linkedin.com/in/malcolm)</div>
                                                        <input
                                                            placeholder={"LinkedIn"}
                                                            className={classes.inputStyle}
                                                            style={{
                                                                marginTop: "10px",
                                                                width: "100%",
                                                            }}
                                                             onChange={(e) => {
                                                                 this.setState({
                                                                     linkedin: e.target.value
                                                                 })
                                                             }}/>
                                                        {this.renderOkButton(this.canGoNext.bind(this))}
                                                    </div>)
                                                })}
                                            </div>}

                                            {this.state.page === 14 && <div style={{padding: "20px 0"}}>
                                                <div>
                                                    <div style={{fontSize: "17px"}}>Thank you for your feedback! We've received your response. If you are interested in getting further involved, feel free to email <a  href={"mailto:miles@osiris.works"} style={{color: "black", textDecoration: "underline"}}>miles@osiris.works</a>. You can also follow our Instagram <a href={"https://www.instagram.com/osiris.works"} style={{color: "black", textDecoration: "underline"}}>@osiris.works</a></div>
                                                </div>
                                            </div>}
                                        </div>

                                        <div>
                                            <Query query={FeedbackQuery} fetchPolicy={"network-only"} variables={{email_address: this.state.email_address}}>
                                                {({ loading, error, data, refetch }) => {


                                                    const renderFunc = (user) => {
                                                        return (<div style={{display: this.state.page !== 1 ? "none" : null}}>
                                                            <div onClick={() => {
                                                                if (!this.state.email_address || !this.state.first_name || !this.state.last_name || !this.validEmail()) {
                                                                    return;
                                                                }

                                                                DataService.createFeedback({client, email_address: this.state.email_address, first_name: this.state.first_name, last_name: this.state.last_name}).then((feedback_id) => {
                                                                    localStorage.feedback_id = user.feedback_id;
                                                                    DataService.trackEvent({client, user_id: feedback_id.toString(), type: "10", custom_1: this.state.email_address, custom_2: this.state.first_name, custom_3: this.state.last_name, custom_4: "survery-1"});
                                                                    DataService.trackFormEntry("email", this.state.email_address);
                                                                    this.setState({ page: 2, submitted: true });
                                                                    if (refetch) refetch();
                                                                });
                                                            }}>
                                                                <div style={{
                                                                    opacity: (!this.state.email_address || !this.state.first_name || !this.state.last_name || !this.validEmail()) ? 0.4 : 1
                                                                }} className={classes.submitButtom}>Submit</div>
                                                            </div>
                                                        </div>)
                                                    }

                                                    if (loading) return renderFunc({});
                                                    if (error) return <p>Error Loading User</p>;

                                                    const user = data.feedback_users && data.feedback_users.length ? data.feedback_users[0] : {};

                                                    this.user = user;
                                                    console.log("This is the new user:", user);
                                                    console.log("This is the user email:", this.state.email_address);

                                                    return renderFunc(user)
                                                }}
                                            </Query>

                                        </div>
                                    </div>



                                </div>


                            </div>
                        </div>
                    </div>
            </div>

            <div style={{display: this.state.submitted !== true ? "none" : null, position: "absolute", top: "0", width: "100%", height: "5px", background: "#C8CBC9"}}>
                <div style={{
                    width: `${this.getProgressBar()}%`,
                    height: "100%",
                    background: "#1F3D3B"
                }}/>
            </div>

            <div style={{display: (this.state.submitted !== true || this.state.page === 14) ? "none" : null, position: "absolute", bottom: "0", paddingLeft: "20px", paddingTop: "25px", width: "100%", height: "100px", background: "linear-gradient(to top, rgba(242,239,236,0.8), rgba(242,239,236,0.0))"}}>
                <div style={{display: "flex", width: "100px", textAlign: "center", lineHeight: "50px", height: "50px", color: "white"}}>
                    <div style={{flex: 1, background: "#1F3D3B",  borderRadius: "15px 0 0 15px", borderRight: "1px solid white", opacity: this.canGoBack() ? 1 : 0.4}} onClick={() => {
                        this.goBack();
                    }}>
                        <i style={{lineHeight: "50px", fontSize: "20px"}} className="fa-solid fa-angle-left"></i>
                    </div>
                    <div style={{flex: 1, background: "#1F3D3B",  borderRadius: "0 15px 15px 0", opacity: this.canGoNext() ? 1 : 0.4}} onClick={() => {
                        this.goNext();
                    }}>
                        <i style={{lineHeight: "50px", fontSize: "20px"}} className="fa-solid fa-angle-right"></i>
                    </div>
                </div>
            </div>

        </div>)
    }

}

const FeedbackQuery = gql`
    query FeedbackQuery($email_address: String) {
        feedback_users(input: {email_address: $email_address}) {
            feedback_id
            first_name
            last_name
            email_address
            
            linkedin
            instagram
            phone_number
            
            gender
            sexual_orientation
        }
    }
`;

export default withApollo(withRouter(injectSheet(Styles)(Feedback)));

