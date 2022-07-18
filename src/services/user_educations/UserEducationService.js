const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const USER_EDUCATION_TABLE = "user_educations";
const SERVICE_NAME = "User Education Service";
const SERVICE_DEFAULT_TABLE = USER_EDUCATION_TABLE;

module.exports.USER_EDUCATION_TABLE = USER_EDUCATION_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);

    // get_user_educations({}).then((d) => {
    //     console.log("USER EDUCATIONS", d);
    // });

    // edit_user_education({
    //     user_education_id: 4,
    //     // user_id: 7,
    //     school_name: "College for Creative Studies",
    //     degree_name: "BFA, Industrial Design (Product)",
    //     school_logo_url: "https://dl.airtable.com/.attachmentThumbnails/abf1031e1956a44a57b27d5ecff3a4be/e5a90fc2",
    //     start_date: new Date("9/1/1998").getTime(),
    //     end_date: new Date("5/1/2002").getTime(),
    // })



    // remove_user_education({user_education_id: 3, school_name: "MIT", degree_name: "Bachelors"}).then((r) =>{
    //     console.log("NEW ED", r);
    // })

    // mass_delete();
};

module.exports.get_user_educations = get_user_educations;

function get_user_educations({user_education_id, user_id}) {

    const query = DatabaseService.generate_query({user_education_id, user_id});

    let knexQuery = knex(SERVICE_DEFAULT_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.create_user_education = create_user_education;

function create_user_education({user_id, school_name, school_id, school_logo_url, degree_id, degree_name, field_of_study_name, field_of_study_id, start_date, end_date, is_currently_enrolled }) {

    //school_name = DatabaseService.clean_string(school_name);
    // degree_name = DatabaseService.clean_string(degree_name);
    // field_of_study_name = DatabaseService.clean_string(field_of_study_name);

    return new Promise((resolve, reject) => {
        if (!user_id || !school_name)
            return reject(new Error("Missing user_id or school_name"));

        const query = DatabaseService.generate_query({user_id, school_name, school_id, school_logo_url, degree_id, degree_name, field_of_study_name, field_of_study_id, start_date, end_date, is_currently_enrolled});

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("user_education_id").then((rows) => {
            const user_education_id = rows[0];

            return resolve(user_education_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_user_education = edit_user_education;

function edit_user_education({user_education_id, school_name, school_id, school_logo_url, degree_id, degree_name, field_of_study_name, field_of_study_id, start_date, end_date, is_currently_enrolled}) {

    //school_name = DatabaseService.clean_string(school_name);
    // degree_name = DatabaseService.clean_string(degree_name);
    // field_of_study_name = DatabaseService.clean_string(field_of_study_name);

    return new Promise((resolve, reject) => {
        if (!user_education_id)
            return reject(new Error("Missing user_education_id"));

        const query = { school_name, school_id, degree_id, school_logo_url, degree_name, field_of_study_name, field_of_study_id, start_date, end_date, is_currently_enrolled};

        knex(SERVICE_DEFAULT_TABLE).where({user_education_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_user_education = remove_user_education;

function remove_user_education({user_education_id}) {
    return new Promise((resolve, reject) => {
        if (!user_education_id)
            return reject(new Error("Missing user_education_id"));

        const query = DatabaseService.generate_query({user_education_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

function mass_delete() {
    knex(SERVICE_DEFAULT_TABLE).whereNot({user_id: 7}).del().then(() => {
    }).catch((err) => {
    });
}