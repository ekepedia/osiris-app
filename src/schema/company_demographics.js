const { gql } = require('apollo-server-express');

const CompanyDemographicService = require("../services/company_demographics/CompanyDemographicService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        company_demographics(input: QueryCompanyDemographic): [CompanyDemographic]
    }

    extend type Mutation {
        add_company_demographic(input: CreateCompanyDemographicInput!): String
        edit_company_demographic(input: EditCompanyDemographicInput!): Boolean
        remove_company_demographic(company_demographic_id: String!): Boolean
    }

    type CompanyDemographic {
        company_demographic_id: String,
        company_id: String,
        airtable_company_id: String,

        employees_female: Float,
        employees_male: Float,
        employees_nonbinary: Float,
        employees_trans: Float,
        employees_other: Float,

        employees_bipoc: Float,
        employees_nonbipoc: Float,
        
        employees_black: Float,
        employees_white: Float,
        employees_asian: Float,
        employees_latinx: Float,
        employees_indigenous: Float,
        
        employees_lgbtq: Float,
        employees_lesbian: Float,
        employees_gay: Float,
        employees_queer: Float,
        employees_asexual: Float,
        
        employees_multi: Float,
        employees_hawaiian: Float,
        year: Float,
        
        is_hidden: Boolean

        batch_id: String
        airtable_batch_id: String
    }
    
    input CreateCompanyDemographicInput {
        company_id: String!
        airtable_company_id: String,

        employees_female: Float,
        employees_male: Float,
        employees_nonbinary: Float,
        employees_trans: Float,
        employees_other: Float,

        employees_bipoc: Float,
        employees_nonbipoc: Float,

        employees_black: Float,
        employees_white: Float,
        employees_asian: Float,
        employees_latinx: Float,
        employees_indigenous: Float,

        employees_lgbtq: Float,
        employees_lesbian: Float,
        employees_gay: Float,
        employees_queer: Float,
        employees_asexual: Float,

        employees_multi: Float,
        employees_hawaiian: Float,
        year: Float,
        
        is_hidden: Boolean

        batch_id: String
        airtable_batch_id: String
    }

    input EditCompanyDemographicInput {
        company_demographic_id: String!
        company_id: String,
        airtable_company_id: String,

        employees_female: Float,
        employees_male: Float,
        employees_nonbinary: Float,
        employees_trans: Float,
        employees_other: Float,

        employees_bipoc: Float,
        employees_nonbipoc: Float,

        employees_black: Float,
        employees_white: Float,
        employees_asian: Float,
        employees_latinx: Float,
        employees_indigenous: Float,

        employees_lgbtq: Float,
        employees_lesbian: Float,
        employees_gay: Float,
        employees_queer: Float,
        employees_asexual: Float,

        employees_multi: Float,
        employees_hawaiian: Float,
        year: Float,

        is_hidden: Boolean

        batch_id: String
        airtable_batch_id: String
    }
    
    input QueryCompanyDemographic {
        company_demographic_id: String,
        company_id: String,
        airtable_company_id: String,

        employees_female: Float,
        employees_male: Float,
        employees_nonbinary: Float,
        employees_trans: Float,
        employees_other: Float,

        employees_bipoc: Float,
        employees_nonbipoc: Float,

        employees_black: Float,
        employees_white: Float,
        employees_asian: Float,
        employees_latinx: Float,
        employees_indigenous: Float,

        employees_lgbtq: Float,
        employees_lesbian: Float,
        employees_gay: Float,
        employees_queer: Float,
        employees_asexual: Float,

        employees_multi: Float,
        employees_hawaiian: Float,
        year: Float,

        is_hidden: Boolean

        batch_id: String
        airtable_batch_id: String
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        company_demographics: (_, { input }) => new Promise((res, rej) => {
            CompanyDemographicService.get_company_demographics(input).then((companies) => {
                return res(companies);
            });
        }),
    },
    Mutation: {
        add_company_demographic: (_, {input}) => new Promise((res, rej) => {
            CompanyDemographicService.create_company_demographic(input).then( (company_id) => {
                return res(company_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_company_demographic: (_, {input}) => new Promise((res, rej) => {
            CompanyDemographicService.edit_company_demographic(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_company_demographic: (_, {company_demographic_id}) => new Promise((res, rej) => {
            CompanyDemographicService.remove_company_demographic({company_demographic_id}).then( () => {
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