const winston = require("winston");
const { GROUP_POST_RESPONSES_TABLE } = require("../GroupPostResponseService");

module.exports = function (connection) {
    connection.schema.createTable(GROUP_POST_RESPONSES_TABLE, function (table) {
        table.increments('group_post_response_id').primary();

        table.string('group_post_id');
        table.string('user_id');
        table.string('user_company_while_responding_id');
        table.string('user_role_while_responding_id');
        table.string('job_id');
        table.string('date');
        table.string('response');

        table.boolean('user_is_employed_at_time_of_response').defaultTo(false);
        table.boolean('user_is_student_at_time_of_response').defaultTo(true);

        table.boolean('is_active').defaultTo(true);
        table.boolean('is_archived').defaultTo(false);

        table.string('batch_id');
        table.string('airtable_batch_id');

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${GROUP_POST_RESPONSES_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${GROUP_POST_RESPONSES_TABLE} table`);
    });
};