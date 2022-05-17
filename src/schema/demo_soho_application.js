const { gql } = require('apollo-server-express');

const DemoSohoApplicationService = require("../services/demo_soho_application/DemoSohoApplicationService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        demo_soho_applications(input: QueryDemoSohoApplication): [DemoSohoApplication]
    }

    extend type Mutation {
        add_demo_demo_soho_application(input: CreateDemoSohoApplicationInput!): String
        edit_demo_soho_application(input: EditDemoSohoApplicationInput!): Boolean
        remove_demo_soho_application(application_id: String!): Boolean
    }

    type DemoSohoApplication {
        application_id: String!,

        user_id: String,

        startup_name: String,
        startup_location: String,
        startup_focus: String,
        startup_website: String,
        startup_instagram: String,
        startup_funding: String,
        startup_employees: String,

        deck_url: String,
        elevator_pitch: String,
        essay_1: String,
        essay_2: String,

        elevator_pitch_tags_1: String,
        elevator_pitch_tags_2: String,
        elevator_pitch_tags_3: String,
        essay_1_tags_1: String,
        essay_1_tags_2: String,
        essay_1_tags_3: String,
        essay_2_tags_1: String,
        essay_2_tags_2: String,
        essay_2_tags_3: String,

        date_created: String,
        date_submitted: String,
        submitted: String,
        has_co_founders: String,
        is_incorporated: String,
        incorporation_structure: String,
    }
    
    input CreateDemoSohoApplicationInput {
        user_id: String,

        startup_name: String,
        startup_location: String,
        startup_focus: String,
        startup_website: String,
        startup_instagram: String,
        startup_funding: String,
        startup_employees: String,

        deck_url: String,
        elevator_pitch: String,
        essay_1: String,
        essay_2: String,

        elevator_pitch_tags_1: String,
        elevator_pitch_tags_2: String,
        elevator_pitch_tags_3: String,
        essay_1_tags_1: String,
        essay_1_tags_2: String,
        essay_1_tags_3: String,
        essay_2_tags_1: String,
        essay_2_tags_2: String,
        essay_2_tags_3: String,

        date_created: String,
        date_submitted: String,
        submitted: String,
        has_co_founders: String,
        is_incorporated: String,
        incorporation_structure: String,
    }

    input EditDemoSohoApplicationInput {
        application_id: String!,

        user_id: String,

        startup_name: String,
        startup_location: String,
        startup_focus: String,
        startup_website: String,
        startup_instagram: String,
        startup_funding: String,
        startup_employees: String,

        deck_url: String,
        elevator_pitch: String,
        essay_1: String,
        essay_2: String,

        elevator_pitch_tags_1: String,
        elevator_pitch_tags_2: String,
        elevator_pitch_tags_3: String,
        essay_1_tags_1: String,
        essay_1_tags_2: String,
        essay_1_tags_3: String,
        essay_2_tags_1: String,
        essay_2_tags_2: String,
        essay_2_tags_3: String,

        date_created: String,
        date_submitted: String,
        submitted: String,
        has_co_founders: String,
        is_incorporated: String,
        incorporation_structure: String,
    }
    
    input QueryDemoSohoApplication {
        user_id: String,
        application_id: String
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        demo_soho_applications: (_, { input }) => new Promise((res, rej) => {
            DemoSohoApplicationService.get_demo_soho_applications(input).then((demo_soho_applications) => {
                return res(demo_soho_applications);
            });
        }),
    },
    Mutation: {
        add_demo_demo_soho_application: (_, {input}) => new Promise((res, rej) => {
            DemoSohoApplicationService.create_demo_soho_application(input).then( (application_id) => {
                return res(application_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_demo_soho_application: (_, {input}) => new Promise((res, rej) => {
            DemoSohoApplicationService.edit_demo_soho_application(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_demo_soho_application: (_, {application_id}) => new Promise((res, rej) => {
            DemoSohoApplicationService.remove_soho_application({application_id}).then( () => {
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