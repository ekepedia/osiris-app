const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const JOBS_TABLE = "jobs";
const SERVICE_NAME = "Jobs Service";
const SERVICE_DEFAULT_TABLE = JOBS_TABLE;

module.exports.JOBS_TABLE = JOBS_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);

    // test_endpoints();
    // mass_delete();
};

module.exports.get_jobs = get_jobs;

function get_jobs({
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
}) {

    const query = DatabaseService.generate_query({
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

module.exports.create_job = create_job;

function create_job({
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
                        }) {
    return new Promise((resolve, reject) => {
        if (!company_id && !company_name)
            return reject(new Error("Missing company_id || company_name"));

        const query = DatabaseService.generate_query({
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
        });

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("job_id").then((rows) => {
            const job_id = rows[0];

            return resolve(job_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_job = edit_job;

function edit_job({
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
}) {
    return new Promise((resolve, reject) => {
        if (!job_id)
            return reject(new Error("Missing job_id"));

        const query = {
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

        knex(SERVICE_DEFAULT_TABLE).where({job_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_job = remove_job;

function remove_job({job_id}) {
    return new Promise((resolve, reject) => {
        if (!job_id)
            return reject(new Error("Missing job_id"));

        const query = DatabaseService.generate_query({job_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

function test_endpoints() {
    get_jobs({}).then((d) => {
        console.log("JOBS", d);
    });
    // //

    // edit_job({
    //     job_id:"1",
    //     company_name: "No Label",
    // }).then(() => {})

    //
    // create_job({
    //    job_title: "test job 1",
    //     company_name: "small company",
    // }).then((e) =>{
    //     console.log(e)
    // })

    // remove_job({job_id: 1}).then((r) =>{
    //     console.log("REMOVED", r);
    // })
}

function mass_delete() {
    knex(SERVICE_DEFAULT_TABLE).whereNot({user_id: 7}).del().then(() => {
    }).catch((err) => {
    });
}