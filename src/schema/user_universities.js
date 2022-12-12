const { gql } = require('apollo-server-express');

const UserUniversityService = require("../services/user_universities/UserUniversityService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        user_universities(input: QueryUserUniversity): [UserUniversity]
    }

    extend type Mutation {
        add_user_university(input: CreateUserUniversityInput!): String
        edit_user_university(input: EditUserUniversityInput!): Boolean
        remove_user_university(user_university_id: String!): Boolean
    }

    type UserUniversity {
        user_university_id: String,
        user_id: String,
        university_id: String,
    }
    
    input CreateUserUniversityInput {
        user_id: String!,
        university_id: String!,
    }

    input EditUserUniversityInput {
        user_university_id: String,
        university_id: String,
    }
    
    input QueryUserUniversity {
        user_id: String,
        university_id: String,
        user_university_id: String
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        user_universities: (_, { input }) => new Promise((res, rej) => {
            UserUniversityService.get_user_universities(input).then((user_races) => {
                return res(user_races);
            });
        }),
    },
    Mutation: {
        add_user_university: (_, {input}) => new Promise((res, rej) => {
            UserUniversityService.create_user_universities(input).then( (user_university_id) => {
                return res(user_university_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_user_university: (_, {input}) => new Promise((res, rej) => {
            UserUniversityService.edit_user_universities(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_user_university: (_, {user_university_id}) => new Promise((res, rej) => {
            UserUniversityService.remove_user_universities({user_university_id}).then( () => {
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