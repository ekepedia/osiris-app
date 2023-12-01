import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";
import SavedJobService from "./SavedJobService";

let GroupMemberService = {};

GroupMemberService.addGroupMember = ({
                                         client,
                                         group_member_id,
                                         group_id,
                                         user_id,
                                         type_id,
                                         notification_preferences,
                                         role_in_group_id,
                                         role_in_group_name,
                                         join_date,
                                         leave_date,
                                         date_verified,

                                         is_current,
                                         is_alumni,
                                         is_recruiter,
                                         is_group_admin,
                                         is_verified,
                                         is_hidden,
                                     }
) => {
    return new Promise((resolve, reject) => {
        const AddGroupMemberMutation = gql`
            mutation AddGroupMemberMutation(
                $group_member_id: String,
                $group_id: String,
                $user_id: String,
                $type_id: String,
                $notification_preferences: String,
                $role_in_group_id: String,
                $role_in_group_name: String,
                $join_date: String,
                $leave_date: String,
                $date_verified: String,

                $is_current: Boolean,
                $is_alumni: Boolean,
                $is_recruiter: Boolean,
                $is_group_admin: Boolean,
                $is_verified: Boolean,
                $is_hidden: Boolean,

            ){
                add_group_member(input:{
                    group_member_id: $group_member_id,
                    group_id: $group_id,
                    user_id: $user_id,
                    type_id: $type_id,
                    notification_preferences: $notification_preferences,
                    role_in_group_id: $role_in_group_id,
                    role_in_group_name: $role_in_group_name,
                    join_date: $join_date,
                    leave_date: $leave_date,
                    date_verified: $date_verified,
                    is_current: $is_current,
                    is_alumni: $is_alumni,
                    is_recruiter: $is_recruiter,
                    is_group_admin: $is_group_admin,
                    is_verified: $is_verified,
                    is_hidden: $is_hidden,
                })
            }
        `;

        let variables = {
            group_member_id, group_id,user_id, type_id, notification_preferences, role_in_group_id, role_in_group_name, join_date, leave_date, date_verified, is_current, is_alumni, is_recruiter, is_group_admin, is_verified, is_hidden
        };

        client.mutate({mutation: AddGroupMemberMutation, variables}).then((response) => {
            resolve(response.data.add_group_member)
        }).catch((err) => {
            resolve();
        })
    })
}

GroupMemberService.removeGroupMember = ({client, group_member_id, group_id, user_id, type_id, is_group_admin}) => {
    return new Promise((resolve, reject) => {
        const RemoveGroupMemberMutation = gql`
            mutation RemoveGroupMemberMutation(
                $group_member_id: String!,
            ){
                remove_user_preference(user_preference_id: $group_member_id)
            }
        `;

        let variables = {
            group_member_id
        };

        client.mutate({mutation: RemoveGroupMemberMutation, variables}).then((response) => {
            resolve(response.data.remove_group_member)
        }).catch((err) => {
            resolve();
        })
    })
}

GroupMemberService.getGroupMembers = ({
                                          client,
                                          group_member_id,
                                          group_id,
                                          user_id,
                                          type_id,
                                          notification_preferences,
                                          role_in_group_id,
                                          role_in_group_name,
                                          join_date,
                                          leave_date,
                                          date_verified,

                                          is_current,
                                          is_alumni,
                                          is_recruiter,
                                          is_group_admin,
                                          is_verified,
                                          is_hidden,
}) => {
    return new Promise((resolve, reject) => {
        const GroupMemberQuery = gql`
            query GroupMemberQuery(
                $group_member_id: String,
                $group_id: String,
                $user_id: String,
                $type_id: String,
                $notification_preferences: String,
                $role_in_group_id: String,
                $role_in_group_name: String,
                $join_date: String,
                $leave_date: String,
                $date_verified: String,

                $is_current: Boolean,
                $is_alumni: Boolean,
                $is_recruiter: Boolean,
                $is_group_admin: Boolean,
                $is_verified: Boolean,
                $is_hidden: Boolean,
            ){
                group_members(input:{
                    group_member_id: $group_member_id,
                    group_id: $group_id,
                    user_id: $user_id,
                    type_id: $type_id,
                    notification_preferences: $notification_preferences,
                    role_in_group_id: $role_in_group_id,
                    role_in_group_name: $role_in_group_name,
                    join_date: $join_date,
                    leave_date: $leave_date,
                    date_verified: $date_verified,
                    is_current: $is_current,
                    is_alumni: $is_alumni,
                    is_recruiter: $is_recruiter,
                    is_group_admin: $is_group_admin,
                    is_verified: $is_verified,
                    is_hidden: $is_hidden,
                }) {
                    group_member_id,
                    group_id,
                    user_id,
                    type_id,
                    notification_preferences,
                    role_in_group_id,
                    role_in_group_name,
                    join_date,
                    leave_date,
                    date_verified,

                    is_current,
                    is_alumni,
                    is_recruiter,
                    is_group_admin,
                    is_verified,
                    is_hidden,
                }
            }
        `;

        const variables = {
            group_member_id,
            group_id,
            user_id,
            type_id,
            notification_preferences,
            role_in_group_id,
            role_in_group_name,
            join_date,
            leave_date,
            date_verified,

            is_current,
            is_alumni,
            is_recruiter,
            is_group_admin,
            is_verified,
            is_hidden,
        };
        console.log("this is where we look ", GroupMemberQuery);
        client.query({query: GroupMemberQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.group_members && response.data.group_members.length) {
                resolve(response.data.group_members);
            } else {
                resolve(null);
            }
        }).catch((err) => {
            console.log("error in front end service", err);
            resolve();
        })
    });
}

GroupMemberService.editGroupMember = ({
                                          client,
                                          group_member_id,
                                          group_id,
                                          user_id,
                                          type_id,
                                          notification_preferences,
                                          role_in_group_id,
                                          role_in_group_name,
                                          join_date,
                                          leave_date,
                                          date_verified,

                                          is_current,
                                          is_alumni,
                                          is_recruiter,
                                          is_group_admin,
                                          is_verified,
                                          is_hidden,
}) => {
    return new Promise((resolve, reject) => {
        const EditGroupMemberMutation = gql`
            mutation EditGroupMemberMutation(
                $group_member_id: String,
                $group_id: String,
                $user_id: String,
                $type_id: String,
                $notification_preferences: String,
                $role_in_group_id: String,
                $role_in_group_name: String,
                $join_date: String,
                $leave_date: String,
                $date_verified: String,

                $is_current: Boolean,
                $is_alumni: Boolean,
                $is_recruiter: Boolean,
                $is_group_admin: Boolean,
                $is_verified: Boolean,
                $is_hidden: Boolean,
            ){
                edit_group_member(input:{
                    group_member_id: $group_member_id,
                    group_id: $group_id,
                    user_id: $user_id,
                    type_id: $type_id,
                    notification_preferences: $notification_preferences,
                    role_in_group_id: $role_in_group_id,
                    role_in_group_name: $role_in_group_name,
                    join_date: $join_date,
                    leave_date: $leave_date,
                    date_verified: $date_verified,
                    is_current: $is_current,
                    is_alumni: $is_alumni,
                    is_recruiter: $is_recruiter,
                    is_group_admin: $is_group_admin,
                    is_verified: $is_verified,
                    is_hidden: $is_hidden,
                })
            }
        `;

        let variables = {
            group_member_id, group_id,user_id, type_id, notification_preferences, role_in_group_id, role_in_group_name, join_date, leave_date, date_verified, is_current, is_alumni, is_recruiter, is_group_admin, is_verified, is_hidden
        };

        client.mutate({mutation: EditGroupMemberMutation, variables}).then((response) => {
            resolve(response.data.edit_group_member)
        }).catch((err) => {
            resolve();
        })
    })
}

export default GroupMemberService
