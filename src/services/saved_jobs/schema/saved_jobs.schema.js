const winston = require("winston");
const { SAVED_JOBS_TABLE } = require("../SavedJobService");

module.exports = function (connection) {
    connection.schema.createTable(SAVED_JOBS_TABLE, function (table) {
        table.increments('saved_job_id').primary();

        table.string('job_id');
        table.string('user_id');
        table.string('status_id');
        table.string('status');
        table.string('job_salary');
        table.string('job_deadline');

        table.boolean('is_active').defaultTo(true);
        table.boolean('is_archived').defaultTo(false);

        table.string('batch_id');
        table.string('airtable_batch_id');

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${SAVED_JOBS_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${SAVED_JOBS_TABLE} table`);
    });
};