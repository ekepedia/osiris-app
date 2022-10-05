const { gql } = require('apollo-server-express');

const SavedJobReminderService = require("../services/saved_jobs_reminders/SavedJobReminderService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        saved_job_reminders(input: QuerySavedJobReminder): [SavedJobReminder]
    }

    extend type Mutation {
        add_saved_job_reminder(input: CreateSavedJobReminderInput!): String
        edit_saved_job_reminder(input: EditSavedJobReminderInput!): Boolean
        remove_saved_job_reminder(saved_job_reminder_id: String!): Boolean
    }

    type SavedJobReminder {
        saved_job_reminder_id: String,
        saved_job_id: String,
        job_id: String,
        user_id: String,

        date_created: String,
        date_modified: String,

        reminder_name: String
        reminder_date: String

        is_archived: Boolean
        is_completed: Boolean
    }
    
    input CreateSavedJobReminderInput {
        saved_job_id: String,
        job_id: String,
        user_id: String,

        date_created: String,
        date_modified: String,

        reminder_name: String
        reminder_date: String

        is_archived: Boolean
        is_completed: Boolean
    }

    input EditSavedJobReminderInput {
        saved_job_reminder_id: String!
        saved_job_id: String,
        job_id: String,
        user_id: String,

        date_created: String,
        date_modified: String,

        reminder_name: String
        reminder_date: String

        is_archived: Boolean
        is_completed: Boolean
    }
    
    input QuerySavedJobReminder {
        saved_job_reminder_id: String
        saved_job_id: String
        job_id: String
        user_id: String

        date_created: String
        date_modified: String

        reminder_name: String
        reminder_date: String

        is_archived: Boolean
        is_completed: Boolean
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        saved_job_reminders: (_, { input }) => new Promise((res, rej) => {
            SavedJobReminderService.get_saved_job_reminders(input).then((saved_job_notes) => {
                return res(saved_job_notes);
            });
        }),
    },
    Mutation: {
        add_saved_job_reminder: (_, {input}) => new Promise((res, rej) => {
            SavedJobReminderService.create_saved_job_reminder(input).then( (saved_job_reminder_id) => {
                return res(saved_job_reminder_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_saved_job_reminder: (_, {input}) => new Promise((res, rej) => {
            SavedJobReminderService.edit_saved_job_reminder(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_saved_job_reminder: (_, {saved_job_reminder_id}) => new Promise((res, rej) => {
            SavedJobReminderService.remove_saved_job_reminder({saved_job_reminder_id}).then( () => {
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