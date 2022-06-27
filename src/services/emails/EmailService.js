const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const EMAIL_TABLE = "emails";
const SERVICE_NAME = "Email Service";
const SERVICE_DEFAULT_TABLE = EMAIL_TABLE;

module.exports.EMAIL_TABLE = EMAIL_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);
};

module.exports.get_emails = get_emails;

function get_emails({email_id, user_id}) {

    const query = DatabaseService.generate_query({email_id, user_id});

    let knexQuery = knex(SERVICE_DEFAULT_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

function clean_email (email) {
    if (!email)
        return email

    email = email || "";
    return email.toLowerCase().trim();
}

module.exports.create_email = create_email;

function create_email({user_id, email_address, is_primary}) {

    email_address = clean_email(email_address);

    return new Promise((resolve, reject) => {
        if (!user_id || !email_address)
            return reject(new Error("Missing user_id or email_address"));

        const query = DatabaseService.generate_query({user_id, email_address, is_primary});

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("email_id").then((rows) => {
            const email_id = rows[0];

            return resolve(email_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_email = edit_email;

function edit_email({email_id, email_address}) {

    email_address = clean_email(email_address);

    return new Promise((resolve, reject) => {
        if (!email_id)
            return reject(new Error("Missing email_id"));

        const query = {email_address};

        knex(SERVICE_DEFAULT_TABLE).where({email_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_email = remove_email;

function remove_email({email_id}) {
    return new Promise((resolve, reject) => {
        if (!email_id)
            return reject(new Error("Missing email_id"));

        const query = DatabaseService.generate_query({email_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}