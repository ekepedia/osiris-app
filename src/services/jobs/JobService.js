
const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const csv = require('csv-parser');
const fs = require('fs');

const AIR_TABLE_KEY = "key967P3bJaUjmwX2";
const JOBS_BASE = "appZJyAhamGamN0SI";

const DatabaseService = require("../DatabaseService");
const CompanyService = require("../companies/CompanyService");

let init = false;
let knex = null;

const JOBS_TABLE = "jobs";
const JOBS_BUFFER_TABLE = "jobs_buffer";
const SERVICE_NAME = "Jobs Service";
const SERVICE_DEFAULT_TABLE = JOBS_TABLE;

let WEBSCRAPED_JOBS = [];
let ALL_JOBS = [];
let JOB_COUNTS = {};


let COMPANY_MAP = {};
let JOB_TITLE_MAP = {};
let INDUSTRY_MAP = {};
let SENORITY_MAP = {};
let LOCATION_MAP = {};

module.exports.JOBS_TABLE = JOBS_TABLE;
module.exports.JOBS_BUFFER_TABLE = JOBS_BUFFER_TABLE;
module.exports.WEBSCRAPED_JOBS = WEBSCRAPED_JOBS;
module.exports.JOB_COUNTS = JOB_COUNTS;
module.exports.ALL_JOBS = ALL_JOBS;

module.exports.get_all_companies = () => {
    return COMPANY_MAP;
};

module.exports.get_all_job_titles = () => {
    return JOB_TITLE_MAP;
};

module.exports.get_all_industries = () => {
    return INDUSTRY_MAP;
};

module.exports.get_all_senorities = () => {
    return SENORITY_MAP;
};

module.exports.get_all_locations = () => {
    return LOCATION_MAP;
};

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
    get_jobs_for_job_board({}).then(() => {});
    // port_buffer_to_jobs().then(() => {
    //
    // });

    // get_buffer_for_lambda().then((rows) => {
    //     console.log(rows);
    // })
    // populate_job_board_links();
    // call_lambda({
    //     job_board_link:"https://www.glassdoor.com/Job/new-york-financial-analyst-jobs-SRCH_IL.0,8_IC1132348_KO9,26.htm",
    //     attempts: 1
    // }).then((data) => {
    //     console.log(data);
    // })

    // internships
    // get_jobs_by_ids({jobs_ids: ["30555", "30550", "30535", "30548", "30524"]}).then((jobs) => {
    //     // console.log("jobs", jobs);
    //
    //     if (jobs && jobs.length) {
    //         jobs.forEach((job) => {
    //
    //             let { job_id, job_title, company_name} = job;
    //             let apply_link = `https://www.pearl.works/jobs?j=${job_id}`;
    //             let html = generate_html({job_title, company_name, apply_link});
    //             console.log("\n\n", html, "\n\n",);
    //
    //         })
    //     }
    // })

    //jobs
    get_jobs_by_ids({jobs_ids: ["32940","32928", "32899", "32788", "32501", "32917"]}).then((jobs) => {
        // console.log("jobs", jobs);

        return
        if (jobs && jobs.length) {
            console.log("\n\n");
            jobs.forEach((job) => {

                let { job_id, job_title, company_name} = job;
                // let apply_link = `https://www.pearl.works/jobs?j=${job_id}`;
                let apply_link = `https://www.pearl.works/jobs?j=${job_id}&t=Product%20Manager`;
                let html = generate_html({job_title, company_name, apply_link});
                console.log(html);

            })
            console.log("\n\n");

        }
    })
};

let TITTLES = [{"job_category":"Account Manager"},{"job_category":"Aerospace Engineer"},{"job_category":"Biology Research Assistant"},{"job_category":"Business Analyst"},{"job_category":"Chemistry Research Assistant"},{"job_category":"Associate Consultant"},{"job_category":"Customer Success Manager"},{"job_category":"Data Science Analyst"},{"job_category":"Assistant Electrical Engineer"},{"job_category":"Financial Analyst"},{"job_category":"Junior Graphic Designer"},{"job_category":"Machine Learning Engineer"},{"job_category":"Marketing Coordinator"},{"job_category":"Mechanical Engineer"},{"job_category":"Paralegal"},{"job_category":"Associate Product Manager"},{"job_category":"Recruiter"},{"job_category":"Product Strategy"},{"job_category":"Associate Software Engineer"},{"job_category":"Life Sciences Analyst"},{"job_category":"Research Analyst"},{"job_category":"Social Media Coordinator"},{"job_category":"Research Associate"},{"job_category":"Sales and Trading Markets Analyst"},{"job_category":"Sales Strategy & Operations"},{"job_category":"Systems Engineer"},{"job_category":"Product Sales"},{"job_category":"Chief of Staff"},{"job_category":"Digital Marketing Project Manager"},{"job_category":"Digital Strategy Manager"},{"job_category":"Management Consultant"},{"job_category":"Media Planner"},{"job_category":"Private Equity Analyst"},{"job_category":"Private Equity Associate"},{"job_category":"Product Manager"},{"job_category":"Product Owner"},{"job_category":"Program Manager"},{"job_category":"Project Coordinator"},{"job_category":"Project Finance Analyst"},{"job_category":"Software Engineer"},{"job_category":"Software Engineer Associate"},{"job_category":"Staff Software Engineer"},{"job_category":"Strategist"},{"job_category":"Supply Chain Planner"},{"job_category":"Acquisitions Analyst"},{"job_category":"Advisory Associate"},{"job_category":"Audit Associate"},{"job_category":"Backend Engineer"},{"job_category":"Business Technology Analyst"},{"job_category":"Clean Energy Strategic Analyst"},{"job_category":"Community Operations Manager & Designer"},{"job_category":"Consultant"},{"job_category":"Data Scientist"},{"job_category":"Enterprise Account Executive"},{"job_category":"Equities Analyst"},{"job_category":"Health Management Consultant"},{"job_category":"Junior Full Stack Developer"},{"job_category":"Life Sciences Associate"},{"job_category":"Account Executive"},{"job_category":"Advisory Senior Associate"},{"job_category":"Aeronautical Engineer Associate"},{"job_category":"Associate Product Designer"},{"job_category":"Business & Integration Architecture Analyst"},{"job_category":"Business Development Associate"},{"job_category":"Cloud Native Engineer"},{"job_category":"Commercial Real Estate Analyst"},{"job_category":"Communications Designer"},{"job_category":"Corporate Strategy"},{"job_category":"Data Strategist"},{"job_category":"Digital Customer Solutions Manager"},{"job_category":"Digital Experience Specialist"},{"job_category":"Institutional Equity Sales Analyst"},{"job_category":"Manager of Entertainment and Influencer"},{"job_category":"Mechanical Design Engineer"},{"job_category":"Media Manager"},{"job_category":"Product Manager II"},{"job_category":"Program Analyst"},{"job_category":"Program Specialist"},{"job_category":"Quantitative Trader"},{"job_category":"Real Estate Analyst"},{"job_category":"Real Estate Syndicated Finance Analyst"},{"job_category":"Senior Associate Software Engineer"},{"job_category":"Senior Consultant"},{"job_category":"Senior Data Analyst"},{"job_category":"Senior Manager"},{"job_category":"Senior Product Manager"},{"job_category":"Software Development Engineer"},{"job_category":"Space Vehicle Systems Engineer"},{"job_category":"Sustainability Fellow"},{"job_category":"Training and Content Coordinator"},{"job_category":"Trust Solutions Assurance Associate"},{"job_category":"Value Chain Finance Analyst"},{"job_category":"Wealth Management Analyst"}];
let JOB_TITLES = TITTLES.map((a) => (a.job_category));


// function generate_html({apply_link, company_name, job_title}) {
//     let html =
// `<tr><td align="left" class="v  s-8 m" style="font-size:0;padding-bottom:18px;word-break:break-word;"><div class="il">
// <!--[if mso | IE]>
// <table role="none" border="0" cellpadding="0" cellspacing="0" align="left"><tr><td style="padding:0;padding-top:0;padding-left:0;padding-right:0;padding-bottom:0;" class="l-outlook -outlook -outlook">
// <![endif]--> <a class="l  " href="${apply_link}" target="_blank" style="display:inline-block;color:#000000;font-family:Inter,Arial,sans-serif;font-size:13px;font-weight:normal;line-height:0;text-decoration:none;text-transform:none;padding:0;padding-top:0;padding-left:0;padding-right:0;padding-bottom:0;"><ul class="glist" style="font-size:14px;color:#101840;padding:0;font-weight:700;Margin:0 0 0 14px;list-style-position:inside;"><li style="Margin:0;"><span style="font-size:14px;font-family:Inter,Arial,sans-serif;font-weight:700;color:#101840;line-height:121%;text-decoration:underline;"><span style="font-size:14px;font-family:Inter,Arial,sans-serif;font-weight:700;color:#101840;line-height:121%;text-decoration:underline;">${company_name}</span><span style="font-size:14px;font-family:Inter,Arial,sans-serif;font-weight:400;color:#101840;line-height:121%;text-decoration:underline;"> | ${job_title}
// </span></span></li></ul></a>
// <!--[if mso | IE]>
// </td></tr></table>
// <![endif]--></div>
// </td></tr>`
//     return html
// }

function generate_html({apply_link, company_name, job_title}) {
    let html = `
<li style="text-decoration:underline; padding: 8px 0">
    <a style="color: #23496d;" href="${apply_link}">
        <span style="font-weight:700">${company_name}</span> | <span>${job_title}</span>
    </a>
</li>`;
    return html
}

module.exports.port_buffer_to_jobs = port_buffer_to_jobs;

function port_buffer_to_jobs() {
    let knexQuery = knex(JOBS_BUFFER_TABLE).whereNotNull("job_html");

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {

            rows = rows.map((row) => {
                // if (JOB_TITLES.indexOf(row.job_board_category) === -1)
                //     return null;

                // if (row.batch_id.indexOf("single") === -1)
                //     return null;

                // if (row.job_company.indexOf("Patreon") === -1)
                //     return null;

                // if (row.job_buffer_id !== 8781)
                //        return null;

                return row;
            });

            rows =  _.without(rows, null)

            console.log("JOB TO PORT", rows.length)

            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.get_buffer_for_lambda = get_buffer_for_lambda;

function get_buffer_for_lambda() {
    let knexQuery = knex(JOBS_BUFFER_TABLE).whereNull("job_html");

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {

            let batch_ids = {};

            rows = rows.map((row) => {
                batch_ids[row.batch_id] = batch_ids[row.batch_id] || 0;
                batch_ids[row.batch_id]++;

                // if (row.job_board_level.indexOf("Internship") === -1 && row.job_board_level.indexOf("Entry") === -1)
                //     return null;

                // if (row.job_board_link.indexOf("companyId") === -1)
                //     return null;

                // if (row.batch_id.indexOf("single-") === -1)
                //     return null;

                return row;
            });

            // console.log(batch_ids)

            return resolve(_.without(rows, null));
        }).catch((err) => {
            return reject(err);
        });
    });
}

function populate_job_board_links() {
    let links = require("../../../data/data-board-links.json");
    console.log(links.length);

    let batch_id = `glassdoor-batch-${moment().format("MM-DD-YYYY-hh-mm-ss")}`;
    console.log("batch_id", batch_id)

    async.forEachLimit(links, 5, (link, cb) => {
        const { job_board_link } = link;

        setTimeout(() => {
            console.log(job_board_link);

            call_lambda({
                job_board_link,
                attempts: 1
            }).then((data) => {
                // console.log(data);

                if (!data || !data.length)
                    return cb();


                data.forEach((job) => {
                    let buffer_unique_code = `${(job.job_company || "").toUpperCase()}-${(job.job_location || "").toUpperCase()}-${(job.job_title || "").toUpperCase()}`;

                    let payload = {
                        ...job,
                        batch_id,
                        buffer_unique_code,
                        job_board_link,
                        job_board_city: link.job_city,
                        job_board_state: link.job_state,
                        job_board_location:  link.job_location,
                        job_board_category: link.job_category,
                        job_board_level: link.job_level,
                        job_source: "glassdoor"
                    };

                    create_job_buffer(payload).then((job_buffer_id) => {
                        console.log(job_buffer_id, buffer_unique_code);
                    }).catch((e) => {

                    });
                });

                cb();

            })


        }, Math.random()*30000);
    })
}

function call_lambda({job_board_link, attempts}) {
    return new Promise((resolve) => {
        axios.post("https://fghccj98xj.execute-api.us-east-1.amazonaws.com/default/second-lambda-test", {
            "url": job_board_link
        }).then((response) => {
            // console.log(response.data);
            if (response && response.data && response.data.length) {
                console.log(`${job_board_link} - Success (${response.data.length})`);
                resolve(response.data);
            } else {
                if (attempts < 5) {
                    console.log(`${job_board_link} - Failed (${attempts})`);
                    call_lambda({job_board_link, attempts: attempts + 1}).then((data) => {
                        resolve(data);
                    });
                } else {
                    resolve(null);
                }
            }
        }).catch((e) => {
            if (attempts < 5) {
                console.log(`${job_board_link} - Failed (${attempts})`);
                call_lambda({job_board_link, attempts: attempts + 1}).then((data) => {
                    resolve(data);
                });
            } else {
                resolve(null);
            }
        })
    })

}


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

module.exports.get_jobs_by_ids = get_jobs_by_ids;

function get_jobs_by_ids({jobs_ids}) {
    return new Promise((resolve, reject) => {
        if (!jobs_ids && !jobs_ids)
            return reject(new Error("Missing jobs_ids"));

        let knexQuery = knex(SERVICE_DEFAULT_TABLE).whereIn("job_id", jobs_ids);

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

module.exports.create_job_buffer = create_job_buffer;

function create_job_buffer({
                               buffer_unique_code,
                               batch_id,
                               company_id,
                               job_board_link,
                               job_board_city,
                               job_board_state,
                               job_board_location,
                               job_board_category,
                               job_board_level,
                               job_title,
                               job_company,
                               job_location,
                               job_salary,
                               job_link,
                               job_direct_link,
                               job_logo_url,
                               job_html,
                               apply_link,
                               job_overview,
                               job_qualifications,
                               job_responsibilities,
                               job_source,
                    }) {
    return new Promise((resolve, reject) => {
        if (!buffer_unique_code || !job_link)
            return reject(new Error("Missing buffer_unique_code"));

        const query = DatabaseService.generate_query({
            buffer_unique_code,
            batch_id,
            company_id,
            job_board_link,
            job_board_city,
            job_board_state,
            job_board_location,
            job_board_category,
            job_board_level,
            job_title,
            job_company,
            job_location,
            job_salary,
            job_link,
            job_direct_link,
            job_logo_url,
            job_html,
            apply_link,
            job_overview,
            job_qualifications,
            job_responsibilities,
            job_source,
        });

        knex(JOBS_BUFFER_TABLE).insert(query).returning("job_buffer_id").then((rows) => {
            const job_buffer_id = rows[0];

            return resolve(job_buffer_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_job_buffer = edit_job_buffer;

function edit_job_buffer({
                               job_buffer_id,
                               buffer_unique_code,
                               batch_id,
                               company_id,
                               job_board_link,
                               job_board_city,
                               job_board_state,
                               job_board_location,
                               job_board_category,
                               job_board_level,
                               job_title,
                               job_company,
                               job_location,
                               job_salary,
                               job_link,
                               job_direct_link,
                               job_logo_url,
                               job_html,
                               apply_link,
                               job_overview,
                               job_qualifications,
                               job_responsibilities,
                               job_source,
                           }) {
    return new Promise((resolve, reject) => {
        if (!job_buffer_id)
            return reject(new Error("Missing job_buffer_id"));

        const query = DatabaseService.generate_query({
            buffer_unique_code,
            batch_id,
            company_id,
            job_board_link,
            job_board_city,
            job_board_state,
            job_board_location,
            job_board_category,
            job_board_level,
            job_title,
            job_company,
            job_location,
            job_salary,
            job_link,
            job_direct_link,
            job_logo_url,
            job_html,
            apply_link,
            job_overview,
            job_qualifications,
            job_responsibilities,
            job_source,
        });


        knex(JOBS_BUFFER_TABLE).where({job_buffer_id}).update(query).then(() =>{
            return resolve();
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


function reformat_job_for_job_board(job) {

    if (!job)
        return job;

    let years_of_experience = null;
    let job_salary_min = null;
    let job_salary_max = null;
    let years_of_experience_min = null;
    let years_of_experience_max = null;

    if (job.job_html) {
        const regexp = /(\d+.{0,30}experience)/g;
        const matches = (regexp).exec(job.job_html);
        if (matches && matches.length && matches[1] && matches[1].indexOf("year") !== -1) {
            years_of_experience = matches[1];

            if (years_of_experience && years_of_experience.length) {
                let yoe = (years_of_experience || "").replace(/,/g,"");
                yoe = (yoe || "").replace(/\+/g,"");
                yoe = (yoe || "").replace(/-/g," ");
                yoe = yoe.split(" ");
                yoe = _.filter(yoe, (s) => {
                    return (s && (parseFloat(s) && parseFloat(s) > 0 || s === "0"))
                });
                yoe = yoe.map((s) => parseFloat(s));
                years_of_experience_min = _.min(yoe);
                years_of_experience_max = _.max(yoe);
                // console.log("yoe", yoe, years_of_experience, years_of_experience_min, years_of_experience_max);
            }
        }
    }

    if (job.job_salary_estimate && job.job_salary_estimate.length && job.job_salary_estimate.indexOf("Per Hour") === -1) {
        let salary = (job.job_salary_estimate || "").replace(/K/g,",000");
        salary = (salary || "").replace(/,/g,"");
        salary = (salary || "").replace(/\$/g,"");
        salary = (salary || "").replace(/-/g," ");
        salary = salary.split(" ");
        salary = _.filter(salary, (s) => {
            return (s && (parseFloat(s) && parseFloat(s) > 0 || s === "0"))
        });
        salary = salary.map((s) => parseFloat(s));
        job_salary_min = _.min(salary);
        job_salary_max = _.max(salary);
        // console.log("salary", salary, _.max(salary))
    }

    return {

        job_id: job.job_id,
        date_created: new Date().getTime(),
        apply_link: job.apply_link,

        job_salary_min,
        job_salary_max,
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

        affinities: job.diverse_candidates ? [{
            affinity_id: "Diverse Candidates",
            id: "Diverse Candidates",
            label: "Diverse Candidates",
            name: "Diverse Candidates",
        }]: [],

        job_html: job.job_html,
        job_board_category: job.job_board_category,
        job_seniority: job.job_seniority,
        years_of_experience,
        years_of_experience_min,
        years_of_experience_max,

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
}

module.exports.format_jobs_for_job_board = format_jobs_for_job_board;

function format_jobs_for_job_board() {
    return new Promise((resolve, reject) => {
        load_all_jobs().then((jobs) => {
            jobs = jobs.map((job) => {
                return reformat_job_for_job_board(job);
            });
            resolve(jobs);
        });
    })
}

module.exports.get_jobs_for_job_board = get_jobs_for_job_board;

function get_jobs_for_job_board({
    max,
    offset,
    companies,
    industries,
    job_titles,
    job_types,
    seniorities,
    locations,
    job_ids,
    glassdoor_overall,
    glassdoor_culture,
    glassdoor_work_life,
    glassdoor_compensation,
    job_salary_min,
    job_salary_max,
    years_of_experience_min,
    years_of_experience_max,
                                }) {
    return new Promise((resolve, reject) => {
        console.time("total job processing time:");
        if (parseFloat(job_salary_min) === 2000000)
            job_salary_min = 200000
        if (parseFloat(years_of_experience_min) === 100)
            years_of_experience_min = 10
        load_all_jobs().then((jobs) => {
            let all_jobs = [];
            let forced_jobs = [];
            let semi_filtered_jobs = [];

            let filtered_jobs = jobs.map((job) => {

                //
                // FORMATTING
                //
                job = reformat_job_for_job_board(job);

                // console.log(job);

                let company = CompanyService.COMPANY_MAP[job.company_id] || {};

                if (company.company_id) {
                    COMPANY_MAP[company.company_id] = company;
                    job.companies = [company];
                }

                //
                // FILTERING
                //

                let industry = company.company_industry || null;

                let company_found = valid_single_field(companies, job.company_id);
                let industry_found = valid_single_field(industries, industry);
                let job_title_found = valid_single_field(job_titles, job.industries, true);
                let job_type_found = valid_single_field(job_types, job.job_types, true);
                let location_found = valid_single_field(locations, job.locations, true);
                let seniority_found = valid_single_field(seniorities, job.job_seniority);

                seniorities = seniorities || [];

                let glassdoor_overall_found = glassdoor_overall && glassdoor_overall > 0 ? company.glassdoor_overall >= glassdoor_overall : true;
                let glassdoor_culture_found = glassdoor_culture && glassdoor_culture > 0 ? company.glassdoor_culture >= glassdoor_culture : true;
                let glassdoor_work_life_found = glassdoor_work_life && glassdoor_work_life > 0 ? company.glassdoor_work_life >= glassdoor_work_life : true;
                let glassdoor_compensation_found = glassdoor_compensation && glassdoor_compensation > 0 ? company.glassdoor_compensation >= glassdoor_compensation : true;

                let job_salary_min_found = seniorities.indexOf("Internship") === -1 && job_salary_min && job_salary_min > 0 ? job.job_salary_min !== null && job.job_salary_min >= job_salary_min : true;
                let job_salary_max_found = seniorities.indexOf("Internship") === -1 && job_salary_max && job_salary_max > 0 ? job.job_salary_max !== null && job.job_salary_max <= job_salary_max : true;

                let years_of_experience_min_found = seniorities.indexOf("Internship") === -1 && years_of_experience_min && years_of_experience_min > 0 ? job.years_of_experience_min !== null && job.years_of_experience_min >= years_of_experience_min : true;
                let years_of_experience_max_found = seniorities.indexOf("Internship") === -1 && years_of_experience_max && years_of_experience_max > 0 ? job.years_of_experience_max !== null && job.years_of_experience_max <= years_of_experience_max : true;

                // console.log( years_of_experience_min, years_of_experience_min && years_of_experience_min > 0, years_of_experience_max && years_of_experience_max > 0, years_of_experience_min_found, job.years_of_experience)

                if (job.industries) {
                    job.industries.forEach((job_title) => {
                        JOB_TITLE_MAP[job_title.id] = job_title;
                    })
                }

                if (job.locations) {
                    job.locations.forEach((location) => {
                        LOCATION_MAP[location.id] = location;
                    })
                }

                if (industry) {
                    INDUSTRY_MAP[industry] = {
                        id: industry,
                        label: industry
                    };
                }

                if (job.job_seniority) {
                    SENORITY_MAP[job.job_seniority] = {
                        id: job.job_seniority,
                        label: job.job_seniority
                    };
                }

                let forced_id = false

                if (job_ids && job_ids.length) {
                    job_ids.forEach((job_id) => {
                        if ((job.job_id + "") === (job_id + ""))
                            forced_id = true;
                    })
                }


                if (forced_id ) {
                    forced_jobs.push(job)
                    return null;
                } else if (
                    company_found &&
                    industry_found &&
                    job_title_found &&
                    job_type_found &&
                    location_found &&
                    seniority_found &&
                    glassdoor_overall_found &&
                    glassdoor_culture_found &&
                    glassdoor_work_life_found &&
                    job_salary_min_found &&
                    job_salary_max_found &&
                    years_of_experience_min_found &&
                    years_of_experience_max_found &&
                    glassdoor_compensation_found
                ) {
                    return job
                } else {
                    job.is_fill = true;

                    if (
                        company_found ||
                        industry_found ||
                        job_title_found ||
                        job_type_found ||
                        location_found ||
                        seniority_found ||
                        glassdoor_overall_found ||
                        glassdoor_culture_found ||
                        glassdoor_work_life_found ||
                        job_salary_min_found ||
                        job_salary_max_found ||
                        years_of_experience_min_found ||
                        years_of_experience_max_found ||
                        glassdoor_compensation_found
                    ) {
                        semi_filtered_jobs.push(job);
                    }

                    all_jobs.push(job)
                    return null;
                }
            });

            filtered_jobs = _.without(filtered_jobs, null);

            if (max) {
                filtered_jobs = filtered_jobs.slice(offset ? offset : 0, max)
            }

            if (filtered_jobs.length < max) {
                let fill_lenth = Math.round(max - filtered_jobs.length);
                console.warn(`not enough filtered jobs! ${semi_filtered_jobs.length} semi-filtered jobs available; filling in ${fill_lenth} extra jobs!`);
                filtered_jobs = _.concat(filtered_jobs, (_.shuffle(all_jobs)).slice(0, fill_lenth))
            }

            resolve(_.concat(forced_jobs, _.shuffle(filtered_jobs)));
            console.timeEnd("total job processing time:");

        });
    })
}

function valid_single_field(options, value, multi) {
    let found = false;

    if (options && options.length) {
        found = false;
        options.forEach((option) => {
            option = option + "";

            if (multi) {
                value.forEach((v) => {
                    // console.log(v)
                    if (v && v.id) {
                        // console.log(v.id, option)
                        if (option === (v.id + "")) {
                            found = true;
                        }
                    }

                })
            } else {
                if (option === (value + "")) {
                    found = true;
                }
            }
        });
    } else {
        found = true
    }

    return found
}


function load_all_jobs() {
    return new Promise((resolve, reject) => {
        if (ALL_JOBS && ALL_JOBS.length) {
            // resolve(ALL_JOBS.slice(0,30));

            // let temp = _.shuffle(_.concat(ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS,
            //     ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS,
            //     ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS,
            //     ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS,
            //     ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS,
            //     ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS,
            //     ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS,
            //     ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS,
            //     ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS, ALL_JOBS));
            //
            // console.log("resolving jobs", temp.length)

            resolve(ALL_JOBS);
        } get_jobs({
            is_user_submitted: false,
            job_source: "glassdoor"
        }).then((jobs) => {
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

module.exports.get_text_completion = get_text_completion;

async function get_text_completion({prompt}) {
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    return new Promise(async (resolve) => {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt || "Say this is a test",
            max_tokens: 256,
            temperature: 0.7,
        });

        resolve(response.data)
    })


}

function load_job_counts() {
    get_jobs({
        is_user_submitted: false,
        job_source: "glassdoor"
    }).then((jobs) => {

        ALL_JOBS = jobs;

        console.log("jobs, lenths", jobs.length);
        jobs.forEach((job) => {
            JOB_COUNTS[job.company_id] = JOB_COUNTS[job.company_id] || 0;
            JOB_COUNTS[job.company_id]++
        })
    })
}
import_jobs_and_skills();

let JOB_SKILLS = {};
let JOB_DESCRIPTIONS = {};

module.exports.get_job_descriptions = get_job_descriptions;

function get_job_descriptions () {
    return new Promise((resolve) => {
        resolve({
            JOB_SKILLS,
            JOB_DESCRIPTIONS
        });
    })
}

function import_jobs_and_skills() {
    fs.createReadStream(__dirname + `/../../../data/skills.csv`)
        .pipe(csv())
        .on('data', (skill) => {
            JOB_SKILLS[skill.skill_title] = {
                ...skill,
                youtube_link: `https://www.youtube.com/results?search_query=${skill.skill_title}`,
                skillshare_link: `https://www.skillshare.com/en/search?query=${skill.skill_title}`,
            };
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });
    fs.createReadStream(__dirname + `/../../../data/job-titles.csv`)
        .pipe(csv())
        .on('data', (job) => {
            JOB_DESCRIPTIONS[job.job_title] = {...job, skills: _.without([
                job.skill_1 || null,
                job.skill_2 || null,
                job.skill_3 || null,
                job.skill_4 || null,
                job.skill_5 || null,
                job.skill_6 || null,
                job.skill_7 || null,
                job.skill_8 || null,
                job.skill_9 || null,
                job.skill_10 || null,
                job.skill_11 || null,
                job.skill_12 || null,
                job.skill_13 || null,
                job.skill_14 || null,
                job.skill_15 || null,
                job.skill_16 || null,
                job.skill_17 || null,
                job.skill_18 || null,
                job.skill_19 || null,
                job.skill_20 || null,
                ], null)};
            // console.log(JOB_DESCRIPTIONS);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });
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

