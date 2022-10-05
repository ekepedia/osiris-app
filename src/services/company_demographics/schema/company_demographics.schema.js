const winston = require("winston");
const { COMPANY_DEMOGRAPHIC_TABLE } = require("../CompanyDemographicService");

module.exports = function (connection) {
    connection.schema.createTable(COMPANY_DEMOGRAPHIC_TABLE, function (table) {
        table.increments('company_demographic_id').primary();

        table.string('company_id');
        table.string('airtable_company_id');

        table.float('employees_female');
        table.float('employees_male');
        table.float('employees_nonbinary');
        table.float('employees_trans');
        table.float('employees_other');

        table.float('employees_bipoc');
        table.float('employees_nonbipoc');

        table.float('employees_black');
        table.float('employees_white');
        table.float('employees_asian');
        table.float('employees_latinx');
        table.float('employees_indigenous');
        table.float('employees_multi');
        table.float('employees_hawaiian');
        table.float('year');

        table.float('employees_lgbtq');
        table.float('employees_lesbian');
        table.float('employees_gay');
        table.float('employees_queer');
        table.float('employees_asexual');

        table.boolean('is_hidden').defaultTo(false);

        table.string('batch_id');
        table.string('airtable_batch_id');

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${COMPANY_DEMOGRAPHIC_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${COMPANY_DEMOGRAPHIC_TABLE} table`);
    });
};