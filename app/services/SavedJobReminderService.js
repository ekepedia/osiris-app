import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";
import UserEducationService from "./UserEducationService";

let SavedJobReminderService = {};

SavedJobReminderService.getSavedJobReminders = ({
                                                    client,
                                                    saved_job_reminder_id,
                                                    saved_job_id,
                                                    job_id,
                                                    user_id,
                                                    date_created,
                                                    date_modified,
                                                    reminder_name,
                                                    reminder_date,
                                                    is_archived,
                                                    is_completed
                                        }) => {
    return new Promise((resolve, reject) => {
        const SavedJobRemindersQuery = gql`
            query SavedJobRemindersQuery(
                $saved_job_reminder_id: String,
                $saved_job_id: String,
                $job_id: String,
                $user_id: String,
    
                $date_created: String,
                $date_modified: String,
    
                $reminder_name: String
                $reminder_date: String
    
                $is_archived: Boolean
                $is_completed: Boolean
            ){
                saved_job_reminders(input:{
                    saved_job_reminder_id: $saved_job_reminder_id,
                    saved_job_id: $saved_job_id,
                    job_id: $job_id,
                    user_id: $user_id,
                    date_created: $date_created,
                    date_modified: $date_modified,
                    reminder_name: $reminder_name,
                    reminder_date: $reminder_date,
                    is_archived: $is_archived,
                    is_completed: $is_completed
                }) {
                    saved_job_reminder_id,
                    saved_job_id,
                    job_id,
                    user_id,
                    date_created,
                    date_modified,
                    reminder_name,
                    reminder_date,
                    is_archived,
                    is_completed
                }
            }
        `;

        const variables = {
            saved_job_reminder_id,
            saved_job_id,
            job_id,
            user_id,
            date_created,
            date_modified,
            reminder_name,
            reminder_date,
            is_archived,
            is_completed
        };

        client.query({query: SavedJobRemindersQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.saved_job_reminders && response.data.saved_job_reminders.length) {
                resolve(response.data.saved_job_reminders)
            } else {
                resolve(null)
            }
        }).catch((err) => {
            resolve();
        })
    });
}

SavedJobReminderService.addSavedJobReminder = ({
                                                   client,
                                                   saved_job_reminder_id,
                                                   saved_job_id,
                                                   job_id,
                                                   user_id,
                                                   date_created,
                                                   date_modified,
                                                   reminder_name,
                                                   reminder_date,
                                                   is_archived,
                                                   is_completed
}) => {
    return new Promise((resolve, reject) => {
        const AddSavedJobReminderMutation = gql`
            mutation AddSavedJobReminderMutation(
                $saved_job_id: String,
                $job_id: String,
                $user_id: String,

                $date_created: String,
                $date_modified: String,

                $reminder_name: String
                $reminder_date: String

                $is_archived: Boolean
                $is_completed: Boolean
            ){
                add_saved_job_reminder(input:{
                    saved_job_id: $saved_job_id,
                    job_id: $job_id,
                    user_id: $user_id,
                    date_created: $date_created,
                    date_modified: $date_modified,
                    reminder_name: $reminder_name,
                    reminder_date: $reminder_date,
                    is_archived: $is_archived,
                    is_completed: $is_completed
                })
            }
        `;

        let variables = {
            saved_job_id,
            job_id,
            user_id,
            date_created,
            date_modified,
            reminder_name,
            reminder_date,
            is_archived,
            is_completed
        };

        client.mutate({mutation: AddSavedJobReminderMutation, variables}).then((response) => {
            resolve(response.data.add_saved_job_reminder)
        }).catch((err) => {
            resolve();
        })
    })
}

SavedJobReminderService.deleteSavedJobReminder = ({client, saved_job_reminder_id}) => {
    return new Promise((resolve, reject) => {
        const RemoveSavedJobReminderMutation = gql`
            mutation RemoveSavedJobMutation(
                $saved_job_reminder_id: String!,
            ){
                remove_saved_job_reminder(saved_job_reminder_id: $saved_job_reminder_id)
            }
        `;

        let variables = {saved_job_reminder_id};

        client.mutate({mutation: RemoveSavedJobReminderMutation, variables}).then((response) => {
            resolve(response.data.remove_saved_job_reminder)
        }).catch((err) => {
            resolve();
        })
    })
}

SavedJobReminderService.editSavedJobReminder = ({
                                                    client,
                                                    saved_job_reminder_id,
                                                    saved_job_id,
                                                    job_id,
                                                    user_id,
                                                    date_created,
                                                    date_modified,
                                                    reminder_name,
                                                    reminder_date,
                                                    is_archived,
                                                    is_completed
}) => {
    return new Promise((resolve, reject) => {
        const EditSavedJobReminderMutation = gql`
            mutation EditSavedJobReminderMutation(
                $saved_job_reminder_id: String!
                $saved_job_id: String,
                $job_id: String,
                $user_id: String,

                $date_created: String,
                $date_modified: String,

                $reminder_name: String
                $reminder_date: String

                $is_archived: Boolean
                $is_completed: Boolean
            ){
                edit_saved_job_reminder(input:{
                    saved_job_reminder_id: $saved_job_reminder_id,
                    saved_job_id: $saved_job_id,
                    job_id: $job_id,
                    user_id: $user_id,
                    date_created: $date_created,
                    date_modified: $date_modified,
                    reminder_name: $reminder_name,
                    reminder_date: $reminder_date,
                    is_archived: $is_archived,
                    is_completed: $is_completed
                })
            }
        `;

        let variables = {
            saved_job_reminder_id,
            saved_job_id,
            job_id,
            user_id,
            date_created,
            date_modified,
            reminder_name,
            reminder_date,
            is_archived,
            is_completed
        };

        client.mutate({mutation: EditSavedJobReminderMutation, variables}).then((response) => {
            resolve(response.data.edit_saved_job_reminder)
        }).catch((err) => {
            resolve();
        })
    })
}

export default SavedJobReminderService
