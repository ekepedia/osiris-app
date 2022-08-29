const winston = require("winston");
const { SAVED_JOBS_NOTES_TABLE } = require("../SavedJobNoteService");

module.exports = function (connection) {
    connection.schema.createTable(SAVED_JOBS_NOTES_TABLE, function (table) {
        table.increments('saved_job_note_id').primary();

        table.string('saved_job_id');
        table.string('job_id');
        table.string('user_id');

        table.string('date_created');
        table.string('date_modified');

        table.string('note_title', 5000);
        table.string('note_body', 5000);
        table.string('note_html', 5000);

        table.boolean('is_archived').defaultTo(false);

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${SAVED_JOBS_NOTES_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${SAVED_JOBS_NOTES_TABLE} table`);
    });
};