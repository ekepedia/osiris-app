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

    const DATA = [
        {
            "role_name": "Chief Executive Officer",
            "company_name": "Trillicon Valley",
            "company_logo_url": "https://dl.airtable.com/.attachments/c2ed95ed3bb160fed18c37af7a9e7672/6f4fecc5/TrilliconValley.png",
            "Associated Person": "Jason Mayden",
            "start_date": "8/1/2017",
            "end_date": "",
            "user_id": 7
        },
        {
            "role_name": "(Interim) President - Fear of God Athletics",
            "company_name": "Fear of God",
            "company_logo_url": "https://dl.airtable.com/.attachments/fed44e7f47d2c17dda165cd2914d9ed3/c9934fd7/FearofGod.png",
            "Associated Person": "Jason Mayden",
            "start_date": "12/1/2020",
            "end_date": "",
            "user_id": 7
        },
        {
            "role_name": "Advisory Board Member",
            "company_name": "VSCO",
            "company_logo_url": "https://dl.airtable.com/.attachments/1dd882ed1e7b82295c3938ecbc8e4be2/bb8c466b/VSCO.png",
            "Associated Person": "Jason Mayden",
            "start_date": "1/1/2016",
            "end_date": "",
            "user_id": 7
        },
        {
            "role_name": "Advisory Board Member",
            "company_name": "Uptake",
            "company_logo_url": "https://dl.airtable.com/.attachments/18bbcdbc602b1f203e6e635e27e7d15a/da6ce8a3/Uptake.png",
            "Associated Person": "Jason Mayden",
            "start_date": "5/1/2016",
            "end_date": "",
            "user_id": 7
        },
        {
            "role_name": "Board Member",
            "company_name": "StreetCode Academy",
            "company_logo_url": "https://dl.airtable.com/.attachments/b9b15be5eb67ff9ab55003f1a20fcfc7/a13bfa15/StreetCodeAcademy.png",
            "Associated Person": "Jason Mayden",
            "start_date": "6/1/2015",
            "end_date": "",
            "user_id": 7
        },
        {
            "role_name": "d.school Advisory Board Member",
            "company_name": "Stanford University",
            "company_logo_url": "https://dl.airtable.com/.attachments/1b23f95ca71971e4ce555a04fa7c8803/7e8ddbee/StanfordUniversity.png",
            "Associated Person": "Jason Mayden",
            "start_date": "5/1/2013",
            "end_date": "12/1/2021",
            "user_id": 7
        },
        {
            "role_name": "Advisory Board Member",
            "company_name": "College for Creative Studies",
            "company_logo_url": "https://dl.airtable.com/.attachments/ad2be8d38cfc0c85f284f9d9c8db36a8/6b06aa27/CollegeforCreativeStudies.png",
            "Associated Person": "Jason Mayden",
            "start_date": "5/1/2012",
            "end_date": "12/1/2021",
            "user_id": 7
        },
        {
            "role_name": "CEO + Co-Founder",
            "company_name": "Super Heroic",
            "company_logo_url": "https://dl.airtable.com/.attachments/19ebd67ca731ebebef5cb6e5b58db725/9a552dff/SuperHeroic.png",
            "Associated Person": "Jason Mayden",
            "start_date": "5/1/2016",
            "end_date": "6/1/2020",
            "user_id": 7
        },
        {
            "role_name": "d.Fellow, Media Designer & Lecturer",
            "company_name": "Hasso Plattner Institute of Design at Stanford ( d.school )",
            "company_logo_url": "https://dl.airtable.com/.attachments/375f9c926141244854ab1850f22e696c/858a283e/HassoPlattnerInstituteofDesignatStanfordd_school.png",
            "Associated Person": "Jason Mayden",
            "start_date": "3/1/2014",
            "end_date": "9/1/2018",
            "user_id": 7
        },
        {
            "role_name": "Co-Founder + CPO",
            "company_name": "Slyce.io",
            "company_logo_url": "https://dl.airtable.com/.attachments/b39b33aed594153e3d48e77c8e68b5bb/2b48aef6/Slyce_io.png",
            "Associated Person": "Jason Mayden",
            "start_date": "7/1/2015",
            "end_date": "7/1/2016",
            "user_id": 7
        },
        {
            "role_name": "VP of Design",
            "company_name": "Mark One",
            "company_logo_url": "https://dl.airtable.com/.attachments/d6a2014eeb3cdffec2c73d5902406d7a/53325df0/MarkOne.png",
            "Associated Person": "Jason Mayden",
            "start_date": "6/1/2014",
            "end_date": "10/1/2015",
            "user_id": 7
        },
        {
            "role_name": "Sr. Global Design Director - Brand Jordan",
            "company_name": "Nike",
            "company_logo_url": "https://dl.airtable.com/.attachments/fc616339614106e0b499354f38ed28f4/40c52f37/Nike.png",
            "Associated Person": "Jason Mayden",
            "start_date": "11/1/2012",
            "end_date": "6/1/2014",
            "user_id": 7
        },
        {
            "role_name": "Director of Innovation - Digital Sport",
            "company_name": "Nike",
            "company_logo_url": "https://dl.airtable.com/.attachments/fc616339614106e0b499354f38ed28f4/40c52f37/Nike.png",
            "Associated Person": "Jason Mayden",
            "start_date": "7/1/2011",
            "end_date": "11/1/2012",
            "user_id": 7
        },
        {
            "role_name": "Sr. Product Designer (Footwear/Brand/Apparel/Innovation)",
            "company_name": "Nike",
            "company_logo_url": "https://dl.airtable.com/.attachments/fc616339614106e0b499354f38ed28f4/40c52f37/Nike.png",
            "Associated Person": "Jason Mayden",
            "start_date": "1/1/2001",
            "end_date": "6/1/2011",
            "user_id": 7
        },
        {
            "role_name": "Co-Chair Nike BEN (Black Employee Network)",
            "company_name": "Nike",
            "company_logo_url": "https://dl.airtable.com/.attachments/fc616339614106e0b499354f38ed28f4/40c52f37/Nike.png",
            "Associated Person": "Jason Mayden",
            "start_date": "6/1/2011",
            "end_date": "9/1/2013",
            "user_id": 7
        },
        {
            "role_name": "Stanford GSB & TEDxSV (Silicon Valley) Planning Committee",
            "company_name": "Stanford Graduate School of Business",
            "company_logo_url": "https://dl.airtable.com/.attachments/20c8ffef15d819664907c128e7d8c2df/066fa833/StanfordGraduateSchoolofBusiness.png",
            "Associated Person": "Jason Mayden",
            "start_date": "2/1/2011",
            "end_date": "6/1/2011",
            "user_id": 7
        },
        {
            "role_name": "Sloan Fellow",
            "company_name": "Stanford Graduate School of Business",
            "company_logo_url": "https://dl.airtable.com/.attachments/20c8ffef15d819664907c128e7d8c2df/066fa833/StanfordGraduateSchoolofBusiness.png",
            "Associated Person": "Jason Mayden",
            "start_date": "5/1/2010",
            "end_date": "6/1/2011",
            "user_id": 7
        }
    ];

    // DATA.forEach((row) => {
    //
    //     row.end_date = row.end_date && row.end_date.length ? new Date(row.end_date).getTime() : undefined;
    //     row.start_date = row.start_date && row.start_date.length ? new Date(row.start_date).getTime() : undefined;
    //
    //     delete row["Associated Person"];
    //     console.log(row);
    //
    //     create_user_experience(row).then((e) => {
    //         console.log(e)
    //     })
    // })

    // knex(SERVICE_DEFAULT_TABLE).where({user_id: 7}).del().then(() => {
    // }).catch((err) => {
    // });
};

module.exports.get_user_experiences = get_user_experiences;

function get_user_experiences({user_education_id, user_id}) {

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

module.exports.create_user_experience = create_user_experience;

function create_user_experience({user_id, company_id, company_name, company_logo_url, role_id, role_name, is_current, start_date, end_date, type, type_id, description,}) {
    return new Promise((resolve, reject) => {
        if (!user_id || !company_name)
            return reject(new Error("Missing user_id or company_name"));

        const query = DatabaseService.generate_query({user_id, company_id, company_name, company_logo_url, role_id, role_name, is_current, start_date, end_date, type, type_id, description});

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("user_experience_id").then((rows) => {
            const user_experience_id = rows[0];

            return resolve(user_experience_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_user_experience = edit_user_experience;

function edit_user_experience({user_experience_id, user_id, company_id, company_name, company_logo_url, role_id, role_name, is_current, start_date, end_date, type, type_id, description}) {
    return new Promise((resolve, reject) => {
        if (!user_experience_id)
            return reject(new Error("Missing user_experience_id"));

        const query = { user_id, company_id, company_name, company_logo_url, role_id, role_name, is_current, start_date, end_date, type, type_id, description};

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