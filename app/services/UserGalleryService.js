import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";

let UserGalleryService = {};

UserGalleryService.getUserGallery = ({client, user_id}) => {
    return new Promise((resolve, reject) => {
        const UserGalleryQuery = gql`
            query UserGalleryQuery(
                $user_id: String,
            ){
                user_galleries(input:{
                    user_id: $user_id,
                }) {
                    user_gallery_id
                    user_id

                    gallery_photo_url
                    gallery_order
                    gallery_name
                    gallery_caption
                }
            }
        `;

        const variables = {
            user_id
        };

        client.query({query: UserGalleryQuery, variables}).then((response) => {
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


export default UserGalleryService
