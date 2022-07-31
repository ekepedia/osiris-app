const { gql } = require('apollo-server-express');

const UserEducationService = require("../services/user_educations/UserEducationService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        user_educations(input: QueryUserEducation): [UserEducation]
    }

    extend type Mutation {
        add_user_education(input: CreateUserEducationInput!): String
        edit_user_education(input: EditUserEducationInput!): Boolean
        remove_user_education(user_education_id: String!): Boolean
    }

    type UserEducation {
        user_education_id: String,
        user_id: String,
        is_hidden: Boolean,

        school_id: String,
        school_name: String
        school_logo_url: String
        degree_id: String
        degree_name: String

        field_of_study_id: String
        field_of_study_name: String

        start_date: String
        end_date: String

        is_currently_enrolled: Boolean
        verified: Boolean

        date_verified: String
        date_created: String
        date_updated: String
    }
    
    input CreateUserEducationInput {
        user_id: String!
        is_hidden: Boolean,

        school_id: String,
        school_name: String
        school_logo_url: String
        degree_id: String
        degree_name: String

        field_of_study_id: String
        field_of_study_name: String

        start_date: String
        end_date: String

        is_currently_enrolled: Boolean
        verified: Boolean

        date_verified: String
        date_created: String
        date_updated: String
    }

    input EditUserEducationInput {
        user_education_id: String!
        user_id: String,
        is_hidden: Boolean,

        school_id: String,
        school_name: String
        school_logo_url: String
        degree_id: String
        degree_name: String

        field_of_study_id: String
        field_of_study_name: String

        start_date: String
        end_date: String

        is_currently_enrolled: Boolean
        verified: Boolean

        date_verified: String
        date_created: String
        date_updated: String
    }
    
    input QueryUserEducation {
        user_education_id: String,
        user_id: String,
        is_hidden: Boolean,

        school_id: String,
        school_name: String
        school_logo_url: String
        degree_id: String
        degree_name: String

        field_of_study_id: String
        field_of_study_name: String

        start_date: String
        end_date: String

        is_currently_enrolled: Boolean
        verified: Boolean

        date_verified: String
        date_created: String
        date_updated: String
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        user_educations: (_, { input }) => new Promise((res, rej) => {
            UserEducationService.get_user_educations(input).then((user_educations) => {
                return res(user_educations);
            });
        }),
    },
    Mutation: {
        add_user_education: (_, {input}) => new Promise((res, rej) => {
            UserEducationService.create_user_education(input).then( (user_education_id) => {
                return res(user_education_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_user_education: (_, {input}) => new Promise((res, rej) => {
            UserEducationService.edit_user_education(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_user_education: (_, {user_education_id}) => new Promise((res, rej) => {
            UserEducationService.remove_user_education({user_education_id}).then( () => {
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