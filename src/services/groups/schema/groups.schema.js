const winston = require("winston");
const { GROUP_TABLE } = require("../GroupService");

module.exports = function (connection) {
    connection.schema.createTable(GROUP_TABLE, function (table) {
        console.log("table for groups");
        table.increments('group_id').primary();
        table.string('clearbit_group_id').unique();

        table.string('group_name');
        table.string('group_logo_url', 2000);
        table.string('group_photo_url', 2000);

        table.string('group_size');
        table.string('group_about', 5000);
        table.string('group_website', 2000);
        table.string('group_founded_year');

        table.string('group_industry_affiliation');
        table.string('group_company_affiliation');
        table.string('group_role_affiliation');
        table.string('group_school_affiliation');


        table.boolean('is_hidden').defaultTo(false);
        table.boolean('is_verified').defaultTo(false);
        table.boolean('is_clearbit_import').defaultTo(false);

        table.string('batch_id');

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${GROUP_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${GROUP_TABLE} table`);
    });
};