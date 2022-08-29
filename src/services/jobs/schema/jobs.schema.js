const winston = require("winston");
const { JOBS_TABLE } = require("../JobService");

module.exports = function (connection) {
    connection.schema.createTable(JOBS_TABLE, function (table) {
        table.increments('job_id').primary();
        table.string('airtable_job_id').unique();

        table.string('company_id');
        table.string('user_id');
        table.string('date_created');
        table.string('date_created_label');

        table.string('apply_link', 2000);
        table.string('job_salary_estimate');
        table.string('company_name');

        table.string('job_title', 2000);
        table.string('job_overview', 5000);
        table.string('job_qualifications', 5000);
        table.string('job_responsibilities', 5000);

        table.string('submitted_by_id');

        table.boolean('is_verified').defaultTo(false);
        table.boolean('is_active').defaultTo(true);
        table.boolean('is_user_submitted').defaultTo(false);
        table.boolean('is_public').defaultTo(true);

        table.string('batch_id');
        table.string('airtable_batch_id');

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${JOBS_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${JOBS_TABLE} table`);
    });
};