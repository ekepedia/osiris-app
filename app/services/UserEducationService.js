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

        client.query({query: UserEducationQuery, variables}).then((response) => {
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


export default UserEducationService
