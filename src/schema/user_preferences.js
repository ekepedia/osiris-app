const { gql } = require('apollo-server-express');

const UserPreferenceService = require("../services/user_preferences/UserPreferenceService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        user_preferences(input: QueryUserPreference): [UserPreference]
    }

    extend type Mutation {
        add_user_preference(input: CreateUserPreferenceInput!): String
        edit_user_preference(input: EditUserPreferenceInput!): Boolean
        remove_user_preference(user_preference_id: String!): Boolean
    }

    type UserPreference {
        user_preference_id: String,
        user_id: String,
        type_id: String,
        preference_id: String,
        order: String,
        preference_value: String,
    }
    
    input CreateUserPreferenceInput {
        user_id: String!,
        type_id: String!,
        preference_id: String!,
        order: String,
        preference_value: String,
    }

    input EditUserPreferenceInput {
        user_preference_id: String,
        user_id: String,
        type_id: String,
        preference_id: String,
        order: String,
        preference_value: String,
    }
    
    input QueryUserPreference {
        user_preference_id: String,
        user_id: String,
        type_id: String,
        preference_id: String,
        order: String,
        preference_value: String,
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        user_preferences: (_, { input }) => new Promise((res, rej) => {
            UserPreferenceService.get_user_preferences(input).then((user_preferences) => {
                console.log("RE", user_preferences)
                return res(user_preferences);
            });
        }),
    },
    Mutation: {
        add_user_preference: (_, {input}) => new Promise((res, rej) => {
            UserPreferenceService.create_user_preference(input).then( (user_preference_id) => {
                return res(user_preference_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_user_preference: (_, {input}) => new Promise((res, rej) => {
            UserPreferenceService.edit_user_preference(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_user_preference: (_, {user_preference_id}) => new Promise((res, rej) => {
            UserPreferenceService.remove_user_preference({user_preference_id}).then( () => {
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