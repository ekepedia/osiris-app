const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");


const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const GROUP_TABLE = "groups";
const SERVICE_NAME = "Group Service";
const SERVICE_DEFAULT_TABLE = GROUP_TABLE;

const OSIRIS_DATA_BASE = "appMzGF6dxRHZfubu";

let PRELOADED_DATA = [];

let GROUP_MAP = {};

// let INDUSTRY_MAPPING = [{"company_industry":"Health Care Services & Hospitals","count":772,"new_industry":"Healthcare","":""},{"company_industry":"Information Technology Support Services","count":421,"new_industry":"Engineering","":""},{"company_industry":"Enterprise Software & Network Solutions","count":380,"new_industry":"Engineering","":""},{"company_industry":"Colleges & Universities","count":329,"new_industry":"Education","":""},{"company_industry":"Computer Hardware Development","count":315,"new_industry":"Engineering","":""},{"company_industry":"Advertising & Public Relations","count":285,"new_industry":"Marketing","":""},{"company_industry":"Banking & Lending","count":269,"new_industry":"Financial Services","":""},{"company_industry":"Restaurants & Cafes","count":236,"new_industry":"","":""},{"company_industry":"Business Consulting","count":230,"new_industry":"Consulting","":""},{"company_industry":"HR Consulting","count":220,"new_industry":"Consulting","":""},{"company_industry":"Consumer Product Manufacturing","count":190,"new_industry":"Consumer Products","":""},{"company_industry":"Department, Clothing & Shoe Stores","count":187,"new_industry":"Consumer Products","":""},{"company_industry":"Insurance Carriers","count":183,"new_industry":"Financial Services","":""},{"company_industry":"Energy & Utilities","count":182,"new_industry":"Life Sciences","":""},{"company_industry":"Biotech & Pharmaceuticals","count":180,"new_industry":"Life Sciences","":""},{"company_industry":"Internet & Web Services","count":173,"new_industry":"Tech","":""},{"company_industry":"Machinery Manufacturing","count":171,"new_industry":"Engineering","":""},{"company_industry":"Investment & Asset Management","count":165,"new_industry":"Financial Services","":""},{"company_industry":"Real Estate","count":149,"new_industry":"Real Estate","":""},{"company_industry":"Electronics Manufacturing","count":125,"new_industry":"Engineering","":""},{"company_industry":"Primary & Secondary Schools","count":121,"new_industry":"Education","":""},{"company_industry":"Food & Beverage Manufacturing","count":117,"new_industry":"Consumer Products","":""},{"company_industry":"Civic & Social Services","count":112,"new_industry":"","":""},{"company_industry":"Transportation Equipment Manufacturing","count":100,"new_industry":"Engineering","":""},{"company_industry":"Shipping & Trucking","count":95,"new_industry":"","":""},{"company_industry":"Hotels & Resorts","count":94,"new_industry":"","":""},{"company_industry":"Aerospace & Defense","count":92,"new_industry":"Engineering","":""},{"company_industry":"Construction","count":90,"new_industry":"","":""},{"company_industry":"National Agencies","count":82,"new_industry":"","":""},{"company_industry":"Software Development","count":82,"new_industry":"Engineering","":""},{"company_industry":"Legal","count":79,"new_industry":"Legal","":""},{"company_industry":"Research & Development","count":74,"new_industry":"","":""},{"company_industry":"Architectural & Engineering Services","count":73,"new_industry":"Engineering","":""},{"company_industry":"Other Retail Stores","count":73,"new_industry":"Consumer Products","":""},{"company_industry":"Health Care Products Manufacturing","count":69,"new_industry":"Healthcare","":""},{"company_industry":"Education & Training Services","count":66,"new_industry":"Education","":""},{"company_industry":"Wholesale","count":64,"new_industry":"","":""},{"company_industry":"Publishing","count":62,"new_industry":"","":""},{"company_industry":"Telecommunications Services","count":62,"new_industry":"","":""},{"company_industry":"Chemical Manufacturing","count":61,"new_industry":"Life Sciences","":""},{"company_industry":"State & Regional Agencies","count":60,"new_industry":"","":""},{"company_industry":"Financial Transaction Processing","count":59,"new_industry":"Financial Services","":""},{"company_industry":"Grocery Stores","count":58,"new_industry":"","":""},{"company_industry":"Municipal Agencies","count":58,"new_industry":"","":""},{"company_industry":"Beauty & Wellness","count":57,"new_industry":"Beauty","":""},{"company_industry":"Home Furniture & Housewares Stores","count":57,"new_industry":"","":""},{"company_industry":"Accounting & Tax","count":53,"new_industry":"Financial Services","":""},{"company_industry":"Insurance Agencies & Brokerages","count":53,"new_industry":"","":""},{"company_industry":"Taxi & Car Services","count":53,"new_industry":"","":""},{"company_industry":"Broadcast Media","count":48,"new_industry":"Media","":""},{"company_industry":"Preschools & Child Care Services","count":41,"new_industry":"","":""},{"company_industry":"Culture & Entertainment","count":40,"new_industry":"Entertainment","":""},{"company_industry":"Sports & Recreation","count":38,"new_industry":"","":""},{"company_industry":"Food & Beverage Stores","count":37,"new_industry":"","":""},{"company_industry":"Vehicle Dealers","count":37,"new_industry":"","":""},{"company_industry":"Airlines, Airports & Air Transportation","count":36,"new_industry":"Engineering","":""},{"company_industry":"Staffing & Subcontracting","count":36,"new_industry":"","":""},{"company_industry":"Building & Personnel Services","count":32,"new_industry":"","":""},{"company_industry":"Cable, Internet & Telephone Providers","count":29,"new_industry":"","":""},{"company_industry":"Financial Services","count":29,"new_industry":"Financial Services","":""},{"company_industry":"Grantmaking & Charitable Foundations","count":29,"new_industry":"","":""},{"company_industry":"Metal & Mineral Manufacturing","count":29,"new_industry":"","":""},{"company_industry":"Travel Agencies","count":28,"new_industry":"","":""},{"company_industry":"Sporting Goods Stores","count":26,"new_industry":"","":""},{"company_industry":"Beauty & Personal Accessories Stores","count":25,"new_industry":"Beauty","":""},{"company_industry":"Security & Protective","count":25,"new_industry":"","":""},{"company_industry":"Catering & Food Service Contractors","count":24,"new_industry":"","":""},{"company_industry":"Film Production","count":24,"new_industry":"","":""},{"company_industry":"Membership Organizations","count":23,"new_industry":"","":""},{"company_industry":"Consumer Electronics & Appliances Stores","count":22,"new_industry":"Engineering","":""},{"company_industry":"Video Game Publishing","count":21,"new_industry":"","":""},{"company_industry":"IT Services and IT Consulting","count":19,"new_industry":"","":""},{"company_industry":"General Merchandise & Superstores","count":18,"new_industry":"","":""},{"company_industry":"Technology, Information and Internet","count":17,"new_industry":"","":""},{"company_industry":"Automotive Parts & Accessories Stores","count":15,"new_industry":"","":""},{"company_industry":"Gambling","count":14,"new_industry":"","":""},{"company_industry":"Convenience Stores","count":13,"new_industry":"Consumer Products","":""},{"company_industry":"Pet & Pet Supplies Stores","count":13,"new_industry":"","":""},{"company_industry":"Gift, Novelty & Souvenir Stores","count":12,"new_industry":"","":""},{"company_industry":"Rail Transportation","count":12,"new_industry":"","":""},{"company_industry":"Consumer Product Rental","count":11,"new_industry":"","":""},{"company_industry":"Drug & Health Stores","count":11,"new_industry":"","":""},{"company_industry":"Mining & Metals","count":11,"new_industry":"","":""},{"company_industry":"General Repair & Maintenance","count":10,"new_industry":"","":""},{"company_industry":"Office Supply & Copy Stores","count":10,"new_industry":"","":""},{"company_industry":"Crop Production","count":9,"new_industry":"Life Sciences","":""},{"company_industry":"Manufacturing","count":9,"new_industry":"Engineering","":""},{"company_industry":"Commercial Equipment Services","count":8,"new_industry":"","":""},{"company_industry":"Hospitals & Health Clinics","count":8,"new_industry":"","":""},{"company_industry":"Media & Entertainment Stores","count":8,"new_industry":"","":""},{"company_industry":"Vehicle Repair & Maintenance","count":8,"new_industry":"","":""},{"company_industry":"Wood & Paper Manufacturing","count":8,"new_industry":"","":""},{"company_industry":"Business Consulting and Services","count":7,"new_industry":"Consulting","":""},{"company_industry":"Hospitals and Health Care","count":7,"new_industry":"","":""},{"company_industry":"Oil and Gas","count":7,"new_industry":"","":""},{"company_industry":"Retail","count":7,"new_industry":"","":""},{"company_industry":"Stock Exchanges","count":7,"new_industry":"","":""},{"company_industry":"Higher Education","count":6,"new_industry":"","":""},{"company_industry":"Industrial Machinery Manufacturing","count":6,"new_industry":"","":""},{"company_industry":"Photography","count":6,"new_industry":"","":""},{"company_industry":"Religious Institutions","count":6,"new_industry":"","":""},{"company_industry":"Car & Truck Rental","count":5,"new_industry":"","":""},{"company_industry":"Farm Support","count":5,"new_industry":"","":""},{"company_industry":"Insurance","count":5,"new_industry":"","":""},{"company_industry":"Motor Vehicle Manufacturing","count":5,"new_industry":"","":""},{"company_industry":"Pet Care & Veterinary","count":5,"new_industry":"","":""},{"company_industry":"Pharmaceutical Manufacturing","count":5,"new_industry":"","":""},{"company_industry":"Toy & Hobby Stores","count":5,"new_industry":"","":""},{"company_industry":"Utilities","count":5,"new_industry":"","":""},{"company_industry":"Auctions & Galleries","count":4,"new_industry":"","":""},{"company_industry":"Commercial Printing","count":4,"new_industry":"","":""},{"company_industry":"Food and Beverage Services","count":4,"new_industry":"","":""},{"company_industry":"Law Firms","count":4,"new_industry":"Legal","":""},{"company_industry":"Telecommunications","count":4,"new_industry":"","":""},{"company_industry":"Wellness and Fitness Services","count":4,"new_industry":"","":""},{"company_industry":"Banking","count":3,"new_industry":"Financial Services","":""},{"company_industry":"Biotechnology Research","count":3,"new_industry":"Life Sciences","":""},{"company_industry":"Forestry, Logging & Timber Operations","count":3,"new_industry":"","":""},{"company_industry":"Marine Transportation","count":3,"new_industry":"","":""},{"company_industry":"Semiconductor Manufacturing","count":3,"new_industry":"","":""},{"company_industry":"Advertising Services","count":2,"new_industry":"Marketing","":""},{"company_industry":"Audiovisual","count":2,"new_industry":"","":""},{"company_industry":"Aviation and Aerospace Component Manufacturing","count":2,"new_industry":"Engineering","":""},{"company_industry":"Civil Engineering","count":2,"new_industry":"","":""},{"company_industry":"Computers and Electronics Manufacturing","count":2,"new_industry":"","":""},{"company_industry":"Consumer Services","count":2,"new_industry":"Consumer Products","":""},{"company_industry":"Debt Relief","count":2,"new_industry":"","":""},{"company_industry":"Defense and Space Manufacturing","count":2,"new_industry":"Engineering","":""},{"company_industry":"Design Services","count":2,"new_industry":"","":""},{"company_industry":"Environmental Services","count":2,"new_industry":"","":""},{"company_industry":"Human Resources Services","count":2,"new_industry":"","":""},{"company_industry":"Property Management","count":2,"new_industry":"","":""},{"company_industry":"Wholesale Building Materials","count":2,"new_industry":"","":""},{"company_industry":"Accounting","count":1,"new_industry":"Financial Services","":""},{"company_industry":"Airlines and Aviation","count":1,"new_industry":"Engineering","":""},{"company_industry":"Animal Production","count":1,"new_industry":"Life Sciences","":""},{"company_industry":"Appliances, Electrical, and Electronics Manufacturing","count":1,"new_industry":"Engineering","":""},{"company_industry":"Biotechnology","count":1,"new_industry":"Life Sciences","":""},{"company_industry":"Broadcast Media Production and Distribution","count":1,"new_industry":"Media","":""},{"company_industry":"Computer and Network Security","count":1,"new_industry":"","":""},{"company_industry":"Computer Hardware Manufacturing","count":1,"new_industry":"Engineering","":""},{"company_industry":"Data Security Software Products","count":1,"new_industry":"","":""},{"company_industry":"Dental Clinics","count":1,"new_industry":"","":""},{"company_industry":"Entertainment Providers","count":1,"new_industry":"","":""},{"company_industry":"Event Services","count":1,"new_industry":"","":""},{"company_industry":"Freight and Package Transportation","count":1,"new_industry":"","":""},{"company_industry":"Government Administration","count":1,"new_industry":"","":""},{"company_industry":"Investment Banking","count":1,"new_industry":"Financial Services","":""},{"company_industry":"Investment Management","count":1,"new_industry":"Financial Services","":""},{"company_industry":"Legal Services","count":1,"new_industry":"Legal","":""},{"company_industry":"Medical Equipment Manufacturing","count":1,"new_industry":"","":""},{"company_industry":"Medical Testing & Clinical Laboratories","count":1,"new_industry":"","":""},{"company_industry":"Musicians","count":1,"new_industry":"","":""},{"company_industry":"Non-profit Organizations","count":1,"new_industry":"","":""},{"company_industry":"Packaging and Containers Manufacturing","count":1,"new_industry":"","":""},{"company_industry":"Parking & Valet","count":1,"new_industry":"","":""},{"company_industry":"Pharmaceutical","count":1,"new_industry":"","":""},{"company_industry":"Philanthropic Fundraising Services","count":1,"new_industry":"","":""},{"company_industry":"Professional Services","count":1,"new_industry":"","":""},{"company_industry":"Real Estate Agencies","count":1,"new_industry":"Real Estate","":""},{"company_industry":"Research Services","count":1,"new_industry":"","":""},{"company_industry":"Residential Building Construction","count":1,"new_industry":"","":""},{"company_industry":"Retail Office Equipment","count":1,"new_industry":"","":""},{"company_industry":"Spectator Sports","count":1,"new_industry":"","":""},{"company_industry":"Translation & Linguistic Services","count":1,"new_industry":"","":""},{"company_industry":"Travel Arrangements","count":1,"new_industry":"","":""},{"company_industry":"Truck Transportation","count":1,"new_industry":"","":""},{"company_industry":"Venture Capital and Private Equity Principals","count":1,"new_industry":"","":""},{"company_industry":"Waste Management","count":1,"new_industry":"","":""}];
// let INDUSTRY_MAPPING_MAP = {};
// INDUSTRY_MAPPING.forEach((m) => {
//     INDUSTRY_MAPPING_MAP[m.company_industry] = m.new_industry
// });

module.exports.GROUP_TABLE = GROUP_TABLE;
module.exports.GROUP_MAP = GROUP_MAP;
module.exports.PRELOADED_DATA = PRELOADED_DATA;
module.exports.GROUPS = PRELOADED_DATA;

module.exports.get_all_groups = () => {
    return PRELOADED_DATA;
};
module.exports.init = function (connection) {
    console.log("begin");
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

    //
    // setTimeout(() => {
    //     preload_and_prejoin_companies();
    // }, 1001);




    // let company_glassdoor = require("../../../data/company_glassdoor.json");

    // let company_map = {};
    // company_glassdoor.forEach((company) => {
    //     let company_name = (company.Company || "").toLowerCase().trim();
    //     company_map[company_name] = company;
    // })

    get_groups({is_clearbit_import: false}).then((groups) => {
        console.log(" Groups DATA:", groups.length);
        PRELOADED_DATA = groups;
        console.log("SET PRELOADED Groups DATA:", groups.length);
        groups.forEach((group) => {
            GROUP_MAP[group.group_id] = group;


            // if (company.company_logo_url.indexOf("airtable")!== -1) {
            //     // console.log(company)
            //     let company_name = (company.company_name || "").toLowerCase().trim();
            //     console.log(company_name, company_map[company_name]);


            //     if (company_map[company_name]) {
            //         console.log("submit edit")
            //         edit_company({
            //             company_id: company.company_id,
            //             company_logo_url: company_map[company_name].Logo
            //         }).then(() => {});
            //     }

            // }



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

    // load_locations({locations: in_locations, location_map: in_location_map}).then(({locations, location_map}) => {
       // load_industries({}).then(({industries, industry_map}) => {
         //   load_dei({}).then(({dei_data, dei_data_map}) => {

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
          //  });
        // });
    // });

    return new Promise((resolve) => {
        resolve();
    });
};

module.exports.get_groups = get_groups;

function get_groups({
                            group_id,
                            group_name,
                            group_logo_url,
                            cover_photo_url,

                            group_size,
                            group_about,
                            group_website,
                            group_founded_year,

                            group_industry_affiliation,
                            group_company_affiliation,
                            group_role_affiliation,
                            group_school_affiliation,

                            is_hidden,
                            is_verified,
                            is_clearbit_import,
                            batch_id,
}) {

    const query = DatabaseService.generate_query({
        group_id,
        group_name,
        group_logo_url,
        cover_photo_url,

        group_size,
        group_about,
        group_website,
        group_founded_year,

        group_industry_affiliation,
        group_company_affiliation,
        group_role_affiliation,
        group_school_affiliation,

        is_hidden,
        is_verified,
        is_clearbit_import,
        batch_id,
    });

    console.log("GROUP 123 QUERY", query, (query.is_clearbit_import === false && !query.group_id));
    let knexQuery = knex(SERVICE_DEFAULT_TABLE).where(query);

    return new Promise((resolve, reject) => {
        if (PRELOADED_DATA && PRELOADED_DATA.length && (query.is_clearbit_import === false && !query.group_id)) {
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

module.exports.create_group = create_group;

function create_group({
                          group_id,
                          group_name,
                          group_logo_url,
                          cover_photo_url,

                          group_size,
                          group_about,
                          group_website,
                          group_founded_year,

                          group_industry_affiliation,
                          group_company_affiliation,
                          group_role_affiliation,
                          group_school_affiliation,

                          is_hidden,
                          is_verified,
                          is_clearbit_import,
                          batch_id,

                        }) {
    return new Promise((resolve, reject) => {
        if (!group_name)
            return reject(new Error("Missing group_name"));

        const query = DatabaseService.generate_query({
            group_id,
            group_name,
            group_logo_url,
            cover_photo_url,

            group_size,
            group_about,
            group_website,
            group_founded_year,

            group_industry_affiliation,
            group_company_affiliation,
            group_role_affiliation,
            group_school_affiliation,

            is_hidden,
            is_verified,
            is_clearbit_import,
            batch_id,
        });

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("group_id").then((rows) => {
            const group_id = rows[0];

            return resolve(group_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_group = edit_group;

function edit_group({
                        group_id,
                        group_name,
                        group_logo_url,
                        cover_photo_url,

                        group_size,
                        group_about,
                        group_website,
                        group_founded_year,

                        group_industry_affiliation,
                        group_company_affiliation,
                        group_role_affiliation,
                        group_school_affiliation,

                        is_hidden,
                        is_verified,
                        is_clearbit_import,
                        batch_id,
                      }) {
    return new Promise((resolve, reject) => {
        if (!group_id)
            return reject(new Error("Missing group_id"));

        const query = {
            group_id,
            group_name,
            group_logo_url,
            cover_photo_url,

            group_size,
            group_about,
            group_website,
            group_founded_year,

            group_industry_affiliation,
            group_company_affiliation,
            group_role_affiliation,
            group_school_affiliation,

            is_hidden,
            is_verified,
            is_clearbit_import,
            batch_id,
        };

        knex(SERVICE_DEFAULT_TABLE).where({group_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_group = remove_group;

function remove_group({group_id}) {
    return new Promise((resolve, reject) => {
        if (!group_id)
            return reject(new Error("Missing group_id"));

        const query = DatabaseService.generate_query({group_id});

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


const csv = require('csv-parser');
const fs = require('fs');
const data = require("../companies/data/data-export-v4.json");

