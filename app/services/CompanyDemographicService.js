import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";

let CompanyDemographicService = {};

CompanyDemographicService.getCompanyDemographics = ({
                                                        client,
                                                        company_demographic_id,
                                                        company_id,
                                                        airtable_company_id,
                                                        employees_female,
                                                        employees_male,
                                                        employees_nonbinary,
                                                        employees_trans,
                                                        employees_other,
                                                        employees_bipoc,
                                                        employees_nonbipoc,
                                                        employees_black,
                                                        employees_white,
                                                        employees_asian,
                                                        employees_latinx,
                                                        employees_indigenous,
                                                        employees_lgbtq,
                                                        employees_lesbian,
                                                        employees_gay,
                                                        employees_queer,
                                                        employees_asexual,
                                                        employees_multi,
                                                        employees_hawaiian,
                                                        year,
                                                        is_hidden,
                                                        batch_id,
                                                        airtable_batch_id,
                                                    }) => {
    return new Promise((resolve, reject) => {
        const CompanyDemographicsQuery = gql`
            query CompanyDemographicsQuery(
                $company_id: String,
                $company_demographic_id: String,
                $airtable_company_id: String,
                $year: Float,
            ){
                company_demographics(input:{
                    company_id: $company_id,
                    company_demographic_id: $company_demographic_id,
                    airtable_company_id: $airtable_company_id,
                    year: $year,
                }) {
                    company_demographic_id
                    company_id
                    airtable_company_id
                    employees_female
                    employees_male
                    employees_nonbinary
                    employees_trans
                    employees_other
                    employees_bipoc
                    employees_nonbipoc
                    employees_black
                    employees_white
                    employees_asian
                    employees_latinx
                    employees_indigenous
                    employees_lgbtq
                    employees_lesbian
                    employees_gay
                    employees_queer
                    employees_asexual
                    employees_multi,
                    employees_hawaiian,
                    year,
                    is_hidden
                    batch_id
                    airtable_batch_id
                }
            }
        `;

        const variables = {
            company_demographic_id,
            company_id,
            airtable_company_id,
            year
        };

        client.query({query: CompanyDemographicsQuery, variables, fetchPolicy: "no-cache"}).then((response) => {
            if (response && response.data && response.data.company_demographics && response.data.company_demographics.length) {
                resolve(response.data.company_demographics)
            } else {
                resolve(null)
            }
        }).catch((err) => {
            resolve();
        })
    });
}

export default CompanyDemographicService
