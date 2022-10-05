const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const SAVED_JOBS_REMINDERS_TABLE = "saved_jobs_reminders";
const SERVICE_NAME = "Saved Jobs Reminder Service";
const SERVICE_DEFAULT_TABLE = SAVED_JOBS_REMINDERS_TABLE;

module.exports.SAVED_JOBS_REMINDERS_TABLE = SAVED_JOBS_REMINDERS_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);

    // test_endpoints();
};

module.exports.get_saved_job_reminders = get_saved_job_reminders;

function get_saved_job_reminders({
                                     saved_job_reminder_id,
                                     saved_job_id,
                                     job_id,
                                     user_id,
                                     date_created,
                                     date_modified,
                                     reminder_name,
                                     reminder_date,
                                     is_archived,
                                     is_completed
}) {

    const query = DatabaseService.generate_query({
        saved_job_reminder_id,
        saved_job_id,
        job_id,
        user_id,
        date_created,
        date_modified,
        reminder_name,
        reminder_date,
        is_archived,
        is_completed
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

module.exports.create_saved_job_reminder = create_saved_job_reminder;

function create_saved_job_reminder({
                                   saved_job_id,
                                   job_id,
                                   user_id,
                                   date_created,
                                   date_modified,
                                   reminder_name,
                                   reminder_date,
                                   is_archived,
                                   is_completed
                        }) {
    return new Promise((resolve, reject) => {
        if (!saved_job_id || !user_id)
            return reject(new Error("Missing saved_job_id || user_id"));

        const query = DatabaseService.generate_query({
            saved_job_id,
            job_id,
            user_id,
            date_created,
            date_modified,
            reminder_name,
            reminder_date,
            is_archived,
            is_completed
        });

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("saved_job_reminder_id").then((rows) => {
            const saved_job_reminder_id = rows[0];

            return resolve(saved_job_reminder_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_saved_job_reminder = edit_saved_job_reminder;

function edit_saved_job_reminder({
                                 saved_job_reminder_id,
                                 saved_job_id,
                                 job_id,
                                 user_id,
                                 date_created,
                                 date_modified,
                                 reminder_name,
                                 reminder_date,
                                 is_archived,
                                 is_completed
}) {
    return new Promise((resolve, reject) => {
        if (!saved_job_reminder_id)
            return reject(new Error("Missing saved_job_reminder_id"));

        const query = {
            saved_job_id,
            job_id,
            user_id,
            date_created,
            date_modified,
            reminder_name,
            reminder_date,
            is_archived,
            is_completed
        };

        knex(SERVICE_DEFAULT_TABLE).where({saved_job_reminder_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_saved_job_reminder = remove_saved_job_reminder;

function remove_saved_job_reminder({saved_job_reminder_id}) {
    return new Promise((resolve, reject) => {
        if (!saved_job_reminder_id)
            return reject(new Error("Missing saved_job_reminder_id"));

        const query = DatabaseService.generate_query({saved_job_reminder_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

function test_endpoints() {
    get_saved_job_reminders({}).then((d) => {
        console.log("SAVED JOBS REMINDERS", d);
    });
    //
    //
    // edit_saved_job_reminder({
    //     saved_job_reminder_id:"1",
    //     reminder_name: "hey you",
    // }).then(() => {})
    //
    // create_saved_job_reminder({
    //     job_id: 3,
    //     user_id: 1,
    //     saved_job_id: 1,
    // }).then((e) =>{
    //     console.log(e)
    // }).catch((err) => {
    //     console.log(err)
    // })
    //
    // remove_saved_job_reminder({saved_job_reminder_id: 1}).then((r) =>{
    //     console.log("REMOVED", r);
    // })
}