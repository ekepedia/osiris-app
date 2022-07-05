const { gql } = require('apollo-server-express');

const UserExperienceService = require("../services/user_experiences/UserExperienceService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        user_experiences(input: QueryUserExperience): [UserExperience]
    }

    extend type Mutation {
        add_user_experience(input: CreateUserExperienceInput!): String
        edit_user_experience(input: EditUserExperienceInput!): Boolean
    }

    type UserExperience {
        user_experience_id: String,
        user_id: String,

        company_id: String,
        company_name: String
        company_logo_url: String

        role_id: String
        role_name: String

        type: String
        type_id: String

        description: String

        is_current: Boolean

        start_date: String
        end_date: String

        date_verified: String
        date_created: String
        date_updated: String
    }
    
    input CreateUserExperienceInput {
        user_id: String!

        company_id: String,
        company_name: String
        company_logo_url: String

        role_id: String
        role_name: String

        type: String
        type_id: String

        description: String

        is_current: Boolean

        start_date: String
        end_date: String

        date_verified: String
        date_created: String
        date_updated: String
    }

    input EditUserExperienceInput {
        user_experience_id: String,
        user_id: String,

        company_id: String,
        company_name: String
        company_logo_url: String

        role_id: String
        role_name: String

        type: String
        type_id: String

        description: String

        is_current: Boolean

        start_date: String
        end_date: String

        date_verified: String
        date_created: String
        date_updated: String
    }
    
    input QueryUserExperience {
        user_experience_id: String,
        user_id: String,

        company_id: String,
        company_name: String
        company_logo_url: String

        role_id: String
        role_name: String

        type: String
        type_id: String

        description: String

        is_current: Boolean

        start_date: String
        end_date: String

        date_verified: String
        date_created: String
        date_updated: String
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        user_experiences: (_, { input }) => new Promise((res, rej) => {
            UserExperienceService.get_user_experiences(input).then((user_experiences) => {
                return res(user_experiences);
            });
        }),
    },
    Mutation: {
        add_user_experience: (_, {input}) => new Promise((res, rej) => {
            UserExperienceService.create_user_experience(input).then( (user_experience_id) => {
                return res(user_experience_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_user_experience: (_, {input}) => new Promise((res, rej) => {
            UserExperienceService.edit_user_experience(input).then( () => {
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