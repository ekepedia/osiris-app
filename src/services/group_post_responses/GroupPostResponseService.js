const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const GROUP_POST_RESPONSES_TABLE = "group_post_responses";
const SERVICE_NAME = "Group Post Responses Service";
const SERVICE_DEFAULT_TABLE = GROUP_POST_RESPONSES_TABLE;

module.exports.GROUP_POST_RESPONSES_TABLE = GROUP_POST_RESPONSES_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);

    // test_endpoints();
    // mass_delete();
};

module.exports.get_group_post_responses = get_group_post_responses;

function get_group_post_responses({
                            group_post_response_id,
                            group_post_id,
                            user_id,
                            user_company_while_responding_id,
                            user_role_while_responding_id,
                            job_id,
                            date,
                            response,
                            user_is_employed_at_time_of_response,
                            user_is_student_at_time_of_response,
                            is_active,
                            is_archived,
                            batch_id,
                            airtable_batch_id
                        }) {

    const query = DatabaseService.generate_query({
        group_post_response_id,
        group_post_id,
        user_id,
        user_company_while_responding_id,
        user_role_while_responding_id,
        job_id,
        date,
        response,
        user_is_employed_at_time_of_response,
        user_is_student_at_time_of_response,
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

module.exports.create_group_post_response = create_group_post_response;

function create_group_post_response({
                                group_post_response_id,
                                group_post_id,
                                user_id,
                                user_company_while_responding_id,
                                user_role_while_responding_id,
                                job_id,
                                date,
                                response,
                                user_is_employed_at_time_of_response,
                                user_is_student_at_time_of_response,
                                is_active,
                                is_archived,
                                batch_id,
                                airtable_batch_id
                          }) {
    return new Promise((resolve, reject) => {
        if (!group_post_id || !user_id)
            return reject(new Error("Missing group_post_id || user_id"));

        const query = DatabaseService.generate_query({
            group_post_response_id,
            group_post_id,
            user_id,
            user_company_while_responding_id,
            user_role_while_responding_id,
            job_id,
            date,
            response,
            user_is_employed_at_time_of_response,
            user_is_student_at_time_of_response,
            is_active,
            is_archived,
            batch_id,
            airtable_batch_id
        });

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("group_post_response_id").then((rows) => {
            const group_post_response_id = rows[0];

            return resolve(group_post_response_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_group_post_response = edit_group_post_response;

function edit_group_post_response({
                              group_post_response_id,
                              group_post_id,
                              user_id,
                              user_company_while_responding_id,
                              user_role_while_responding_id,
                              job_id,
                              date,
                              response,
                              user_is_employed_at_time_of_response,
                              user_is_student_at_time_of_response,
                              is_active,
                              is_archived,
                              batch_id,
                              airtable_batch_id
                        }) {
    return new Promise((resolve, reject) => {
        if (!group_post_response_id)
            return reject(new Error("Missing group_post_response_id"));

        const query = {
            group_post_response_id,
            group_post_id,
            user_id,
            user_company_while_responding_id,
            user_role_while_responding_id,
            job_id,
            date,
            response,
            user_is_employed_at_time_of_response,
            user_is_student_at_time_of_response,
            is_active,
            is_archived,
            batch_id,
            airtable_batch_id
        };

        knex(SERVICE_DEFAULT_TABLE).where({group_post_response_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_group_post_response = remove_group_post_response;

function remove_group_post_response({group_post_response_id}) {
    return new Promise((resolve, reject) => {
        if (!group_post_response_id)
            return reject(new Error("Missing group_post_response_id"));

        const query = DatabaseService.generate_query({group_post_response_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

function test_endpoints() {
    get_group_post_responses({}).then((d) => {
        console.log("GROUP POST RESPONSES", d);
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