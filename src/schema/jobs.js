const { gql } = require('apollo-server-express');

const JobService = require("../services/jobs/JobService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        jobs(input: QueryJob): [Job]
        jobs_by_ids(input: [String]): [Job]
    }

    extend type Mutation {
        add_job(input: CreateJobInput!): String
        edit_job(input: EditJobInput!): Boolean
        remove_job(job_id: String!): Boolean
    }

    type Job {
        job_id: String,
        airtable_job_id: String,
        
        company_id: String,
        user_id: String,
        date_created: String,
        date_created_label: String,

        apply_link: String,
        job_salary_estimate: String,
        company_name: String,

        job_deadline: String,
        job_type: [String],
        
        job_sectors: [String],
        job_locations: [String],
        job_degree_requirements:[String],

        job_title: String,
        job_overview: String
        job_qualifications: String
        job_responsibilities: String

        submitted_by_id: String

        diverse_candidates: Boolean
        is_active: Boolean
        is_verified: Boolean
        is_user_submitted: Boolean
        is_public: Boolean


        job_html: String
        job_seniority: String
        job_board_category: String
        job_source: String

        batch_id: String
        airtable_batch_id: String
    }
    
    input CreateJobInput {
        airtable_job_id: String,

        company_id: String,
        user_id: String,
        date_created: String,
        date_created_label: String,

        apply_link: String,
        job_salary_estimate: String,
        company_name: String,

        job_title: String,
        job_overview: String
        job_qualifications: String
        job_responsibilities: String

        submitted_by_id: String

        is_active: Boolean
        is_verified: Boolean
        is_user_submitted: Boolean
        is_public: Boolean

        batch_id: String
        airtable_batch_id: String
    }

    input EditJobInput {
        job_id: String!
        airtable_job_id: String,

        company_id: String,
        user_id: String,
        date_created: String,
        date_created_label: String,

        apply_link: String,
        job_salary_estimate: String,
        company_name: String,

        job_title: String,
        job_overview: String
        job_qualifications: String
        job_responsibilities: String

        submitted_by_id: String

        is_active: Boolean
        is_verified: Boolean
        is_user_submitted: Boolean
        is_public: Boolean

        batch_id: String
        airtable_batch_id: String
    }
    
    input QueryJob {
        job_id: String,
        airtable_job_id: String,

        company_id: String,
        user_id: String,
        date_created: String,
        date_created_label: String,

        apply_link: String,
        job_salary_estimate: String,
        company_name: String,

        job_title: String,
        job_overview: String
        job_qualifications: String
        job_responsibilities: String

        submitted_by_id: String

        is_active: Boolean
        is_verified: Boolean
        is_user_submitted: Boolean
        is_public: Boolean

        batch_id: String
        airtable_batch_id: String
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        jobs: (_, { input }) => new Promise((res, rej) => {
            JobService.get_jobs(input).then((jobs) => {
                return res(jobs);
            });
        }),
        jobs_by_ids: (_, { input }) => new Promise((res, rej) => {
            JobService.get_jobs_by_ids({jobs_ids: input}).then((jobs) => {
                return res(jobs);
            });
        }),
    },
    Mutation: {
        add_job: (_, {input}) => new Promise((res, rej) => {
            JobService.create_job(input).then( (job_id) => {
                return res(job_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_job: (_, {input}) => new Promise((res, rej) => {
            JobService.edit_job(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_job: (_, {job_id}) => new Promise((res, rej) => {
            JobService.remove_job({job_id}).then( () => {
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