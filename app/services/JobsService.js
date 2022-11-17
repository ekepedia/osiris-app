import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";
import UserEducationService from "./UserEducationService";
import SavedJobService from "./SavedJobService";

let JobsService = {};

JobsService.getJobs = ({
                           client,
                           job_id,
                           airtable_job_id,
                           company_id,
                           company_name,
                           user_id,
                           date_created,
                           date_created_label,
                           apply_link,
                           job_salary_estimate,
                           job_title,
                           job_overview,
                           job_qualifications,
                           job_responsibilities,
                           submitted_by_id,
                           is_verified,
                           is_active,
                           is_user_submitted,
                           job_html,
                           job_seniority,
                           job_board_category,
                           job_source,
                           is_public,
                           batch_id,
                           airtable_batch_id
                                   }) => {
    return new Promise((resolve, reject) => {
        const JobsQuery = gql`
            query JobsQuery(
                $job_id: String,
                $airtable_job_id: String,
                $company_id: String,
                $company_name: String,
                $user_id: String,
                $date_created: String,
                $date_created_label: String,
                $apply_link: String,
                $job_salary_estimate: String,
                $job_title: String,
                $job_overview: String,
                $job_qualifications: String,
                $job_responsibilities: String,
                $submitted_by_id: String,
                $is_verified: Boolean,
                $is_active: Boolean,
                $is_user_submitted: Boolean,
                $is_public: Boolean,
                $batch_id: String,
                $airtable_batch_id: String,
            ){
                jobs(input:{
                    job_id: $job_id
                    airtable_job_id: $airtable_job_id
                    company_id: $company_id
                    company_name: $company_name
                    user_id: $user_id
                    date_created: $date_created
                    date_created_label: $date_created_label
                    apply_link: $apply_link
                    job_salary_estimate: $job_salary_estimate
                    job_title: $job_title
                    job_overview: $job_overview
                    job_qualifications: $job_qualifications
                    job_responsibilities: $job_responsibilities
                    submitted_by_id: $submitted_by_id
                    is_verified: $is_verified
                    is_active: $is_active
                    is_user_submitted: $is_user_submitted
                    is_public: $is_public
                    batch_id: $batch_id
                    airtable_batch_id: $airtable_batch_id
                }) {
                    job_id,
                    airtable_job_id,
                    company_id,
                    company_name,
                    user_id,
                    date_created,
                    date_created_label,
                    apply_link,
                    job_salary_estimate,
                    job_title,
                    job_overview,
                    job_qualifications,
                    job_responsibilities,
                    submitted_by_id,
                    is_verified,
                    is_active,
                    is_user_submitted,
                    is_public,
                    job_html,
                    job_seniority,
                    job_board_category,
                    job_source,
                    batch_id,
                    airtable_batch_id
                }
            }
        `;

        const variables = {
            job_id,
            airtable_job_id,
            company_id,
            company_name,
            user_id,
            date_created,
            date_created_label,
            apply_link,
            job_salary_estimate,
            job_title,
            job_overview,
            job_qualifications,
            job_responsibilities,
            submitted_by_id,
            is_verified,
            is_active,
            is_user_submitted,
            is_public,
            batch_id,
            airtable_batch_id
        };

        client.query({query: JobsQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.jobs && response.data.jobs.length) {
                resolve(response.data.jobs)
            } else {
                resolve(null)
            }
        }).catch((err) => {
            resolve();
        })
    });
}

JobsService.addJob = ({
                          client,
                          job_id,
                          airtable_job_id,
                          company_id,
                          company_name,
                          user_id,
                          date_created,
                          date_created_label,
                          apply_link,
                          job_salary_estimate,
                          job_title,
                          job_overview,
                          job_qualifications,
                          job_responsibilities,
                          submitted_by_id,
                          is_verified,
                          is_active,
                          is_user_submitted,
                          is_public,
                          batch_id,
                          airtable_batch_id
                      }) => {
    return new Promise((resolve, reject) => {
        const AddJobMutation = gql`
            mutation AddJobMutation(
                $airtable_job_id: String,
                $company_id: String,
                $company_name: String,
                $user_id: String,
                $date_created: String,
                $date_created_label: String,
                $apply_link: String,
                $job_salary_estimate: String,
                $job_title: String,
                $job_overview: String,
                $job_qualifications: String,
                $job_responsibilities: String,
                $submitted_by_id: String,
                $is_verified: Boolean,
                $is_active: Boolean,
                $is_user_submitted: Boolean,
                $is_public: Boolean,
                $batch_id: String,
                $airtable_batch_id: String,
            ){
                add_job(input:{
                    airtable_job_id: $airtable_job_id
                    company_id: $company_id
                    company_name: $company_name
                    user_id: $user_id
                    date_created: $date_created
                    date_created_label: $date_created_label
                    apply_link: $apply_link
                    job_salary_estimate: $job_salary_estimate
                    job_title: $job_title
                    job_overview: $job_overview
                    job_qualifications: $job_qualifications
                    job_responsibilities: $job_responsibilities
                    submitted_by_id: $submitted_by_id
                    is_verified: $is_verified
                    is_active: $is_active
                    is_user_submitted: $is_user_submitted
                    is_public: $is_public
                    batch_id: $batch_id
                    airtable_batch_id: $airtable_batch_id
                })
            }
        `;

        let variables = {
            job_id,
            airtable_job_id,
            company_id,
            company_name,
            user_id,
            date_created,
            date_created_label,
            apply_link,
            job_salary_estimate,
            job_title,
            job_overview,
            job_qualifications,
            job_responsibilities,
            submitted_by_id,
            is_verified,
            is_active,
            is_user_submitted,
            is_public,
            batch_id,
            airtable_batch_id
        };

        client.mutate({mutation: AddJobMutation, variables}).then((response) => {
            resolve(response.data.add_job)
        }).catch((err) => {
            resolve();
        })
    })
}

JobsService.editJob = ({
                          client,
                          job_id,
                          airtable_job_id,
                          company_id,
                          company_name,
                          user_id,
                          date_created,
                          date_created_label,
                          apply_link,
                          job_salary_estimate,
                          job_title,
                          job_overview,
                          job_qualifications,
                          job_responsibilities,
                          submitted_by_id,
                          is_verified,
                          is_active,
                          is_user_submitted,
                          is_public,
                          batch_id,
                          airtable_batch_id
                      }) => {
    return new Promise((resolve, reject) => {
        const EditJobMutation = gql`
            mutation EditJobMutation(
                $job_id: String!,
                $airtable_job_id: String,
                $company_id: String,
                $company_name: String,
                $user_id: String,
                $date_created: String,
                $date_created_label: String,
                $apply_link: String,
                $job_salary_estimate: String,
                $job_title: String,
                $job_overview: String,
                $job_qualifications: String,
                $job_responsibilities: String,
                $submitted_by_id: String,
                $is_verified: Boolean,
                $is_active: Boolean,
                $is_user_submitted: Boolean,
                $is_public: Boolean,
                $batch_id: String,
                $airtable_batch_id: String,
            ){
                edit_job(input:{
                    job_id: $job_id
                    airtable_job_id: $airtable_job_id
                    company_id: $company_id
                    company_name: $company_name
                    user_id: $user_id
                    date_created: $date_created
                    date_created_label: $date_created_label
                    apply_link: $apply_link
                    job_salary_estimate: $job_salary_estimate
                    job_title: $job_title
                    job_overview: $job_overview
                    job_qualifications: $job_qualifications
                    job_responsibilities: $job_responsibilities
                    submitted_by_id: $submitted_by_id
                    is_verified: $is_verified
                    is_active: $is_active
                    is_user_submitted: $is_user_submitted
                    is_public: $is_public
                    batch_id: $batch_id
                    airtable_batch_id: $airtable_batch_id
                })
            }
        `;

        let variables = {
            job_id,
            airtable_job_id,
            company_id,
            company_name,
            user_id,
            date_created,
            date_created_label,
            apply_link,
            job_salary_estimate,
            job_title,
            job_overview,
            job_qualifications,
            job_responsibilities,
            submitted_by_id,
            is_verified,
            is_active,
            is_user_submitted,
            is_public,
            batch_id,
            airtable_batch_id
        };

        client.mutate({mutation: EditJobMutation, variables}).then((response) => {
            resolve(response.data.edit_job)
        }).catch((err) => {
            resolve();
        })
    })
}


export default JobsService
