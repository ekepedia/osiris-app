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

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0 20px",
        },
    },
    ...COMMON.STYLES.GENERAL.NavigationStyles,
};

class GroupsHomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
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
            console.log("LOADED USERS GROUPS");
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
        let { users_groups, openCreateNewGroupModal, openFindGroupsModal, openGroupActionsModal, selectedGroup } = this.state;
        console.log(this.state);

        return (
            <div className={classes.masterContainer}>
                <div className={classes.masterNavContainer}>
                    <NavBar/>
                </div>
                <div className={classes.masterBodyContainer}>
                    <div style={{display: "flex"}} className={classes.container}>
                        <div className={mc(classes.mainContainer)}>
                            <div className={mc(classes.rowHeaderSuperContainer)}>
                                <div className={mc(classes.rowContainerHeader)} style={{flex: 1}}>
                                    Your Groups
                                </div>
                                <div style={{flex: "0 0 58x", lineHeight: "initial", marginTop: "6px"}} id="add-saved-job">
                                    <StandardButton label={"Create Group"} onClick={() => (this.setState({openCreateNewGroupModal: true}))}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withApollo(withRouter(injectSheet(Styles)(GroupsHomePage)));

