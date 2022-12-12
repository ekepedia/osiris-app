const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const USER_RACE_TABLE = "user_races";
const SERVICE_NAME = "User Race Service";
const SERVICE_DEFAULT_TABLE = USER_RACE_TABLE;

module.exports.USER_RACE_TABLE = USER_RACE_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);
};

module.exports.get_user_races = get_user_races;

function get_user_races({user_id, race_id}) {

    const query = DatabaseService.generate_query({user_id, race_id});

    let knexQuery = knex(SERVICE_DEFAULT_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.create_user_races = create_user_races;

function create_user_races({user_id, race_id}) {
    return new Promise((resolve, reject) => {
        if (!user_id || !race_id)
            return reject(new Error("Missing user_id or race_id"));

        const query = DatabaseService.generate_query({user_id, race_id});

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("user_race_id").then((rows) => {
            const user_race_id = rows[0];

            return resolve(user_race_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_user_races = edit_user_races;

function edit_user_races({user_race_id, race_id}) {
    return new Promise((resolve, reject) => {
        if (!user_race_id)
            return reject(new Error("Missing user_race_id"));

        const query = { race_id };

        knex(SERVICE_DEFAULT_TABLE).where({user_race_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_user_race = remove_user_race;

function remove_user_race({user_race_id}) {
    return new Promise((resolve, reject) => {
        if (!user_race_id)
            return reject(new Error("Missing user_race_id"));

        const query = DatabaseService.generate_query({user_race_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}