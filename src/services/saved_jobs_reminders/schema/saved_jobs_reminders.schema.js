const winston = require("winston");
const { SAVED_JOBS_REMINDERS_TABLE } = require("../SavedJobReminderService");

module.exports = function (connection) {
    connection.schema.createTable(SAVED_JOBS_REMINDERS_TABLE, function (table) {
        table.increments('saved_job_reminder_id').primary();

        table.string('saved_job_id');
        table.string('job_id');
        table.string('user_id');

        table.string('date_created');
        table.string('date_modified');

        table.string('reminder_name', 5000);
        table.string('reminder_date');

        table.boolean('is_archived').defaultTo(false);
        table.boolean('is_completed').defaultTo(false);

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${SAVED_JOBS_REMINDERS_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${SAVED_JOBS_REMINDERS_TABLE} table`);
    });
};