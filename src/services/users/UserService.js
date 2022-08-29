const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");
const UserExperienceService = require("../user_experiences/UserExperienceService");
const UserEducationService = require("../user_educations/UserEducationService");
const UserLinksService = require("../user_links/UserLinksService");
const UserGalleryService = require("../user_galleries/UserGalleryService");
const CompanyService = require("../companies/CompanyService");

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

function create_user({username, first_name, last_name, profile_photo_url, cover_photo_url, bio, user_twitter_link, user_clubhouse_link, user_instagram_link, user_website_link, user_tiktok_link, user_youtube_link, user_vimeo_link, user_main_contact_email, user_main_contact_phone}) {

    username = clean_username(username);

    return new Promise((resolve, reject) => {
        if (!username)
            return reject(new Error("Missing username"));

        const query = DatabaseService.generate_query({username, first_name, last_name, profile_photo_url, cover_photo_url, bio, user_twitter_link, user_clubhouse_link, user_instagram_link, user_website_link, user_tiktok_link, user_youtube_link, user_vimeo_link, user_main_contact_email, user_main_contact_phone});

        knex(USER_TABLE).insert(query).returning("user_id").then((rows) => {
            const user_id = rows[0];

            return resolve(user_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_user = edit_user;

function edit_user({user_id, username, first_name, last_name, profile_photo_url, cover_photo_url, bio, user_twitter_link, user_clubhouse_link, user_instagram_link, user_website_link, user_tiktok_link, user_youtube_link, user_vimeo_link, user_main_contact_email, user_main_contact_phone}) {

    username = clean_username(username);

    return new Promise((resolve, reject) => {
        if (!user_id)
            return reject(new Error("Missing user_id"));

        const query = {username, first_name, last_name, profile_photo_url, cover_photo_url, bio, user_twitter_link, user_clubhouse_link, user_instagram_link, user_website_link, user_tiktok_link, user_youtube_link, user_vimeo_link, user_main_contact_email, user_main_contact_phone};

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

        // console.log("LOADD COMPANYS", companies)
        //
        // Object.values(companies).forEach((company) => {
        //     CompanyService.create_company(company).then((company_id) => {
        //         console.log("company_id", company_id);
        //     }).catch((e) => {
        //         console.log("company already exists", company.company_name);
        //
        //     })
        // })

        load_users_from_airtable().then((users) => {

            // console.log(users);

            // SUBMIT EDITS
            // Object.values(users).forEach((user) => {
            //     edit_user(user).then((rs) => {
            //     })
            // });

            // CREATE USERS
            // Object.values(users).forEach((user) => {
            //     user.username = `${user.first_name}${user.last_name}`.toLowerCase();
            //     console.log(user)
            //     create_user(user).then((rs) => {
            //         console.log(user.username, rs)
            //     })
            // });

            // load_experiences_from_airtable({users, companies, create: false}).then(() => {
            //
            // });
            //
            // load_education_from_airtable({users, companies, create: false}).then(() => {
            //
            // });

            // load_links_from_airtable({users, companies, create: false}).then(() => {
            //
            // });
        })
    });

    // get_users({}).then((users) => {
    //     users.forEach((user) => {
    //         console.log(`https://app-osiris.herokuapp.com/u/${user.username}`)
    //     })
    // })
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
                // if (!fields.user_id && fields["Status"] === "Done"){
                if (fields.user_id){
                    const {
                        user_id,
                        Name
                    } = fields;

                    const first_name = fields["First Name"];
                    const last_name = fields["Last Name"];

                    const Header = fields["Header"];
                    const Profile = fields["Profile Picture"];
                    const bio = fields["Bio"];
                    const user_instagram_link = fields["Instagram"];
                    const user_twitter_link = fields["Twitter"];
                    const user_website_link = fields["Personal Site"];
                    const user_vimeo_link = fields["Vimeo"];
                    const user_tiktok_link = fields["TikTok"];
                    const user_main_contact_email = fields["Email"];

                    const status = fields["Status"];

                    const cover_photo_url = Header && Header.length ? Header[0].url : undefined;
                    const profile_photo_url = Profile && Profile.length ? Profile[0].url : undefined;

                    users[record.id] = {
                        user_id,
                        first_name,
                        last_name,
                        Name,
                        airtable_user_id: record.id,
                        cover_photo_url,
                        profile_photo_url,
                        bio,
                        user_instagram_link,
                        user_twitter_link,
                        user_website_link,
                        user_vimeo_link,
                        user_tiktok_link,
                        user_main_contact_email
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


                let company_city = undefined;
                let company_state = undefined;
                let company_city_lower = undefined;
                let company_state_lower = undefined;

                if (fields["Headquarters"]) {
                    let h = fields["Headquarters"];
                    h = h.replace("'","");
                    h = h.replace("'","");
                    h = h.replace("\"","");
                    h = h.replace("\"","");
                    let hs = h.split(", ");

                    if (hs.length === 2) {
                        console.log("COMPANY CITY STATE", hs[0], hs[1]);
                        company_city = hs[0];
                        company_state = hs[1];
                        company_city_lower = company_city.toLowerCase();
                        company_state_lower = company_state.toLowerCase();
                    }
                }
                console.log("COMPANY CITY STATE AGAIN", company_city, company_state);

                const company = {
                    airtable_company_id: record.id,
                    name: fields["Name"],
                    company_city,
                    company_state,
                    company_city_lower,
                    company_state_lower,
                    company_name: fields["Name"],
                    company_about: fields["About"],
                    company_website: fields["Site"],
                    company_size: fields["Employees"],
                    headquarters: fields["Headquarters"],
                    logo: fields["Logo"] ? fields["Logo"][0].url : null,
                    company_logo_url: fields["Logo"] ? fields["Logo"][0].url : null,
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

function load_experiences_from_airtable({users, companies, offset, create}) {
    return new Promise((resolve) => {

        let url = "https://api.airtable.com/v0/appBlhk8AlG9XyuEo/Experiences";

        if (offset) {
            url += "?offset=" + offset
        }

        axios.get(url, {
            headers: {
                'Authorization': `Bearer ${AIR_TABLE_KEY}`
            }
        }).then((res) => {

            const offset = res.data.offset;

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

                        // console.log( user.user_id, user.Name,  experience);
                        //
                        if (create) {
                            UserExperienceService.create_user_experience(experience).then((id) => {
                                console.log(id)
                            })
                        }

                    }

                }
            });

            if (offset) {
                load_experiences_from_airtable({users, companies, offset}).then(() => {

                })
            }
        });
    })
}

function load_education_from_airtable({users, companies, create}) {
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

                        // console.log( user.user_id, user.Name, education);
                        //
                        if (create) {
                            UserEducationService.create_user_education(education).then((id) => {
                                console.log(id)
                            })
                        }
                    }

                }
            });
        });
    })
}

function load_links_from_airtable({users, companies, create}) {
    return new Promise((resolve) => {

        axios.get(`https://api.airtable.com/v0/appBlhk8AlG9XyuEo/Portfolio?`, {
            headers: {
                'Authorization': `Bearer ${AIR_TABLE_KEY}`
            }
        }).then((res) => {
            const offset = res.data.offset;
            console.log("ODSDSDFS", offset)
            res.data.records.forEach((record) => {
                let fields = record.fields || {};
                if (fields["Associated Person"]){
                    let airtable_user_id = fields["Associated Person"][0];

                    const user = users[airtable_user_id];

                    if (user && user.user_id !== 7) {

                        let link_name = fields["Name"];
                        let link_url = fields["Link"];
                        let link_type = fields["Type"];
                        let link_image_url = fields["Image"] ? fields["Image"][0].url : undefined;

                        let link = {
                            user_id: user.user_id,
                            link_name,
                            link_url,
                            link_image_url
                        }


                        if (link_type === "YouTube") {
                            link.link_type = "youtube";
                            console.log( "YOURUBE", user.user_id, user.username, link);

                            if (create) {
                                UserLinksService.create_user_link(link).then((id) => {
                                    console.log(id)
                                })
                            }
                        } else if (link_type === "Banner Link") {
                            link.link_type = "banner";
                            console.log( "BANNER", user.user_id, user.username, link);

                            if (create) {
                                UserLinksService.create_user_link(link).then((id) => {
                                    console.log(id)
                                })
                            }
                        } else if (link_type === "Small Link") {
                            link.link_type = "small";
                            console.log( "SMA:", user.user_id, user.username, link);

                            if (create) {
                                UserLinksService.create_user_link(link).then((id) => {
                                    console.log(id)
                                })
                            }
                        } else if (link_type === "Slideshow") {
                            fields["Image"].forEach((img, i ) => {


                                const { url } = img;

                                let gallery = {
                                    user_id: user.user_id,
                                    gallery_photo_url: url,
                                    gallery_order: i,
                                };

                                // console.log(gallery)

                                if (create) {
                                    UserGalleryService.create_user_gallery(gallery).then((id) => {
                                        console.log(id)
                                    });
                                }
                            })
                        }
                    }

                }
            });
        });
    })
}