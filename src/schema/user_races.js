const { gql } = require('apollo-server-express');

const UserRaceService = require("../services/user_races/UserRaceService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        user_races(input: QueryUserRace): [UserRace]
    }

    extend type Mutation {
        add_user_race(input: CreateUserRaceInput!): String
        edit_user_race(input: EditUserRaceInput!): Boolean
        remove_user_race(user_race_id: String!): Boolean
    }

    type UserRace {
        user_race_id: String,
        user_id: String,
        race_id: String,
    }
    
    input CreateUserRaceInput {
        user_id: String!,
        race_id: String!,
    }

    input EditUserRaceInput {
        user_race_id: String,
        race_id: String,
    }
    
    input QueryUserRace {
        user_id: String,
        race_id: String,
        user_race_id: String
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        user_races: (_, { input }) => new Promise((res, rej) => {
            UserRaceService.get_user_races(input).then((user_races) => {
                return res(user_races);
            });
        }),
    },
    Mutation: {
        add_user_race: (_, {input}) => new Promise((res, rej) => {
            UserRaceService.create_user_races(input).then( (user_race_id) => {
                return res(user_race_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_user_race: (_, {input}) => new Promise((res, rej) => {
            UserRaceService.edit_user_races(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_user_race: (_, {user_race_id}) => new Promise((res, rej) => {
            UserRaceService.remove_user_race({user_race_id}).then( () => {
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