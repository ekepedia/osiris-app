import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";
import UserEducationService from "./UserEducationService";

let GroupService = {};

GroupService.getGroups = ({
                                   client,
                                   group_id,
                                   is_clearbit_import,
                                   group_name,
                                   group_size,
                                   group_founded_year,
                                   group_about,
                                   group_industry_affiliation,
                                   group_company_affiliation,
                                   group_role_affiliation,
                                   group_school_affiliation,
                                   is_hidden,
                                   is_verified,
                                   batch_id,
                                   airtable_batch_id}) => {
    return new Promise((resolve, reject) => {
        const GroupsQuery = gql`
            query GroupsQuery(
                $group_id: String,
                $is_clearbit_import: Boolean,
                $group_name: String,
                $group_size: String,
                $group_founded_year: String,
                $group_about: String,
                $group_industry_affiliation: String,
                $group_company_affiliation: String,
                $group_role_affiliation: String,
                $group_school_affiliation: String,
                $is_hidden: Boolean,
                $is_verified: Boolean,
                $batch_id: String,
            ){
                groups(input:{
                    group_id: $group_id,
                    group_name: $group_name,
                    group_size: $group_size,
                    group_founded_year: $group_founded_year,
                    group_about: $group_about,
                    group_industry_affiliation: $group_industry_affiliation,
                    group_company_affiliation: $group_company_affiliation,
                    group_role_affiliation: $group_role_affiliation,
                    group_school_affiliation: $group_school_affiliation,
                    is_hidden: $is_hidden,
                    is_verified: $is_verified,
                    batch_id: $batch_id,
                    is_clearbit_import: $is_clearbit_import,
                }) {
                    group_id
                    group_name
                    group_logo_url
                    cover_photo_url
                    group_size
                    group_about
                    group_website
                    group_founded_year
                    group_industry_affiliation
                    group_company_affiliation
                    group_role_affiliation
                    group_school_affiliation
                    is_hidden
                    is_verified
                    batch_id
                    is_clearbit_import
                }
            }
        `;

        const variables = {
            group_id,
            group_name,
            group_size,
            group_founded_year,
            group_about,
            group_industry_affiliation,
            group_company_affiliation,
            group_role_affiliation,
            group_school_affiliation,
            is_hidden,
            is_verified,
            batch_id,
            is_clearbit_import: false
        };

        client.query({query: GroupsQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.groups && response.data.groups.length) {
                resolve(response.data.groups)
            } else {
                resolve(null)
            }
        }).catch((err) => {
            resolve();
        })
    });
}

//CompanyService.getJobCounts = ({}) => {
//    return new Promise((resolve, reject) => {
 //       axios.get("/api/job-counts").then((response) => {
   //         if (response && response.data && response.data.counts) {
     //           resolve(response.data.counts)
//            } else {
 //               resolve(null)
 //           }
 //       })
 //   });
//}

export default GroupService
