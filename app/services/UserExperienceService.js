import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";

let UserExperienceService = {};

UserExperienceService.getUserExperiences = ({client, user_id, is_hidden}) => {
    return new Promise((resolve, reject) => {
        const UserExperienceQuery = gql`
            query UserExperienceQuery(
                $user_id: String,
                $is_hidden: Boolean
            ){
                user_experiences(input:{
                    user_id: $user_id,
                    is_hidden: $is_hidden
                }) {
                    user_experience_id
                    user_id
                    is_hidden

                    company_name
                    company_logo_url
                    role_name
                    is_current
                    
                    start_date
                    end_date
                }
            }
        `;

        const variables = {
            user_id, is_hidden
        };

        client.query({query: UserExperienceQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.user_experiences && response.data.user_experiences.length) {
                resolve(response.data.user_experiences)
            } else {
                resolve(null)
            }
        }).catch((err) => {
            resolve();
        })
    });
}

UserExperienceService.deleteUserExperience = ({client, user_experience_id}) => {
    return new Promise((resolve, reject) => {
        const RemoveUserExperienceMutation = gql`
            mutation RemoveUserExperienceMutation(
                $user_experience_id: String!,
            ){
                remove_user_experience(user_experience_id: $user_experience_id,)
            }
        `;

        let variables = {user_experience_id};

        client.mutate({mutation: RemoveUserExperienceMutation, variables}).then((response) => {
            resolve(response.data.remove_user_experience)
        }).catch((err) => {
            resolve();
        })
    })
}


UserExperienceService.editUserExperience = ({client, user_experience_id, is_hidden, company_name, company_logo_url, role_name, is_current, start_date, end_date}) => {
    return new Promise((resolve, reject) => {
        const EditUserExperienceMutation = gql`
            mutation EditUserExperienceMutation(
                $user_experience_id: String!,
                $company_name: String,
                $is_hidden: Boolean,
                $company_logo_url: String,
                $role_name: String,
                $is_current: Boolean
                $start_date: String
                $end_date: String
            ){
                edit_user_experience(input:{
                    user_experience_id: $user_experience_id,
                    company_name: $company_name,
                    company_logo_url: $company_logo_url,
                    role_name: $role_name,
                    is_current: $is_current,
                    is_hidden: $is_hidden,
                    start_date: $start_date,
                    end_date: $end_date,
                })
            }
        `;

        let variables = {
            user_experience_id, is_hidden, company_name, company_logo_url, role_name, is_current, start_date, end_date
        };

        client.mutate({mutation: EditUserExperienceMutation, variables}).then((response) => {
            resolve(response.data.edit_user_experience)
        }).catch((err) => {
            resolve();
        })
    })
}

UserExperienceService.addUserExperience = ({client, user_id, company_name, company_logo_url, role_name, is_current, start_date, end_date}) => {
    return new Promise((resolve, reject) => {
        const AddUserExperienceMutation = gql`
            mutation AddUserExperienceMutation(
                $user_id: String!,
                $company_name: String,
                $company_logo_url: String,
                $role_name: String,
                $is_current: Boolean
                $start_date: String
                $end_date: String
            ){
                add_user_experience(input:{
                    user_id: $user_id,
                    company_name: $company_name,
                    company_logo_url: $company_logo_url,
                    role_name: $role_name,
                    is_current: $is_current,
                    start_date: $start_date,
                    end_date: $end_date,
                })
            }
        `;

        let variables = {
            user_id, company_name, company_logo_url, role_name, is_current, start_date, end_date
        };

        client.mutate({mutation: AddUserExperienceMutation, variables}).then((response) => {
            resolve(response.data.add_user_experience)
        }).catch((err) => {
            resolve();
        })
    })
}


export default UserExperienceService
