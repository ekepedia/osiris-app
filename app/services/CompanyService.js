import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";
import UserEducationService from "./UserEducationService";

let CompanyService = {};

CompanyService.getCompanies = ({
                                   client,
                                   company_id,
                                   is_clearbit_import,
                                   company_name,
                                   company_size,
                                   company_founded_year,
                                   company_city,
                                   company_city_id,
                                   company_city_lower,
                                   company_state,
                                   company_state_id,
                                   company_state_lower,
                                   company_zip_code,
                                   is_hidden,
                                   is_verified,
                                   batch_id,
                                   airtable_batch_id}) => {
    return new Promise((resolve, reject) => {
        const CompaniesQuery = gql`
            query CompaniesQuery(
                $company_id: String,
                $company_name: String,
                $company_size: String,
                $company_founded_year: String,
                $company_city: String,
                $company_city_id: String,
                $company_city_lower: String,
                $company_state: String,
                $company_state_id: String,
                $company_state_lower: String,
                $company_zip_code: String,
                $is_hidden: Boolean,
                $is_verified: Boolean,
                $batch_id: String,
                $airtable_batch_id: String,
                $is_clearbit_import: Boolean,
            ){
                companies(input:{
                    company_id: $company_id,
                    company_name: $company_name,
                    company_size: $company_size,
                    company_founded_year: $company_founded_year,
                    company_city: $company_city,
                    company_city_id: $company_city_id,
                    company_city_lower: $company_city_lower,
                    company_state: $company_state,
                    company_state_id: $company_state_id,
                    company_state_lower: $company_state_lower,
                    company_zip_code: $company_zip_code,
                    is_hidden: $is_hidden,
                    is_verified: $is_verified,
                    batch_id: $batch_id,
                    airtable_batch_id: $airtable_batch_id,
                    is_clearbit_import: $is_clearbit_import,
                }) {
                    company_id
                    airtable_company_id
                    company_name
                    company_logo_url
                    company_size
                    company_about
                    company_website
                    company_founded_year
                    company_address_1
                    company_address_2
                    company_city
                    company_city_id
                    company_state
                    company_state_id
                    company_zip_code
                    is_hidden
                    is_verified
                    batch_id
                    airtable_batch_id
                    is_clearbit_import
                    company_industry
                    company_industry_group
                }
            }
        `;

        const variables = {
            company_id,
            company_name,
            company_size,
            company_founded_year,
            company_city,
            company_city_id,
            company_city_lower,
            company_state,
            company_state_id,
            company_state_lower,
            company_zip_code,
            is_hidden,
            is_verified,
            batch_id,
            airtable_batch_id,
            is_clearbit_import: false
        };

        client.query({query: CompaniesQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.companies && response.data.companies.length) {
                resolve(response.data.companies)
            } else {
                resolve(null)
            }
        }).catch((err) => {
            resolve();
        })
    });
}

export default CompanyService
