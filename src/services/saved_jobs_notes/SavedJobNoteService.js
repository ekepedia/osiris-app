const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const SAVED_JOBS_NOTES_TABLE = "saved_jobs_notes";
const SERVICE_NAME = "Saved Jobs Notes Service";
const SERVICE_DEFAULT_TABLE = SAVED_JOBS_NOTES_TABLE;

module.exports.SAVED_JOBS_NOTES_TABLE = SAVED_JOBS_NOTES_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);

    // test_endpoints();
};

module.exports.get_saved_job_notes = get_saved_job_notes;

function get_saved_job_notes({
                                 saved_job_note_id,
                                 saved_job_id,
                                 job_id,
                                 user_id,
                                 date_created,
                                 date_modified,
                                 note_title,
                                 note_body,
                                 note_html,
                                 is_archived,
}) {

    const query = DatabaseService.generate_query({
        saved_job_note_id,
        saved_job_id,
        job_id,
        user_id,
        date_created,
        date_modified,
        note_title,
        note_body,
        note_html,
        is_archived,
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

module.exports.create_saved_job_note = create_saved_job_note;

function create_saved_job_note({
                              saved_job_id,
                              job_id,
                              user_id,
                              date_created,
                              date_modified,
                              note_title,
                              note_body,
                              note_html,
                              is_archived,
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
            note_title,
            note_body,
            note_html,
            is_archived,
        });

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("saved_job_note_id").then((rows) => {
            const saved_job_note_id = rows[0];

            return resolve(saved_job_note_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_saved_job_note = edit_saved_job_note;

function edit_saved_job_note({
                                 saved_job_note_id,
                                 saved_job_id,
                                 job_id,
                                 user_id,
                                 date_created,
                                 date_modified,
                                 note_title,
                                 note_body,
                                 note_html,
                                 is_archived,
}) {
    return new Promise((resolve, reject) => {
        if (!saved_job_note_id)
            return reject(new Error("Missing saved_job_note_id"));

        const query = {
            saved_job_id,
            job_id,
            user_id,
            date_created,
            date_modified,
            note_title,
            note_body,
            note_html,
            is_archived,
        };

        knex(SERVICE_DEFAULT_TABLE).where({saved_job_note_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_saved_job_note = remove_saved_job_note;

function remove_saved_job_note({saved_job_note_id}) {
    return new Promise((resolve, reject) => {
        if (!saved_job_note_id)
            return reject(new Error("Missing saved_job_note_id"));

        const query = DatabaseService.generate_query({saved_job_note_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

function test_endpoints() {
    get_saved_job_notes({}).then((d) => {
        console.log("SAVED JOBS NOTES", d);
    });
    //
    //
    // edit_saved_job_note({
    //     saved_job_note_id:"1",
    //     note_body: "hey",
    // }).then(() => {})

    //
    // create_saved_job_note({
    //     job_id: 3,
    //     user_id: 1,
    //     saved_job_id: 1,
    // }).then((e) =>{
    //     console.log(e)
    // })

    // remove_saved_job_note({saved_job_note_id: 1}).then((r) =>{
    //     console.log("REMOVED", r);
    // })
}