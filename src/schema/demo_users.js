const { gql } = require('apollo-server-express');

const DemoUserService = require("../services/demo_users/DemoUserService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        demo_users(input: QueryDemoUser): [DemoUser]
    }

    extend type Mutation {
        add_demo_user(input: CreateDemoUserInput!): String
        edit_demo_user(input: EditDemoUserInput!): Boolean
        remove_demo_user(user_id: String!): Boolean
    }

    type DemoUser {
        user_id: String!,

        email_address: String,
        password: String,
        phone_number: String,
        gender: String,
        sexual_orientation: String

        first_name: String

        last_name: String
        instagram: String,
        linkedin: String,
    }
    
    input CreateDemoUserInput {
        email_address: String,
        password: String,
        phone_number: String,
        gender: String,
        sexual_orientation: String

        first_name: String

        last_name: String
        instagram: String,
        linkedin: String,
    }

    input EditDemoUserInput {
        user_id: String!,

        email_address: String,
        password: String,
        phone_number: String,
        gender: String,
        sexual_orientation: String

        first_name: String

        last_name: String
        instagram: String,
        linkedin: String,
    }
    
    input QueryDemoUser {
        user_id: String,
        email_address: String
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        demo_users: (_, { input }) => new Promise((res, rej) => {
            DemoUserService.get_demo_users(input).then((demo_users) => {
                return res(demo_users);
            });
        }),
    },
    Mutation: {
        add_demo_user: (_, {input}) => new Promise((res, rej) => {
            DemoUserService.create_demo_user(input).then( (user_id) => {
                return res(user_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_demo_user: (_, {input}) => new Promise((res, rej) => {
            DemoUserService.edit_demo_user(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_demo_user: (_, {user_id}) => new Promise((res, rej) => {
            DemoUserService.remove_demo_user({user_id}).then( () => {
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