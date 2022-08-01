import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";

let UserGalleryService = {};

UserGalleryService.addUserGallery = ({client, user_id, gallery_photo_url, gallery_order, gallery_name, gallery_caption}) => {
    return new Promise((resolve, reject) => {
        const AddUserGalleryMutation = gql`
            mutation AddUserGalleryMutation(
                $user_id: String,
                $gallery_caption: String,
                $gallery_name: String,
                $gallery_order: Int,
                $gallery_photo_url: String
            ){
                add_user_gallery(input:{
                    user_id: $user_id,
                    gallery_caption: $gallery_caption,
                    gallery_name: $gallery_name,
                    gallery_order: $gallery_order,
                    gallery_photo_url: $gallery_photo_url,
                })
            }
        `;

        let variables = {
            user_id, gallery_photo_url, gallery_order, gallery_name, gallery_caption
        };

        client.mutate({mutation: AddUserGalleryMutation, variables}).then((response) => {
            resolve(response.data.add_user_gallery)
        }).catch((err) => {
            resolve();
        })
    })
}

UserGalleryService.editUserGallery = ({client, user_gallery_id, is_hidden, gallery_photo_url, gallery_order, gallery_name, gallery_caption}) => {
    return new Promise((resolve, reject) => {
        const EditUserGalleryMutation = gql`
            mutation EditUserGalleryMutation(
                $user_gallery_id: String!,
                $gallery_caption: String,
                $gallery_name: String,
                $gallery_order: Int,
                $gallery_photo_url: String,
                $is_hidden: Boolean
            ){
                edit_user_gallery(input:{
                    user_gallery_id: $user_gallery_id,
                    gallery_caption: $gallery_caption,
                    gallery_name: $gallery_name,
                    gallery_order: $gallery_order,
                    gallery_photo_url: $gallery_photo_url,
                    is_hidden: $is_hidden
                })
            }
        `;

        let variables = {
            user_gallery_id, is_hidden, gallery_photo_url, gallery_order, gallery_name, gallery_caption
        };

        client.mutate({mutation: EditUserGalleryMutation, variables}).then((response) => {
            resolve(response.data.edit_user_gallery)
        }).catch((err) => {
            resolve();
        })
    })
}

UserGalleryService.getUserGallery = ({client, user_id, is_hidden}) => {
    return new Promise((resolve, reject) => {
        const UserGalleryQuery = gql`
            query UserGalleryQuery(
                $user_id: String,
                $is_hidden: Boolean,
            ){
                user_galleries(input:{
                    user_id: $user_id,
                    is_hidden: $is_hidden,
                }) {
                    user_gallery_id
                    user_id
                    is_hidden

                    gallery_photo_url
                    gallery_order
                    gallery_name
                    gallery_caption
                }
            }
        `;

        const variables = {
            user_id,
            is_hidden
        };

        client.query({query: UserGalleryQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.user_galleries && response.data.user_galleries.length) {
                resolve(response.data.user_galleries)
            } else {
                resolve(null)
            }
        }).catch((err) => {
            resolve();
        })
    });
}

UserGalleryService.removeUserGallery = ({client, user_gallery_id}) => {
    return new Promise((resolve, reject) => {
        const RemoveUserGalleryMutation = gql`
            mutation RemoveUserGalleryMutation(
                $user_gallery_id: String!
            ){
                remove_user_gallery(user_gallery_id: $user_gallery_id)
            }
        `;

        let variables = {
            user_gallery_id
        };

        client.mutate({mutation: RemoveUserGalleryMutation, variables}).then((response) => {
            resolve(response.data.remove_user_gallery)
        }).catch((err) => {
            resolve();
        })
    })
}

export default UserGalleryService
