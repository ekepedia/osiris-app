const winston = require("winston");
const { COMPANY_TABLE } = require("../CompanyService");

module.exports = function (connection) {
    connection.schema.createTable(COMPANY_TABLE, function (table) {
        table.increments('company_id').primary();
        table.string('airtable_company_id').unique();
        table.string('clearbit_company_id').unique();

        table.string('company_name');
        table.string('company_logo_url', 2000);
        table.string('cover_photo_url', 2000);

        table.string('company_size');
        table.string('company_about', 5000);
        table.string('company_website', 2000);
        table.string('company_founded_year');

        table.string('company_address_1');
        table.string('company_address_2');
        table.string('company_city');
        table.string('company_city_lower');
        table.string('company_city_id');
        table.string('company_state');
        table.string('company_state_id');
        table.string('company_state_lower');
        table.string('company_zip_code')

        table.float('glassdoor_overall');
        table.float('glassdoor_culture');
        table.float('glassdoor_diversity');
        table.float('glassdoor_work_life');
        table.float('glassdoor_senior_management');
        table.float('glassdoor_compensation');
        table.float('glassdoor_career');

        table.string('company_industry');
        table.string('company_industry_group');

        table.boolean('is_hidden').defaultTo(false);
        table.boolean('is_verified').defaultTo(false);
        table.boolean('is_clearbit_import').defaultTo(false);

        table.string('batch_id');
        table.string('airtable_batch_id');

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${COMPANY_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${COMPANY_TABLE} table`);
    });
};