const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const csv = require('csv-parser');
const fs = require('fs');

const AIR_TABLE_KEY = "key967P3bJaUjmwX2";
const JOBS_BASE = "appZJyAhamGamN0SI";

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const JOBS_TABLE = "jobs";
const SERVICE_NAME = "Jobs Service";
const SERVICE_DEFAULT_TABLE = JOBS_TABLE;

let WEBSCRAPED_JOBS = [];
let JOB_COUNTS = {};

module.exports.JOBS_TABLE = JOBS_TABLE;
module.exports.WEBSCRAPED_JOBS = WEBSCRAPED_JOBS;
module.exports.JOB_COUNTS = JOB_COUNTS;

const join_character = ";@;";

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);

    // test_endpoints();
    // mass_delete();
    // import_airtable_jobs();
    // format_jobs_for_job_board();
    // import_webscraper_jobs();
    load_job_counts();
};

module.exports.get_jobs = get_jobs;

function get_jobs({
                      job_id,
                      airtable_job_id,
                      airtable_company_id,
                      company_id,
                      company_name,
                      user_id,
                      date_created,
                      date_created_label,
                      apply_link,
                      job_salary_estimate,
                      job_title,
                      job_overview,
                      job_qualifications,
                      job_responsibilities,
                      job_type,
                      job_deadline,
                      job_sectors,
                      job_degree_requirements,
                      job_locations,
                      submitted_by_id,
                      is_verified,
                      is_active,
                      is_user_submitted,
                      diverse_candidates,
                      job_html,
                      job_seniority,
                      job_board_category,
                      job_source,
                      is_public,
                      batch_id,
                      airtable_batch_id
}) {

    const query = DatabaseService.generate_query({
        job_id,
        airtable_job_id,
        airtable_company_id,
        company_id,
        company_name,
        user_id,
        date_created,
        date_created_label,
        apply_link,
        job_salary_estimate,
        job_title,
        job_overview,
        job_qualifications,
        job_responsibilities,
        job_type,
        job_deadline,
        job_sectors,
        job_degree_requirements,
        job_locations,
        submitted_by_id,
        is_verified,
        is_active,
        is_user_submitted,
        diverse_candidates,
        job_html,
        job_seniority,
        job_board_category,
        job_source,
        is_public,
        batch_id,
        airtable_batch_id
    });

    let knexQuery = knex(SERVICE_DEFAULT_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.create_job = create_job;

function create_job({
                        airtable_job_id,
                        airtable_company_id,
                        company_id,
                        company_name,
                        user_id,
                        date_created,
                        date_created_label,
                        apply_link,
                        job_salary_estimate,
                        job_title,
                        job_overview,
                        job_qualifications,
                        job_responsibilities,
                        job_type,
                        job_deadline,
                        job_sectors,
                        job_degree_requirements,
                        job_locations,
                        submitted_by_id,
                        is_verified,
                        is_active,
                        is_user_submitted,
                        diverse_candidates,
                        job_html,
                        job_seniority,
                        job_board_category,
                        job_source,
                        is_public,
                        batch_id,
                        airtable_batch_id
                    }) {
    return new Promise((resolve, reject) => {
        if (!company_id && !company_name)
            return reject(new Error("Missing company_id || company_name"));

        const query = DatabaseService.generate_query({
            airtable_job_id,
            airtable_company_id,
            company_id,
            company_name,
            user_id,
            date_created,
            date_created_label,
            apply_link,
            job_salary_estimate,
            job_title,
            job_overview,
            job_qualifications,
            job_responsibilities,
            job_sectors,
            job_type,
            job_deadline,
            job_degree_requirements,
            job_locations,
            submitted_by_id,
            is_verified,
            is_active,
            is_user_submitted,
            diverse_candidates,
            job_html,
            job_seniority,
            job_board_category,
            job_source,
            is_public,
            batch_id,
            airtable_batch_id
        });

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("job_id").then((rows) => {
            const job_id = rows[0];

            return resolve(job_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_job = edit_job;

function edit_job({
                      job_id,
                      airtable_job_id,
                      airtable_company_id,
                      company_id,
                      company_name,
                      user_id,
                      date_created,
                      date_created_label,
                      apply_link,
                      job_salary_estimate,
                      job_title,
                      job_overview,
                      job_qualifications,
                      job_responsibilities,
                      job_sectors,
                      job_type,
                      job_deadline,
                      job_degree_requirements,
                      job_locations,
                      submitted_by_id,
                      is_verified,
                      is_active,
                      is_user_submitted,
                      diverse_candidates,
                      job_html,
                      job_seniority,
                      job_board_category,
                      job_source,
                      is_public,
                      batch_id,
                      airtable_batch_id
}) {
    return new Promise((resolve, reject) => {
        if (!job_id)
            return reject(new Error("Missing job_id"));

        const query = {
            airtable_job_id,
            airtable_company_id,
            company_id,
            company_name,
            user_id,
            date_created,
            date_created_label,
            apply_link,
            job_salary_estimate,
            job_title,
            job_overview,
            job_qualifications,
            job_responsibilities,
            job_sectors,
            job_type,
            job_deadline,
            job_degree_requirements,
            job_locations,
            submitted_by_id,
            is_verified,
            is_active,
            is_user_submitted,
            diverse_candidates,
            job_html,
            job_seniority,
            job_board_category,
            job_source,
            is_public,
            batch_id,
            airtable_batch_id
        };

        knex(SERVICE_DEFAULT_TABLE).where({job_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_job = remove_job;

function remove_job({job_id}) {
    return new Promise((resolve, reject) => {
        if (!job_id)
            return reject(new Error("Missing job_id"));

        const query = DatabaseService.generate_query({job_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.format_jobs_for_job_board = format_jobs_for_job_board;

function format_jobs_for_job_board() {
    return new Promise((resolve, reject) => {
        get_jobs({
            is_user_submitted: false,
            job_source: "glassdoor"
        }).then((jobs) => {
            jobs = jobs.map((job) => {

                return {

                    job_id: job.job_id,
                    date_created: new Date().getTime(),
                    apply_link: job.apply_link,

                    job_salary_estimate: job.job_salary_estimate,

                    date_created_label: null,
                    job_title: job.job_title,
                    job_overview: job.job_overview,

                    industries: job.job_sectors && job.job_sectors.length ?
                        job.job_sectors.split(join_character).map((job_sector) => {
                            return {
                                industry_id: job_sector,
                                id: job_sector,
                                label: job_sector,
                                name: job_sector,
                            }
                        })
                        : [],

                    job_types:  [{
                        job_type_id: job.job_type,
                        id: job.job_type,
                        label: job.job_type,
                        name: job.job_type,
                    }],

                    qualifications: [
                        {
                            qualification_id: Math.round(Math.random()*100000),
                            name: job.job_qualifications
                        }
                    ],

                    responsibilities: [
                        {
                            responsibility_id: Math.round(Math.random()*100000),
                            name: job.job_responsibilities
                        }
                    ],

                    degree_requirements: job.job_degree_requirements && job.job_degree_requirements.length ? job.job_degree_requirements.split(join_character).map((requirement) => {
                        return {
                            degree_requirement_id: requirement,
                            id: requirement,
                            name: requirement,
                            label: requirement,
                        }
                    }) : [],
                    company_id: job.company_id,
                    // companies: [
                    //     fields['Company'] && fields['Company'].length ? EMPLOYERS_MAP[fields['Company'][0]] : {}
                    // ],
                    affinities: job.diverse_candidates ? [{
                        affinity_id: "Diverse Candidates",
                        id: "Diverse Candidates",
                        label: "Diverse Candidates",
                        name: "Diverse Candidates",
                    }]: [],


                    job_html: job.job_html,
                    job_board_category: job.job_board_category,
                    job_seniority: job.job_seniority,


                    locations: job.job_locations && job.job_locations.length ? job.job_locations.split(join_character).map((location) => {
                            return {
                                location_id: location,
                                id: location,
                                city: location,
                                state: location,
                                label: location
                            }
                        })
                        : [{
                            location_id: "remote",
                            id: "remote",
                            city: "Remote",
                            state: "Remote",
                            label: "Remote"
                        }]
                }

            });

            // console.log(jobs)
            resolve(jobs);
        })
    })

}

function test_endpoints() {
    // get_jobs({}).then((d) => {
    //     console.log("JOBS", d);
    // });
    // //

    // edit_job({
    //     job_id:"1",
    //     company_name: "No Label",
    // }).then(() => {})

    //
    // create_job({
    //    job_title: "test job 1",
    //     company_name: "small company",
    // }).then((e) =>{
    //     console.log(e)
    // })

    // remove_job({job_id: 1}).then((r) =>{
    //     console.log("REMOVED", r);
    // })
}

function import_airtable_jobs() {

    const airtable_batch_id = moment().format("MM-DD-YYYY-hh-mm-ss");

    axios.get(`https://api.airtable.com/v0/${JOBS_BASE}/Jobs?`, {
        headers: {
            'Authorization': `Bearer ${AIR_TABLE_KEY}`
        }
    }).then((res) => {
        // console.log(res.data);

        res.data.records.forEach((record) => {

            let fields = record.fields || {};


            if (!fields["Record ID (from New Company)"])
                return

            const airtable_company_id = fields["Record ID (from New Company)"][0];

            const CompanyService = require("../companies/CompanyService");


            CompanyService.get_companies({airtable_company_id}).then((companies) => {
                if (companies && companies.length) {
                    const company = companies[0];

                    let job = {
                        airtable_job_id: record.id,
                        airtable_company_id,
                        company_id: company.company_id,
                        user_id: null,
                        apply_link: fields["Link"],
                        company_name: company.company_name,
                        job_title: fields["Role"],
                        job_overview: fields["Overview"],
                        job_qualifications: fields["Key Qualifications"],
                        job_responsibilities: fields["Responsibilities"],
                        job_deadline: fields["Application Deadline"],

                        job_type: fields["Type"],
                        submitted_by_id: null,
                        is_user_submitted: false,
                        diverse_candidates: fields["Diverse Candidates"] || false,
                        is_public: true,
                        job_sectors: (fields["Name (from Role Tags)"] || []).join(join_character),
                        job_locations: (fields["Name (from Location)"] || []).join(join_character),
                        job_degree_requirements: (fields["Degree Requirements"] || []).join(join_character),
                        airtable_batch_id
                    }

                    // console.log(job)

                    // create_job(job).then((job_id) => {
                    //     console.log(job_id)
                    // })
                }
            })



        });

    });
}

function load_job_counts() {
    get_jobs({
        is_user_submitted: false,
        job_source: "glassdoor"
    }).then((jobs) => {
        console.log("jobs, lenths", jobs.length);
        jobs.forEach((job) => {
            JOB_COUNTS[job.company_id] = JOB_COUNTS[job.company_id] || 0;
            JOB_COUNTS[job.company_id]++
        })
    })
}

function import_webscraper_jobs() {
    const filename = "221004 - 1646- lever-scraper - various.csv";

    fs.createReadStream(__dirname + `/../../../data/${filename}`)
        .pipe(csv())
        .on('data', (job) => {

            let job_locations = process_locations(job);
            job_locations = job_locations.map((location) => {
                return {
                    location_id: location,
                    id: location,
                    city: location,
                    state: location,
                    label: location
                }
            });

            let job_sector = job.job_sector.replace("/","").trim();

            let company = job["web-scraper-start-url"];
            let job_for_board = {
                job_id: Math.random(),
                date_created: new Date().getTime(),
                apply_link: job["apply_link-href"],
                locations: job_locations,
                job_salary_estimate: null,

                date_created_label: null,
                job_title: job.job_title,
                job_overview: "",
                industries: {
                    industry_id: job_sector,
                    id: job_sector,
                    label: job_sector,
                    name: job_sector,
                },
                job_types: [{
                    job_type_id: job.job_type,
                    id: job.job_type,
                    label: job.job_type,
                    name: job.job_type,
                }],
                qualifications: [],
                responsibilities: [],
                degree_requirements: [],
                company_id: null,
                companies: [{
                    company_name: company,
                    company_website: company,
                    company_logo_url: null,
                    company_industry: null
                }],
                affinities: [],
                job_html: job.job_html
            };

            // console.log(job_for_board)
            WEBSCRAPED_JOBS.push(job_for_board);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });
}

module.exports.set_webscraped_jobs = set_webscraped_jobs;

function set_webscraped_jobs (jobs) {
    WEBSCRAPED_JOBS = jobs;
    module.exports.WEBSCRAPED_JOBS = WEBSCRAPED_JOBS;
}

function process_locations(job) {

    if (!job)
        return []
    let { job_location } = job;
    let split_locations = job_location.split("/");
    split_locations = split_locations.map((l) => ((l || "").trim()))
    split_locations = _.flattenDeep(split_locations.map((l) => {return (l || "").split(" or")}))

    split_locations = _.without(split_locations, '')
    split_locations = split_locations.map((l) => (clean_location(l || "")));
    split_locations = _.flattenDeep(split_locations);
    split_locations = split_locations.map((l) => ((l || "").trim()))

    return split_locations;
}

function clean_location(location) {
    if (location === "Telecommuter")
        return "Remote"

    if (location === "NYC")
        return "New York, NY"

    if (location === "DC")
        return "Washington, DC"

    if (location === "NYC, DC,")
        return ["New York, NY", "Washington, DC"]

    return location
}

function mass_delete() {
    knex(SERVICE_DEFAULT_TABLE).whereNot({user_id: 7}).del().then(() => {
    }).catch((err) => {
    });
}

