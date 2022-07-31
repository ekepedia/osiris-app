import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";
import UserEducationService from "./UserEducationService";

let UserLinkService = {};

UserLinkService.getUserLink = ({client, user_id, is_hidden}) => {
    return new Promise((resolve, reject) => {
        const UserLinkQuery = gql`
            query UserLinkQuery(
                $user_id: String,
                $is_hidden: Boolean,
            ){
                user_links(input:{
                    user_id: $user_id,
                    is_hidden: $is_hidden
                }) {
                    user_link_id
                    user_id
                    is_hidden

                    link_type_id
                    link_type
                    link_name
                    link_url
                    link_image_url
                    link_order
                }
            }
        `;

        const variables = {
            user_id, is_hidden
        };

        client.query({query: UserLinkQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.user_links && response.data.user_links.length) {
                resolve(response.data.user_links)
            } else {
                resolve(null)
            }
        }).catch((err) => {
            resolve();
        })
    });
}

UserLinkService.addLink = ({client, user_id, link_type, link_name, link_url, link_image_url}) => {
    return new Promise((resolve, reject) => {
        const AddUserLinkMutation = gql`
            mutation AddUserLinkMutation(
                $user_id: String,
                $link_type: String,
                $link_name: String,
                $link_url: String,
                $link_image_url: String
            ){
                add_user_link(input:{
                    user_id: $user_id,
                    link_type: $link_type,
                    link_name: $link_name,
                    link_url: $link_url,
                    link_image_url: $link_image_url,
                })
            }
        `;

        let variables = {
            user_id, link_type, link_name, link_url, link_image_url
        };

        client.mutate({mutation: AddUserLinkMutation, variables}).then((response) => {
            resolve(response.data.add_user_link)
        }).catch((err) => {
            resolve();
        })
    })
}

UserLinkService.deleteUserLink = ({client, user_link_id}) => {
    return new Promise((resolve, reject) => {
        const RemoveUserEducationMutation = gql`
            mutation RemoveUserEducationMutation(
                $user_link_id: String!,
            ){
                remove_user_link(user_link_id: $user_link_id)
            }
        `;

        let variables = {user_link_id};

        client.mutate({mutation: RemoveUserEducationMutation, variables}).then((response) => {
            resolve(response.data.remove_user_link)
        }).catch((err) => {
            resolve();
        })
    })
}


UserLinkService.editUserSmallLink = ({client, user_link_id, is_hidden, link_type, link_name, link_url, link_image_url}) => {
    return new Promise((resolve, reject) => {
        const EditUserLinkMutation = gql`
            mutation EditUserLinkMutation(
                $user_link_id: String,
                $is_hidden: Boolean,
                $link_type: String,
                $link_name: String,
                $link_url: String,
                $link_image_url: String
            ){
                edit_user_link(input:{
                    user_link_id: $user_link_id,
                    is_hidden: $is_hidden,
                    link_type: $link_type,
                    link_name: $link_name,
                    link_url: $link_url,
                    link_image_url: $link_image_url,
                })
            }
        `;

        let variables = {
            user_link_id, is_hidden, link_type, link_name, link_url, link_image_url
        };

        client.mutate({mutation: EditUserLinkMutation, variables}).then((response) => {
            resolve(response.data.edit_user_link)
        }).catch((err) => {
            resolve();
        })
    })
}

export default UserLinkService
