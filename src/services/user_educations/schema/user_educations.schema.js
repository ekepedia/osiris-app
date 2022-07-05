const winston = require("winston");
const { USER_EDUCATION_TABLE } = require("../UserEducationService");

module.exports = function (connection) {
    connection.schema.createTable(USER_EDUCATION_TABLE, function (table) {
        table.increments('user_education_id').primary();

        table.string('user_id');

        table.string('school_id');
        table.string('school_name');
        table.string('school_logo_url');
        table.string('degree_id');
        table.string('degree_name');

        table.string('field_of_study_id');
        table.string('field_of_study_name');

        table.string('start_date');
        table.string('end_date');

        table.boolean('is_currently_enrolled').defaultTo(false);
        table.boolean('verified').defaultTo(false);

        table.string('date_verified');
        table.string('date_created');
        table.string('date_updated');

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${USER_EDUCATION_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${USER_EDUCATION_TABLE} table`);
    });
};