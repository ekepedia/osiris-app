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
        background: COLOR_WHITE
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

        this.state = {
            options: [
                { value: 'chocolate', label: 'Chocolate' },
                { value: 'strawberry', label: 'Strawberry' },
                { value: 'vanilla', label: (<div><img src={"/img/jayson.png"} style={{height: "20px", width: "20px", borderRadius: "4px", marginRight: "5px"}}/>Chocolate </div>) }
            ],
            openCreateNewGroupModal: false,
            openFindGroupsModal: false,
            openGroupActionsModal: false,
            selectedGroup: null,
        };
    }

    componentDidMount() {
        this.loadUsersGroups(true);
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
                let nameA = a.status_id || "";
                let nameB = b.status_id || "";

                return nameA.localeCompare(nameB);
            }) : users_groups;

            if(users_groups && users_groups.length) {
                let group_ids = users_groups.map((sj) => (sj.group_id));
                console.log("group_ids", group_ids);
                this.loadGroups(true, group_ids);
            }

            this.setState({
                users_groups,
                loading_users_groups: false
            })
        })
    }

    loadGroups(first, group_ids) {
        let { client } = this.props;

        if(first){
            this.setState({loading_groups: true});
        }

        if (group_ids) {
            GroupService.getGroupsByIds({client, group_ids}).then((groups) => {
                console.log("LOADED GROUPS", groups);

                groups = groups || [];
                let groups_map = {};

                groups.forEach((job) => {
                    groups_map[group.group_id] = group;
                })

                groups = groups.sort((a, b) => {

                    let nameA = a.group_name || "";
                    let nameB = b.group_name || "";

                    return nameA.localeCompare(nameB);
                });

                this.setState({
                    groups,
                    groups_map,
                    loading_jobs: false
                })
            })
        } else {
            GroupService.getGroups({client}).then((groups) => {
                // console.log("LOADED GROUPS", groups);

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

                this.setState({
                    groups,
                    groups_map,
                    loading_groups: false
                })
            })
        }

    }

    render() {
        let { classes, client, match: { params } } = this.props;
        let { users_groups, groups_map, openCreateNewGroupModal, options, openFindGroupsModal, openGroupActionsModal, selectedGroup } = this.state;
        console.log(this.state);

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
                        <div>{users_groups && users_groups.length && !this.state.loading_groups && !this.state.loading_saved_jobs && !this.state.loading_users_groups ? <div>
                            {users_groups.map((user_group) => {
                                console.log("USER GROUP GROUP", user_group)
                                let group = groups_map ? ((groups_map[user_group.group_id] || {})) : {};
                                let group_name = group.group_id && group_map ? (group_map[group.group_id] || {}).group_name : group.group_name

                                if (!groups_map)
                                    return;
                                return (<div className={mc(classes.savedJobRow)} key={user_group.group_id}>
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
                                    <StandardButton label={"Create Group"} onClick={() => (this.setState({openCreateNewGroupModal: true}))}/>
                                </div>
                            </div>
                        </div>
                        } </div>
                    </div>
                    <CreateNewGroupModal open={openCreateNewGroupModal} options={options} onSubmit={({group_name, group_about, group_company_affiliation}) => {
                        console.log("Submit", group_name, group_about, group_company_affiliation);

                        GroupService.addGroup(
                            client, group_name, group_about, group_company_affiliation
                        )
                    }} onClose={() => (this.setState({openCreateNewGroupModal: false}))}/>
                </div>
            </div>
        )
    }
}

export default withApollo(withRouter(injectSheet(Styles)(GroupsHomePage)));

