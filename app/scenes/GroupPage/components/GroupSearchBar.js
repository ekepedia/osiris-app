import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import COMMON from "../../../common";
import EventService from "../../../services/EventService";
import AuthService from "../../../services/AuthService";
import TrackingService from "../../../services/TrackingService";
import CoverImageHolder from "../../../components/CoverImageHolder";
import {mc} from "../../../common/helpers";
import StandardInput from "../../../components/StandardInput";
import PostJobModal from "./modals/PostJobModal";
import JobsService from "../../../services/JobsService";
import SavedJobService from "../../../services/SavedJobService";
import CompanyService from "../../../services/CompanyService";

const Styles = {
    groupSearchBarContainer: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
        width: "100%"
    },
    groupSearchBar: {
        display: "flex",
        width: "100%",
        marginBottom: "20px"
    },
    groupLHSProfileContainer: {
        marginRight: "15px",
        height: "30px",
        width: "30px",
        borderRadius: "100%",
        border: `2px solid ${COMMON.COLORS.N900}`,
        overflow: "hidden",
        cursor: "pointer",
        alignItems: "center"
    },
    groupPostOptions: {
        height:"100%",
        width:"33%",
        cursor: "pointer",
        textAlign:"center"
    }
};

class GroupSearchBar extends React.Component {

    constructor(props) {
        super(props);

        let user = {};
        let userstring = localStorage.user;

        if (userstring && userstring !== "undefined") {
            user = JSON.parse(userstring)
        }

        this.state = {
            selected: true,
            newPostInSearchBar:null,
            user,
            openPostJobModal: false,
        };
    }

    componentDidMount() {
        this.loadUser();
        this.loadCompanies(true);
        EventService.on(EventService.events.UPDATE_USER, () => {
            this.loadUser();
        })
    }

    loadUser() {
        let {  client, } = this.props;

        AuthService.getCurrentUser().then((user) => {
            this.setState({
                user: user || {}
            })
        })
    }

    loadCompanies(first) {
        let { client } = this.props;

        if (first) {
            this.setState({loading_companies: true});
        }

        CompanyService.getCompanies({client}).then((companies) => {
            console.log("LOADED COMPANIES");

            companies = companies.sort((a, b) => {

                let nameA = a.company_name || "";
                let nameB = b.company_name || "";

                return nameA.localeCompare(nameB);
            });

            let options = [];
            let company_map = {};
            let option_map = {};

            companies.forEach((company) => {
                options.push({
                    value: company.company_id,
                    company: company,
                    label: (<div><img src={company.company_logo_url} style={{
                        height: "20px",
                        width: "20px",
                        borderRadius: "4px",
                        marginRight: "5px",
                        border: `1px solid ${COMMON.COLORS.N300}`
                    }}/><span style={{...COMMON.FONTS.P100}}>{company.company_name}</span></div>)
                });
                company_map[company.company_id] = company;
            });

            options.forEach((option) => {
                option_map[option.value] = option
            })

            this.setState({
                companies,
                options,
                company_map,
                option_map,
                loading_companies: false
            })
        })
    }

    render() {
        let { classes, client, match: { params } } = this.props;
        let { user, openPostJobModal, companies, options, company_map, option_map} = this.state;

        const {
            newPostInSearchBar,
        } = this.state

        user = user || {};

        return (<div className={mc(classes.groupSearchBarContainer)} style={{width:"100%"}}>
                <div className={mc(classes.groupSearchBar)}>
                    <div style={{flex: user && user.user_id ? "0 0 30px" : 0}}>
                        {user && user.user_id ? <Link to={"/profile"} onClick={() => {
                            TrackingService.trackClick({page: "navbar", value: "profile"});
                        }}>
                            <div title="Profile" id="profile-link" className={classes.groupLHSProfileContainer}>
                                <div style={{border: `1px solid ${COMMON.COLORS.N0}`, borderRadius: "100%", height: "100%", width: "100%", overflow: "hidden", alignItems: "center"}}>
                                    <CoverImageHolder url={user.profile_photo_url || "/img/generic-user.jpeg"}/>
                                </div>
                            </div>
                        </Link> : null}
                    </div>
                    <StandardInput style={{width: "100%"}} placeholder={"What's on your mind?"} value={this.state.newPostInSearchBar} update={(v) => {
                        this.setState({
                            companyNameFilter: v,
                        });
                        TrackingService.trackSubmit({page: "groups", sub_page: "new-post", value: v});
                    }}/>
                </div>
                <div className={classes.postOptions} style={{display:"flex", height: "20px", width: "100%"}}>
                    <div className={classes.groupPostOptions} onClick={() => (this.setState({openPostJobModal: true}))}>
                        <i className="fa-regular fa-pen-to-square" style={{marginRight: "5px"}}/>Post a Job
                    </div>
                    <div className={classes.groupPostOptions} onClick={() => {setSelectedState ? setSelectedState(2) : null}}>
                        <i className="fa-regular fa-pen-to-square" style={{marginRight: "5px"}}/>Ask a Question
                    </div>
                    <div className={classes.groupPostOptions} onClick={() => {setSelectedState ? setSelectedState(3) : null}}>
                        <i className="fa-light fa-microphone" style={{marginRight: "5px"}}/>Create Event
                    </div>
                </div>
            <PostJobModal open={openPostJobModal} options={options} onSubmit={({job_title, apply_link, status_id, company_id,}) => {
                console.log("SUBMIT", job_title, apply_link, status_id, company_id);

                JobsService.addJob({
                    client,
                    job_title,
                    apply_link,
                    company_id,
                    user_id: params.user_id,
                    submitted_by_id: params.user_id,
                    date_created: new Date().getTime() + "",
                    is_user_submitted: true,
                    is_public: false
                }).then((job_id) => {
                    console.log("CREATE NEW JOB:", job_id);
                    console.log("params", params)
                    console.log("params.user)id", params.user_id)

                    // this.loadJobs();
                    console.log("USER ID:", params.user_id);
                    SavedJobService.addSavedJob({client,
                        job_id,
                        user_id: params.user_id,
                        status_id: status_id + ""
                    }).then((saved_job_id) => {
                        console.log("CREATED NEW SAVED JOB:", saved_job_id);
                    })
                })


            }} onClose={() => (this.setState({openPostJobModal: false}))}/>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(GroupSearchBar)));

