const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const USER_LINK_TABLE = "user_links";
const SERVICE_NAME = "User Link Service";
const SERVICE_DEFAULT_TABLE = USER_LINK_TABLE;

module.exports.USER_LINK_TABLE = USER_LINK_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);

    // test_endpoints();
    // mass_delete();
};

module.exports.get_user_links = get_user_links;

function get_user_links({user_link_id, user_id, is_hidden}) {

    const query = DatabaseService.generate_query({user_link_id, user_id, is_hidden});

    let knexQuery = knex(SERVICE_DEFAULT_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.create_user_link = create_user_link;

function create_user_link({user_id, is_hidden, link_type_id, link_type, link_name, link_url, link_image_url, link_order, }) {
    return new Promise((resolve, reject) => {
        if (!user_id || !link_url)
            return reject(new Error("Missing user_id or link_url"));

        const query = DatabaseService.generate_query({user_id, is_hidden, link_type_id, link_type, link_name, link_url, link_image_url, link_order});

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("user_link_id").then((rows) => {
            const user_link_id = rows[0];

            return resolve(user_link_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_user_link = edit_user_link;

function edit_user_link({user_link_id, user_id, is_hidden, link_type_id, link_type, link_name, link_url, link_image_url, link_order}) {
    return new Promise((resolve, reject) => {
        if (!user_link_id)
            return reject(new Error("Missing user_link_id"));

        const query = { user_id, is_hidden, link_type_id, link_type, link_name, link_url, link_image_url, link_order};

        knex(SERVICE_DEFAULT_TABLE).where({user_link_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_user_link = remove_user_link;

function remove_user_link({user_link_id}) {
    return new Promise((resolve, reject) => {
        if (!user_link_id)
            return reject(new Error("Missing user_link_id"));

        const query = DatabaseService.generate_query({user_link_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

function test_endpoints() {
    // get_user_links({}).then((d) => {
    //     console.log("USER LINK", d);
    // });
    // // //

    // edit_user_link({
    //     user_link_id:"6",
    //     link_name: "No Label",
    //     link_image_url: "https://dl.airtable.com/.attachmentThumbnails/895ccf330eae6c9b81b88dee333576e8/58cf893d",
    // }).then(() => {})

    //
    // create_user_link({
    //     user_id:"1",
    //     link_type: "small",
    // link_url: "https://nolabel.live"}).then((e) =>{
    //     console.log(e)
    // })
    //
    // remove_user_link({user_link_id: 1, school_name: "MIT", degree_name: "Bachelors"}).then((r) =>{
    //     console.log("NEW ED", r);
    // })
}

function mass_delete() {
    knex(SERVICE_DEFAULT_TABLE).whereNot({user_id: 7}).del().then(() => {
    }).catch((err) => {
    });
}