
const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");


const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const COMPANY_TABLE = "companies";
const SERVICE_NAME = "Company Service";
const SERVICE_DEFAULT_TABLE = COMPANY_TABLE;

const AIR_TABLE_KEY = "key967P3bJaUjmwX2";
const OSIRIS_DATA_BASE = "appMzGF6dxRHZfubu";

module.exports.COMPANY_TABLE = COMPANY_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);

    // test_endpoints();
    // mass_delete();
    // construct_questions();
    // import_data();
    // import_demo_data();

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
        glassdoor_overall,
        glassdoor_culture,
        glassdoor_diversity,
        glassdoor_work_life,
        glassdoor_senior_management,
        glassdoor_compensation,
        glassdoor_career,
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

    const CompanyDemographicService = require("../company_demographics/CompanyDemographicService");

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
    const CompanyDemographicService = require("../company_demographics/CompanyDemographicService")

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

function mass_delete() {
    knex(SERVICE_DEFAULT_TABLE).where({}).del().then(() => {
    }).catch((err) => {
    });
}

function construct_questions() {

    let questions = [];

    get_companies({}).then((companies) => {
        companies.forEach((company) => {

            let { company_name, company_id } = company;

            let clean_company_name = company_name.replace("&", "and");
            clean_company_name = clean_company_name.replace("&", "and");

            if (clean_company_name.toLowerCase().indexOf("university") !== -1)
                return;

            if (clean_company_name.toLowerCase().indexOf("college") !== -1)
                return;

            if (clean_company_name.toLowerCase().indexOf("yale") !== -1)
                return;

            if (clean_company_name.toLowerCase().indexOf("institute") !== -1)
                return;

            questions.push({
                field: "employees_female",
                company_name,
                company_id,
                question: `What percentage of ${company_name} employees are female?`,
                url: `https://www.google.com/search?q=What percentage of ${clean_company_name} employees are female?`.split(" ").join("+")
            });
            questions.push({
                field: "employees_male",
                company_name,
                company_id,
                question: `What percentage of ${company_name} employees are male?`,
                url: `https://www.google.com/search?q=What percentage of ${clean_company_name} employees are male?`.split(" ").join("+")
            });

            questions.push({
                field: "employees_asian",
                company_name,
                company_id,
                question: `What percentage of ${company_name} employees are asian?`,
                url: `https://www.google.com/search?q=What percentage of ${clean_company_name} employees are asian?`.split(" ").join("+")
            });
            questions.push({
                field: "employees_black",
                company_name,
                company_id,
                question: `What percentage of ${company_name} employees are black?`,
                url: `https://www.google.com/search?q=What percentage of ${clean_company_name} employees are black?`.split(" ").join("+")
            });
            questions.push({
                field: "employees_latinx",
                company_name,
                company_id,
                question: `What percentage of ${company_name} employees are hispanic?`,
                url: `https://www.google.com/search?q=What percentage of ${clean_company_name} employees are hispanic?`.split(" ").join("+")
            });
            questions.push({
                field: "employees_indigenous",
                company_name,
                company_id,
                question: `What percentage of ${company_name} employees are native american?`,
                url: `https://www.google.com/search?q=What percentage of ${clean_company_name} employees are native american?`.split(" ").join("+")
            });
            questions.push({
                field: "employees_white",
                company_name,
                company_id,
                question: `What percentage of ${company_name} employees are white?`,
                url: `https://www.google.com/search?q=What percentage of ${clean_company_name} employees are white?`.split(" ").join("+")
            });
            questions.push({
                field: "company_website",
                company_name,
                company_id,
                question: `What is the website for ${company_name}?`,
                url: `https://www.google.com/search?q=What is the website for ${clean_company_name}?`.split(" ").join("+")
            });
            questions.push({
                field: "company_founded_year",
                company_name,
                company_id,
                question: `What year was ${company_name} founded?`,
                url: `https://www.google.com/search?q=What year was ${clean_company_name} founded?`.split(" ").join("+")
            });
            questions.push({
                field: "company_size",
                company_name,
                company_id,
                question: `How many employees does ${company_name} have?`,
                url: `https://www.google.com/search?q=How many employees does ${clean_company_name} have?`.split(" ").join("+")
            });
            questions.push({
                field: "company_headquarters",
                company_name,
                company_id,
                question: `Where are the headquarters for ${company_name}?`,
                url: `https://www.google.com/search?q=Where are the headquarters for ${clean_company_name}?`.split(" ").join("+")
            });

            questions.push({
                field: "company_glassdoor",
                company_name,
                company_id,
                question: `What is the Glassdoor overall rating for ${company_name}?`,
                url: `https://www.google.com/search?q=What is the Glassdoor overall rating for ${clean_company_name}?`.split(" ").join("+")
            });

            questions.push({
                field: "company_work_life",
                company_name,
                company_id,
                question: `What is the Glassdoor work life balance rating for ${company_name}?`,
                url: `https://www.google.com/search?q=What is the Glassdoor work life balance rating for ${clean_company_name}?`.split(" ").join("+")
            });
        });

        console.log(questions)

        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
            path: 'data-request-220811-v1.csv',
            header: Object.keys(questions[0]).map((key) => ({id: key, title: key}))
        });

        csvWriter
            .writeRecords(questions)
            .then(()=> console.log('The CSV file was written successfully'));
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