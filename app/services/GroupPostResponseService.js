import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";
import UserEducationService from "./UserEducationService";
import GroupMemberService from "./GroupMemberService";

let GroupPostResponseService = {};

GroupPostResponseService.getGroupPostResponses = ({
                              client,
                              group_post_response_id,
                              group_post_id,
                              user_id,
                              user_company_while_responding_id,
                              user_role_while_responding_id,
                              job_id,
                              date,

                              response,

                              user_is_employed_at_time_of_response,
                              user_is_student_at_time_of_response,
                              is_active,
                              is_archived,

                              batch_id,
                              airtable_batch_id,
                          }) => {
    return new Promise((resolve, reject) => {
        const GroupPostResponsesQuery = gql`
            query GroupPostResponsesQuery(
                    $group_post_response_id: String,
                    $group_post_id: String,
                    $user_id: String,
                    $user_company_while_responding_id: String,
                    $user_role_while_responding_id: String,
                    $job_id: String,
                    $date: String,
        
                    $response: String,
        
                    $user_is_employed_at_time_of_response: Boolean
                    $user_is_student_at_time_of_response: Boolean
                    $is_active: Boolean
                    $is_archived: Boolean
        
                    $batch_id: String
                    $airtable_batch_id: String
            ){
                group_post_responses(input:{
                    group_post_response_id: $group_post_response_id,
                    group_post_id: $group_post_id,
                    user_id: $user_id,
                    user_company_while_responding_id: $user_company_while_responding_id,
                    user_role_while_responding_id: $user_role_while_responding_id,
                    job_id: $job_id,
                    date: $date,

                    response: $response,

                    user_is_employed_at_time_of_response: $user_is_employed_at_time_of_response,
                    user_is_student_at_time_of_response: $user_is_student_at_time_of_response,
                    is_active: $is_active,
                    is_archived: $is_archived,

                    batch_id: $batch_id,
                    airtable_batch_id: $airtable_batch_id,
                }) {
                    group_post_response_id,
                    group_post_id,
                    user_id,
                    user_company_while_responding_id,
                    user_role_while_responding_id,
                    job_id,
                    date,

                    response,

                    user_is_employed_at_time_of_response,
                    user_is_student_at_time_of_response,
                    is_active,
                    is_archived,

                    batch_id,
                    airtable_batch_id,
                }
            }
        `;

        const variables = {
            client,
            group_post_response_id,
            group_post_id,
            user_id,
            user_company_while_responding_id,
            user_role_while_responding_id,
            job_id,
            date,

            response,

            user_is_employed_at_time_of_response,
            user_is_student_at_time_of_response,
            is_active,
            is_archived,

            batch_id,
            airtable_batch_id,
        };

        client.query({query: GroupPostResponsesQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.group_post_responses && response.data.group_post_responses.length) {
                resolve(response.data.group_post_responses)
            } else {
                resolve(null)
            }
        }).catch((err) => {
            resolve();
        })
    });
}

GroupPostResponseService.addGroupPostResponse = ({
                             client,
                             group_post_response_id,
                             group_post_id,
                             user_id,
                             user_company_while_responding_id,
                             user_role_while_responding_id,
                             job_id,
                             date,

                             response,

                             user_is_employed_at_time_of_response,
                             user_is_student_at_time_of_response,
                             is_active,
                             is_archived,

                             batch_id,
                             airtable_batch_id,
                         }
) => {
    return new Promise((resolve, reject) => {
        const CreateGroupPostResponseMutation = gql`
            mutation CreateGroupPostResponseMutation(
                $group_post_response_id: String,
                $group_post_id: String,
                $user_id: String,
                $user_company_while_responding_id: String,
                $user_role_while_responding_id: String,
                $job_id: String,
                $date: String,

                $response: String,

                $user_is_employed_at_time_of_response: Boolean
                $user_is_student_at_time_of_response: Boolean
                $is_active: Boolean
                $is_archived: Boolean

                $batch_id: String
                $airtable_batch_id: String

            ){
                add_group_post_response(input:{
                    group_post_response_id: $group_post_response_id,
                    group_post_id: $group_post_id,
                    user_id: $user_id,
                    user_company_while_responding_id: $user_company_while_responding_id,
                    user_role_while_responding_id: $user_role_while_responding_id,
                    job_id: $job_id,
                    date: $date,

                    response: $response,

                    user_is_employed_at_time_of_response: $user_is_employed_at_time_of_response,
                    user_is_student_at_time_of_response: $user_is_student_at_time_of_response,
                    is_active: $is_active,
                    is_archived: $is_archived,

                    batch_id: $batch_id,
                    airtable_batch_id: $airtable_batch_id,
                })
            }
        `;

        let variables = {
            client, group_post_response_id, group_post_id, user_id, user_company_while_responding_id, user_role_while_responding_id, job_id, date, response, user_is_employed_at_time_of_response, user_is_student_at_time_of_response, is_active, is_archived, batch_id, airtable_batch_id,
        };

        client.mutate({mutation: CreateGroupPostResponseMutation, variables}).then((response) => {
            resolve(response.data.add_group_post_response)
        }).catch((err) => {
            resolve();
        })
    })
}

GroupPostResponseService.removeGroupPostResponse = ({client, group_post_response_id, user_id}) => {
    return new Promise((resolve, reject) => {
        const RemoveGroupPostResponseMutation = gql`
            mutation RemoveGroupPostResponseMutation(
                $group_post_response_id: String!,
            ){
                remove_group_post_response(group_post_response_id: $group_post_response_id)
            }
        `;

        let variables = {
            group_post_response_id
        };

        client.mutate({mutation: RemoveGroupPostResponseMutation, variables}).then((response) => {
            resolve(response.data.remove_group_post_response)
        }).catch((err) => {
            resolve();
        })
    })
}

GroupPostResponseService.editGroupPostResponse = ({
                                  client,
                                  group_post_response_id,
                                  group_post_id,
                                  user_id,
                                  user_company_while_responding_id,
                                  user_role_while_responding_id,
                                  job_id,
                                  date,

                                  response,

                                  user_is_employed_at_time_of_response,
                                  user_is_student_at_time_of_response,
                                  is_active,
                                  is_archived,

                                  batch_id,
                                  airtable_batch_id,
                          }
) => {
    return new Promise((resolve, reject) => {
        const EditGroupPostResponseMutation = gql`
            mutation EditGroupPostResponseMutation(
                $group_post_response_id: String,
                $group_post_id: String,
                $user_id: String,
                $user_company_while_responding_id: String,
                $user_role_while_responding_id: String,
                $job_id: String,
                $date: String,

                $response: String,

                $user_is_employed_at_time_of_response: Boolean
                $user_is_student_at_time_of_response: Boolean
                $is_active: Boolean
                $is_archived: Boolean

                $batch_id: String
                $airtable_batch_id: String

            ){
                edit_group_post_response(input:{
                    group_post_response_id: $group_post_response_id,
                    group_post_id: $group_post_id,
                    user_id: $user_id,
                    user_company_while_responding_id: $user_company_while_responding_id,
                    user_role_while_responding_id: $user_role_while_responding_id,
                    job_id: $job_id,
                    date: $date,

                    response: $response,

                    user_is_employed_at_time_of_response: $user_is_employed_at_time_of_response,
                    user_is_student_at_time_of_response: $user_is_student_at_time_of_response,
                    is_active: $is_active,
                    is_archived: $is_archived,

                    batch_id: $batch_id,
                    airtable_batch_id: $airtable_batch_id,
                })
            }
        `;

        let variables = {
            client, group_post_response_id, group_post_id, user_id, user_company_while_responding_id, user_role_while_responding_id, job_id, date, response, user_is_employed_at_time_of_response, user_is_student_at_time_of_response, is_active, is_archived, batch_id, airtable_batch_id,
        };

        client.mutate({mutation: EditGroupPostResponseMutation, variables}).then((response) => {
            resolve(response.data.edit_group_post_response)
        }).catch((err) => {
            resolve();
        })
    })
}

export default GroupPostResponseService
