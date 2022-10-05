const { gql } = require('apollo-server-express');

const UserLinksService = require("../services/user_links/UserLinksService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        user_links(input: QueryUserLink): [UserLink]
    }

    extend type Mutation {
        add_user_link(input: CreateUserLinkInput!): String
        edit_user_link(input: EditUserLinkInput!): Boolean
        remove_user_link(user_link_id: String!): Boolean
    }

    type UserLink {
        user_link_id: String,
        user_id: String,
        is_hidden: Boolean,

        link_type_id: String,
        link_type: String

        link_name: String

        link_url: String
        link_image_url: String

        link_order: String
    }
    
    input CreateUserLinkInput {
        user_id: String,
        is_hidden: Boolean,

        link_type_id: String,
        link_type: String

        link_name: String

        link_url: String
        link_image_url: String

        link_order: String
    }

    input EditUserLinkInput {
        user_link_id: String,
        user_id: String,
        is_hidden: Boolean,

        link_type_id: String,
        link_type: String

        link_name: String

        link_url: String
        link_image_url: String

        link_order: String
    }
    
    input QueryUserLink {
        user_link_id: String,
        user_id: String,
        is_hidden: Boolean,

        link_type_id: String,
        link_type: String

        link_name: String

        link_url: String
        link_image_url: String

        link_order: String
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        user_links: (_, { input }) => new Promise((res, rej) => {
            UserLinksService.get_user_links(input).then((user_links) => {
                return res(user_links);
            });
        }),
    },
    Mutation: {
        add_user_link: (_, {input}) => new Promise((res, rej) => {
            UserLinksService.create_user_link(input).then( (user_link_id) => {
                return res(user_link_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_user_link: (_, {input}) => new Promise((res, rej) => {
            UserLinksService.edit_user_link(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_user_link: (_, {user_link_id}) => new Promise((res, rej) => {
            UserLinksService.remove_user_link({user_link_id}).then( () => {
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