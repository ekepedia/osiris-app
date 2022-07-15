const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");
const UserExperienceService = require("../user_experiences/UserExperienceService");
const UserEducationService = require("../user_educations/UserEducationService");
const AIR_TABLE_KEY = "key967P3bJaUjmwX2";

let init = false;
let knex = null;

const USER_TABLE = "users";

module.exports.USER_TABLE = USER_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log("SQL: User Service Successfully Initialized");

    // test_endpoints();
    // edit_user({
    //     user_id: 7,
    //     user_instagram_link: "https://www.instagram.com/jasonmayden/",
    //     user_twitter_link: "https://twitter.com/JasonMayden/",
    // }).then(() => {});
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

function create_user({username, first_name, last_name, profile_photo_url, cover_photo_url, bio, user_twitter_link, user_clubhouse_link, user_instagram_link, user_website_link, user_youtube_link, user_main_contact_email, user_main_contact_phone}) {

    username = clean_username(username);

    return new Promise((resolve, reject) => {
        if (!username)
            return reject(new Error("Missing username"));

        const query = DatabaseService.generate_query({username, first_name, last_name, profile_photo_url, cover_photo_url, bio, user_twitter_link, user_clubhouse_link, user_instagram_link, user_website_link, user_youtube_link, user_main_contact_email, user_main_contact_phone});

        knex(USER_TABLE).insert(query).returning("user_id").then((rows) => {
            const user_id = rows[0];

            return resolve(user_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_user = edit_user;

function edit_user({user_id, username, first_name, last_name, profile_photo_url, cover_photo_url, bio, user_twitter_link, user_clubhouse_link, user_instagram_link, user_website_link, user_youtube_link, user_main_contact_email, user_main_contact_phone}) {

    username = clean_username(username);

    return new Promise((resolve, reject) => {
        if (!user_id)
            return reject(new Error("Missing user_id"));

        const query = {username, first_name, last_name, profile_photo_url, cover_photo_url, bio, user_twitter_link, user_clubhouse_link, user_instagram_link, user_website_link, user_youtube_link, user_main_contact_email, user_main_contact_phone};

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


const IMPORT_DATA = []
function test_endpoints() {
    load_companies_from_airtable({companies: {}}).then((companies) => {
        load_users_from_airtable().then((users) => {
            // load_experiences_from_airtable({users, companies}).then(() => {
            //
            // });
            load_education_from_airtable({users, companies}).then(() => {

            });
        })
    });

}

function load_users_from_airtable() {
    const users = {};
    return new Promise((resolve) => {

        axios.get(`https://api.airtable.com/v0/appBlhk8AlG9XyuEo/Seeding%20List?`, {
            headers: {
                'Authorization': `Bearer ${AIR_TABLE_KEY}`
            }
        }).then((res) => {
            res.data.records.forEach((record) => {
                let fields = record.fields || {};
                if (fields.user_id){
                    const {
                        user_id,
                        Name
                    } = fields;

                    users[record.id] = {
                        user_id,
                        Name,
                        airtable_user_id: record.id
                    };

                }
            });

            resolve(users);
        });
    })
}

function load_companies_from_airtable({offset, companies}) {

    return new Promise((resolve) => {

        let url =`https://api.airtable.com/v0/appBlhk8AlG9XyuEo/All%20Companies?`;

        if (offset) {
            url += `offset=${offset}`
        }

        axios.get(url, {
            headers: {
                'Authorization': `Bearer ${AIR_TABLE_KEY}`
            }
        }).then((res) => {

            const offset = res.data.offset;

            res.data.records.forEach((record) => {
                let fields = record.fields || {};

                const company = {
                    name: fields["Name"],
                    logo: fields["Logo"] ? fields["Logo"][0].url : null,
                };

                companies[record.id] = company
            });

            if (offset) {
                load_companies_from_airtable({offset, companies}).then((all_companies) => {
                    resolve(all_companies)
                })
            } else {
                resolve(companies);

            }
        });
    })
}

function load_experiences_from_airtable({users, companies}) {
    return new Promise((resolve) => {

        axios.get(`https://api.airtable.com/v0/appBlhk8AlG9XyuEo/Experiences?`, {
            headers: {
                'Authorization': `Bearer ${AIR_TABLE_KEY}`
            }
        }).then((res) => {
            res.data.records.forEach((record) => {
                let fields = record.fields || {};
                if (fields["Associated Person"]){
                    let airtable_user_id = fields["Associated Person"][0];
                    let airtable_company_id = fields["Companies"][0];
                    const user = users[airtable_user_id];
                    const company = companies[airtable_company_id];

                    if (user && user.user_id !== 7) {

                        let start_date = fields["Start Date"];
                        let end_date = fields["End Date"];
                        let title = fields["Role"];

                        const experience = {
                            user_id: user.user_id,
                            company_name: company.name,
                            company_logo_url: company.logo,
                            start_date: start_date ? new Date(start_date).getTime() : undefined,
                            end_date: end_date ? new Date(end_date).getTime() : undefined,
                            role_name: title
                        }

                        console.log( user.user_id, user.Name,  experience);

                        // UserExperienceService.create_user_experience(experience).then((id) => {
                        //     console.log(id)
                        // })
                    }

                }
            });
        });
    })
}

function load_education_from_airtable({users, companies}) {
    return new Promise((resolve) => {

        axios.get(`https://api.airtable.com/v0/appBlhk8AlG9XyuEo/Education?`, {
            headers: {
                'Authorization': `Bearer ${AIR_TABLE_KEY}`
            }
        }).then((res) => {
            res.data.records.forEach((record) => {
                let fields = record.fields || {};
                if (fields["Associated Person"]){
                    let airtable_user_id = fields["Associated Person"][0];
                    let airtable_school_id = fields["School"][0];

                    const user = users[airtable_user_id];
                    const school = companies[airtable_school_id];

                    if (user && user.user_id !== 7) {

                        let start_year = fields["Start Year"];
                        let end_year = fields["End Year"];
                        let title = fields["Role"];

                        const education = {
                            user_id: user.user_id,
                            school_name: school.name,
                            school_logo_url: school.logo,
                            degree_name: title,
                            start_date: start_year ? new Date(`9/1/${start_year}`).getTime() : undefined,
                            end_date: end_year ? new Date(`5/30/${end_year}`).getTime() : undefined,
                        }

                        console.log( user.user_id, user.Name, education);

                        // UserEducationService.create_user_education(education).then((id) => {
                        //     console.log(id)
                        // })
                    }

                }
            });
        });
    })
}