const { gql } = require('apollo-server-express');

const GroupPostResponseService = require("../services/group_post_responses/GroupPostResponseService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        group_post_responses(input: QueryGroupPostResponse): [GroupPostResponse]
    }

    extend type Mutation {
        add_group_post_response(input: CreateGroupPostResponse!): String
        edit_group_post_response(input: EditGroupPostResponse!): Boolean
        remove_group_post_response(group_post_response_id: String!): Boolean
    }

    type GroupPostResponse {
        group_post_response_id: String,
        group_post_id: String,
        user_id: String,
        user_company_while_responding_id: String,
        user_role_while_responding_id: String,
        job_id: String,
        date: String,
        
        response: String,
        
        user_is_employed_at_time_of_response: Boolean
        user_is_student_at_time_of_response: Boolean
        is_active: Boolean
        is_archived: Boolean

        batch_id: String
        airtable_batch_id: String
    }

    input CreateGroupPostResponse {
        group_post_response_id: String,
        group_post_id: String,
        user_id: String,
        user_company_while_responding_id: String,
        user_role_while_responding_id: String,
        job_id: String,
        date: String,

        response: String,

        user_is_employed_at_time_of_response: Boolean
        user_is_student_at_time_of_response: Boolean
        is_active: Boolean
        is_archived: Boolean

        batch_id: String
        airtable_batch_id: String
    }

    input EditGroupPostResponse {
        group_post_response_id: String,
        group_post_id: String,
        user_id: String,
        user_company_while_responding_id: String,
        user_role_while_responding_id: String,
        job_id: String,
        date: String,

        response: String,

        user_is_employed_at_time_of_response: Boolean
        user_is_student_at_time_of_response: Boolean
        is_active: Boolean
        is_archived: Boolean

        batch_id: String
        airtable_batch_id: String
    }

    input QueryGroupPostResponse {
        group_post_response_id: String,
        group_post_id: String,
        user_id: String,
        user_company_while_responding_id: String,
        user_role_while_responding_id: String,
        job_id: String,
        date: String,

        response: String,

        user_is_employed_at_time_of_response: Boolean
        user_is_student_at_time_of_response: Boolean
        is_active: Boolean
        is_archived: Boolean

        batch_id: String
        airtable_batch_id: String
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        group_post_responses: (_, { input }) => new Promise((res, rej) => {
            GroupPostResponseService.get_group_post_responses(input).then((group_post_responses) => {
                return res(group_post_responses);
            });
        }),
    },
    Mutation: {
        add_group_post_response: (_, {input}) => new Promise((res, rej) => {
            GroupPostResponseService.create_group_post_response(input).then( (group_post_response_id) => {
                return res(group_post_response_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_group_post_response: (_, {input}) => new Promise((res, rej) => {
            GroupPostResponseService.edit_group_post_response(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_group_post_response: (_, {group_post_response_id}) => new Promise((res, rej) => {
            GroupPostResponseService.remove_group_post_response({group_post_response_id}).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
    }
};

module.exports = {
    typeDef,
    resolver
};