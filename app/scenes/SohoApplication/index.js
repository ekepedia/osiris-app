import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import {Mutation, Query} from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        }
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
        fontSize: "10px",
        borderRadius: "15px",
        marginRight: "5px",
        marginBottom: "5px",
    },
    osirisPillHollow: {
        border: "2px solid #1F3D3B",
        display: "inline-block",
        color: "#1F3D3B",
        padding: "3px 9px",
        fontWeight: 600,
        fontSize: "10px",
        borderRadius: "15px",
        marginRight: "5px",
        marginBottom: "5px",
    }
};

class SohoApplication extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            full_name: "",
            email: "",
            race: "",
            state: 1,
            type: null,
        };

        this.timeouts = {};

        this.changeState = this.changeState.bind(this);
    }

    changeState(state) {
        this.setState({state})
    }

    componentDidMount() {
        let { classes, client, match: { params } } = this.props;
        const user_id = params ? params.user_id : null;

        let openTime = new Date().getTime().toString();

        DataService.openPageSession({client, user_id, page: window.location.pathname}).then((tracking_id) =>{
            console.log("Opened page session", tracking_id)

            this.pageSessionPing = setInterval(() => {
                const custom_1 = (new Date().getTime() - openTime).toString();

                DataService.updatePageSession({client, tracking_id, custom_1}).then(() => {
                })
            }, 1000);
        });
    }

    componentWillUnmount() {
        clearInterval(this.pageSessionPing)
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
                        border: "1px solid #EBE3D6"
                    }}
                    onChange={(e) => { update(e) }}
                    value={this.state[field] === undefined ? data[field] : this.state[field]}
                />}

        </div>)
    }


    render() {
        let { classes, match: { params } } = this.props;
        const user_id = params ? params.user_id : null;

        const WHITE = "#F2EFEC";

        return (<div className={classes.container}>

            <Query query={SohoApplcationQuery} fetchPolicy={"network-only"} variables={{user_id}}>
                {({ loading, error, data, refetch }) => {

                    if (loading) return <p></p>;
                    if (error) return <p>Error Loading Application</p>;


                    const user = data.demo_users && data.demo_users.length ? data.demo_users[0] : {};
                    const soho_application = data.demo_soho_applications && data.demo_soho_applications.length ? data.demo_soho_applications[0] : {};

                    console.log(user, soho_application);

                    const initial = DataService.getInitial(user);

                    let tags_1 = [];
                    let tags_2 = [];
                    let tags_3 = [];

                    if (soho_application.elevator_pitch_tags_1 && soho_application.elevator_pitch_tags_1.length) {
                        tags_1 = soho_application.elevator_pitch_tags_1.split(" ");
                    }

                    if (soho_application.essay_1_tags_1 && soho_application.essay_1_tags_1.length) {
                        tags_2 = soho_application.essay_1_tags_1.split(" ");
                    }

                    if (soho_application.essay_2_tags_1 && soho_application.essay_2_tags_1.length) {
                        tags_3  = soho_application.essay_2_tags_1.split(" ");
                    }

                    const {
                        progress_percent,
                        user_progress_percent,
                        company_progress_percent,
                        essay_progress_percent,
                        status
                    } = DataService.getCompletionStatus({user, soho_application});

                    return (<div>
                        <div style={{display: "flex", height: "100%", overflow: "hidden"}}>
                            <div style={{flex: 4, background:"#1F3D3B", height: "100%", padding: "40px 15px"}}>
                                <div style={{height: "100%", position: "relative", color: WHITE}}>
                                    <div style={{display: "flex", marginBottom: "80px", padding: "0 15px"}}>
                                        <div style={{flex: "0 0 50px", paddingRight: "10px"}}>
                                            <div style={{width: "50px", height: "50px", background: "white", borderRadius: "11px", textAlign: "center", padding: "5px"}}>
                                                <div style={{width: "40px", height: "40px", background: "#B8965E", borderRadius: "100%", textAlign: "center", padding: "7px"}}>
                                                    <div style={{width: "26px", height: "26px", background: "#1F3D3B", borderRadius: "100%", textAlign: "center",}}>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{flex: 1}}>
                                            <div style={{fontSize: "17px", marginTop: "13px"}}>OSIRIS</div>
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{display: "flex", padding: "15px 17px", background: "#627775", borderRadius: "7px", marginBottom: "10px", cursor: "pointer"}}>
                                            <div style={{flex: "0 0 40px", textAlign: "center"}}>
                                                <div style={{paddingTop: "4px", fontSize: "13px"}}>
                                                    <i className="fa-solid fa-file"></i>
                                                </div>
                                            </div>
                                            <div style={{flex: 1, fontSize: "15px"}}>
                                                <div>Soho House Application</div>
                                            </div>
                                        </div>
                                        <div style={{display: "none", padding: "15px 17px", background: "", borderRadius: "7px", marginBottom: "15px", cursor: "pointer"}}>
                                            <div style={{flex: "0 0 40px", textAlign: "center"}}>
                                                O
                                            </div>
                                            <div style={{flex: 1, fontSize: "15px"}}>
                                                <div>God View</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{display: "flex", padding: "0 15px", position: "absolute", bottom: "0"}}>
                                        <div style={{flex: "0 0 50px", paddingRight: "10px"}}>
                                            <div style={{width: "50px", height: "50px", lineHeight: "50px", fontSize: "20px", background: "#B8965E", color: WHITE, borderRadius: "11px", textAlign: "center"}}>
                                                {initial}
                                            </div>
                                        </div>
                                        <div style={{flex: 1}}>
                                            <div style={{fontSize: "17px", marginTop: "5px", textTransform: "capitalize"}}>{user.first_name} {user.last_name}</div>
                                            <div style={{fontSize: "12px", color: "#B8965E", textTransform: "lowercase"}}>{user.email_address}</div>
                                        </div>
                                    </div>


                                </div>
                            </div>


                            <div style={{flex: 10, padding: "40px 40px", overflow: "scroll", background: WHITE, height: "100%"}}>


                                {this.state.state === 1 && <div>
                                    <div>
                                        <div className={classes.sectionHeading}>Personal Information</div>

                                        <div style={{display: "flex"}}>
                                            <div style={{flex: 1, paddingRight: "20px"}}>
                                                {this.renderInput(soho_application.application_id, "first_name", user, "First Name", DataService.updateUser, refetch)}
                                            </div>
                                            <div style={{flex: 1}}>
                                                {this.renderInput(soho_application.application_id, "last_name", user, "Last Name", DataService.updateUser, refetch)}
                                            </div>
                                        </div>
                                        <div style={{display: "flex"}}>
                                            <div style={{flex: 1, paddingRight: "20px"}}>
                                                {this.renderInput(soho_application.application_id, "email_address", user, "Email Address", DataService.updateUser, refetch)}
                                            </div>
                                            <div style={{flex: 1}}>
                                                {this.renderInput(soho_application.application_id, "phone_number", user, "Phone Number", DataService.updateUser, refetch)}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className={classes.sectionHeading}>Socials</div>

                                        <div style={{display: "flex"}}>
                                            <div style={{flex: 1, paddingRight: "20px"}}>
                                                {this.renderInput(soho_application.application_id, "instagram", user, "Instagram", DataService.updateUser, refetch)}
                                            </div>
                                            <div style={{flex: 1}}>
                                                {this.renderInput(soho_application.application_id, "linkedin", user, "LinkedIn", DataService.updateUser, refetch)}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className={classes.sectionHeading}>Demographic Information</div>

                                        <div style={{display: "flex"}}>
                                            <div style={{flex: 1, paddingRight: "20px"}}>
                                                {this.renderInput(soho_application.application_id, "gender", user, "Gender", DataService.updateUser, refetch)}
                                            </div>
                                            <div style={{flex: 1}}>
                                                {this.renderInput(soho_application.application_id, "sexual_orientation", user, "Sexual Orientation", DataService.updateUser, refetch)}
                                            </div>
                                        </div>
                                    </div>

                                </div>}


                                {this.state.state === 2 && <div>
                                    <div>Co founders Details</div>
                                </div>}

                                {this.state.state === 3 && <div>
                                    <div>
                                        <div className={classes.sectionHeading}>Startup Background</div>

                                        <div style={{display: "flex"}}>
                                            <div style={{flex: 1, paddingRight: "20px"}}>
                                                {this.renderInput(
                                                    soho_application.application_id,
                                                    "startup_name",
                                                    soho_application,
                                                    "Startup Name",
                                                    DataService.updateApplication,
                                                    refetch
                                                )}
                                            </div>
                                            <div style={{flex: 1}}>
                                                {this.renderInput(
                                                    soho_application.application_id,
                                                    "startup_location",
                                                    soho_application,
                                                    "Startup Location",
                                                    DataService.updateApplication,
                                                    refetch
                                                )}
                                            </div>
                                        </div>

                                        <div style={{display: "flex"}}>
                                            <div style={{flex: 1, paddingRight: "20px"}}>
                                                {this.renderInput(
                                                    soho_application.application_id,
                                                    "startup_website",
                                                    soho_application,
                                                    "Startup Website",
                                                    DataService.updateApplication,
                                                    refetch
                                                )}
                                            </div>
                                            <div style={{flex: 1}}>
                                                {this.renderInput(
                                                    soho_application.application_id,
                                                    "startup_instagram",
                                                    soho_application,
                                                    "Startup Instagram",
                                                    DataService.updateApplication,
                                                    refetch
                                                )}
                                            </div>
                                        </div>

                                        <div style={{display: "flex"}}>
                                            <div style={{flex: 1, paddingRight: "20px"}}>
                                                {this.renderInput(
                                                    soho_application.application_id,
                                                    "startup_funding",
                                                    soho_application,
                                                    "Startup Funding",
                                                    DataService.updateApplication,
                                                    refetch
                                                )}
                                            </div>
                                            <div style={{flex: 1}}>
                                                {this.renderInput(
                                                    soho_application.application_id,
                                                    "startup_employees",
                                                    soho_application,
                                                    "Startup Employees",
                                                    DataService.updateApplication,
                                                    refetch
                                                )}
                                            </div>
                                        </div>

                                        <div style={{display: "flex"}}>
                                            <div style={{flex: 1, paddingRight: "20px"}}>
                                                {this.renderInput(
                                                    soho_application.application_id,
                                                    "startup_focus",
                                                    soho_application,
                                                    "Startup Focus",
                                                    DataService.updateApplication,
                                                    refetch
                                                )}
                                            </div>
                                            <div style={{flex: 1}}>

                                            </div>
                                        </div>

                                    </div>

                                    <div>
                                        <div className={classes.sectionHeading}>Startup Pitch</div>
                                        <div>
                                            <div style={{marginBottom: "0px"}}>
                                                {this.renderInput(
                                                    soho_application.application_id,
                                                    "deck_url",
                                                    soho_application,
                                                    "Link to Deck",
                                                    DataService.updateApplication,
                                                    refetch
                                                )}
                                            </div>
                                            <div>
                                                {this.renderInput(
                                                    soho_application.application_id,
                                                    "elevator_pitch",
                                                    soho_application,
                                                    "Elevator Pitch",
                                                    DataService.updateApplication,
                                                    refetch,
                                                    "textarea"
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>}

                                {this.state.state === 4 && <div>
                                    <div className={classes.sectionHeading}>Essays</div>

                                    <div>
                                        <div>
                                            <div style={{marginBottom: "0"}}>
                                                {this.renderInput(
                                                    soho_application.application_id,
                                                    "essay_1",
                                                    soho_application,
                                                    "How will the $10K grant and Soho Works space accelerate your business development?",
                                                    DataService.updateApplication,
                                                    refetch,
                                                    "textarea",
                                                )}
                                            </div>
                                            <div>
                                                {this.renderInput(
                                                    soho_application.application_id,
                                                    "essay_2",
                                                    soho_application,
                                                    "What is the biggest obstacle you and your team have had to overcome?",
                                                    DataService.updateApplication,
                                                    refetch,
                                                    "textarea",
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>}

                                {this.state.state === 5 && <div style={{paddingBottom: "60px"}}>
                                    <div className={classes.sectionHeading}>Review & Submit</div>

                                    <div>
                                        <div style={{marginTop: "40px"}} className={classes.sectionHeading}>
                                            Startup Background
                                        </div>

                                        <div>
                                            <div style={{display: "flex"}}>
                                                <div style={{flex: "0 0 50px", paddingRight: "40px"}}>
                                                    <div style={{width: "50px", height: "50px", lineHeight: "50px", fontSize: "20px", background: "#1F3D3B", color: WHITE, borderRadius: "11px", textAlign: "center", textTransform: "uppercase"}}>
                                                        {soho_application.startup_name ? soho_application.startup_name[0] : "O"}
                                                    </div>

                                                    <div style={{textAlign: "center", marginTop: "20px", fontWeight: "600", color: "#1F3D3B"}}>
                                                        <div style={{margin: "10px 0"}}>
                                                            <i className="fa-solid fa-people-group"></i> {soho_application.startup_employees}
                                                        </div>
                                                        <div style={{margin: "10px 0"}}>
                                                            <i className="fa-solid fa-dollar-sign"></i>{soho_application.startup_funding}
                                                        </div>
                                                        <div style={{margin: "10px 0", fontSize: "20px"}}>
                                                            <a target={"_blank"} style={{color: "#1F3D3B", textDecoration: "none"}} href={`https://instagram.com/${soho_application.startup_instagram}`}>
                                                                <i className="fa-brands fa-instagram"></i>
                                                            </a>
                                                        </div>
                                                        <div style={{margin: "10px 0", fontSize: "20px"}}>
                                                            <a target={"_blank"} style={{color: "#1F3D3B", textDecoration: "none"}} href={soho_application.startup_website}>
                                                                <i className="fa-solid fa-paperclip"></i>
                                                            </a>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div style={{flex: 1}}>
                                                    <div>
                                                        <div className={classes.heading} style={{marginTop: "0"}}>{soho_application.startup_name}</div>
                                                    </div>
                                                    <div style={{fontWeight: "600"}}>Elevator Pitch</div>
                                                    <div style={{display: "flex"}}>
                                                        <div style={{flex: 1}}>
                                                            {soho_application.elevator_pitch}
                                                        </div>
                                                        <div style={{flex: "0 0 140px"}}>
                                                            <a style={{color: "#1F3D3B", textDecoration: "none", textAlign:"center"}} href={soho_application.deck_url} target={"_blank"}>
                                                                <div style={{paddingTop: "3px", fontSize: "30px", marginBottom: "10px"}}>
                                                                    <i className="fa-solid fa-file-arrow-down"></i>
                                                                </div>
                                                                <div style={{fontWeight: "600"}}>Pitch Deck</div>
                                                            </a>

                                                        </div>
                                                    </div>
                                                    <div style={{marginTop: "10px"}}>
                                                        <div className={classes.osirisPill}>{soho_application.startup_focus}</div>
                                                        <div className={classes.osirisPill}>{soho_application.startup_location}</div>
                                                        {
                                                            tags_1.map((t) => {
                                                                return (
                                                                    <div key={t} className={classes.osirisPillHollow}>{t}</div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div>
                                        <div style={{marginTop: "40px"}}  className={classes.sectionHeading}>
                                            Founder
                                        </div>

                                        <div>
                                            <div style={{display: "flex"}}>
                                                <div style={{flex: "0 0 50px", paddingRight: "0"}}>
                                                    <div style={{width: "50px", height: "50px", lineHeight: "50px", fontSize: "20px", background: "#B8965E", color: WHITE, borderRadius: "11px", textAlign: "center", textTransform: "uppercase"}}>
                                                        {initial}
                                                    </div>


                                                </div>
                                                <div style={{flex: "0 0 40px",}}>
                                                    <div style={{textAlign: "center", marginTop: "0", fontWeight: "600", color: "#1F3D3B"}}>
                                                        <div style={{marginTop: "0", fontSize: "20px"}}>
                                                            <a target={"_blank"} style={{color: "#1F3D3B", textDecoration: "none"}} href={`https://instagram.com/${user.instagram}`}>
                                                                <i className="fa-brands fa-instagram"></i>
                                                            </a>
                                                        </div>
                                                        <div style={{marginTop: "5px", fontSize: "20px"}}>
                                                            <a target={"_blank"} style={{color: "#1F3D3B", textDecoration: "none"}} href={`https://linkedin.com/${user.linkedin}`}>
                                                                <i className="fa-brands fa-linkedin"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{flex: 1}}>
                                                    <div>
                                                        <div className={classes.heading} style={{marginTop: "0", marginBottom: "0", fontSize: "20px"}}>{user.first_name} {user.last_name}</div>
                                                        <div>{user.email_address} / {user.phone_number}</div>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{marginTop: "60px"}} className={classes.sectionHeading}>
                                            Essays
                                        </div>

                                        <div>
                                            <div style={{fontWeight: 600, marginBottom: "10px"}}>How will the $10K grant and Soho Works space accelerate your business development?</div>
                                            <div>{soho_application.essay_1}</div>
                                            <div style={{marginTop: "10px"}}>
                                                {
                                                    tags_2.map((t) => {
                                                        return (
                                                            <div key={t} className={classes.osirisPillHollow}>{t}</div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{fontWeight: 600, marginTop: "20px", marginBottom: "10px"}}>What is the biggest obstacle you and your team have had to overcome?</div>
                                            <div>{soho_application.essay_2}</div>
                                            <div style={{marginTop: "10px"}}>
                                                {
                                                    tags_3.map((t) => {
                                                        return (
                                                            <div key={t} className={classes.osirisPillHollow}>{t}</div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>

                                </div>}

                            </div>


                            <div style={{flex: 5, padding: "40px 40px", background: "#F1EEE9", height: "100%", borderLeft: "1px solid #EBE3D6"}}>

                                <div style={{marginBottom: "40px"}}>
                                    <div style={{border: "2px solid #1F3D3B", textAlign: "center", borderRadius: "7px", background: "#E9E7E2", padding: "20px"}}>
                                        <div style={{fontSize: "30px"}}>{Math.round(progress_percent * 100)}% </div>
                                        <div style={{fontSize:"13px"}}>Complete</div>
                                    </div>

                                </div>

                                <div style={{marginBottom: "40px"}}>

                                    <div style={{marginBottom: "10px"}}>Sections</div>

                                    <div>
                                        <div onClick={() => (this.changeState(1))} style={{display: "flex", padding: "10px 5px", background: this.state.state === 1 ? "#F9F8F6" : "", borderRadius: "7px", marginBottom: "10px", cursor: "pointer"}}>
                                            <div style={{flex: "0 0 30px", textAlign: "center"}}>
                                                <div style={{paddingTop: "3px", fontSize: "16px"}}>
                                                    <i className="fa-solid fa-person"></i>
                                                </div>
                                            </div>
                                            <div style={{flex: 1, fontSize: "15px"}}>
                                                <div>Personal Information</div>
                                            </div>
                                            <div style={{flex: "0 0 25px", textAlign: "right"}}>
                                                {Math.round(user_progress_percent * 100)}%
                                            </div>
                                        </div>
                                        <div onClick={() => (this.changeState(2))} style={{display: "none", padding: "10px 5px", background: this.state.state === 2 ? "#F9F8F6" : "", borderRadius: "7px", marginBottom: "15px", cursor: "pointer"}}>
                                            <div style={{flex: "0 0 30px", textAlign: "center"}}>
                                                <div style={{paddingTop: "4px", fontSize: "13px"}}>
                                                    <i className="fa-solid fa-building"></i>
                                                </div>
                                            </div>
                                            <div style={{flex: 1, fontSize: "15px"}}>
                                                <div>Co-founders</div>
                                            </div>
                                            <div style={{flex: "0 0 25px", textAlign: "right"}}>
                                                done
                                            </div>
                                        </div>
                                        <div onClick={() => (this.changeState(3))} style={{display: "flex", padding: "10px 5px", background: this.state.state === 3 ? "#F9F8F6" : "", borderRadius: "7px", marginBottom: "15px", cursor: "pointer"}}>
                                            <div style={{flex: "0 0 30px", textAlign: "center"}}>
                                                <div style={{paddingTop: "4px", fontSize: "13px"}}>
                                                    <i className="fa-solid fa-building"></i>
                                                </div>
                                            </div>
                                            <div style={{flex: 1, fontSize: "15px"}}>
                                                <div>Startup Background</div>
                                            </div>
                                            <div style={{flex: "0 0 25px", textAlign: "right"}}>
                                                {Math.round(company_progress_percent * 100)}%
                                            </div>
                                        </div>
                                        <div onClick={() => (this.changeState(4))} style={{display: "flex", padding: "10px 5px", background: this.state.state === 4 ? "#F9F8F6" : "", borderRadius: "7px", marginBottom: "15px", cursor: "pointer"}}>
                                            <div style={{flex: "0 0 30px", textAlign: "center"}}>
                                                <div style={{paddingTop: "4px", fontSize: "13px"}}>
                                                    <i className="fa-solid fa-file-word"></i>
                                                </div>
                                            </div>
                                            <div style={{flex: 1, fontSize: "15px"}}>
                                                <div>Essays</div>
                                            </div>
                                            <div style={{flex: "0 0 25px", textAlign: "right"}}>
                                                {Math.round(essay_progress_percent * 100)}%
                                            </div>
                                        </div>
                                        <div onClick={() => (this.changeState(5))} style={{display: "flex", padding: "10px 5px", background: this.state.state === 5 ? "#F9F8F6" : "", borderRadius: "7px", marginBottom: "15px", cursor: "pointer"}}>
                                            <div style={{flex: "0 0 25px", textAlign: "center"}}>

                                                <div style={{paddingTop: "4px", fontSize: "13px"}}>
                                                    <i className="fa-solid fa-magnifying-glass"></i>
                                                </div>
                                            </div>
                                            <div style={{flex: 1, fontSize: "15px"}}>
                                                <div>Review & Submit</div>
                                            </div>
                                            <div style={{flex: "0 0 25px", textAlign: "right"}}>

                                            </div>
                                        </div>
                                    </div>


                                </div>

                                <div style={{marginBottom: "60px"}}>
                                    <div style={{marginBottom: "10px"}}>
                                        Founder
                                    </div>
                                    <div style={{border: "2px solid #1F3D3B", borderRadius: "7px", background: "#E9E7E2", padding: "20px"}}>
                                        <div>
                                            <div style={{display: "flex"}}>
                                                <div style={{flex: "0 0 50px", paddingRight: "10px"}}>
                                                    <div style={{width: "50px", height: "50px", lineHeight: "50px", fontSize: "20px", background: "#B8965E", color: WHITE, borderRadius: "11px", textAlign: "center"}}>
                                                        {initial}
                                                    </div>
                                                </div>
                                                <div style={{flex: 1}}>
                                                    <Link to={`/god-view/${user.user_id}`}>
                                                        <div style={{fontSize: "17px", marginTop: "5px", textDecoration: "none", color: "#1F3D3B", textTransform: "capitalize"}}>{user.first_name} {user.last_name}</div>
                                                    </Link>
                                                    <div style={{fontSize: "12px", textTransform: "lowercase"}}>{user.email_address}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>);
                }}
            </Query>


        </div>)
    }

}

const SohoApplcationQuery = gql`
    query SohoApplcationQuery($user_id: String) {
        demo_users(input: {user_id: $user_id}) {
            user_id
            first_name
            last_name
            email_address
            
            linkedin
            instagram
            phone_number
            
            gender
            sexual_orientation
        }
        demo_soho_applications(input:{user_id: $user_id}){
            application_id
            user_id
            
            startup_name
            startup_location
            startup_focus
            startup_website
            startup_instagram
            startup_funding
            startup_employees

            deck_url
            elevator_pitch
            essay_1
            essay_2

            elevator_pitch_tags_1
            elevator_pitch_tags_2
            elevator_pitch_tags_3
            essay_1_tags_1
            essay_1_tags_2
            essay_1_tags_3
            essay_2_tags_1
            essay_2_tags_2
            essay_2_tags_3

            date_created
            date_submitted
            submitted
            has_co_founders
            is_incorporated
            incorporation_structure
        }
    }
`;

export default withApollo(withRouter(injectSheet(Styles)(SohoApplication)));

