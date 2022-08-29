const { gql } = require('apollo-server-express');

const CompanyService = require("../services/companies/CompanyService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        companies(input: QueryCompany): [Company]
    }

    extend type Mutation {
        add_company(input: CreateCompanyInput!): String
        edit_company(input: EditCompanyInput!): Boolean
        remove_company(company_id: String!): Boolean
    }

    type Company {
        company_id: String,
        airtable_company_id: String,
        company_name: String,
        company_logo_url: String,


        company_size: String,
        company_about: String
        company_website: String
        company_founded_year: String

        company_address_1: String
        company_address_2: String
        company_city: String
        company_city_lower: String
        company_city_id: String
        company_state: String
        company_state_id: String
        company_state_lower: String
        company_zip_code: String

        company_industry: String
        company_industry_group: String
        
        is_hidden: Boolean
        is_verified: Boolean
        is_clearbit_import: Boolean

        batch_id: String
        airtable_batch_id: String
    }
    
    input CreateCompanyInput {
        airtable_company_id: String,
        company_name: String,
        company_logo_url: String,


        company_size: String,
        company_about: String
        company_website: String
        company_founded_year: String

        company_address_1: String
        company_address_2: String
        company_city: String
        company_city_lower: String
        company_city_id: String
        company_state: String
        company_state_id: String
        company_state_lower: String
        company_zip_code: String

        company_industry: String
        company_industry_group: String
        
        is_hidden: Boolean
        is_verified: Boolean
        is_clearbit_import: Boolean

        batch_id: String
        airtable_batch_id: String
    }

    input EditCompanyInput {
        company_id: String,
        airtable_company_id: String,
        company_name: String,
        company_logo_url: String,


        company_size: String,
        company_about: String
        company_website: String
        company_founded_year: String

        company_address_1: String
        company_address_2: String
        company_city: String
        company_city_lower: String
        company_city_id: String
        company_state: String
        company_state_id: String
        company_state_lower: String
        company_zip_code: String

        company_industry: String
        company_industry_group: String
        
        is_hidden: Boolean
        is_verified: Boolean
        is_clearbit_import: Boolean

        batch_id: String
        airtable_batch_id: String
    }
    
    input QueryCompany {
        company_id: String,
        airtable_company_id: String,
        company_name: String,
        company_logo_url: String,


        company_size: String,
        company_about: String
        company_website: String
        company_founded_year: String

        company_address_1: String
        company_address_2: String
        company_city: String
        company_city_lower: String
        company_city_id: String
        company_state: String
        company_state_id: String
        company_state_lower: String
        company_zip_code: String

        company_industry: String
        company_industry_group: String

        is_hidden: Boolean
        is_verified: Boolean
        is_clearbit_import: Boolean

        batch_id: String
        airtable_batch_id: String
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        companies: (_, { input }) => new Promise((res, rej) => {
            CompanyService.get_companies(input).then((companies) => {
                return res(companies);
            });
        }),
    },
    Mutation: {
        add_company: (_, {input}) => new Promise((res, rej) => {
            CompanyService.create_company(input).then( (company_id) => {
                return res(company_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_company: (_, {input}) => new Promise((res, rej) => {
            CompanyService.edit_company(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_company: (_, {company_id}) => new Promise((res, rej) => {
            CompanyService.remove_company({company_id}).then( () => {
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