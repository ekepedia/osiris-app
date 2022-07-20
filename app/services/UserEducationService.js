import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";

let UserEducationService = {};

UserEducationService.getUserEducation = ({client, user_id}) => {
    return new Promise((resolve, reject) => {
        const UserEducationQuery = gql`
            query UserEducationQuery(
                $user_id: String,
            ){
                user_educations(input:{
                    user_id: $user_id,
                }) {
                    user_education_id
                    user_id
                    school_name
                    school_logo_url
                    
                    degree_name
                    
                    start_date
                    end_date
                }
            }
        `;

        const variables = {
            user_id
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

UserEducationService.editUserEducation = ({client, user_education_id, school_name, degree_name, start_date, end_date}) => {
    return new Promise((resolve, reject) => {
        const EditUserEducationMutation = gql`
            mutation EditUserEducationMutation(
                $user_education_id: String!,
                $school_name: String,
                $degree_name: String,
                $start_date: String, 
                $end_date: String
            ){
                edit_user_education(input:{
                    user_education_id: $user_education_id,
                    school_name: $school_name,
                    degree_name: $degree_name,
                    start_date: $start_date,
                    end_date: $end_date,
                })
            }
        `;

        let variables = {
            user_education_id, school_name, degree_name, start_date, end_date
        };

        client.mutate({mutation: EditUserEducationMutation, variables}).then((response) => {
            resolve(response.data.edit_user_education)
        }).catch((err) => {
            resolve();
        })
    })
}


export default UserEducationService
