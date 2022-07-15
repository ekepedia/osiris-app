const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const USER_GALLERY_TABLE = "user_galleries";
const SERVICE_NAME = "User Gallery Service";
const SERVICE_DEFAULT_TABLE = USER_GALLERY_TABLE;

module.exports.USER_GALLERY_TABLE = USER_GALLERY_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);

    // test_endpoints();
};

module.exports.get_user_galleries = get_user_galleries;

function get_user_galleries({user_gallery_id, user_id}) {

    const query = DatabaseService.generate_query({user_gallery_id, user_id});

    let knexQuery = knex(SERVICE_DEFAULT_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.create_user_gallery = create_user_gallery;

function create_user_gallery({user_id, gallery_photo_url, gallery_order, gallery_name, gallery_caption}) {
    return new Promise((resolve, reject) => {
        if (!user_id || !gallery_photo_url)
            return reject(new Error("Missing user_id or gallery_photo_url"));

        const query = DatabaseService.generate_query({user_id, gallery_photo_url, gallery_order, gallery_name, gallery_caption});

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("user_gallery_id").then((rows) => {
            const user_gallery_id = rows[0];
            return resolve(user_gallery_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_user_gallery = edit_user_gallery;

function edit_user_gallery({user_gallery_id, gallery_photo_url, gallery_order, gallery_name, gallery_caption}) {
    return new Promise((resolve, reject) => {
        if (!user_gallery_id)
            return reject(new Error("Missing user_gallery_id"));

        const query = {gallery_photo_url, gallery_order, gallery_name, gallery_caption};

        knex(SERVICE_DEFAULT_TABLE).where({user_gallery_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_user_gallery = remove_user_gallery;

function remove_user_gallery({user_gallery_id}) {
    return new Promise((resolve, reject) => {
        if (!user_gallery_id)
            return reject(new Error("Missing user_gallery_id"));

        const query = DatabaseService.generate_query({user_gallery_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

function test_endpoints() {
    // get_user_galleries({}).then((d) => {
    //     console.log("USER GALLERY", d);
    // });
    // // //
    // edit_user_gallery({
    //     user_gallery_id:"2",
    //     gallery_order: 2,
    //     gallery_photo_url: "https://dl.airtable.com/.attachmentThumbnails/171f03cbac5ab5be28fb07c46c0d2277/3355f151"
    // }).then((e) =>{
    //     console.log(e)
    // })
    //
    // create_user_gallery({
    //     user_id:"1",
    //     gallery_order: 1,
    //     gallery_photo_url: "https://dl.airtable.com/.attachmentThumbnails/ae14d6db3a6a3beacafe9e57dd4d80a9/63a0b1b5"}).then((e) =>{
    //     console.log(e)
    // })
    //
    // remove_user_link({user_link_id: 1, school_name: "MIT", degree_name: "Bachelors"}).then((r) =>{
    //     console.log("NEW ED", r);
    // })
}