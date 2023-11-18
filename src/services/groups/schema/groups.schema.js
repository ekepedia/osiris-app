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

        //Determines who can view the group
        // 1 means only members can see content but everyone can view group and request to post
        // 2 means it is secret and only members can see group
        // 3 means it is open to anyone (all users can see content)
        table.string('privacy_setting').defaultTo("1");

        table.boolean('is_active').defaultTo(true);
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