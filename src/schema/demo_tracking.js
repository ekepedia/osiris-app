const { gql } = require('apollo-server-express');

const DemoTrackingService = require("../services/demo_tracking/DemoTrackingService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        demo_trackings(input: QueryDemoTracking): [DemoTracking]
    }

    extend type Mutation {
        add_demo_tracking(input: CreateDemoTrackingInput!): String
        edit_demo_tracking(input: EditDemoTrackingInput!): Boolean
        remove_demo_tracking(tracking_id: String!): Boolean
    }

    type DemoTracking {
        tracking_id: String!,

        user_id: String,
        type: String,
        version: String,
        timestamp: String,

        custom_1: String,
        custom_2: String,
        custom_3: String,
        custom_4: String,
        custom_5: String,
        custom_6: String,
        custom_7: String,
        custom_8: String,
        custom_9: String,
        custom_10: String,
    }
    
    input CreateDemoTrackingInput {
        user_id: String,
        type: String,
        version: String,
        timestamp: String,

        custom_1: String,
        custom_2: String,
        custom_3: String,
        custom_4: String,
        custom_5: String,
        custom_6: String,
        custom_7: String,
        custom_8: String,
        custom_9: String,
        custom_10: String,
    }

    input EditDemoTrackingInput {
        tracking_id: String!,

        user_id: String,
        type: String,
        version: String,
        timestamp: String,

        custom_1: String,
        custom_2: String,
        custom_3: String,
        custom_4: String,
        custom_5: String,
        custom_6: String,
        custom_7: String,
        custom_8: String,
        custom_9: String,
        custom_10: String,
    }
    
    input QueryDemoTracking {
        user_id: String,
        tracking_id: String
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        demo_trackings: (_, { input }) => new Promise((res, rej) => {
            DemoTrackingService.get_demo_trackings(input).then((demo_trackings) => {
                return res(demo_trackings);
            });
        }),
    },
    Mutation: {
        add_demo_tracking: (_, {input}) => new Promise((res, rej) => {
            DemoTrackingService.create_demo_tracking(input).then( (tracking_id) => {
                return res(tracking_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_demo_tracking: (_, {input}) => new Promise((res, rej) => {
            DemoTrackingService.edit_demo_tracking(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_demo_tracking: (_, {tracking_id}) => new Promise((res, rej) => {
            DemoTrackingService.remove_demo_tracking({tracking_id}).then( () => {
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