import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";
import UserEducationService from "./UserEducationService";

let UserLinkService = {};

UserLinkService.getUserLink = ({client, user_id}) => {
    return new Promise((resolve, reject) => {
        const UserLinkQuery = gql`
            query UserLinkQuery(
                $user_id: String,
            ){
                user_links(input:{
                    user_id: $user_id,
                }) {
                    user_link_id
                    user_id
                    
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
            user_id
        };

        client.query({query: UserLinkQuery, variables}).then((response) => {
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

export default UserLinkService
