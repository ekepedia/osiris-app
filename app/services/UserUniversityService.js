import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";

let UserUniversityService = {};

UserUniversityService.createUserUniversity = ({client, user_id, university_id}) => {
    return new Promise((resolve, reject) => {
        const NewUserUniversityMutation = gql`
            mutation NewUserUniversityMutation(
                $user_id: String!,
                $university_id: String!,
            ){
                add_user_university(input:{
                    user_id: $user_id,
                    university_id: $university_id,
                })
            }
        `;

        let variables = {
            user_id, university_id
        };

        client.mutate({mutation: NewUserUniversityMutation, variables}).then((response) => {
            resolve(response.data.add_user_university)
        }).catch((err) => {
            resolve();
        })
    })
}

UserUniversityService.removeUserUniversity = ({client, user_university_id}) => {
    return new Promise((resolve, reject) => {
        const RemoveUserUniversityMutation = gql`
            mutation RemoveUserUniversityMutation(
                $user_university_id: String!,
            ){
                remove_user_university(user_university_id: $user_university_id)
             }
        `;

        let variables = {
            user_university_id
        };

        client.mutate({mutation: RemoveUserUniversityMutation, variables}).then((response) => {
            resolve(response.data.remove_user_university)
        }).catch((err) => {
            resolve();
        })
    })
}


UserUniversityService.getUserUniversity = ({client, user_id}) => {
    return new Promise((resolve, reject) => {
        const UserUniversityQuery = gql`
            query UserUniversityQuery(
                $user_id: String,
            ){
                user_universities(input:{
                    user_id: $user_id
                }) {
                    user_id
                    user_university_id
                    university_id
                }
            }
        `;

        const variables = {
            user_id
        };

        client.query({query: UserUniversityQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.user_universities && response.data.user_universities.length) {
                resolve(response.data.user_universities);
            } else {
                resolve(null);
            }
        }).catch((err) => {
            resolve();
        })
    });
}

export default UserUniversityService
