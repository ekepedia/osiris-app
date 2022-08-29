import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";
import UserEducationService from "./UserEducationService";

let SavedJobNoteService = {};

SavedJobNoteService.getSavedJobNotes = ({
                                            client,
                                            saved_job_note_id,
                                            saved_job_id,
                                            job_id,
                                            user_id,
                                            date_created,
                                            date_modified,
                                            note_title,
                                            note_body,
                                            note_html,
                                            is_archived,
                                        }) => {
    return new Promise((resolve, reject) => {
        const SavedJobNotesQuery = gql`
            query SavedJobNotesQuery(
                $saved_job_note_id: String,
                $saved_job_id: String,
                $job_id: String,
                $user_id: String,

                $date_created: String,
                $date_modified: String,

                $note_title: String
                $note_body: String
                $note_html: String

                $is_archived: Boolean
            ){
                saved_job_notes(input:{
                    saved_job_note_id: $saved_job_note_id,
                    saved_job_id: $saved_job_id,
                    job_id: $job_id,
                    user_id: $user_id,

                    date_created: $date_created,
                    date_modified: $date_modified,

                    note_title: $note_title
                    note_body: $note_body
                    note_html: $note_html

                    is_archived: $is_archived
                }) {
                    saved_job_note_id,
                    saved_job_id,
                    job_id,
                    user_id,
                    date_created,
                    date_modified,
                    note_title,
                    note_body,
                    note_html,
                    is_archived
                }
            }
        `;

        const variables = {
            saved_job_note_id,
            saved_job_id,
            job_id,
            user_id,
            date_created,
            date_modified,
            note_title,
            note_body,
            note_html,
            is_archived
        };

        client.query({query: SavedJobNotesQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.saved_job_notes && response.data.saved_job_notes.length) {
                resolve(response.data.saved_job_notes)
            } else {
                resolve(null)
            }
        }).catch((err) => {
            resolve();
        })
    });
}

SavedJobNoteService.addSavedJobNote = ({
                                           client,
                                           saved_job_note_id,
                                           saved_job_id,
                                           job_id,
                                           user_id,
                                           date_created,
                                           date_modified,
                                           note_title,
                                           note_body,
                                           note_html,
                                           is_archived,
}) => {
    return new Promise((resolve, reject) => {
        const AddSavedJobNoteMutation = gql`
            mutation AddSavedJobNoteMutation(
                $saved_job_id: String,
                $job_id: String,
                $user_id: String,

                $date_created: String,
                $date_modified: String,

                $note_title: String
                $note_body: String
                $note_html: String

                $is_archived: Boolean
            ){
                add_saved_job_note(input:{
                    saved_job_id: $saved_job_id,
                    job_id: $job_id,
                    user_id: $user_id,

                    date_created: $date_created,
                    date_modified: $date_modified,

                    note_title: $note_title
                    note_body: $note_body
                    note_html: $note_html

                    is_archived: $is_archived
                })
            }
        `;

        let variables = {
            saved_job_id,
            job_id,
            user_id,
            date_created,
            date_modified,
            note_title,
            note_body,
            note_html,
            is_archived,
        };

        client.mutate({mutation: AddSavedJobNoteMutation, variables}).then((response) => {
            resolve(response.data.add_saved_job_note)
        }).catch((err) => {
            resolve();
        })
    })
}

SavedJobNoteService.deleteSavedJobNote = ({client, saved_job_note_id}) => {
    return new Promise((resolve, reject) => {
        const RemoveSavedJobNoteMutation = gql`
            mutation RemoveSavedJobMutation(
                $saved_job_note_id: String!,
            ){
                remove_saved_job_note(saved_job_note_id: $saved_job_note_id)
            }
        `;

        let variables = {saved_job_note_id};

        client.mutate({mutation: RemoveSavedJobNoteMutation, variables}).then((response) => {
            resolve(response.data.remove_saved_job_note)
        }).catch((err) => {
            resolve();
        })
    })
}

SavedJobNoteService.editSavedJobNote = ({
                                            client,
                                            saved_job_note_id,
                                            saved_job_id,
                                            job_id,
                                            user_id,
                                            date_created,
                                            date_modified,
                                            note_title,
                                            note_body,
                                            note_html,
                                            is_archived,
}) => {
    return new Promise((resolve, reject) => {
        const EditSavedJobNoteMutation = gql`
            mutation EditSavedJobNoteMutation(
                $saved_job_note_id: String!
                $saved_job_id: String
                $job_id: String,
                $user_id: String,

                $date_created: String,
                $date_modified: String,

                $note_title: String
                $note_body: String
                $note_html: String

                $is_archived: Boolean
            ){
                edit_saved_job_note(input:{
                    saved_job_note_id: $saved_job_note_id,
                    saved_job_id: $saved_job_id,
                    job_id: $job_id,
                    user_id: $user_id,

                    date_created: $date_created,
                    date_modified: $date_modified,

                    note_title: $note_title
                    note_body: $note_body
                    note_html: $note_html

                    is_archived: $is_archived
                })
            }
        `;

        let variables = {
            saved_job_note_id,
            saved_job_id,
            job_id,
            user_id,
            date_created,
            date_modified,
            note_title,
            note_body,
            note_html,
            is_archived,
        };

        client.mutate({mutation: EditSavedJobNoteMutation, variables}).then((response) => {
            resolve(response.data.edit_saved_job_note)
        }).catch((err) => {
            resolve();
        })
    })
}

export default SavedJobNoteService
