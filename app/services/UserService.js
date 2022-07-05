import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";

let UserService = {};

UserService.createUser = ({client, first_name, last_name, username}) => {
    return new Promise((resolve, reject) => {
        const NewUserMutation = gql`
            mutation NewUserMutation(
                $first_name: String,
                $last_name: String,
                $username: String,
            ){
                add_user(input:{
                    first_name: $first_name,
                    last_name: $last_name,
                    username: $username,
                })
            }
        `;

        let variables = {
            first_name, last_name, username
        };

        client.mutate({mutation: NewUserMutation, variables}).then((response) => {
            resolve(response.data.add_user)
        }).catch((err) => {
            resolve();
        })
    })
}


UserService.getUser = ({client, username}) => {
    return new Promise((resolve, reject) => {
        const UserQuery = gql`
            query UserQuery(
                $username: String,
            ){
                users(input:{
                    username: $username,
                }) {
                    user_id
                    username
                    first_name
                    last_name
                    profile_photo_url
                    cover_photo_url
                    bio
                }
            }
        `;

        const variables = {
            username
        };

        client.query({query: UserQuery, variables}).then((response) => {
            if (response && response.data && response.data.users && response.data.users.length) {
                resolve(response.data.users[0])
            } else {
                resolve(null)
            }
        }).catch((err) => {
            resolve();
        })
    });
}

UserService.editUser = ({client, user_id, first_name, last_name, username}) => {
    return new Promise((resolve, reject) => {
        const EditUserMutation = gql`
            mutation EditUserMutation(
                $user_id: String!,
                $first_name: String,
                $last_name: String,
                $username: String,
            ){
                edit_user(input:{
                    user_id: $user_id,
                    first_name: $first_name,
                    last_name: $last_name,
                    username: $username,
                })
            }
        `;

        let variables = {
            user_id, first_name, last_name, username
        };

        client.mutate({mutation: EditUserMutation, variables}).then((response) => {
            resolve(response.data.edit_user)
        }).catch((err) => {
            resolve();
        })
    })
}

export default UserService
