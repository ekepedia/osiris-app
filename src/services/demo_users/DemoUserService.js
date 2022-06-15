const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const DEMO_USER_TABLE = "demo_users";
const FEEDBACK_USER_TABLE = "feedback_users";

module.exports.DEMO_USER_TABLE = DEMO_USER_TABLE;
module.exports.FEEDBACK_USER_TABLE = FEEDBACK_USER_TABLE;

const AIR_TABLE_KEY = "key967P3bJaUjmwX2";
const JOBS_BASE = "appZJyAhamGamN0SI";

let JOBS = [];
let EMPLOYERS = [];
let EMPLOYERS_USED = [];
let INDUSTRIES_USED = [];

let ROLES_USED = [];
let DEGREE_REQUIREMENTS_USED = [];

let DEGREE_REQUIREMENTS_MAP = {};
let ROLES_MAP = {};

let EMPLOYERS_MAP = {};
let LOCATIONS_MAP = {};
let JOB_TYPES_MAP = {};

let AFFINITY_MAP = {
    "Diverse Candidates": {
        affinity_id: "Diverse Candidates",
        id: "Diverse Candidates",
        label: "Diverse Candidates",
        name: "Diverse Candidates",
    },
    "Black-Founded": {
        affinity_id: "Black-Founded",
        id: "Black-Founded",
        label: "Black-Founded",
        name: "Black-Founded",
    },
    "Latinx-Founded": {
        affinity_id: "Latinx-Founded",
        id: "Latinx-Founded",
        label: "Latinx-Founded",
        name: "Latinx-Founded",
    },
};

let AFFINITIES = Object.values(AFFINITY_MAP);

let TYPES = [];
let INDUSTRIES = [];
let LOCATIONS = [];

module.exports.init = function (connection) {
    init = true;
    knex = connection;


    console.log("SQL: Demo User Service Successfully Initialized");

    // create_report();


    load_job_types().then(({job_types, job_types_map}) => {
        // console.log(job_types_map)

        INDUSTRIES = job_types;
        JOB_TYPES_MAP = job_types_map;
        load_locations().then(({locations, location_map}) => {
            LOCATIONS = locations;
            LOCATIONS_MAP = location_map;
            load_employers().then(({companies, company_map}) => {
                EMPLOYERS = companies;
                EMPLOYERS_MAP = company_map;

                axios.get(`https://api.airtable.com/v0/${JOBS_BASE}/Jobs?`, {
                    headers: {
                        'Authorization': `Bearer ${AIR_TABLE_KEY}`
                    }
                }).then((res) => {
                    // console.log(res.data);

                    res.data.records.forEach((record) => {

                        let fields = record.fields || {};

                        TYPES.push(fields['Type']);
                        TYPES = _.without(_.without(_.uniq(TYPES), null), undefined);

                        let job = convert_to_job(record);

                        JOBS.push(job);
                    });

                    // console.log(JOBS);
                    console.log(TYPES);
                });
            })
        })


    });



};

module.exports.get_jobs = get_jobs;

function get_jobs() {
    return new Promise((resolve, reject) => {
        return resolve({
            jobs: JOBS
        });
    });
}

module.exports.get_locations = get_locations;

function get_locations() {
    return new Promise((resolve, reject) => {
        return resolve({
            locations: LOCATIONS.sort((a, b) => {
                return a.label.localeCompare(b.label)
            })
        });
    });
}


module.exports.get_affinities = get_affinities;

function get_affinities() {
    return new Promise((resolve, reject) => {
        return resolve({
            affinities: AFFINITIES.sort((a, b) => {
                return a.label.localeCompare(b.label)
            })
        });
    });
}

module.exports.get_companies = get_companies;

function get_companies() {
    return new Promise((resolve, reject) => {
        return resolve({
            companies: EMPLOYERS_USED.map((employer) => (EMPLOYERS_MAP[employer])).sort((a, b) => {
                return a.label.localeCompare(b.label)
            })
        });
    });
}

module.exports.get_industries = get_industries;

function get_industries() {
    return new Promise((resolve, reject) => {
        return resolve({
            industries: INDUSTRIES_USED.map((industry) => (JOB_TYPES_MAP[industry])).sort((a, b) => {
                return a.label.localeCompare(b.label)
            })
        });
    });
}

module.exports.get_degree_requirements = get_degree_requirements;

function get_degree_requirements() {
    return new Promise((resolve, reject) => {
        return resolve({
            degree_requirements: DEGREE_REQUIREMENTS_USED.map((req) => (DEGREE_REQUIREMENTS_MAP[req])).sort((a, b) => {
                return a.label.localeCompare(b.label)
            })
        });
    });
}

module.exports.get_roles = get_roles;

function get_roles() {
    return new Promise((resolve, reject) => {
        return resolve({
            roles: ROLES_USED.map((req) => (ROLES_MAP[req])).sort((a, b) => {
                return a.label.localeCompare(b.label)
            })
        });
    });
}

function convert_to_job(record) {

    if (!record)
        return {};

    const now = new Date();
    let fields = record.fields || {};
    let created = fields['Posting Date'] ? new Date(fields['Posting Date']) : now;

    if (fields['Company'] && fields['Company'].length) {
        EMPLOYERS_USED.push(fields['Company'][0])
        EMPLOYERS_USED = _.uniq(EMPLOYERS_USED);
    }

    ROLES_USED.push(fields["Type"]);
    ROLES_USED = _.uniq(ROLES_USED);

    ROLES_MAP[fields["Type"]] = {
        job_type_id: fields["Type"],
        id: fields["Type"],
        name: fields["Type"],
        label: fields["Type"],
    };

    let affinities = [];

    Object.keys(AFFINITY_MAP).forEach((affinity) => {

        if (fields[affinity]) {
            affinities.push(AFFINITY_MAP[affinity])
        }

    });

    let job = {

        job_id: record.id,
        date_created: created,
        apply_link: fields["Link"],

        job_salary_estimate: fields['Salary Estimate'],

        date_created_label: created === now ? "Today" : moment().from(moment(created)),
        job_title: fields['Role'],
        job_overview: fields['Overview'],

        industries: fields['Role Tags'] && fields['Role Tags'].length ?
            fields['Role Tags'].map((job_type_id) => {
                INDUSTRIES_USED.push(job_type_id);
                INDUSTRIES_USED = _.uniq(INDUSTRIES_USED);
                return JOB_TYPES_MAP[job_type_id]
            })
            : [],

        job_types: [{
            job_type_id: fields["Type"],
            id: fields["Type"],
            label: fields["Type"],
            name: fields["Type"],
        }],

        qualifications: [
            {
                qualification_id: Math.round(Math.random()*100000),
                name: fields['Key Qualifications']
            }
        ],

        responsibilities: [
            {
                responsibility_id: Math.round(Math.random()*100000),
                name: fields['Responsibilities']
            }
        ],

        degree_requirements: fields['Degree Requirements'].map((requirement) => {


            if (requirement.indexOf("Master") === -1 && requirement.indexOf("Doctor") === -1) {
                DEGREE_REQUIREMENTS_USED.push(requirement);
                DEGREE_REQUIREMENTS_USED = _.uniq(DEGREE_REQUIREMENTS_USED);
                DEGREE_REQUIREMENTS_MAP[requirement] = {
                    degree_requirement_id: requirement,
                    id: requirement,
                    name: requirement,
                    label: requirement,
                };
            }


            return {
                degree_requirement_id: requirement,
                id: requirement,
                name: requirement,
                label: requirement,
            }
        }),
        companies: [
            fields['Company'] && fields['Company'].length ? EMPLOYERS_MAP[fields['Company'][0]] : {}
        ],
        affinities,
        locations:
            fields['Location'] && fields['Location'].length ?
                fields['Location'].map((location_id) => (LOCATIONS_MAP[location_id]))
                : [LOCATIONS_MAP["remote"]]

    };

    return job;
}

function load_employers() {
    let companies = [];
    let company_map = {};

    return new Promise((resolve, reject) => {
        axios.get(`https://api.airtable.com/v0/${JOBS_BASE}/Employers?`, {
            headers: {
                'Authorization': `Bearer ${AIR_TABLE_KEY}`
            }
        }).then((res) => {

            res.data.records.forEach((record) =>{
                let fields = record.fields || {};

                let company = {
                    company_id: record.id,
                    id: record.id,
                    label: fields['Name'],
                    company_name: fields['Name'],
                    company_logo: fields['Logo'] && fields['Logo'].length ? fields['Logo'][0].url : "",
                    company_about: fields['About'],
                }

                companies.push(company);
                company_map[company.company_id] = company;
            });

            resolve({
                companies,
                company_map
            });
        });
    })
}

function load_locations() {
    let locations = [{
        location_id: "remote",
        id: "remote",
        city: "Remote",
        state: "Remote",
        label: "Remote"
    }];
    let location_map = {
        "remote": {
            location_id: "remote",
            id: "remote",
            city: "Remote",
            state: "Remote",
            label: "Remote"
        }
    };

    return new Promise((resolve, reject) => {
        axios.get(`https://api.airtable.com/v0/${JOBS_BASE}/Locations?`, {
            headers: {
                'Authorization': `Bearer ${AIR_TABLE_KEY}`
            }
        }).then((res) => {

            res.data.records.forEach((record) =>{
                let fields = record.fields || {};

                let location = {
                    location_id: record.id,
                    id: record.id,
                    label: fields['Name'],
                    city: fields['City'],
                    state: fields['State']
                }

                if (fields['Jobs'] && fields['Jobs'].length) {
                    locations.push(location);
                }


                location_map[location.location_id] = location;
            });

            resolve({
                locations,
                location_map
            });
        });
    })
}


function load_job_types() {
    let job_types = [];
    let job_types_map = {};

    return new Promise((resolve, reject) => {
        axios.get(`https://api.airtable.com/v0/${JOBS_BASE}/Job%20Tags?`, {
            headers: {
                'Authorization': `Bearer ${AIR_TABLE_KEY}`
            }
        }).then((res) => {

            res.data.records.forEach((record) =>{
                let fields = record.fields || {};

                let job_type = {
                    industry_id: record.id,
                    id: record.id,
                    label: fields['Name'],
                    name: fields['Name'],
                }

                job_types.push(job_type);
                job_types_map[job_type.industry_id] = job_type;
            });

            resolve({
                job_types,
                job_types_map
            });
        });
    })
}

module.exports.get_demo_users = get_demo_users;

function get_demo_users({user_id, email_address}) {

    const query = DatabaseService.generate_query({user_id, email_address});

    let knexQuery = knex(DEMO_USER_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.create_demo_user = create_demo_user;

function create_demo_user({email_address, password, phone_number, gender, sexual_orientation, first_name,  last_name, instagram, linkedin}) {
    return new Promise((resolve, reject) => {
        if (!email_address)
            return reject(new Error("Missing email_address"));

        const query = DatabaseService.generate_query({email_address, password, phone_number, gender, sexual_orientation, first_name,  last_name, instagram, linkedin});

        knex(DEMO_USER_TABLE).insert(query).returning("user_id").then((rows) => {
            const user_id = rows[0];

            return resolve(user_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_demo_user = edit_demo_user;

function edit_demo_user({user_id, email_address, password, phone_number, gender, sexual_orientation, first_name,  last_name, instagram, linkedin}) {
    return new Promise((resolve, reject) => {
        if (!user_id)
            return reject(new Error("Missing user_id"));

        const query = {email_address, password, phone_number, gender, sexual_orientation, first_name,  last_name, instagram, linkedin};

        knex(DEMO_USER_TABLE).where({user_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_demo_user = remove_demo_user;

function remove_demo_user({user_id}) {
    return new Promise((resolve, reject) => {
        if (!user_id)
            return reject(new Error("Missing user_id"));

        const query = DatabaseService.generate_query({user_id});

        knex(DEMO_USER_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.get_feedback_users = get_feedback_users;

function get_feedback_users({feedback_id, email_address}) {

    const query = DatabaseService.generate_query({feedback_id, email_address});

    let knexQuery = knex(FEEDBACK_USER_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.create_feedback_user = create_feedback_user;

function create_feedback_user({email_address, password, phone_number, gender, sexual_orientation, first_name, last_name, instagram, linkedin}) {
    return new Promise((resolve, reject) => {
        if (!email_address)
            return reject(new Error("Missing email_address"));

        get_feedback_users({email_address}).then((feedback_users) => {
            if (feedback_users && feedback_users.length) {

                const user = feedback_users[0];
                const feedback_id = user.feedback_id

                if (email_address) {
                    const name = first_name && last_name ? (`${first_name} ${last_name}`) : (
                        first_name ? first_name : "Someone"
                    )

                    if (email_address && email_address.indexOf("eke") === -1) {
                        DatabaseService.post_to_slack(`*New Feedback Submission*\nHey Guys, it looks like ${name} (${email_address}) submitted again? Don't worry, we didn't add a new row!`);
                    }
                }

                edit_feedback_user({
                    feedback_id,
                    first_name,
                    last_name
                }).then(() => {
                    return resolve(feedback_id);
                }).catch(() => {
                    return resolve(feedback_id);
                });
            } else {
                const query = DatabaseService.generate_query({email_address, password, phone_number, gender, sexual_orientation, first_name,  last_name, instagram, linkedin});

                knex(FEEDBACK_USER_TABLE).insert(query).returning("feedback_id").then((rows) => {
                    const user_id = rows[0];

                    if (email_address) {
                        const name = first_name && last_name ? (`${first_name} ${last_name}`) : (
                            first_name ? first_name : "Someone"
                        )

                        if (email_address && email_address.indexOf("eke") === -1) {
                            DatabaseService.post_to_slack(`*New Feedback Submission*\nHey Guys, ${name} (${email_address}) just submitted! :tada:`);
                        }
                    }

                    return resolve(user_id);
                }).catch((err) => {
                    return reject(err);
                });
            }
        })


    });
}

module.exports.edit_feedback_user = edit_feedback_user;

function edit_feedback_user({feedback_id,

                                stage,

                                is_native,
                                is_asian,
                                is_black,
                                is_hispanic,
                                is_middle_eastern,
                                is_hawaiian,
                                is_white,
                                is_not_respond,

                                question_1,
                                question_2,
                                question_3,
                                question_4,
                                question_5,

                                wants_mentors,
                                wants_peers,
                                wants_internships,
                                wants_jobs,
                                wants_other,
                                other,

                                heard_seo,
                                heard_mlt,
                                heard_jopwell,
                                heard_valence,
                                heard_yc,
                                heard_elpha,
                                heard_lh,

                                school_1,
                                school_2,
                                school_3,
                                school_4,
                                school_5,

                                city,


                                email_address,
                                password,
                                phone_number,
                                gender,
                                sexual_orientation,
                                first_name,
                                last_name,
                                instagram,
                                linkedin
}) {
    return new Promise((resolve, reject) => {
        if (!feedback_id)
            return reject(new Error("Missing feedback_id"));

        const query = {
            stage,

            is_native,
            is_asian,
            is_black,
            is_hispanic,
            is_middle_eastern,
            is_hawaiian,
            is_white,
            is_not_respond,

            question_1,
            question_2,
            question_3,
            question_4,
            question_5,

            wants_mentors,
            wants_peers,
            wants_internships,
            wants_jobs,
            wants_other,
            other,

            heard_seo,
            heard_mlt,
            heard_jopwell,
            heard_valence,
            heard_yc,
            heard_elpha,
            heard_lh,

            school_1,
            school_2,
            school_3,
            school_4,
            school_5,

            city,

            email_address,
            password,
            phone_number,
            gender,
            sexual_orientation,
            first_name,
            last_name,
            instagram,
            linkedin
        };

        knex(FEEDBACK_USER_TABLE).where({feedback_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_feedback_user = remove_feedback_user;

function remove_feedback_user({feedback_id}) {
    return new Promise((resolve, reject) => {
        if (!feedback_id)
            return reject(new Error("Missing user_id"));

        const query = DatabaseService.generate_query({feedback_id});

        knex(FEEDBACK_USER_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

const SPAM = [
    'wdxpvqafsqxxepv@gmail.com'
];

const DUP = [
    'amariweddle@gmail.com',
];

const TEST = [
    'milesweddle@gmail.com',
];

let COUNTER = {};
let CITY_COUNTER = {};
let SCHOOL_COUNTER = {};
let TOTAL_COUNTER = {};
let FIELDS = [
    'stage',
    'question_1', 'question_2', 'question_3',
    'heard_seo', 'heard_mlt', 'heard_jopwell','heard_valence', 'heard_yc', 'heard_elpha', 'heard_lh',
    'wants_mentors', 'wants_peers', 'wants_internships','wants_jobs', 'wants_other',
    'is_native', 'is_asian', 'is_black','is_hispanic', 'is_middle_eastern', 'is_hawaiian', 'is_white', 'is_not_respond'
];

function create_report() {

    let TOTAL_USERS = 0;
    let TOTAL_RESPONSES = 0;
    let SURVEY_RESPONSES = 0;

    let other_text = "";

    console.log("")
    console.log("")
    console.log("")

    get_feedback_users({}).then((users) => {

        users = users.sort((a,b) => {
            return a.first_name.trim().localeCompare(b.first_name.trim())
        })

        users.map((user) => {
            if (DUP.indexOf(user.email_address) !== -1 || SPAM.indexOf(user.email_address) !== -1 || TEST.indexOf(user.email_address) !== -1) {
                return;
            }

            // if (!(!user.stage || user.stage.indexOf("Under") === -1))
            //     return

            console.log(`${user.first_name} ${user.last_name} ${user.email_address} ${user.city} ${user.school_1}`);

            CITY_COUNTER[user.city] = CITY_COUNTER[user.city] || 0;
            CITY_COUNTER[user.city] += parseFloat(1);

            SCHOOL_COUNTER[user.school_1] = SCHOOL_COUNTER[user.school_1] || 0;
            SCHOOL_COUNTER[user.school_1] += parseFloat(1);

            FIELDS.forEach((field) => {
                if (user[field] !== null) {
                    COUNTER[field] = COUNTER[field] || 0;
                    COUNTER[field] += parseFloat(user[field]);

                    TOTAL_COUNTER[field] = TOTAL_COUNTER[field] || 0;
                    TOTAL_COUNTER[field] += 1;
                }
            })

            if (user.other) {
                other_text += `"${user.other.trim()}" - ${user.first_name} ${user.last_name}`;
            }

            if (user.stage) {
                COUNTER[user.stage] = COUNTER[user.stage] || 0;
                COUNTER[user.stage] += 1;
            }

            if (user.gender) {
                COUNTER[user.gender] = COUNTER[user.gender] || 0;
                COUNTER[user.gender] += 1;
            }

            TOTAL_USERS += 1;
        });

        SURVEY_RESPONSES = TOTAL_COUNTER['stage'];
        TOTAL_RESPONSES = TOTAL_COUNTER['question_1'];

        console.log(COUNTER)
        console.log(TOTAL_COUNTER)

        console.log(SCHOOL_COUNTER)
        console.log(CITY_COUNTER)

        console.log(Object.keys(SCHOOL_COUNTER).length)

console.log(
`
Valid Emails: ${TOTAL_USERS}
    ${users.length} Total
    -${SPAM.length} Spam
    -${DUP.length} Duplicate
    -${TEST.length} Internal Team

Survey Responses: ${SURVEY_RESPONSES}

Yes/No Questions:
    ${Math.round(COUNTER['question_2']/TOTAL_RESPONSES * 100)}%: "Would join a platform"
    ${Math.round(COUNTER['question_1']/TOTAL_RESPONSES * 100)}%:  "Wish they had more support"
    ${Math.round(COUNTER['question_3']/TOTAL_RESPONSES * 100)}%:  "Would join a feedback group"

Wants Access to:
    ${Math.round(COUNTER['wants_mentors'] / TOTAL_RESPONSES * 100)}%: Mentors
    ${Math.round(COUNTER['wants_peers'] / TOTAL_RESPONSES * 100)}%: Peers
    ${Math.round(COUNTER['wants_jobs'] / TOTAL_RESPONSES * 100)}%: Jobs
    ${Math.round(COUNTER['wants_internships'] / TOTAL_RESPONSES * 100)}%: Internships
    ${Math.round(COUNTER['wants_other'] / TOTAL_RESPONSES * 100)}%:  Other
    
Other:
    ${other_text}

Has Heard of:
    ${Math.round(COUNTER['heard_seo'] / TOTAL_RESPONSES * 100)}%: SEO
    ${Math.round(COUNTER['heard_yc'] / TOTAL_RESPONSES * 100)}%: YC
    ${Math.round(COUNTER['heard_jopwell'] / TOTAL_RESPONSES * 100)}%:  Jopwell
    ${Math.round(COUNTER['heard_lh'] / TOTAL_RESPONSES * 100)}%:  Launch House
    ${Math.round(COUNTER['heard_mlt'] / TOTAL_RESPONSES * 100)}%:  MLT
    ${Math.round(COUNTER['heard_valence'] / TOTAL_RESPONSES * 100)}%:  Valence
    ${Math.round(COUNTER['heard_elpha'] / TOTAL_RESPONSES * 100)}%:  Elpha
    
Gender:
    ${Math.round(COUNTER['Man'] / SURVEY_RESPONSES * 100)}%: Man
    ${Math.round(COUNTER['Woman'] / SURVEY_RESPONSES * 100)}%: Woman
    
Race:
    ${Math.round(COUNTER['is_black'] / SURVEY_RESPONSES * 100)}%: Black
    ${Math.round(COUNTER['is_asian'] / SURVEY_RESPONSES * 100)}%: Asian
    ${Math.round(COUNTER['is_white'] / SURVEY_RESPONSES * 100)}%: White
    ${Math.round(COUNTER['is_hispanic'] / SURVEY_RESPONSES * 100)}%: Hispanic
    ${Math.round(COUNTER['is_native'] / SURVEY_RESPONSES * 100)}%:  Native
    ${Math.round(COUNTER['is_middle_eastern'] / SURVEY_RESPONSES * 100)}%:  Middle Eastern
    ${Math.round(COUNTER['is_hawaiian'] / SURVEY_RESPONSES * 100)}%:  Hawaiian
    ${Math.round(COUNTER['is_not_respond'] / SURVEY_RESPONSES * 100)}%:  No Response
        
Employment:
    ${Math.round(COUNTER['Employed, Full-Time'] / SURVEY_RESPONSES * 100)}%: Employed, Full-Time
    ${Math.round(COUNTER['Undergraduate Student'] / SURVEY_RESPONSES * 100)}%: Undergraduate Student
    ${Math.round(COUNTER['Graduate Student'] / SURVEY_RESPONSES * 100)}%: Graduate Student
    ${Math.round(COUNTER['Employed, Part-Time'] / SURVEY_RESPONSES * 100)}%:  Employed, Part-Time
    ${Math.round(COUNTER['Unemployed'] / SURVEY_RESPONSES * 100)}%:  Unemployed

Pulled: ${new Date()}
`);
    });
}