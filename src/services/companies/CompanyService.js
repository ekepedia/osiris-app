const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");


const DatabaseService = require("../DatabaseService");
const CompanyDemographicService = require("../company_demographics/CompanyDemographicService")
const JobService = require("../jobs/JobService")

let init = false;
let knex = null;

const COMPANY_TABLE = "companies";
const SERVICE_NAME = "Company Service";
const SERVICE_DEFAULT_TABLE = COMPANY_TABLE;

const AIR_TABLE_KEY = "key967P3bJaUjmwX2";
const OSIRIS_DATA_BASE = "appMzGF6dxRHZfubu";

let PRELOADED_DATA = [];

let COMPANY_MAP = {};

let INDUSTRY_MAPPING = [{"company_industry":"Health Care Services & Hospitals","count":772,"new_industry":"Healthcare","":""},{"company_industry":"Information Technology Support Services","count":421,"new_industry":"Engineering","":""},{"company_industry":"Enterprise Software & Network Solutions","count":380,"new_industry":"Engineering","":""},{"company_industry":"Colleges & Universities","count":329,"new_industry":"Education","":""},{"company_industry":"Computer Hardware Development","count":315,"new_industry":"Engineering","":""},{"company_industry":"Advertising & Public Relations","count":285,"new_industry":"Marketing","":""},{"company_industry":"Banking & Lending","count":269,"new_industry":"Financial Services","":""},{"company_industry":"Restaurants & Cafes","count":236,"new_industry":"","":""},{"company_industry":"Business Consulting","count":230,"new_industry":"Consulting","":""},{"company_industry":"HR Consulting","count":220,"new_industry":"Consulting","":""},{"company_industry":"Consumer Product Manufacturing","count":190,"new_industry":"Consumer Products","":""},{"company_industry":"Department, Clothing & Shoe Stores","count":187,"new_industry":"Consumer Products","":""},{"company_industry":"Insurance Carriers","count":183,"new_industry":"Financial Services","":""},{"company_industry":"Energy & Utilities","count":182,"new_industry":"Life Sciences","":""},{"company_industry":"Biotech & Pharmaceuticals","count":180,"new_industry":"Life Sciences","":""},{"company_industry":"Internet & Web Services","count":173,"new_industry":"Tech","":""},{"company_industry":"Machinery Manufacturing","count":171,"new_industry":"Engineering","":""},{"company_industry":"Investment & Asset Management","count":165,"new_industry":"Financial Services","":""},{"company_industry":"Real Estate","count":149,"new_industry":"Real Estate","":""},{"company_industry":"Electronics Manufacturing","count":125,"new_industry":"Engineering","":""},{"company_industry":"Primary & Secondary Schools","count":121,"new_industry":"Education","":""},{"company_industry":"Food & Beverage Manufacturing","count":117,"new_industry":"Consumer Products","":""},{"company_industry":"Civic & Social Services","count":112,"new_industry":"","":""},{"company_industry":"Transportation Equipment Manufacturing","count":100,"new_industry":"Engineering","":""},{"company_industry":"Shipping & Trucking","count":95,"new_industry":"","":""},{"company_industry":"Hotels & Resorts","count":94,"new_industry":"","":""},{"company_industry":"Aerospace & Defense","count":92,"new_industry":"Engineering","":""},{"company_industry":"Construction","count":90,"new_industry":"","":""},{"company_industry":"National Agencies","count":82,"new_industry":"","":""},{"company_industry":"Software Development","count":82,"new_industry":"Engineering","":""},{"company_industry":"Legal","count":79,"new_industry":"Legal","":""},{"company_industry":"Research & Development","count":74,"new_industry":"","":""},{"company_industry":"Architectural & Engineering Services","count":73,"new_industry":"Engineering","":""},{"company_industry":"Other Retail Stores","count":73,"new_industry":"Consumer Products","":""},{"company_industry":"Health Care Products Manufacturing","count":69,"new_industry":"Healthcare","":""},{"company_industry":"Education & Training Services","count":66,"new_industry":"Education","":""},{"company_industry":"Wholesale","count":64,"new_industry":"","":""},{"company_industry":"Publishing","count":62,"new_industry":"","":""},{"company_industry":"Telecommunications Services","count":62,"new_industry":"","":""},{"company_industry":"Chemical Manufacturing","count":61,"new_industry":"Life Sciences","":""},{"company_industry":"State & Regional Agencies","count":60,"new_industry":"","":""},{"company_industry":"Financial Transaction Processing","count":59,"new_industry":"Financial Services","":""},{"company_industry":"Grocery Stores","count":58,"new_industry":"","":""},{"company_industry":"Municipal Agencies","count":58,"new_industry":"","":""},{"company_industry":"Beauty & Wellness","count":57,"new_industry":"Beauty","":""},{"company_industry":"Home Furniture & Housewares Stores","count":57,"new_industry":"","":""},{"company_industry":"Accounting & Tax","count":53,"new_industry":"Financial Services","":""},{"company_industry":"Insurance Agencies & Brokerages","count":53,"new_industry":"","":""},{"company_industry":"Taxi & Car Services","count":53,"new_industry":"","":""},{"company_industry":"Broadcast Media","count":48,"new_industry":"Media","":""},{"company_industry":"Preschools & Child Care Services","count":41,"new_industry":"","":""},{"company_industry":"Culture & Entertainment","count":40,"new_industry":"Entertainment","":""},{"company_industry":"Sports & Recreation","count":38,"new_industry":"","":""},{"company_industry":"Food & Beverage Stores","count":37,"new_industry":"","":""},{"company_industry":"Vehicle Dealers","count":37,"new_industry":"","":""},{"company_industry":"Airlines, Airports & Air Transportation","count":36,"new_industry":"Engineering","":""},{"company_industry":"Staffing & Subcontracting","count":36,"new_industry":"","":""},{"company_industry":"Building & Personnel Services","count":32,"new_industry":"","":""},{"company_industry":"Cable, Internet & Telephone Providers","count":29,"new_industry":"","":""},{"company_industry":"Financial Services","count":29,"new_industry":"Financial Services","":""},{"company_industry":"Grantmaking & Charitable Foundations","count":29,"new_industry":"","":""},{"company_industry":"Metal & Mineral Manufacturing","count":29,"new_industry":"","":""},{"company_industry":"Travel Agencies","count":28,"new_industry":"","":""},{"company_industry":"Sporting Goods Stores","count":26,"new_industry":"","":""},{"company_industry":"Beauty & Personal Accessories Stores","count":25,"new_industry":"Beauty","":""},{"company_industry":"Security & Protective","count":25,"new_industry":"","":""},{"company_industry":"Catering & Food Service Contractors","count":24,"new_industry":"","":""},{"company_industry":"Film Production","count":24,"new_industry":"","":""},{"company_industry":"Membership Organizations","count":23,"new_industry":"","":""},{"company_industry":"Consumer Electronics & Appliances Stores","count":22,"new_industry":"Engineering","":""},{"company_industry":"Video Game Publishing","count":21,"new_industry":"","":""},{"company_industry":"IT Services and IT Consulting","count":19,"new_industry":"","":""},{"company_industry":"General Merchandise & Superstores","count":18,"new_industry":"","":""},{"company_industry":"Technology, Information and Internet","count":17,"new_industry":"","":""},{"company_industry":"Automotive Parts & Accessories Stores","count":15,"new_industry":"","":""},{"company_industry":"Gambling","count":14,"new_industry":"","":""},{"company_industry":"Convenience Stores","count":13,"new_industry":"Consumer Products","":""},{"company_industry":"Pet & Pet Supplies Stores","count":13,"new_industry":"","":""},{"company_industry":"Gift, Novelty & Souvenir Stores","count":12,"new_industry":"","":""},{"company_industry":"Rail Transportation","count":12,"new_industry":"","":""},{"company_industry":"Consumer Product Rental","count":11,"new_industry":"","":""},{"company_industry":"Drug & Health Stores","count":11,"new_industry":"","":""},{"company_industry":"Mining & Metals","count":11,"new_industry":"","":""},{"company_industry":"General Repair & Maintenance","count":10,"new_industry":"","":""},{"company_industry":"Office Supply & Copy Stores","count":10,"new_industry":"","":""},{"company_industry":"Crop Production","count":9,"new_industry":"Life Sciences","":""},{"company_industry":"Manufacturing","count":9,"new_industry":"Engineering","":""},{"company_industry":"Commercial Equipment Services","count":8,"new_industry":"","":""},{"company_industry":"Hospitals & Health Clinics","count":8,"new_industry":"","":""},{"company_industry":"Media & Entertainment Stores","count":8,"new_industry":"","":""},{"company_industry":"Vehicle Repair & Maintenance","count":8,"new_industry":"","":""},{"company_industry":"Wood & Paper Manufacturing","count":8,"new_industry":"","":""},{"company_industry":"Business Consulting and Services","count":7,"new_industry":"Consulting","":""},{"company_industry":"Hospitals and Health Care","count":7,"new_industry":"","":""},{"company_industry":"Oil and Gas","count":7,"new_industry":"","":""},{"company_industry":"Retail","count":7,"new_industry":"","":""},{"company_industry":"Stock Exchanges","count":7,"new_industry":"","":""},{"company_industry":"Higher Education","count":6,"new_industry":"","":""},{"company_industry":"Industrial Machinery Manufacturing","count":6,"new_industry":"","":""},{"company_industry":"Photography","count":6,"new_industry":"","":""},{"company_industry":"Religious Institutions","count":6,"new_industry":"","":""},{"company_industry":"Car & Truck Rental","count":5,"new_industry":"","":""},{"company_industry":"Farm Support","count":5,"new_industry":"","":""},{"company_industry":"Insurance","count":5,"new_industry":"","":""},{"company_industry":"Motor Vehicle Manufacturing","count":5,"new_industry":"","":""},{"company_industry":"Pet Care & Veterinary","count":5,"new_industry":"","":""},{"company_industry":"Pharmaceutical Manufacturing","count":5,"new_industry":"","":""},{"company_industry":"Toy & Hobby Stores","count":5,"new_industry":"","":""},{"company_industry":"Utilities","count":5,"new_industry":"","":""},{"company_industry":"Auctions & Galleries","count":4,"new_industry":"","":""},{"company_industry":"Commercial Printing","count":4,"new_industry":"","":""},{"company_industry":"Food and Beverage Services","count":4,"new_industry":"","":""},{"company_industry":"Law Firms","count":4,"new_industry":"Legal","":""},{"company_industry":"Telecommunications","count":4,"new_industry":"","":""},{"company_industry":"Wellness and Fitness Services","count":4,"new_industry":"","":""},{"company_industry":"Banking","count":3,"new_industry":"Financial Services","":""},{"company_industry":"Biotechnology Research","count":3,"new_industry":"Life Sciences","":""},{"company_industry":"Forestry, Logging & Timber Operations","count":3,"new_industry":"","":""},{"company_industry":"Marine Transportation","count":3,"new_industry":"","":""},{"company_industry":"Semiconductor Manufacturing","count":3,"new_industry":"","":""},{"company_industry":"Advertising Services","count":2,"new_industry":"Marketing","":""},{"company_industry":"Audiovisual","count":2,"new_industry":"","":""},{"company_industry":"Aviation and Aerospace Component Manufacturing","count":2,"new_industry":"Engineering","":""},{"company_industry":"Civil Engineering","count":2,"new_industry":"","":""},{"company_industry":"Computers and Electronics Manufacturing","count":2,"new_industry":"","":""},{"company_industry":"Consumer Services","count":2,"new_industry":"Consumer Products","":""},{"company_industry":"Debt Relief","count":2,"new_industry":"","":""},{"company_industry":"Defense and Space Manufacturing","count":2,"new_industry":"Engineering","":""},{"company_industry":"Design Services","count":2,"new_industry":"","":""},{"company_industry":"Environmental Services","count":2,"new_industry":"","":""},{"company_industry":"Human Resources Services","count":2,"new_industry":"","":""},{"company_industry":"Property Management","count":2,"new_industry":"","":""},{"company_industry":"Wholesale Building Materials","count":2,"new_industry":"","":""},{"company_industry":"Accounting","count":1,"new_industry":"Financial Services","":""},{"company_industry":"Airlines and Aviation","count":1,"new_industry":"Engineering","":""},{"company_industry":"Animal Production","count":1,"new_industry":"Life Sciences","":""},{"company_industry":"Appliances, Electrical, and Electronics Manufacturing","count":1,"new_industry":"Engineering","":""},{"company_industry":"Biotechnology","count":1,"new_industry":"Life Sciences","":""},{"company_industry":"Broadcast Media Production and Distribution","count":1,"new_industry":"Media","":""},{"company_industry":"Computer and Network Security","count":1,"new_industry":"","":""},{"company_industry":"Computer Hardware Manufacturing","count":1,"new_industry":"Engineering","":""},{"company_industry":"Data Security Software Products","count":1,"new_industry":"","":""},{"company_industry":"Dental Clinics","count":1,"new_industry":"","":""},{"company_industry":"Entertainment Providers","count":1,"new_industry":"","":""},{"company_industry":"Event Services","count":1,"new_industry":"","":""},{"company_industry":"Freight and Package Transportation","count":1,"new_industry":"","":""},{"company_industry":"Government Administration","count":1,"new_industry":"","":""},{"company_industry":"Investment Banking","count":1,"new_industry":"Financial Services","":""},{"company_industry":"Investment Management","count":1,"new_industry":"Financial Services","":""},{"company_industry":"Legal Services","count":1,"new_industry":"Legal","":""},{"company_industry":"Medical Equipment Manufacturing","count":1,"new_industry":"","":""},{"company_industry":"Medical Testing & Clinical Laboratories","count":1,"new_industry":"","":""},{"company_industry":"Musicians","count":1,"new_industry":"","":""},{"company_industry":"Non-profit Organizations","count":1,"new_industry":"","":""},{"company_industry":"Packaging and Containers Manufacturing","count":1,"new_industry":"","":""},{"company_industry":"Parking & Valet","count":1,"new_industry":"","":""},{"company_industry":"Pharmaceutical","count":1,"new_industry":"","":""},{"company_industry":"Philanthropic Fundraising Services","count":1,"new_industry":"","":""},{"company_industry":"Professional Services","count":1,"new_industry":"","":""},{"company_industry":"Real Estate Agencies","count":1,"new_industry":"Real Estate","":""},{"company_industry":"Research Services","count":1,"new_industry":"","":""},{"company_industry":"Residential Building Construction","count":1,"new_industry":"","":""},{"company_industry":"Retail Office Equipment","count":1,"new_industry":"","":""},{"company_industry":"Spectator Sports","count":1,"new_industry":"","":""},{"company_industry":"Translation & Linguistic Services","count":1,"new_industry":"","":""},{"company_industry":"Travel Arrangements","count":1,"new_industry":"","":""},{"company_industry":"Truck Transportation","count":1,"new_industry":"","":""},{"company_industry":"Venture Capital and Private Equity Principals","count":1,"new_industry":"","":""},{"company_industry":"Waste Management","count":1,"new_industry":"","":""}];
let INDUSTRY_MAPPING_MAP = {};
INDUSTRY_MAPPING.forEach((m) => {
    INDUSTRY_MAPPING_MAP[m.company_industry] = m.new_industry
});

module.exports.COMPANY_TABLE = COMPANY_TABLE;
module.exports.COMPANY_MAP = COMPANY_MAP;
module.exports.PRELOADED_DATA = PRELOADED_DATA;
module.exports.COMPANIES = PRELOADED_DATA;

module.exports.get_all_companies = () => {
    return PRELOADED_DATA;
};
module.exports.init = function (connection) {

    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);

    // knex(COMPANY_TABLE).where({batch_id: "glassdoor_s_0_n_11000"}).del().then(() => {
    // }).catch((err) => {
    // });

    // import_glassdoor_companies();
    // test_endpoints();
    // mass_delete();
    // construct_questions();
    // import_data();
    // import_demo_data();
    //

    // setTimeout(() => {
    //     preload_and_prejoin_companies();
    // }, 1001);

    get_companies({is_clearbit_import: false}).then((companies) => {
        PRELOADED_DATA = companies;
        console.log("SET PRELOADED DATA:", companies.length);
        companies.forEach((company) => {
            COMPANY_MAP[company.company_id] = company;
        })

        // companies.forEach((company) => {
        //     let new_industry = (INDUSTRY_MAPPING_MAP[company.company_industry] || company.glassdoor_industry);
        //
        //     if (new_industry && new_industry.length) {
        //         console.log(company.company_id, company.company_industry, new_industry);
        //
        //     }
        //     edit_company({
        //         company_id: company.company_id,
        //         company_industry: new_industry
        //     }).then((d) => {
        //         console.log(d);
        //     })
        // })
    })

    let in_locations = [{
        location_id: "remote",
        id: "remote",
        city: "Remote",
        state: "Remote",
        label: "Remote"
    }];
    let in_location_map = {
        "remote": {
            location_id: "remote",
            id: "remote",
            city: "Remote",
            state: "Remote",
            label: "Remote"
        }
    };

    load_locations({locations: in_locations, location_map: in_location_map}).then(({locations, location_map}) => {
        load_industries({}).then(({industries, industry_map}) => {
            load_dei({}).then(({dei_data, dei_data_map}) => {

                // dei_data.forEach((dei) => {
                //
                //     get_companies({
                //         airtable_company_id: dei.airtable_company_id
                //     }).then((companies) =>{
                //         if (companies && companies.length) {
                //             const {company_id} = companies[0];
                //             const CompanyDemographicService = require("../company_demographics/CompanyDemographicService")
                //
                //             CompanyDemographicService.create_company_demographic(
                //                 {...dei, company_id}
                //             ).then((d) => {
                //                 console.log(d)
                //             })
                //         }
                //     })
                //
                // })
                // import_airtable_companies({location_map, industry_map, dei_data_map});
            });
        });
    });

    return new Promise((resolve) => {
        resolve();
    });
};

module.exports.get_companies = get_companies;

function get_companies({
                           company_id,
                           company_name,
                           company_size,
                           company_founded_year,
                           airtable_company_id,
                           company_city,
                           company_city_id,
                           company_city_lower,
                           company_state,
                           company_state_id,
                           company_state_lower,
                           company_zip_code,
                           is_hidden,
                           is_verified,
                           batch_id,
                           airtable_batch_id,
                           clearbit_company_id,
                           is_clearbit_import,
                           company_industry,
                           glassdoor_industry,
                           company_industry_group,
                           glassdoor_reviews,
                           glassdoor_overall,
                           glassdoor_culture,
                           glassdoor_diversity,
                           glassdoor_work_life,
                           glassdoor_senior_management,
                           glassdoor_compensation,
                           glassdoor_career,
}) {

    const query = DatabaseService.generate_query({
        company_id,
        airtable_company_id,
        company_name,
        company_size,
        company_founded_year,
        company_city,
        company_city_id,
        company_city_lower,
        company_state,
        company_state_id,
        company_state_lower,
        company_zip_code,
        is_hidden,
        is_verified,
        batch_id,
        airtable_batch_id,
        clearbit_company_id,
        is_clearbit_import,
        company_industry,
        glassdoor_industry,
        company_industry_group,
        glassdoor_reviews,
        glassdoor_overall,
        glassdoor_culture,
        glassdoor_diversity,
        glassdoor_work_life,
        glassdoor_senior_management,
        glassdoor_compensation,
        glassdoor_career,
    });

    console.log("COMPANY QUERY", query, (query.is_clearbit_import === false && !query.company_id));
    let knexQuery = knex(SERVICE_DEFAULT_TABLE).where(query);

    return new Promise((resolve, reject) => {
        if (PRELOADED_DATA && PRELOADED_DATA.length && (query.is_clearbit_import === false && !query.company_id)) {
            return resolve(PRELOADED_DATA);
        } else {
            knexQuery.then((rows) => {
                return resolve(rows);
            }).catch((err) => {
                return reject(err);
            });
        }
    });
}

module.exports.create_company = create_company;

function create_company({
                            airtable_company_id,
                            company_name,
                            company_logo_url,
                            cover_photo_url,
                            company_size,
                            company_about,
                            company_website,
                            company_founded_year,
                            company_address_1,
                            company_address_2,
                            company_city,
                            company_city_id,
                            company_state,
                            company_state_id,
                            company_zip_code,
                            is_hidden,
                            is_verified,
                            batch_id,
                            airtable_batch_id,
                            clearbit_company_id,
                            is_clearbit_import,
                            company_industry,
                            glassdoor_industry,
                            company_industry_group,
                            glassdoor_reviews,
                            glassdoor_overall,
                            glassdoor_culture,
                            glassdoor_diversity,
                            glassdoor_work_life,
                            glassdoor_senior_management,
                            glassdoor_compensation,
                            glassdoor_career,
                        }) {
    return new Promise((resolve, reject) => {
        if (!company_name)
            return reject(new Error("Missing company_name"));

        const query = DatabaseService.generate_query({
            airtable_company_id,
            company_name,
            company_logo_url,
            cover_photo_url,
            company_size,
            company_about,
            company_website,
            company_founded_year,
            company_address_1,
            company_address_2,
            company_city,
            company_city_id,
            company_state,
            company_state_id,
            company_zip_code,
            is_hidden,
            is_verified,
            batch_id,
            airtable_batch_id,
            clearbit_company_id,
            is_clearbit_import,
            company_industry,
            glassdoor_industry,
            company_industry_group,
            glassdoor_reviews,
            glassdoor_overall,
            glassdoor_culture,
            glassdoor_diversity,
            glassdoor_work_life,
            glassdoor_senior_management,
            glassdoor_compensation,
            glassdoor_career,
        });

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("company_id").then((rows) => {
            const company_id = rows[0];

            return resolve(company_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_company = edit_company;

function edit_company({
                            company_id,
                            airtable_company_id,
                            company_name,
                            company_logo_url,
                            cover_photo_url,
                            company_size,
                            company_about,
                            company_website,
                            company_founded_year,
                            company_address_1,
                            company_address_2,
                            company_city,
                            company_city_id,
                            company_state,
                            company_state_id,
                            company_zip_code,
                            is_hidden,
                            is_verified,
                            batch_id,
                            airtable_batch_id,
                          clearbit_company_id,
                          is_clearbit_import,
                          company_industry,
                          glassdoor_industry,
                          company_industry_group,
                          glassdoor_reviews,
                          glassdoor_overall,
                          glassdoor_culture,
                          glassdoor_diversity,
                          glassdoor_work_life,
                          glassdoor_senior_management,
                          glassdoor_compensation,
                          glassdoor_career,
}) {
    return new Promise((resolve, reject) => {
        if (!company_id)
            return reject(new Error("Missing company_id"));

        const query = {
            airtable_company_id,
            company_name,
            company_logo_url,
            cover_photo_url,
            company_size,
            company_about,
            company_website,
            company_founded_year,
            company_address_1,
            company_address_2,
            company_city,
            company_city_id,
            company_state,
            company_state_id,
            company_zip_code,
            is_hidden,
            is_verified,
            batch_id,
            airtable_batch_id,
            clearbit_company_id,
            is_clearbit_import,
            company_industry,
            glassdoor_industry,
            company_industry_group,
            glassdoor_reviews,
            glassdoor_overall,
            glassdoor_culture,
            glassdoor_diversity,
            glassdoor_work_life,
            glassdoor_senior_management,
            glassdoor_compensation,
            glassdoor_career,
        };

        knex(SERVICE_DEFAULT_TABLE).where({company_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_company = remove_company;

function remove_company({company_id}) {
    return new Promise((resolve, reject) => {
        if (!company_id)
            return reject(new Error("Missing company_id"));

        const query = DatabaseService.generate_query({company_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

function preload_and_prejoin_companies() {
    let company_demographics_map = {};
    let company_map = {};
    let company_name_map = {};
    let company_lowercase_name_map = {};
    let companies = [];
    let company_demographics = [];
    let jobs_buffer = [];
    let missing_companies = {};

    async.parallel([(cb) => {
        CompanyDemographicService.get_company_demographics({}).then((in_company_demographics) => {
            company_demographics = in_company_demographics
            company_demographics.forEach((company_demographic) => {
                company_demographics = company_demographic;
                company_demographics_map[company_demographic.company_id] = company_demographics_map[company_demographic.company_id] || [];
                company_demographics_map[company_demographic.company_id].push(company_demographic);
            });
            cb(null);
        })
    }, (cb) => {
        get_companies({is_clearbit_import: false}).then((in_companies) => {
            companies = in_companies;
            cb();
        })
    },(cb) => {
        JobService.port_buffer_to_jobs().then((j) => {
            jobs_buffer = j;
            cb();
        });
    },], (err) => {
        companies.forEach((company) => {
            company_map[company.company_id] = company;
            company_name_map[company.company_name] = company;
            company_lowercase_name_map[(company.company_name || "").toLowerCase()] = company;
        });




        // console.log(jobs_buffer)
        // const filename = "jobs_desc_working_doc_1050.csv";
        // const filename = "jobs_desc_working_doc_2476.csv";
        const filename = "jobs_desc_working_doc_1275.csv";

        let i = 0;
        let found = 0;
        let missing = 0;
        let web_jobs = [];

        jobs_buffer.forEach( (job) => {
            i++

            if (job.job_company === "Boston Consulting Group") {
                job.job_company = "Boston Consulting Group (BCG)"
            }

            if (job.job_company === "JPMorgan Chase Bank, N.A.") {
                job.job_company = "JPMorgan Chase & Co."
            }

            if (job.job_company === "CLEAR - Corporate") {
                job.job_company = "CLEAR"
            }

            if (job.job_company === "TIDAL") {
                job.job_company = "BLOCK"
            }

            if (job.job_company === "Macquarie Group Limited") {
                job.job_company = "Macquarie Group"
            }

            if (job.job_company === "PUBLIC POLICY INSTITUTE OF CALIFORNIA") {
                job.job_company = "PPIC"
            }

            if (job.job_company === "Snapchat") {
                job.job_company = "Snap"
            }

            if (job.job_company === "VICE MEDIA GROUP") {
                job.job_company = "Vice Media"
            }

            const job_company = company_lowercase_name_map[(job.job_company || "").toLowerCase()];
            let company_id = null;

            // console.log("job.job_company", job.job_company, company_lowercase_name_map[(job.job_company || "").toLowerCase()])

            if (job_company) {
                // console.log("FOUNDD!!")
                found++;
                company_id = job_company.company_id
            } else {
                // console.log("NOOTTTT FOUNDD!!")
                // console.log(job.job_company)
                missing_companies[job.job_company] = missing_companies[job.job_company] || 0;
                missing_companies[job.job_company]++;
            }


            let job_city = "";
            let job_state = "";
            if (job.job_location && job.job_location.indexOf(", ") !== -1) {
                let parts = job.job_location.split(", ");
                job_city = parts[0];
                job_state = parts[1];
            } else {

            }

            const job_location = [{
                location_id: job.job_location,
                id: job.job_location,
                city: job_city,
                state: job_state,
                label: job.job_location,
            }];

            console.log(company_id && job.job_html ? "TRE" : "FALSE", job.job_company)

            // TODO: FIX
            // if (job.job_html) {
            //     job.job_html = job.job_html.replace(/<div.*Show more.*<\/div>/, "");
            // } else {
            //     missing++
            // }

            // console.log(job.job_html)

            if (job.job_board_category === "Consulting")
                job.job_board_category = "Consultant"

            if (company_id && job.job_html) {
                let db_job = format_webscraped_job_for_db(job, company_id, "Full-Time", job.batch_id, job.job_source);
                // delete db_job["job_html"]
                // console.log(db_job)
                JobService.create_job(db_job).then((job_id) =>{
                    console.log("created job:", job_id);
                }).catch((e) => {
                    // console.log("error creating job:", e);
                    console.log("job already existed");
                });

            } else {
                // console.log(job)
            }
        });

        let compss = Object.keys(missing_companies);

        compss = compss.sort((a, b) => {
            return missing_companies[a] - missing_companies[b]
        });

        console.log(found, missing, i)
        console.log("Missing companies:", compss.length)
        compss.forEach((c) => {
            console.log(c, missing_companies[c])
        })
    })

}

function format_webscraped_job_for_db(job, company_id, job_type, batch_id, job_source) {

    job = job || {};

    let db_job = {
        company_id: company_id,
        user_id: null,
        apply_link: job.job_direct_link || job.job_link,
        job_salary_estimate: job.job_salary && job.job_salary.length ? job.job_salary : null,
        company_name: job.job_company,
        job_title: job.job_title,
        airtable_job_id: job.job_buffer_id,
        job_overview: null,
        job_qualifications: null,
        job_responsibilities: null,
        job_deadline: null,
        job_type,
        submitted_by_id: null,
        is_user_submitted: false,
        diverse_candidates: false,
        is_public: true,
        job_sectors: job.job_board_category,
        job_locations: job.job_location,
        job_degree_requirements: null,
        batch_id,

        job_html: job.job_html,
        job_board_category: job.job_board_category,
        job_seniority: job.job_board_level,

        job_source,


    }

    return db_job;
}

function test_endpoints() {
    // get_companies({}).then((d) => {
    //     console.log("COMPANIES", d);
    // });
    // //

    // edit_company({
    //     company_id:"1",
    //     company_name: "No Label",
    // }).then(() => {})

    //
    // create_company({
    //     airtable_batch_id:"test-1",
    //     company_name: "small company",
    // }).then((e) =>{
    //     console.log(e)
    // })

    // remove_company({company_id: 1}).then((r) =>{
    //     console.log("REMOVED", r);
    // })
}

function import_data() {
    const data = require("./data/data-export-v4.json");
    Object.values(data).forEach((company) => {

        const new_company = {
            is_clearbit_import: true,
            clearbit_company_id: company.companyID,
            company_name: company.companyName,
            company_logo_url: company.companyLogoOriginal,
            company_city: company.companyCity,
            company_state: company.companyStateCode,
            company_about: company.companyDescription,
            company_website: company.companyWebsite,
            company_founded_year: company.companyFoundedDate,
            company_size: company.companyEmployeeSizeActual,
            company_industry: company.companyIndustry,
            company_industry_group: company.companyIndustryGroup
        }

        create_company(new_company).then((company_id) => {
            console.log(company_id)
        })
        // console.log(new_company);
    })
}


function import_airtable_companies({location_map, industry_map, dei_data_map, offset}) {

    let url = `https://api.airtable.com/v0/${OSIRIS_DATA_BASE}/Companies?`;

    if (offset) {
        url += `offset=${offset}`
    }

    axios.get(url, {
        headers: {
            'Authorization': `Bearer ${AIR_TABLE_KEY}`
        }
    }).then((res) => {
        // console.log(res.data.records)
        console.log("OFFSET:", res.data.offset)
        res.data.records.forEach((record) => {
            console.log(record.id)

            let { fields } = record;

            let new_dei_data = dei_data_map[record.id] || {};
            console.log(fields["Company"], fields["Location"]);

            if (!fields["Location"])
                return;

            const new_company = {
                is_clearbit_import: false,
                airtable_company_id: record.id,
                company_name: fields["Company"],
                company_logo_url: fields["Logo"] && fields["Logo"].length ? fields["Logo"][0].url : null,
                cover_photo_url: fields["Banner"] && fields["Banner"].length ? fields["Banner"][0].url : null,
                company_city: location_map[fields["Location"][0]].city,
                company_state: location_map[fields["Location"][0]].state,
                company_about: fields["About"],
                company_website: fields["Site"],
                company_founded_year: fields["Founded"],
                company_size: dei_data_map[record.id] ? dei_data_map[record.id].employees : null,
                company_industry: industry_map[fields["Industry"][0]].name,
                company_industry_group: industry_map[fields["Industry"][0]].name,
                batch_id: "R2-10-13-2022-13:00",
                glassdoor_overall: fields["Glassdoor Overall"],
                glassdoor_culture: fields["Glassdoor Culture & Values"],
                glassdoor_diversity: fields["Glassdoor Diversity & Inclusion"],
                glassdoor_work_life: fields["Glassdoor Work/Life Balance"],
                glassdoor_senior_management: fields["Glassdoor Senior Management"],
                glassdoor_compensation: fields["Glassdoor Compensation and Benefits"],
                glassdoor_career: fields["Glassdoor Career Opportunities"],
            }

            // console.log(new_company, new_dei_data);
            // return;


            // create_company(new_company).then((company_id) => {
            //     console.log(company_id)
            //     new_dei_data = {...new_dei_data, company_id};
            //     CompanyDemographicService.create_company_demographic(new_dei_data).then((id) => {
            //         console.log(id)
            //     })
            // })

            // get_companies({
            //     airtable_company_id: record.id
            // }).then((companies) => {
            //     if (companies && companies.length) {
            //         const {company_id} = companies[0];
            //
            //         if (company_id) {
            //             let company_glassdoor = {
            //                 company_id,
            //                 glassdoor_overall: fields["Glassdoor Overall"],
            //                 glassdoor_culture: fields["Glassdoor Culture & Values"],
            //                 glassdoor_diversity: fields["Glassdoor Diversity & Inclusion"],
            //                 glassdoor_work_life: fields["Glassdoor Work/Life Balance"],
            //                 glassdoor_senior_management: fields["Glassdoor Senior Management"],
            //                 glassdoor_compensation: fields["Glassdoor Compensation and Benefits"],
            //                 glassdoor_career: fields["Glassdoor Career Opportunities"],
            //             }
            //
            //             // edit_company(company_glassdoor).then((d) => {
            //             //     console.log(d)
            //             // })
            //
            //             // console.log(company_glassdoor);
            //         }
            //     }
            // })

        });

        if (res.data.offset) {
            import_airtable_companies({location_map, industry_map, dei_data_map, offset: res.data.offset});
        } else {
            return;
        }
    });

}

function import_demo_data() {
    const data = require("./data/data-export-v4.json");

    Object.values(data).forEach((company) => {

        const clearbit_company_id = company.companyID;

        let all_eths =[]
        get_companies({clearbit_company_id}).then((companies) => {
            if (companies && companies.length) {
                const company_id = companies[0].company_id;
                console.log(company_id);

                if (company && company.companyDiversity) {
                    let new_demo_data = {
                        company_id
                    };

                    if (company.companyDiversity.ethnicities && company.companyDiversity.ethnicities.length) {

                        company.companyDiversity.ethnicities.forEach((ethnicity) => {
                            // console.log(ethnicity)

                            all_eths.push(ethnicity.name)
                            if (ethnicity.name === 'White') {
                                new_demo_data.employees_white = ethnicity.percentage
                            }

                            if (ethnicity.name === 'Hispanic or Latino') {
                                new_demo_data.employees_latinx = ethnicity.percentage
                            }

                            if (ethnicity.name === 'Black or African American') {
                                new_demo_data.employees_black = ethnicity.percentage
                            }

                            if (ethnicity.name === 'Asian') {
                                new_demo_data.employees_asian = ethnicity.percentage
                            }
                        })

                    }

                    if (company.companyDiversity.genders && company.companyDiversity.genders.length) {

                        company.companyDiversity.genders.forEach((gender) => {

                            if (gender.name === 'Male') {
                                new_demo_data.employees_male = gender.percentage
                            }

                            if (gender.name === 'Female') {
                                new_demo_data.employees_female = gender.percentage
                            }

                        })

                    }

                    console.log(new_demo_data);
                    console.log(_.uniq(all_eths))


                    CompanyDemographicService.create_company_demographic(new_demo_data).then((id) => {
                        console.log(id)
                    })
                }

            }
        })
    })
}

function load_locations({locations, location_map, offset}) {

    let url = `https://api.airtable.com/v0/${OSIRIS_DATA_BASE}/Locations?`;

    if (offset) {
        url += `offset=${offset}`
    }

    return new Promise((resolve, reject) => {
        axios.get(url, {
            headers: {
                'Authorization': `Bearer ${AIR_TABLE_KEY}`
            }
        }).then((res) => {

            console.log("LOCATION STUFF", res.data.offset, res.data.records.length)
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

            if (res.data.offset) {
                load_locations({locations, location_map, offset: res.data.offset}).then((data) => {
                    resolve(data)
                })
            } else {
                resolve({
                    locations,
                    location_map
                });
            }
        });
    })
}

function load_industries({industries, industry_map, offset}) {

    industries = industries || [];
    industry_map = industry_map || {};

    let url = `https://api.airtable.com/v0/${OSIRIS_DATA_BASE}/Industries?`;

    if (offset) {
        url += `offset=${offset}`
    }

    return new Promise((resolve, reject) => {
        axios.get(url, {
            headers: {
                'Authorization': `Bearer ${AIR_TABLE_KEY}`
            }
        }).then((res) => {

            res.data.records.forEach((record) =>{
                let fields = record.fields || {};

                let industry = {
                    industry_id: record.id,
                    id: record.id,
                    label: fields['Name'],
                    industry: fields['Name'],
                    name: fields['Name'],
                }

                industries.push(industry);

                industry_map[industry.industry_id] = industry;
            });

            resolve({
                industries,
                industry_map
            });
        });
    })
}

function load_dei({dei_data, dei_data_map, offset}) {

    let url = `https://api.airtable.com/v0/${OSIRIS_DATA_BASE}/DE%26I%20Data?`;

    if (offset) {
        url += `offset=${offset}`
    }

    dei_data = dei_data || [];
    dei_data_map = dei_data_map || {};

    return new Promise((resolve, reject) => {
        axios.get(url, {
            headers: {
                'Authorization': `Bearer ${AIR_TABLE_KEY}`
            }
        }).then((res) => {

            res.data.records.forEach((record) =>{
                let fields = record.fields || {};

                let dei = {
                    dei_id: record.id,
                    id: record.id,
                    employees_female: Math.round(fields['Female']*10000)/100,
                    employees_male: Math.round(fields['Male']*10000)/100,
                    employees_black: Math.round(fields['Black or African American']*10000)/100,
                    employees_white: Math.round(fields['White']*10000)/100,
                    employees_asian: Math.round(fields['Asian']*10000)/100,
                    employees_latinx: Math.round(fields['Hispanic or Latino']*10000)/100,
                    employees_indigenous: Math.round(fields['American Indian or Alaska Native']*10000)/100,
                    employees_multi: Math.round(fields['Two or More Races']*10000)/100,
                    employees_hawaiian: Math.round(fields['Native Hawaiian or Other Pacific Islander']*10000)/100,
                    employees_bipoc: Math.round(fields['BIPOC']*10000)/100,
                    year: fields['Year'],
                    employees: fields['Number of Employees'],
                    airtable_company_id: fields['Company'] ? fields['Company'][0] : null,
                }

                dei_data.push(dei);

                dei_data_map[dei.airtable_company_id] = dei;
            });

            if (res.data.offset) {
                load_dei({dei_data, dei_data_map, offset: res.data.offset}).then((data) => {
                    resolve(data)
                })
            } else {
                resolve({
                    dei_data,
                    dei_data_map
                });
            }


        });
    })
}

const csv = require('csv-parser');
const fs = require('fs');

function import_glassdoor_companies() {
    const filename = "glassdoor_set_1.csv";

    let i = 0;
    fs.createReadStream(__dirname + `/../../../data/${filename}`)
        .pipe(csv())
        .on('data', (company) => {

            company = {
                ...company,
                glassdoor_compensation: company.glassdoor_compensation || null,
                glassdoor_culture: company.glassdoor_culture || null,
                glassdoor_overall: company.glassdoor_overall || null,
                glassdoor_work_life: company.glassdoor_work_life || null,
                batch_id: "glassdoor_s_0_n_11000_v1"
            }

            console.log(company, ++i)
            // create_company(company).then((id) => {
            //     console.log(id)
            // })

        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });
}

