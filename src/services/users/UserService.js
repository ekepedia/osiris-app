const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const USER_TABLE = "users";

module.exports.USER_TABLE = USER_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log("SQL: User Service Successfully Initialized");
};

module.exports.get_users = get_users;

function get_users({user_id, username}) {

    const query = DatabaseService.generate_query({user_id, username});

    let knexQuery = knex(USER_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

function clean_username (username) {
    if (!username)
        return username

    username = username || "";
    return username.toLowerCase().trim();
}

module.exports.create_user = create_user;

function create_user({username, first_name,  last_name}) {

    username = clean_username(username);

    return new Promise((resolve, reject) => {
        if (!username)
            return reject(new Error("Missing username"));

        const query = DatabaseService.generate_query({username, first_name,  last_name});

        knex(USER_TABLE).insert(query).returning("user_id").then((rows) => {
            const user_id = rows[0];

            return resolve(user_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_user = edit_user;

function edit_user({user_id, username, first_name,  last_name}) {

    username = clean_username(username);

    return new Promise((resolve, reject) => {
        if (!user_id)
            return reject(new Error("Missing user_id"));

        const query = {username, first_name,  last_name};

        knex(USER_TABLE).where({user_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.archive_user = archive_user;

function archive_user({user_id}, unarchive) {
    return new Promise((resolve, reject) => {
        if (!user_id)
            return reject(new Error("Missing user_id"));

        const query = DatabaseService.generate_query({user_id});

        knex(USER_TABLE).where(query).update({
            archived: !unarchive
        }).then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

