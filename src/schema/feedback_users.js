const { gql } = require('apollo-server-express');

const DemoUserService = require("../services/demo_users/DemoUserService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        feedback_users(input: QueryFeedbackUser): [FeedbackUser]
    }

    extend type Mutation {
        add_feedback_user(input: CreateFeedbackUserInput!): String
        edit_feedback_user(input: EditFeedbackUserInput!): Boolean
        remove_feedback_user(feedback_id: String!): Boolean
    }

    type FeedbackUser {
        feedback_id: String!,


        is_native: String,
        is_asian: String,
        is_black: String,
        is_hispanic: String,
        is_middle_eastern: String,
        is_hawaiian: String,
        is_white: String,
        is_not_respond: String,

        question_1: String,
        question_2: String,
        question_3: String,
        question_4: String,
        question_5: String,

        wants_mentors: String,
        wants_peers: String,
        wants_internships: String,
        wants_jobs: String,
        wants_other: String,
        other: String,

        heard_seo: String,
        heard_mlt: String,
        heard_jopwell: String,
        heard_valence: String,
        heard_yc: String,
        heard_elpha: String,
        heard_lh: String,

        school_1: String,
        school_2: String,
        school_3: String,
        school_4: String,
        school_5: String,

        city: String,
        

        stage: String,
        
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
    
    input CreateFeedbackUserInput {
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

    input EditFeedbackUserInput {
        feedback_id: String!,

        is_native: String,
        is_asian: String,
        is_black: String,
        is_hispanic: String,
        is_middle_eastern: String,
        is_hawaiian: String,
        is_white: String,
        is_not_respond: String,

        question_1: String,
        question_2: String,
        question_3: String,
        question_4: String,
        question_5: String,

        wants_mentors: String,
        wants_peers: String,
        wants_internships: String,
        wants_jobs: String,
        wants_other: String,
        other: String,

        heard_seo: String,
        heard_mlt: String,
        heard_jopwell: String,
        heard_valence: String,
        heard_yc: String,
        heard_elpha: String,
        heard_lh: String,

        school_1: String,
        school_2: String,
        school_3: String,
        school_4: String,
        school_5: String,

        city: String,

        stage: String,

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
    
    input QueryFeedbackUser {
        feedback_id: String,
        email_address: String
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        feedback_users: (_, { input }) => new Promise((res, rej) => {
            DemoUserService.get_feedback_users(input).then((demo_feedbacks) => {
                return res(demo_feedbacks);
            });
        }),
    },
    Mutation: {
        add_feedback_user: (_, {input}) => new Promise((res, rej) => {
            DemoUserService.create_feedback_user(input).then( (feedback_id) => {
                return res(feedback_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_feedback_user: (_, {input}) => new Promise((res, rej) => {
            DemoUserService.edit_feedback_user(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_feedback_user: (_, {feedback_id}) => new Promise((res, rej) => {
            DemoUserService.remove_feedback_user({feedback_id}).then( () => {
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