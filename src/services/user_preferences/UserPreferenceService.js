const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const USER_PREFERENCE_TABLE = "user_preferences";
const SERVICE_NAME = "User Preference Service";
const SERVICE_DEFAULT_TABLE = USER_PREFERENCE_TABLE;

module.exports.USER_PREFERENCE_TABLE = USER_PREFERENCE_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);
};

module.exports.get_user_preferences = get_user_preferences;

function get_user_preferences({user_id, type_id, preference_id}) {

    const query = DatabaseService.generate_query({user_id, type_id, preference_id});

    let knexQuery = knex(SERVICE_DEFAULT_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.create_user_preference = create_user_preference;

function create_user_preference({user_id, type_id, preference_id, order, preference_value}) {
    return new Promise((resolve, reject) => {
        if (!user_id || !type_id || !preference_id)
            return reject(new Error("Missing user_id or type_id or preference_id or order, preference_value"));

        const query = DatabaseService.generate_query({user_id, type_id, preference_id, order, preference_value});

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("user_preference_id").then((rows) => {
            const user_preference_id = rows[0];

            return resolve(user_preference_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_user_preference = edit_user_preference;

function edit_user_preference({user_preference_id, type_id, preference_id, order, preference_value}) {
    return new Promise((resolve, reject) => {
        if (!user_preference_id)
            return reject(new Error("Missing user_preference_id"));

        const query = { type_id, preference_id, order, preference_value };

        knex(SERVICE_DEFAULT_TABLE).where({user_preference_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_user_preference = remove_user_preference;

function remove_user_preference({user_preference_id}) {
    return new Promise((resolve, reject) => {
        if (!user_preference_id)
            return reject(new Error("Missing user_preference_id"));

        const query = DatabaseService.generate_query({user_preference_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}