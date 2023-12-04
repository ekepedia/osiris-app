const winston = require("winston");
const { GROUP_TABLE } = require("../GroupService");
const {Table} = require("@mui/material");

module.exports = function (connection) {
    connection.schema.createTable(GROUP_TABLE, function (table) {
        table.increments('group_id').primary();

        table.string('group_name');
        table.string('group_logo_url');
        table.string('cover_photo_url');

        table.string('group_creator_user_id');
        table.string('group_owner_user_id');
        table.string('date_created');

        table.string('group_size');
        table.string('group_about', 5000);
        table.string('group_website', 2000);
        table.string('group_founded_year');

        table.string('group_industry_affiliation');
        table.string('group_company_affiliation');
        table.string('group_role_affiliation');
        table.string('group_school_affiliation');

        //Year that group members started at the industry or company that they are affiliated with
        table.string('target_member_starting_year');

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