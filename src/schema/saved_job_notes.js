const { gql } = require('apollo-server-express');

const SavedJobNoteService = require("../services/saved_jobs_notes/SavedJobNoteService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        saved_job_notes(input: QuerySavedJobNote): [SavedJobNote]
    }

    extend type Mutation {
        add_saved_job_note(input: CreateSavedJobNoteInput!): String
        edit_saved_job_note(input: EditSavedJobNoteInput!): Boolean
        remove_saved_job_note(saved_job_note_id: String!): Boolean
    }

    type SavedJobNote {
        saved_job_note_id: String,
        saved_job_id: String,
        job_id: String,
        user_id: String,

        date_created: String,
        date_modified: String,

        note_title: String
        note_body: String
        note_html: String

        is_archived: Boolean
    }
    
    input CreateSavedJobNoteInput {
        saved_job_id: String,
        job_id: String,
        user_id: String,

        date_created: String,
        date_modified: String,

        note_title: String
        note_body: String
        note_html: String

        is_archived: Boolean
    }

    input EditSavedJobNoteInput {
        saved_job_note_id: String!
        saved_job_id: String,
        job_id: String,
        user_id: String,

        date_created: String,
        date_modified: String,

        note_title: String
        note_body: String
        note_html: String

        is_archived: Boolean
    }
    
    input QuerySavedJobNote {
        saved_job_note_id: String,
        saved_job_id: String,
        job_id: String,
        user_id: String,

        date_created: String,
        date_modified: String,

        note_title: String
        note_body: String
        note_html: String

        is_archived: Boolean
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        saved_job_notes: (_, { input }) => new Promise((res, rej) => {
            SavedJobNoteService.get_saved_job_notes(input).then((saved_job_notes) => {
                return res(saved_job_notes);
            });
        }),
    },
    Mutation: {
        add_saved_job_note: (_, {input}) => new Promise((res, rej) => {
            SavedJobNoteService.create_saved_job_note(input).then( (saved_job_note_id) => {
                return res(saved_job_note_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_saved_job_note: (_, {input}) => new Promise((res, rej) => {
            SavedJobNoteService.edit_saved_job_note(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_saved_job_note: (_, {saved_job_note_id}) => new Promise((res, rej) => {
            SavedJobNoteService.remove_saved_job_note({saved_job_note_id}).then( () => {
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