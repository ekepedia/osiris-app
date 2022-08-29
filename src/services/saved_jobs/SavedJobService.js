const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const SAVED_JOBS_TABLE = "saved_jobs";
const SERVICE_NAME = "Saved Jobs Service";
const SERVICE_DEFAULT_TABLE = SAVED_JOBS_TABLE;

module.exports.SAVED_JOBS_TABLE = SAVED_JOBS_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);

    // test_endpoints();
    // mass_delete();
};

module.exports.get_saved_jobs = get_saved_jobs;

function get_saved_jobs({
                            saved_job_id,
                            job_id,
                            user_id,
                            status_id,
                            status,
                            job_salary,
                            job_deadline,
                            is_active,
                            is_archived,
                            batch_id,
                            airtable_batch_id
}) {

    const query = DatabaseService.generate_query({
        saved_job_id,
        job_id,
        user_id,
        status_id,
        status,
        job_salary,
        job_deadline,
        is_active,
        is_archived,
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

module.exports.create_saved_job = create_saved_job;

function create_saved_job({
                        job_id,
                        user_id,
                        status_id,
                        status,
                        job_salary,
                        job_deadline,
                        is_active,
                        is_archived,
                        batch_id,
                        airtable_batch_id
                        }) {
    return new Promise((resolve, reject) => {
        if (!job_id || !user_id)
            return reject(new Error("Missing job_id || user_id"));

        const query = DatabaseService.generate_query({
            job_id,
            user_id,
            status_id,
            status,
            job_salary,
            job_deadline,
            is_active,
            is_archived,
            batch_id,
            airtable_batch_id
        });

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("saved_job_id").then((rows) => {
            const saved_job_id = rows[0];

            return resolve(saved_job_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_saved_job = edit_saved_job;

function edit_saved_job({
                            saved_job_id,
                            job_id,
                            user_id,
                            status_id,
                            status,
                            job_salary,
                            job_deadline,
                            is_active,
                            is_archived,
                            batch_id,
                            airtable_batch_id
}) {
    return new Promise((resolve, reject) => {
        if (!saved_job_id)
            return reject(new Error("Missing saved_job_id"));

        const query = {
            job_id,
            user_id,
            status_id,
            status,
            job_salary,
            job_deadline,
            is_active,
            is_archived,
            batch_id,
            airtable_batch_id
        };

        knex(SERVICE_DEFAULT_TABLE).where({saved_job_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_saved_job = remove_saved_job;

function remove_saved_job({saved_job_id}) {
    return new Promise((resolve, reject) => {
        if (!saved_job_id)
            return reject(new Error("Missing saved_job_id"));

        const query = DatabaseService.generate_query({saved_job_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

function test_endpoints() {
    get_saved_jobs({}).then((d) => {
        console.log("SAVED JOBS", d);
    });
    // //

    // edit_saved_job({
    //     saved_job_id:"1",
    //     status_id: 1,
    // }).then(() => {})

    //
    // create_saved_job({
    //     job_id: 3,
    //     user_id: 1,
    // }).then((e) =>{
    //     console.log(e)
    // })

    // remove_saved_job({saved_job_id: 1}).then((r) =>{
    //     console.log("REMOVED", r);
    // })
}

function mass_delete() {
    knex(SERVICE_DEFAULT_TABLE).whereNot({user_id: 7}).del().then(() => {
    }).catch((err) => {
    });
}