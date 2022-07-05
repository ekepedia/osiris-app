import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";

let UserExperienceService = {};

UserExperienceService.getUserExperiences = ({client, user_id}) => {
    return new Promise((resolve, reject) => {
        const UserExperienceQuery = gql`
            query UserExperienceQuery(
                $user_id: String,
            ){
                user_experiences(input:{
                    user_id: $user_id,
                }) {
                    user_experience_id
                    user_id

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
            user_id
        };

        client.query({query: UserExperienceQuery, variables}).then((response) => {
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


export default UserExperienceService
