const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const EDUCATION_TABLE = "educations";
const SERVICE_NAME = "Education Service";
const SERVICE_DEFAULT_TABLE = EDUCATION_TABLE;

module.exports.EDUCATION_TABLE = EDUCATION_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);
};

module.exports.get_educations = get_educations;

function get_educations({education_id, user_id}) {

    const query = DatabaseService.generate_query({education_id, user_id});

    let knexQuery = knex(SERVICE_DEFAULT_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.create_education = create_education;

function create_education({user_id, school_name, school_id, degree_id, degree_name, field_of_study_name, field_of_study_id, start_date, end_date, is_currently_enrolled }) {

    school_name = DatabaseService.clean_string(school_name);
    degree_name = DatabaseService.clean_string(degree_name);
    field_of_study_name = DatabaseService.clean_string(field_of_study_name);

    return new Promise((resolve, reject) => {
        if (!user_id || !school_name)
            return reject(new Error("Missing user_id or school_name"));

        const query = DatabaseService.generate_query({user_id, school_name, school_id, degree_id, degree_name, field_of_study_name, field_of_study_id, start_date, end_date, is_currently_enrolled});

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("education_id").then((rows) => {
            const email_id = rows[0];

            return resolve(email_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_education = edit_education;

function edit_education({education_id, school_name, school_id, degree_id, degree_name, field_of_study_name, field_of_study_id, start_date, end_date, is_currently_enrolled}) {

    school_name = DatabaseService.clean_string(school_name);
    degree_name = DatabaseService.clean_string(degree_name);
    field_of_study_name = DatabaseService.clean_string(field_of_study_name);

    return new Promise((resolve, reject) => {
        if (!education_id)
            return reject(new Error("Missing education_id"));

        const query = { school_name, school_id, degree_id, degree_name, field_of_study_name, field_of_study_id, start_date, end_date, is_currently_enrolled};

        knex(SERVICE_DEFAULT_TABLE).where({education_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_education = remove_education;

function remove_education({education_id}) {
    return new Promise((resolve, reject) => {
        if (!education_id)
            return reject(new Error("Missing education_id"));

        const query = DatabaseService.generate_query({education_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}