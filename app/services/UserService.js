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


UserService.getUser = ({client, username, user_id}) => {
    return new Promise((resolve, reject) => {
        const UserQuery = gql`
            query UserQuery(
                $username: String,
                $user_id: String,
            ){
                users(input:{
                    username: $username,
                    user_id: $user_id
                }) {
                    user_id
                    username
                    first_name
                    last_name
                    profile_photo_url
                    cover_photo_url
                    bio

                    user_twitter_link
                    user_clubhouse_link
                    user_instagram_link
                    user_website_link 
                    user_youtube_link
                    user_main_contact_email
                    user_main_contact_phone
                }
            }
        `;

        const variables = {
            username,
            user_id
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

UserService.editUser = ({client, user_id, bio, first_name, last_name, profile_photo_url, username, user_twitter_link, user_clubhouse_link, user_instagram_link, user_website_link, user_youtube_link, user_main_contact_email, user_main_contact_phone}) => {
    return new Promise((resolve, reject) => {
        const EditUserMutation = gql`
            mutation EditUserMutation(
                $user_id: String!,
                $first_name: String,
                $last_name: String,
                $bio: String,
                $profile_photo_url: String,
                $username: String,

                $user_twitter_link: String,
                $user_clubhouse_link: String,
                $user_instagram_link: String,
                $user_website_link: String,
                $user_youtube_link: String,
                $user_main_contact_email: String,
                $user_main_contact_phone: String,
            ){
                edit_user(input:{
                    user_id: $user_id,
                    first_name: $first_name,
                    last_name: $last_name,
                    profile_photo_url: $profile_photo_url,
                    username: $username,
                    bio: $bio,
                    user_twitter_link: $user_twitter_link,
                    user_clubhouse_link: $user_clubhouse_link,
                    user_instagram_link: $user_instagram_link,
                    user_website_link: $user_website_link,
                    user_youtube_link: $user_youtube_link,
                    user_main_contact_email: $user_main_contact_email,
                    user_main_contact_phone: $user_main_contact_phone,
                })
            }
        `;

        let variables = {
            user_id, bio, first_name, last_name, username, profile_photo_url, user_twitter_link, user_clubhouse_link, user_instagram_link, user_website_link, user_youtube_link, user_main_contact_email, user_main_contact_phone
        };

        client.mutate({mutation: EditUserMutation, variables}).then((response) => {
            resolve(response.data.edit_user)
        }).catch((err) => {
            resolve();
        })
    })
}

export default UserService
