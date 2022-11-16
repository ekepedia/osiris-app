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

module.exports.COMPANY_TABLE = COMPANY_TABLE;

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

    setTimeout(() => {
        preload_and_prejoin_companies();
    }, 1000);

    get_companies({is_clearbit_import: false}).then((companies) => {
        PRELOADED_DATA = companies;
        console.log("SET PRELOADED DATA:", companies.length )
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
    let company_ids_with_company_demographics = [];

    async.parallel([(cb) => {
        CompanyDemographicService.get_company_demographics({}).then((in_company_demographics) => {
            company_demographics = in_company_demographics
            company_demographics.forEach((company_demographic) => {
                company_demographics = company_demographic;
                company_demographics_map[company_demographic.company_id] = company_demographics_map[company_demographic.company_id] || [];
                company_demographics_map[company_demographic.company_id].push(company_demographic);
                company_ids_with_company_demographics.push(company_demographic.company_id);
            });
            cb(null);
        })
    }, (cb) => {
        get_companies({is_clearbit_import: false}).then((in_companies) => {
            companies = in_companies;
            cb();
        })
    },], (err) => {
        // let list = [];
        companies.forEach((company) => {
            console.log(company.company_id)
            company_map[company.company_id] = company;
            company_name_map[company.company_name] = company;
            company_lowercase_name_map[(company.company_name || "").toLowerCase()] = company;
            // list.push({
            //     company_name: company.company_name,
            //     company_id: company.company_id,
            //     company_size: company.company_size,
            //     years: company_demographics_map[company.company_id + ""] ? company_demographics_map[company.company_id +""].length : 0
            // });
        });
        // const fs = require('fs');
        // fs.writeFile('./helloworld.txt', JSON.stringify(list), function (err) {
        //     if (err) return console.log(err);
        //     console.log('Hello World > helloworld.txt');
        // });

        const filename = "jobs_desc_working_doc_1050.csv";

        let i = 0;
        let found = 0;
        let missing = 0;
        let web_jobs = [];
        fs.createReadStream(__dirname + `/../../../data/${filename}`)
            .pipe(csv())
            .on('data', (job) => {
                const job_company = company_lowercase_name_map[(job.job_company || "").toLowerCase()];
                let company_id = null;
                if (job_company) {
                    found++;
                    company_id = job_company.company_id
                } else {
                    console.log(job.job_company)
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

                if (job.job_html) {
                    job.job_html = job.job_html.replace(/<div.*Show more.*<\/div>/, "");
                } else {
                    missing++
                }

                console.log(found, missing, ++i)

                if (job.job_board_category === "Consulting")
                    job.job_board_category = "Consultant"

                let job_for_board = {
                    job_id: Math.random(),
                    date_created: new Date().getTime(),
                    apply_link: job.job_link,
                    locations: job_location,
                    job_salary_estimate: job.job_salary,
                    date_created_label: null,
                    job_title: job.job_title,
                    job_overview: "",
                    industries: [{
                        industry_id: job.job_board_category,
                        id: job.job_board_category,
                        label:job.job_board_category,
                        name: job.job_board_category,
                    }],
                    job_types: [{
                        job_type_id: "Full-Time",
                        id: "Full-Time",
                        label: "Full-Time",
                        name: "Full-Time",
                    }],
                    qualifications: [],
                    responsibilities: [],
                    degree_requirements: [],
                    company_id,
                    companies: [{
                        company_name: job.job_company,
                        company_website: job.job_company,
                        company_logo_url: job.job_logo_url,
                        company_industry: null
                    }],
                    affinities: [],
                    job_html: job.job_html,
                    job_board_category: job.job_board_category,
                    job_seniority: job.job_board_level,
                };


                if (company_id && job.job_html) {
                    web_jobs.push(job_for_board);

                }
                console.log(job_for_board.job_title)


            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                JobService.set_webscraped_jobs(web_jobs);
            });
    })

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

