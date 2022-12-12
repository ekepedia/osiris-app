import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";

let UserPreferenceService = {};

UserPreferenceService.createUserPreference = ({client, user_id, type_id, preference_id}) => {
    return new Promise((resolve, reject) => {
        const NewUserPreferenceMutation = gql`
            mutation NewUserPreferenceMutation(
                $user_id: String!,
                $type_id: String!,
                $preference_id: String!,
            ){
                add_user_preference(input:{
                    user_id: $user_id,
                    type_id: $type_id,
                    preference_id: $preference_id,
                })
            }
        `;

        let variables = {
            user_id, preference_id, type_id
        };

        client.mutate({mutation: NewUserPreferenceMutation, variables}).then((response) => {
            resolve(response.data.add_user_preference)
        }).catch((err) => {
            resolve();
        })
    })
}

UserPreferenceService.removeUserPreference = ({client, user_preference_id}) => {
    return new Promise((resolve, reject) => {
        const RemoveUserPreferenceMutation = gql`
            mutation RemoveUserPreferenceMutation(
                $user_preference_id: String!,
            ){
                remove_user_preference(user_preference_id: $user_preference_id)
             }
        `;

        let variables = {
            user_preference_id
        };

        client.mutate({mutation: RemoveUserPreferenceMutation, variables}).then((response) => {
            resolve(response.data.remove_user_preference)
        }).catch((err) => {
            resolve();
        })
    })
}

UserPreferenceService.getUserPreference = ({client, user_id, type_id}) => {
    return new Promise((resolve, reject) => {
        const UserPreferenceQuery = gql`
            query UserPreferenceQuery(
                $user_id: String,
                $type_id: String,
            ){
                user_preferences(input:{
                    user_id: $user_id,
                    type_id: $type_id,
                }) {
                    user_id
                    type_id
                    preference_id
                    preference_value
                    user_preference_id
                }
            }
        `;

        const variables = {
            user_id, type_id
        };

        client.query({query: UserPreferenceQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.user_preferences && response.data.user_preferences.length) {
                resolve(response.data.user_preferences);
            } else {
                resolve(null);
            }
        }).catch((err) => {
            resolve();
        })
    });
}

export default UserPreferenceService
