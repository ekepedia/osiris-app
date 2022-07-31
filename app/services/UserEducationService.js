import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";
import UserExperienceService from "./UserExperienceService";

let UserEducationService = {};

UserEducationService.getUserEducation = ({client, user_id, is_hidden}) => {
    return new Promise((resolve, reject) => {
        const UserEducationQuery = gql`
            query UserEducationQuery(
                $user_id: String,
                $is_hidden: Boolean,
            ){
                user_educations(input:{
                    user_id: $user_id,
                    is_hidden: $is_hidden
                }) {
                    user_education_id
                    user_id
                    is_hidden

                    school_name
                    school_logo_url
                    
                    degree_name
                    
                    start_date
                    end_date
                }
            }
        `;

        const variables = {
            user_id, is_hidden
        };

        client.query({query: UserEducationQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.user_educations && response.data.user_educations.length) {
                resolve(response.data.user_educations)
            } else {
                resolve(null)
            }
        }).catch((err) => {
            resolve();
        })
    });
}

UserEducationService.addUserEducation = ({client, user_id, school_name, degree_name, start_date, end_date, school_logo_url}) => {
    return new Promise((resolve, reject) => {
        const AddUserEducationMutation = gql`
            mutation AddUserEducationMutation(
                $user_id: String!,
                $school_name: String,
                $school_logo_url: String,
                $degree_name: String,
                $start_date: String
                $end_date: String
            ){
                add_user_education(input: {
                    user_id: $user_id,
                    school_name: $school_name,
                    degree_name: $degree_name, 
                    school_logo_url: $school_logo_url
                    start_date: $start_date,
                    end_date: $end_date,
                })
            }
        `;

        let variables = {
            user_id, school_name, degree_name, start_date, end_date, school_logo_url
        };

        client.mutate({mutation: AddUserEducationMutation, variables}).then((response) => {
            resolve(response.data.add_user_education)
        }).catch((err) => {
            resolve();
        })
    })
}

UserEducationService.editUserEducation = ({client, user_education_id, is_hidden, school_name, degree_name, start_date, end_date, school_logo_url}) => {
    return new Promise((resolve, reject) => {
        const EditUserEducationMutation = gql`
            mutation EditUserEducationMutation(
                $user_education_id: String!,
                $school_name: String,
                $degree_name: String,
                $start_date: String, 
                $end_date: String
                $school_logo_url: String,
                $is_hidden: Boolean,
            ){
                edit_user_education(input:{
                    user_education_id: $user_education_id,
                    school_name: $school_name,
                    degree_name: $degree_name,
                    start_date: $start_date,
                    end_date: $end_date,
                    school_logo_url: $school_logo_url,
                    is_hidden: $is_hidden
                })
            }
        `;

        let variables = {
            user_education_id, school_name, degree_name, start_date, end_date, school_logo_url, is_hidden
        };

        client.mutate({mutation: EditUserEducationMutation, variables}).then((response) => {
            resolve(response.data.edit_user_education)
        }).catch((err) => {
            resolve();
        })
    })
}


UserEducationService.deleteUserEducation = ({client, user_education_id}) => {
    return new Promise((resolve, reject) => {
        const RemoveUserEducationMutation = gql`
            mutation RemoveUserEducationMutation(
                $user_education_id: String!,
            ){
                remove_user_education(user_education_id: $user_education_id,)
            }
        `;

        let variables = {user_education_id};

        client.mutate({mutation: RemoveUserEducationMutation, variables}).then((response) => {
            resolve(response.data.remove_user_education)
        }).catch((err) => {
            resolve();
        })
    })
}

export default UserEducationService