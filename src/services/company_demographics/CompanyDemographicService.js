const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const COMPANY_DEMOGRAPHIC_TABLE = "company_demographics";
const SERVICE_NAME = "Company Demographic Service";
const SERVICE_DEFAULT_TABLE = COMPANY_DEMOGRAPHIC_TABLE;

module.exports.COMPANY_DEMOGRAPHIC_TABLE = COMPANY_DEMOGRAPHIC_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);
    // test_endpoints();
    // mass_delete();
};

module.exports.get_company_demographics = get_company_demographics;

function get_company_demographics({
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
}) {

    const query = DatabaseService.generate_query({
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
    });

    let knexQuery = knex(SERVICE_DEFAULT_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.create_company_demographic = create_company_demographic;

function create_company_demographic({
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
                        }) {
    return new Promise((resolve, reject) => {
        if (!company_id || !year)
            return reject(new Error("Missing year"));

        const query = DatabaseService.generate_query({
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
        });

        get_company_demographics({company_id, year}).then((rows) => {
            if (rows && rows.length) {
                let { company_demographic_id } = rows[0];
                edit_company_demographic({company_demographic_id, ...query}).then(() => {
                    return resolve(company_demographic_id);
                }).catch((err) => {
                    return reject(err);
                })
            } else {
                knex(SERVICE_DEFAULT_TABLE).insert(query).returning("company_demographic_id").then((rows) => {
                    const company_demographic_id = rows[0];

                    return resolve(company_demographic_id);
                }).catch((err) => {
                    return reject(err);
                });
            }
        });

    });
}

module.exports.edit_company_demographic = edit_company_demographic;

function edit_company_demographic({
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
}) {
    return new Promise((resolve, reject) => {
        if (!company_demographic_id)
            return reject(new Error("Missing company_demographic_id"));

        const query = {
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
        };

        knex(SERVICE_DEFAULT_TABLE).where({company_demographic_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_company_demographic = remove_company_demographic;

function remove_company_demographic({company_demographic_id}) {
    return new Promise((resolve, reject) => {
        if (!company_demographic_id)
            return reject(new Error("Missing company_demographic_id"));

        const query = DatabaseService.generate_query({company_demographic_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

function test_endpoints() {
    get_company_demographics({}).then((d) => {
        console.log("COMPANY DMEOS", d);
    });
    // //

    // edit_company_demographic({
    //     company_demographic_id:1,
    //     employees_male: 43
    // }).then(() => {})

    //
    // create_company_demographic({
    //     company_id:"207",
    //     employees_female: 56,
    //     employees_male: 44,
    // }).then((e) =>{
    //     console.log(e)
    // })
    //
    // remove_company_demographic({company_demographic_id: 1}).then((r) =>{
    //     console.log("REMOVED", r);
    // })
}

function mass_delete() {
    knex(SERVICE_DEFAULT_TABLE).where({}).del().then(() => {
    }).catch((err) => {
    });
}