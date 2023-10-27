const { gql } = require('apollo-server-express');

const GroupService = require("../services/groups/GroupService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        groups(input: QueryGroup): [Group]
    }

    extend type Mutation {
        add_group(input: CreateGroupInput!): String
        edit_group(input: EditGroupInput!): Boolean
        remove_group(group_id: String!): Boolean
    }

    type Group {
        group_id: String,
        group_name: String,
        group_logo_url: String,
        cover_photo_url: String,
        
        group_size: String,
        group_about: String,
        group_website: String,
        group_founded_year: String,
        
        group_industry_affiliation: String,
        group_company_affiliation: String,
        group_role_affiliation: String,
        group_school_affiliation: String,

        is_hidden: Boolean,
        is_verified: Boolean,
        is_clearbit_import: Boolean,

        batch_id: String
    }

    input CreateGroupInput {
        group_id: String,
        group_name: String,
        group_logo_url: String,
        cover_photo_url: String,

        group_size: String,
        group_about: String
        group_website: String
        group_founded_year: String

        group_industry_affiliation: String
        group_company_affiliation: String
        group_role_affiliation: String
        group_school_affiliation: String

        is_hidden: Boolean
        is_verified: Boolean
        is_clearbit_import: Boolean

        batch_id: String
    }

    input EditGroupInput {
        group_id: String,
        group_name: String,
        group_logo_url: String,
        cover_photo_url: String,

        group_size: String,
        group_about: String
        group_website: String
        group_founded_year: String

        group_industry_affiliation: String
        group_company_affiliation: String
        group_role_affiliation: String
        group_school_affiliation: String

        is_hidden: Boolean
        is_verified: Boolean
        is_clearbit_import: Boolean

        batch_id: String
    }

    input QueryGroup {
        group_id: String,
        group_name: String,
        group_logo_url: String,
        cover_photo_url: String,

        group_size: String,
        group_about: String
        group_website: String
        group_founded_year: String

        group_industry_affiliation: String
        group_company_affiliation: String
        group_role_affiliation: String
        group_school_affiliation: String

        is_hidden: Boolean
        is_verified: Boolean
        is_clearbit_import: Boolean

        batch_id: String
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        groups: (_, { input }) => new Promise((res, rej) => {
            GroupsService.get_groups(input).then((groups) => {
                return res(groups);
            });
        }),
    },
    Mutation: {
        add_group: (_, {input}) => new Promise((res, rej) => {
            GroupService.create_group(input).then( (group_id) => {
                return res(group_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_group: (_, {input}) => new Promise((res, rej) => {
            GroupService.edit_group(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_group: (_, {group_id}) => new Promise((res, rej) => {
            GroupService.remove_group({group_id}).then( () => {
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