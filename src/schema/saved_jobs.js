const { gql } = require('apollo-server-express');

const SavedJobService = require("../services/saved_jobs/SavedJobService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        saved_jobs(input: QuerySavedJob): [SavedJob]
    }

    extend type Mutation {
        add_saved_job(input: CreateSavedJobInput!): String
        edit_saved_job(input: EditSavedJobInput!): Boolean
        remove_saved_job(saved_job_id: String!): Boolean
    }

    type SavedJob {
        saved_job_id: String,
        job_id: String,
        user_id: String,
        status_id: String,
        status: String,

        job_salary: String,
        job_deadline: String,

        is_active: Boolean
        is_archived: Boolean

        batch_id: String
        airtable_batch_id: String
    }
    
    input CreateSavedJobInput {
        job_id: String,
        user_id: String,
        status_id: String,
        status: String,

        job_salary: String,
        job_deadline: String,

        is_active: Boolean
        is_archived: Boolean

        batch_id: String
        airtable_batch_id: String
    }

    input EditSavedJobInput {
        saved_job_id: String!
        job_id: String,
        user_id: String,
        status_id: String,
        status: String,

        job_salary: String,
        job_deadline: String,

        is_active: Boolean
        is_archived: Boolean

        batch_id: String
        airtable_batch_id: String
    }
    
    input QuerySavedJob {
        saved_job_id: String,
        job_id: String,
        user_id: String,
        status_id: String,
        status: String,
        
        job_salary: String,
        job_deadline: String,
        
        is_active: Boolean
        is_archived: Boolean

        batch_id: String
        airtable_batch_id: String
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        saved_jobs: (_, { input }) => new Promise((res, rej) => {
            SavedJobService.get_saved_jobs(input).then((saved_jobs) => {
                return res(saved_jobs);
            });
        }),
    },
    Mutation: {
        add_saved_job: (_, {input}) => new Promise((res, rej) => {
            SavedJobService.create_saved_job(input).then( (job_id) => {
                console.log("did get here jobs", input);
                return res(job_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_saved_job: (_, {input}) => new Promise((res, rej) => {
            SavedJobService.edit_saved_job(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_saved_job: (_, {saved_job_id}) => new Promise((res, rej) => {
            SavedJobService.remove_saved_job({saved_job_id}).then( () => {
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