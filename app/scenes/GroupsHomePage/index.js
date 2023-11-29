import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import GroupService from '../../services/GroupService';
import GroupMemberService from '../../services/GroupMemberService';
import DataService from '../../services/DataService';
import COMMON from "../../common";
import {mc} from "../../common/helpers";
import CompanyService from "../../services/CompanyService";
import JobsService from "../../services/JobsService";
import StandardButton from "../../components/StandardButton";
import NavBar from "../../components/NavBar";
import {COLOR_WHITE} from "../../common/colors";
import {COLORS} from "../../common/colors"
import Lottie from "react-lottie";
import loadingCircles from "../../common/lottie/loading-circles";
import CreateNewGroupModal from "./components/CreateNewGroupModal";
import CoverImageHolder from "../../components/CoverImageHolder";


const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0 20px",
        },
    },
    groupBarContainerHeader: {
        display: "flex",
        width: "100%",
        paddingLeft: "25px",
        //paddingTop: "20px",
        height:"70px",
        alignItems: "center",
        alignSelf: "stretch",
        background: COLOR_WHITE,
        borderBottom: `1px solid ${COLORS.N400}`
},
    groupRowContainer: {background: COLOR_WHITE, marginTop: "15px", width: "100%", alignSelf: "stretch", alignItems: "flex-start", display: "flex", height: "auto", cursor: "pointer", borderRadius: "4px", border: `1px solid ${COMMON.COLORS.N400}`, padding: "15px", flex: 1, overflow: "hidden"},
    groupRowImgContainer: {
        flex: "0 0 38px", overflow: "hidden", height: "38px", marginRight: "8px", borderRadius: "4px", border: `1px solid ${COMMON.COLORS.N400}`
    },
    groupRowTitle: {
        ...COMMON.FONTS.H400,
        color: COMMON.COLORS.N900,
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
    },
    groupRowMembers: {
        ...COMMON.FONTS.P100,
        color: COMMON.COLORS.N700,
        marginTop: "-2px"
    },
    ...COMMON.STYLES.GENERAL.NavigationStyles,
};

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingCircles,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

class GroupsHomePage extends React.Component {

    constructor(props) {
        super(props);
        console.log("props in groups", props);

        this.state = {
            options: [
                { value: 'chocolate', label: 'Chocolate' },
                { value: 'strawberry', label: 'Strawberry' },
                { value: 'vanilla', label: (<div><img src={"/img/jayson.png"} style={{height: "20px", width: "20px", borderRadius: "4px", marginRight: "5px"}}/>Chocolate </div>) }
            ],
            openCreateNewGroupModal: false,
            openFindGroupsModal: false,
            openGroupActionsModal: false,
            loadedGroups: false,
            selectedGroup: null,
        };
    }

    componentDidMount() {
        this.loadUsersGroups(true);
        this.loadCompanies(true);
        //this.loadGroups(true);
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

    //Identify groups that user is a member of using GroupMemberService to return a list of group IDs
    loadUsersGroups(first){
        let { client, match: {params} } = this.props;
        if (first) {
            this.setState({loading_users_groups: true});
        }

        GroupMemberService.getGroupMembers({
            client,
            user_id: params.user_id
        }).then((users_groups) => {
            console.log("LOADED USERS GROUPS", users_groups);
            users_groups = users_groups ? users_groups.sort ((a,b) =>{
                let nameA = a.group_id || "";
                let nameB = b.group_id || "";

                return nameA.localeCompare(nameB);
            }) : users_groups;

            if(users_groups && users_groups.length) {
                let group_ids = users_groups.map((sj) => (sj.group_id));
                console.log("group_ids", group_ids);
                //do I need to change this to be false since it has already loaded groups
                this.loadGroups(true, group_ids);
            }

            console.log("state pre 2", this.state);

            this.setState({
                users_groups,
                loading_users_groups: false,
                loadedGroups: true,
                loading_groups: false
            })
            console.log("state pre 3", this.state);
        })
    }

    loadGroups(first, group_ids) {
        let { client, match: {params} } = this.props;
        console.log("params in loadUsersGroups 123", params);
        console.log("group ids in loadUsersGroups 123", group_ids);
        if(first){
            this.setState({loading_groups: true});
        }

        if (group_ids) {
            console.log("entered this 123", group_ids);
            GroupService.getGroupsByIds({client, group_ids}).then((groups) => {
                console.log("LOADED GROUPS", groups);

                groups = groups || [];
                let groups_map = {};

                groups.forEach((group) => {
                    groups_map[group.group_id] = group;
                })

                groups = groups.sort((a, b) => {

                    let nameA = a.group_name || "";
                    let nameB = b.group_name || "";

                    return nameA.localeCompare(nameB);
                });

                console.log("state post load 2", this.state);


                this.setState({
                    groups,
                    groups_map,
                    loading_groups: false
                })
                console.log("state post load", this.state);
            })
        } else {
            console.log("entered this 1234", params.user_id);
            //Loads groups that are open to all members (privacy setting is a 3)
            GroupService.getGroups({client, privacy_setting: "3" }).then((groups) => {
                console.log("LOADED GROUPS", groups);
                groups = groups || [];
                let groups_map = {};
                console.log("entered this 12345", groups);

                groups.forEach((group) => {
                    groups_map[group.group_id] = group;
                })
                console.log("entered this 123456", groups);

                groups = groups.sort((a, b) => {
                    let nameA = a.group_name || "";
                    let nameB = b.group_name || "";

                    return nameA.localeCompare(nameB);
                });

                console.log("state post load 25", this.state);


                this.setState({
                    groups,
                    groups_map,
                    loading_groups: false
                })
                console.log("state post load 26", this.state);

            })
        }

    }

    render() {
        let { classes, client, match: { params } } = this.props;
        let { users_groups, groups, groups_map, openCreateNewGroupModal, options, openFindGroupsModal, openGroupActionsModal, selectedGroup } = this.state;
        console.log("yes", this.state);

        return (
            <div className={classes.masterContainer}>
                <div className={classes.masterNavContainer}>
                    <NavBar/>
                </div>
                <div className={classes.masterBodyContainer} style={{width: "100%", paddingLeft: "50px", paddingRight: "50px",  paddingTop: "50px"}}>
                    <div className={classes.groupBarContainerHeader}>
                        <div style={{display: "flex", width: "100%", alignItems: "center", paddingTop: "0px" }} >
                            <div className={mc(classes.rowContainerHeader)} style={{flex: 1, fontSize: "16px", color: COLORS.G_900}}>
                                Your Groups
                            </div>
                            <div style={{textAlign: "right", marginRight: "25px"}}>
                                <div style={{flex: "0 0 58x", lineHeight: "initial", marginRight: "5px", display: "inline-block"}} id="find-groups">
                                    <StandardButton secondary={true} label={"Find Groups"} onClick={() => (this.setState({openFindGroupsModal: true}))}/>
                                </div>
                                <div style={{flex: "0 0 58x", lineHeight: "initial", display: "inline-block"}} id="create-new-group">
                                    <StandardButton label={"Create Group"} onClick={() => (this.setState({openCreateNewGroupModal: true}))}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={mc(classes.mainContainer)}>
                        <div>{users_groups && users_groups.length && groups && groups.length && !this.state.loading_groups && !this.state.loading_saved_jobs && !this.state.loading_users_groups ? <div>
                            {groups.map((user_group) => {
                                console.log("USER GROUP GROUP", user_group)
                                let group = groups_map ? ((groups_map[groups.group_id] || {})) : {};
                                //let group_name = group.group_id && groups_map ? (groups_map[group.group_id] || {}).group_name : group.group_name

                                if (!groups_map)
                                    return;
                                return (<div className={classes.groupRowContainer}
                                             key={user_group.group_id}
                                             onClick={() => {this.setState({selectedGroup: user_group});}}
                                >
                                    <div className={classes.groupRowImgContainer}>
                                        <CoverImageHolder url={(user_group.group_logo_url || "https://i.imgur.com/tM97NWQ.png")}/>
                                    </div>
                                    <div style={{flex: 1, overflow: "hidden"}}>
                                        <div className={classes.groupRowTitle}>
                                            Group Name: {user_group.group_name}
                                        </div>
                                        <div className={classes.groupRowMembers}>
                                            Group size: {user_group.group_size}
                                        </div>
                                    </div>
                                    <div className={mc(classes.jobTitle)}
                                         style={{flex: 1}}
                                         onClick={() => {
                                             this.setState({selectedGroup: user_group});
                                         }}
                                    >
                                        {(groups_map[user_group.group_id] || {}).group_name}
                                    </div>
                                </div>)
                            })}
                        </div> : (this.state.loading_groups || this.state.loading_users_groups ) ? <div>
                            <div style={{padding: "20px", textAlign: "center"}}>
                                <div style={{textAlign: "center"}}>
                                    <Lottie options={defaultOptions}
                                            height={96}
                                            width={96}/>
                                </div>
                                <div>Loading Groups</div>
                                <div>One Moment Please</div>
                            </div>
                        </div> : <div>
                            <div style={{padding: "20px", textAlign: "center"}}>
                                <div style={{fontSize: "14px"}}>You haven't joined any groups yet! Click below to create a new group</div>
                                <div style={{marginTop: "20px"}}>
                                    <StandardButton label={"Create Group"} onClick={() => (

                                        this.setState({openCreateNewGroupModal: true}))
                                    }/>
                                </div>
                            </div>
                        </div>
                        } </div>
                    </div>
                    <CreateNewGroupModal open={openCreateNewGroupModal} options={options} onSubmit={({group_name, group_company_affiliation, group_about}) => {
                        console.log("CREATING NEW GROUP", group_name, group_company_affiliation, group_about);

                        GroupService.addGroup({
                            client,
                            group_name,
                            group_company_affiliation,
                            group_about,
                            group_creator_user_id: params.user_id,
                            group_owner_user_id: params.user_id,
                            date_created: new Date().getTime() + "",
                        }).then((group_id)=>{
                            console.log("group id", group_id);
                            console.log("user", params.user_id);
                            GroupMemberService.addGroupMember({
                                client,
                                user_id: params.user_id,
                                group_id,
                                type_id: "1",
                                role_in_group_id: "1",
                                role_in_group_name: "Creator",
                                join_date: new Date().getTime() + "",
                                is_group_admin: true
                            }).then((group_member_id)=>{
                                console.log("CREATED NEW GROUP MEMBER", group_member_id);
                                this.loadUsersGroups();
                            })
                        })
                    }} onClose={() => (this.setState({openCreateNewGroupModal: false}))}/>
                </div>
            </div>
        )
    }
}

export default withApollo(withRouter(injectSheet(Styles)(GroupsHomePage)));

