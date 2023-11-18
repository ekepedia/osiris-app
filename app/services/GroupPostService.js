import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";
import UserEducationService from "./UserEducationService";

let GroupPostService = {};

GroupPostService.getGroupPosts = ({
                                      client,
                                      post_id,
                                      group_id,
                                      poster_id,
                                      post_date,
                                      owner_id,

                                      type_id,
                                      subject,
                                      description,

                                      is_shareable,
}) => {
    return new Promise((resolve, reject) => {
        const GroupPostsQuery = gql`
            query GroupPostsQuery(
                $post_id: String,
                $group_id: String,
                $poster_id: String,
                $post_date: String,
                $owner_id: String,
                $type_id: String,
                $subject: String,
                $description: String,
                $is_shareable: Boolean,
            ){
                group_posts(input:{
                    post_id: $post_id,
                    group_id: $group_id,
                    poster_id: $poster_id,
                    post_date: $post_date,
                    owner_id: $owner_id,
                    type_id: $type_id,
                    subject: $subject,
                    description: $description,
                    is_shareable: $is_shareable
                }) {
                    post_id
                    group_id
                    poster_id
                    post_date
                    owner_id
                    type_id
                    subject
                    description
                    is_shareable
                }
            }
        `;

        const variables = {
            client,
            post_id,
            group_id,
            poster_id,
            post_date,
            owner_id,
            type_id,
            subject,
            description,
            is_shareable,
        };

        client.query({query: GroupPostsQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.group_posts && response.data.group_posts.length) {
                resolve(response.data.saved_jobs)
            } else {
                resolve(null)
            }
        }).catch((err) => {
            resolve();
        })
    });
}

GroupPostService.createGroupPost = ({
                                        client,
                                        post_id,
                                        group_id,
                                        poster_id,
                                        post_date,
                                        owner_id,
                                        type_id,
                                        subject,
                                        description,
                                        is_shareable,
}) => {
    return new Promise((resolve, reject) => {
        const CreateGroupPostMutation = gql`
            mutation CreateGroupPostMutation(
                $post_id: String,
                $group_id: String,
                $poster_id: String,
                $post_date: String,
                $owner_id: String,
                $type_id: String,
                $subject: String,
                $description: String,
                $is_shareable: Boolean,
            ){
                add_post(input:{
                    post_id: $post_id,
                    group_id: $group_id,
                    poster_id: $poster_id,
                    post_date: $post_date,
                    owner_id: $owner_id,
                    type_id: $type_id,
                    subject: $subject,
                    description: $description,
                    is_shareable: $is_shareable
                })
            }
        `;

        let variables = {
            client,
            post_id,
            group_id,
            poster_id,
            post_date,
            owner_id,
            type_id,
            subject,
            description,
            is_shareable,
        };

        client.mutate({mutation: CreateGroupPostMutation, variables}).then((response) => {
            resolve(response.data.add_post)
        }).catch((err) => {
            resolve();
        })
    })
}

GroupPostService.deleteGroupPost = ({
                                        client,
                                        post_id,
}) => {
    return new Promise((resolve, reject) => {
        const DeleteGroupPostMutation = gql`
            mutation DeleteGroupPost(
                $post_id: String!,
            ){
                remove_post(post_id: $post_id)
            }
        `;

        let variables = {post_id};

        client.mutate({mutation: DeleteGroupPostMutation, variables}).then((response) => {
            resolve(response.data.remove_post)
        }).catch((err) => {
            resolve();
        })
    })
}

GroupPostService.editGroupPost = ({
                                      client,
                                      post_id,
                                      group_id,
                                      poster_id,
                                      post_date,
                                      owner_id,
                                      type_id,
                                      subject,
                                      description,
                                      is_shareable,
}) => {
    return new Promise((resolve, reject) => {
        const EditGroupPostMutation = gql`
            mutation EditGroupPostMutation(
                $post_id: String,
                $group_id: String,
                $poster_id: String,
                $post_date: String,
                $owner_id: String,
                $type_id: String,
                $subject: String,
                $description: String,
                $is_shareable: Boolean,
            ){
                edit_post(input:{
                    post_id: $post_id,
                    group_id: $group_id,
                    poster_id: $poster_id,
                    post_date: $post_date,
                    owner_id: $owner_id,
                    type_id: $type_id,
                    subject: $subject,
                    description: $description,
                    is_shareable: $is_shareable
                })
            }
        `;

        let variables = {
            client,
            post_id,
            group_id,
            poster_id,
            post_date,
            owner_id,
            type_id,
            subject,
            description,
            is_shareable,
        };

        client.mutate({mutation: EditGroupPostMutation, variables}).then((response) => {
            resolve(response.data.edit_post)
        }).catch((err) => {
            resolve();
        })
    })
}

export default GroupPostService
