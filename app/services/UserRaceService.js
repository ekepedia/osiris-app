import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";

let UserRaceService = {};

UserRaceService.createUserRace = ({client, user_id, race_id}) => {
    return new Promise((resolve, reject) => {
        const NewUserRaceMutation = gql`
            mutation NewUserRaceMutation(
                $user_id: String!,
                $race_id: String!,
            ){
                add_user_race(input:{
                    user_id: $user_id,
                    race_id: $race_id,
                })
            }
        `;

        let variables = {
            user_id, race_id
        };

        client.mutate({mutation: NewUserRaceMutation, variables}).then((response) => {
            resolve(response.data.add_user_race)
        }).catch((err) => {
            resolve();
        })
    })
}

UserRaceService.removeUserRace = ({client, user_race_id}) => {
    return new Promise((resolve, reject) => {
        const RemoveUserRaceMutation = gql`
            mutation RemoveUserRaceMutation(
                $user_race_id: String!,
            ){
                remove_user_race(user_race_id: $user_race_id)
             }
        `;

        let variables = {
            user_race_id
        };

        client.mutate({mutation: RemoveUserRaceMutation, variables}).then((response) => {
            resolve(response.data.remove_user_race)
        }).catch((err) => {
            resolve();
        })
    })
}


UserRaceService.getUserRace = ({client, user_id}) => {
    return new Promise((resolve, reject) => {
        const UserRaceQuery = gql`
            query UserRaceQuery(
                $user_id: String,
            ){
                user_races(input:{
                    user_id: $user_id
                }) {
                    user_id
                    user_race_id
                    race_id
                }
            }
        `;

        const variables = {
            user_id
        };

        client.query({query: UserRaceQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.user_races && response.data.user_races.length) {
                resolve(response.data.user_races);
            } else {
                resolve(null);
            }
        }).catch((err) => {
            resolve();
        })
    });
}

export default UserRaceService
