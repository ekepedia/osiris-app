const { gql } = require('apollo-server-express');

const GroupPostService = require("../services/group_posts/GroupPostService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        group_posts(input: QueryGroupPosts): [GroupPosts]
    }

    extend type Mutation {
        add_post(input: CreateGroupPostInput!): String
        edit_post(input: EditGroupPostInput!): Boolean
        remove_post(post_id: String!): Boolean
    }

    type GroupPosts {
        post_id: String,
        group_id: String,
        poster_id: String,
        post_date: String,
        owner_id: String,
        
        type_id: String,
        subject: String,
        description: String,
        
        is_shareable: Boolean,
    }

    input CreateGroupPostInput {
        post_id: String,
        group_id: String,
        poster_id: String,
        post_date: String,
        owner_id: String,

        type_id: String,
        subject: String,
        description: String,

        is_shareable: Boolean,
    }

    input EditGroupPostInput {
        post_id: String,
        group_id: String,
        poster_id: String,
        post_date: String,
        owner_id: String,

        type_id: String,
        subject: String,
        description: String,

        is_shareable: Boolean,
    }

    input QueryGroupPosts {
        post_id: String,
        group_id: String,
        poster_id: String,
        post_date: String,
        owner_id: String,

        type_id: String,
        subject: String,
        description: String,

        is_shareable: Boolean,
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        group_posts: (_, { input }) => new Promise((res, rej) => {
            GroupPostService.get_group_posts(input).then((group_posts) => {
                return res(group_posts);
            });
        }),
    },
    Mutation: {
        add_post: (_, {input}) => new Promise((res, rej) => {
            GroupPostService.create_group_post(input).then( (post_id) => {
                return res(post_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_group: (_, {input}) => new Promise((res, rej) => {
            GroupPostService.edit_group_post(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_group: (_, {group_id}) => new Promise((res, rej) => {
            GroupPostService.remove_group_post({group_id}).then( () => {
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