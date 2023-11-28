import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";
import UserEducationService from "./UserEducationService";

let SavedJobService = {};

SavedJobService.getSavedJobs = ({client, saved_job_id, job_id, status_id, user_id, is_active, is_archived}) => {
    return new Promise((resolve, reject) => {
        const SavedJobsQuery = gql`
            query SavedJobsQuery(
                $saved_job_id: String,
                $job_id: String,
                $status_id: String,
                $user_id: String,
                $is_archived: Boolean,
                $is_active: Boolean,
            ){
                saved_jobs(input:{
                    saved_job_id: $saved_job_id,
                    job_id: $job_id,
                    status_id: $status_id,
                    user_id: $user_id,
                    is_archived: $is_archived
                    is_active: $is_active
                }) {
                    saved_job_id
                    job_id
                    user_id
                    status_id
                    status
                    job_salary
                    job_deadline
                    is_active
                    is_archived
                    batch_id
                    airtable_batch_id
                }
            }
        `;

        const variables = {
            saved_job_id, job_id, status_id, user_id, is_active, is_archived
        };

        client.query({query: SavedJobsQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.saved_jobs && response.data.saved_jobs.length) {
                resolve(response.data.saved_jobs)
            } else {
                resolve(null)
            }
        }).catch((err) => {
            resolve();
        })
    });
}

SavedJobService.addSavedJob = ({client, job_id, user_id, status_id, status, job_salary, job_deadline, is_active, is_archived}) => {
    return new Promise((resolve, reject) => {
        const AddSavedJobMutation = gql`
            mutation AddSavedJobMutation(
                $job_id: String,
                $user_id: String,
                $status_id: String,
                $status: String,
                $job_salary: String,
                $job_deadline: String,
                $is_archived: Boolean,
                $is_active: Boolean,
            ){
                add_saved_job(input:{
                    job_id: $job_id,
                    user_id: $user_id,
                    status_id: $status_id,
                    status: $status,
                    job_salary: $job_salary,
                    job_deadline: $job_deadline,
                    is_archived: $is_archived,
                    is_active: $is_active,
                })
            }
        `;

        let variables = {
            job_id, user_id, status_id, status, job_salary, job_deadline, is_active, is_archived
        };

        client.mutate({mutation: AddSavedJobMutation, variables}).then((response) => {
            //should this be add_user_link or add_group THISISANOPENQ
            resolve(response.data.add_user_link)
        }).catch((err) => {
            resolve();
        })
    })
}

SavedJobService.deleteSavedJob = ({client, saved_job_id}) => {
    return new Promise((resolve, reject) => {
        const RemoveSavedJobMutation = gql`
            mutation RemoveSavedJobMutation(
                $saved_job_id: String!,
            ){
                remove_saved_job(saved_job_id: $saved_job_id)
            }
        `;

        let variables = {saved_job_id};

        client.mutate({mutation: RemoveSavedJobMutation, variables}).then((response) => {
            resolve(response.data.remove_saved_job)
        }).catch((err) => {
            resolve();
        })
    })
}

SavedJobService.editSavedJob = ({client, saved_job_id, job_id, user_id, status_id, status, job_salary, job_deadline, is_active, is_archived}) => {
    return new Promise((resolve, reject) => {
        const EditSavedJobMutation = gql`
            mutation EditSavedJobMutation(
                $saved_job_id: String!
                $job_id: String,
                $user_id: String,
                $status_id: String,
                $status: String,
                $job_salary: String,
                $job_deadline: String,
                $is_archived: Boolean,
                $is_active: Boolean,
            ){
                edit_saved_job(input:{
                    saved_job_id: $saved_job_id,
                    job_id: $job_id,
                    user_id: $user_id,
                    status_id: $status_id,
                    status: $status,
                    job_salary: $job_salary,
                    job_deadline: $job_deadline,
                    is_archived: $is_archived,
                    is_active: $is_active,
                })
            }
        `;

        let variables = {
            saved_job_id, job_id, user_id, status_id, status, job_salary, job_deadline, is_active, is_archived
        };

        client.mutate({mutation: EditSavedJobMutation, variables}).then((response) => {
            resolve(response.data.edit_saved_job)
        }).catch((err) => {
            resolve();
        })
    })
}

export default SavedJobService
