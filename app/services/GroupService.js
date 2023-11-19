import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";
import UserEducationService from "./UserEducationService";
import GroupMemberService from "./GroupMemberService";
import JobsService from "./JobsService";

let GroupService = {};

GroupService.getGroups = ({
                              client,
                              group_id,
                              group_name,
                              group_logo_url,
                              cover_photo_url,

                              group_size,
                              group_about,
                              group_website,
                              group_founded_year,

                              group_industry_affiliation,
                              group_company_affiliation,
                              group_role_affiliation,
                              group_school_affiliation,

                              privacy_setting,

                              is_active,
                              is_hidden,
                              is_verified,
                              is_clearbit_import,
                              batch_id,
                          }) => {
    return new Promise((resolve, reject) => {
        const GroupsQuery = gql`
            query GroupsQuery(
                $group_id: String,
                $group_name: String,
                $group_logo_url: String,
                $cover_photo_url: String,
                
                $group_size: String,
                $group_about: String,
                $group_website: String,
                $group_founded_year: String,

                $group_industry_affiliation: String,
                $group_company_affiliation: String,
                $group_role_affiliation: String,
                $group_school_affiliation: String,
                
                $privacy_setting: String,

                $is_active: Boolean,
                $is_hidden: Boolean,
                $is_verified: Boolean,
                $is_clearbit_import: Boolean,
                $batch_id: String,
            ){
                groups(input:{
                    group_id: $group_id,
                    group_name: $group_name,
                    group_logo_url: $group_logo_url,
                    cover_photo_url: $cover_photo_url,
                    
                    group_size: $group_size,
                    group_about: $group_about,
                    group_website: $group_website,
                    group_founded_year: $group_founded_year,
                    
                    group_industry_affiliation: $group_industry_affiliation,
                    group_company_affiliation: $group_company_affiliation,
                    group_role_affiliation: $group_role_affiliation,
                    group_school_affiliation: $group_school_affiliation,
                    
                    privacy_setting: $privacy_setting,
                    
                    is_active: $is_active,
                    is_hidden: $is_hidden,
                    is_verified: $is_verified,
                    is_clearbit_import: $is_clearbit_import,
                    batch_id: $batch_id,
                }) {
                    group_id
                    group_name
                    group_logo_url
                    cover_photo_url
                    
                    group_size
                    group_about
                    group_website
                    group_founded_year
                    
                    group_industry_affiliation
                    group_company_affiliation
                    group_role_affiliation
                    group_school_affiliation
                    
                    privacy_setting
                    
                    is_active
                    is_hidden
                    is_verified
                    is_clearbit_import
                    batch_id
                }
            }
        `;

        const variables = {
            client,
            group_id,
            group_name,
            group_logo_url,
            cover_photo_url,

            group_size,
            group_about,
            group_website,
            group_founded_year,

            group_industry_affiliation,
            group_company_affiliation,
            group_role_affiliation,
            group_school_affiliation,

            privacy_setting,

            is_active,
            is_hidden,
            is_verified,
            batch_id,
            is_clearbit_import: false
        };

        client.query({query: GroupsQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.groups && response.data.groups.length) {
                resolve(response.data.groups)
            } else {
                resolve(null)
            }
        }).catch((err) => {
            resolve();
        })
    });
}

JobsService.getGroupsByIds = ({
                                client,
                                group_ids,
                            }) => {
    return new Promise((resolve, reject) => {
        const GroupsQuery = gql`
            query GroupsQuery(
                $group_ids: [String],
            ){
                groups_by_ids(input: $group_ids) {
                    group_id,
                    group_name,
                    group_logo_url,
                    cover_photo_url,

                    group_size,
                    group_about,
                    group_website,
                    group_founded_year,

                    group_industry_affiliation,
                    group_company_affiliation,
                    group_role_affiliation,
                    group_school_affiliation,

                    privacy_setting,

                    is_active,
                    is_hidden,
                    is_verified,
                    is_clearbit_import,
                    batch_id,
                }
            }
        `;

        const variables = {
            group_ids,
        };

        client.query({query: GroupsQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.groups_by_ids && response.data.groups_by_ids.length) {
                resolve(response.data.groups_by_ids)
            } else {
                resolve(null)
            }
        }).catch((err) => {
            resolve();
        })
    });
}

GroupService.addGroup = ({
                                         client,
                                         group_id,
                                         group_name,
                                         group_logo_url,
                                         cover_photo_url,
                                         group_size,
                                         group_about,
                                         group_website,
                                         group_founded_year,

                                         group_industry_affiliation,
                                         group_company_affiliation,
                                         group_role_affiliation,
                                         group_school_affiliation,

                                         privacy_setting,

                                         is_active,
                                         is_hidden,
                                         is_verified,
                                         is_clearbit_import,

                                         batch_id,
                                     }
) => {
    return new Promise((resolve, reject) => {
        const CreateGroupMutation = gql`
            mutation CreateGroupMutation(
                $group_id: String,
                $group_name: String,
                $group_logo_url: String,
                $cover_photo_url: String,
                $group_size: String,
                $group_about: String,
                $group_website: String,
                $group_founded_year: String,
    
                $group_industry_affiliation: String,
                $group_company_affiliation: String,
                $group_role_affiliation: String,
                $group_school_affiliation: String,
    
                $privacy_setting: String,
    
                $is_active: Boolean,
                $is_hidden: Boolean,
                $is_verified: Boolean,
                $is_clearbit_import: Boolean,
    
                $batch_id: String,
                
            ){
                add_group(input:{
                    group_id: $group_id,
                    group_name: $group_name,
                    group_logo_url: $group_logo_url,
                    cover_photo_url: $cover_photo_url,

                    group_size: $group_size,
                    group_about: $group_about,
                    group_website: $group_website,
                    group_founded_year: $group_founded_year,

                    group_industry_affiliation: $group_industry_affiliation,
                    group_company_affiliation: $group_company_affiliation,
                    group_role_affiliation: $group_role_affiliation,
                    group_school_affiliation: $group_school_affiliation,

                    privacy_setting: $privacy_setting,

                    is_active: $is_active,
                    is_hidden: $is_hidden,
                    is_verified: $is_verified,
                    is_clearbit_import: $is_clearbit_import,
                    batch_id: $batch_id,
                })
            }
        `;

        let variables = {
            group_id, group_name, group_logo_url, cover_photo_url, group_size, group_about, group_website, group_founded_year, group_industry_affiliation, group_company_affiliation, group_role_affiliation, group_school_affiliation, privacy_setting, is_active, is_hidden, is_verified, is_clearbit_import, batch_id
        };

        client.mutate({mutation: CreateGroupMutation, variables}).then((response) => {
            resolve(response.data.add_group)
        }).catch((err) => {
            resolve();
        })
    })
}

GroupService.removeGroup = ({client, group_id, user_id}) => {
    return new Promise((resolve, reject) => {
        const RemoveGroupMutation = gql`
            mutation RemoveGroupMutation(
                $group_id: String!,
            ){
                remove_group(group_id: $group_id)
            }
        `;

        let variables = {
            group_id
        };

        client.mutate({mutation: RemoveGroupMutation, variables}).then((response) => {
            resolve(response.data.remove_group)
        }).catch((err) => {
            resolve();
        })
    })
}

GroupService.editGroup = ({
                              client,
                              group_id,
                              group_name,
                              group_logo_url,
                              cover_photo_url,

                              group_size,
                              group_about,
                              group_website,
                              group_founded_year,

                              group_industry_affiliation,
                              group_company_affiliation,
                              group_role_affiliation,
                              group_school_affiliation,

                              privacy_setting,

                              is_active,
                              is_hidden,
                              is_verified,
                              is_clearbit_import,
                              batch_id,
                                     }
) => {
    return new Promise((resolve, reject) => {
        const EditGroupMutation = gql`
            mutation EditGroupMutation(
                $group_id: String,
                $group_name: String,
                $group_logo_url: String,
                $cover_photo_url: String,
                $group_size: String,
                $group_about: String,
                $group_website: String,
                $group_founded_year: String,

                $group_industry_affiliation: String,
                $group_company_affiliation: String,
                $group_role_affiliation: String,
                $group_school_affiliation: String,

                $privacy_setting: String,

                $is_active: Boolean,
                $is_hidden: Boolean,
                $is_verified: Boolean,
                $is_clearbit_import: Boolean,

                $batch_id: String,

            ){
                edit_group(input:{
                    group_id: $group_id,
                    group_name: $group_name,
                    group_logo_url: $group_logo_url,
                    cover_photo_url: $cover_photo_url,

                    group_size: $group_size,
                    group_about: $group_about,
                    group_website: $group_website,
                    group_founded_year: $group_founded_year,

                    group_industry_affiliation: $group_industry_affiliation,
                    group_company_affiliation: $group_company_affiliation,
                    group_role_affiliation: $group_role_affiliation,
                    group_school_affiliation: $group_school_affiliation,

                    privacy_setting: $privacy_setting,

                    is_active: $is_active,
                    is_hidden: $is_hidden,
                    is_verified: $is_verified,
                    is_clearbit_import: $is_clearbit_import,
                    batch_id: $batch_id,
                })
            }
        `;

        let variables = {
            group_id, group_name, group_logo_url, cover_photo_url, group_size, group_about, group_website, group_founded_year, group_industry_affiliation, group_company_affiliation, group_role_affiliation, group_school_affiliation, privacy_setting, is_active, is_hidden, is_verified, is_clearbit_import, batch_id
        };

        client.mutate({mutation: EditGroupMutation, variables}).then((response) => {
            resolve(response.data.edit_group)
        }).catch((err) => {
            resolve();
        })
    })
}

export default GroupService
