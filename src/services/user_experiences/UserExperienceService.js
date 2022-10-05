const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const USER_EXPERIENCE_TABLE = "user_experiences";
const SERVICE_NAME = "User Experience Service";
const SERVICE_DEFAULT_TABLE = USER_EXPERIENCE_TABLE;

module.exports.USER_EXPERIENCE_TABLE = USER_EXPERIENCE_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);

    // get_user_experiences({}).then((d) => {
    //     console.log("USER EXPERIENCe", d);
    // });
    //
    // edit_user_experience({
    //     user_experience_id: 4,
    //     // start_date: new Date("6/1/2015").getTime(),
    //     // end_date: new Date("10/1/2018").getTime(),
    //     // company_name: "Nike",
    //     company_logo_url: "https://dl.airtable.com/.attachmentThumbnails/f02af521f0da9ad66a801284eccbf677/2c28c4b5",
    //     // role_name: "Role 2",
    // }).then((e) => {
    //     console.log(e)
    // })

    // create_user_experience({
    //     user_id: 7,
    //     start_date: new Date("7/1/2015").getTime(),
    //     end_date: new Date("7/1/2016").getTime(),
    //     company_name: "Slyce.io",
    //     company_logo_url: "https://dl.airtable.com/.attachmentThumbnails/aa57bfc85dbc82b971a0720aa106052a/86a2834c",
    //     role_name: "Co-Founder + CPO",
    // }).then((e) => {
    //     console.log(e)
    // })

    // remove_user_experience({user_experience_id: 1, school_name: "MIT", degree_name: "Bachelors"}).then((r) =>{
    //     console.log("NEW ED", r);
    // })



    // knex(SERVICE_DEFAULT_TABLE).where({user_id: 7}).del().then(() => {
    // }).catch((err) => {
    // });

    // mass_delete();
};

module.exports.get_user_experiences = get_user_experiences;

function get_user_experiences({user_education_id, user_id, is_hidden}) {

    const query = DatabaseService.generate_query({user_education_id, user_id, is_hidden});

    let knexQuery = knex(SERVICE_DEFAULT_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.create_user_experience = create_user_experience;

function create_user_experience({user_id, is_hidden, company_id, company_name, company_logo_url, role_id, role_name, is_current, start_date, end_date, type, type_id, description,}) {
    return new Promise((resolve, reject) => {
        if (!user_id || !company_name)
            return reject(new Error("Missing user_id or company_name"));

        const query = DatabaseService.generate_query({user_id, is_hidden, company_id, company_name, company_logo_url, role_id, role_name, is_current, start_date, end_date, type, type_id, description});

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("user_experience_id").then((rows) => {
            const user_experience_id = rows[0];

            return resolve(user_experience_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_user_experience = edit_user_experience;

function edit_user_experience({user_experience_id, user_id, is_hidden, company_id, company_name, company_logo_url, role_id, role_name, is_current, start_date, end_date, type, type_id, description}) {
    return new Promise((resolve, reject) => {
        if (!user_experience_id)
            return reject(new Error("Missing user_experience_id"));

        const query = { user_id, is_hidden, company_id, company_name, company_logo_url, role_id, role_name, is_current, start_date, end_date, type, type_id, description};

        knex(SERVICE_DEFAULT_TABLE).where({user_experience_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_user_experience = remove_user_experience;

function remove_user_experience({user_experience_id}) {
    return new Promise((resolve, reject) => {
        if (!user_experience_id)
            return reject(new Error("Missing user_experience_id"));

        const query = DatabaseService.generate_query({user_experience_id});

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