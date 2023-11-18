const winston = require("winston");
const { GROUP_MEMBER_TABLE } = require("../GroupMemberService");

module.exports = function (connection) {
    connection.schema.createTable(GROUP_MEMBER_TABLE, function (table) {
        table.increments('group_member_id').primary();

        table.string('group_id');
        table.string('user_id');
        table.integer('type_id');
        //1 meaning they receive notifications for all posts; 2 meaning just for posts about jobs; 3 meaning just posts about events; 4 meaning everything except posts about jobs
        table.integer('notification_preferences').defaultTo(1);

        table.string('role_in_group_id');
        table.string('role_in_group_name');

        table.string('join_date');
        table.string('leave_date');
        table.string('date_verified');

        table.boolean('is_current').defaultTo(true);
        table.boolean('is_alumni').defaultTo(false);
        table.boolean('is_recruiter').defaultTo(false);
        table.boolean('is_group_admin').defaultTo(false);
        table.boolean('is_verified').defaultTo(false);

        table.boolean('is_hidden').defaultTo(false);

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${GROUP_MEMBER_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${GROUP_MEMBER_TABLE} table`);
    });
};