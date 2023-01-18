const winston = require("winston");
const { JOBS_BUFFER_TABLE } = require("../JobService");

module.exports = function (connection) {
    connection.schema.createTable(JOBS_BUFFER_TABLE, function (table) {

        table.increments('job_buffer_id').primary();
        table.string('buffer_unique_code').unique();
        table.string('batch_id');

        table.string('company_id');

        table.string('job_board_link', 2000);
        table.string('job_board_city', 2000);
        table.string('job_board_state', 2000);
        table.string('job_board_location', 2000);
        table.string('job_board_category', 2000);
        table.string('job_board_level', 2000);

        table.string('job_title', 2000);
        table.string('job_company', 2000);
        table.string('job_location', 2000);
        table.string('job_salary', 2000);
        table.string('job_link', 2000);
        table.string('job_direct_link', 2000);
        table.string('job_logo_url', 2000);
        table.string('job_html', 10000);

        table.string('apply_link', 2000);

        table.string('job_overview', 5000);
        table.string('job_qualifications', 5000);
        table.string('job_responsibilities', 5000);

        table.string('job_source');

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${JOBS_BUFFER_TABLE} table`);
    }).catch(function (e) {
        winston.info(`Did not create ${JOBS_BUFFER_TABLE} table`);
    });
};