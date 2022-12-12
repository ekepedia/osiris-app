const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const USER_UNIVERSITY_TABLE = "user_universities";
const SERVICE_NAME = "User University Service";
const SERVICE_DEFAULT_TABLE = USER_UNIVERSITY_TABLE;

module.exports.USER_UNIVERSITY_TABLE = USER_UNIVERSITY_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);
};

module.exports.get_user_universities = get_user_universities;

function get_user_universities({user_id, university_id}) {

    const query = DatabaseService.generate_query({user_id, university_id});

    let knexQuery = knex(SERVICE_DEFAULT_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.create_user_universities = create_user_universities;

function create_user_universities({user_id, university_id}) {
    return new Promise((resolve, reject) => {
        if (!user_id || !university_id)
            return reject(new Error("Missing user_id or university_id"));

        const query = DatabaseService.generate_query({user_id, university_id});

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("user_university_id").then((rows) => {
            const user_university_id = rows[0];

            return resolve(user_university_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_user_universities = edit_user_universities;

function edit_user_universities({user_university_id, university_id}) {
    return new Promise((resolve, reject) => {
        if (!user_university_id)
            return reject(new Error("Missing user_university_id"));

        const query = { university_id };

        knex(SERVICE_DEFAULT_TABLE).where({user_university_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_user_universities = remove_user_universities;

function remove_user_universities({user_university_id}) {
    return new Promise((resolve, reject) => {
        if (!user_university_id)
            return reject(new Error("Missing user_race_id"));

        const query = DatabaseService.generate_query({user_university_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}