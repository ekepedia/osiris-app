const winston = require("winston");
const { USER_EXPERIENCE_TABLE } = require("../UserExperienceService");

module.exports = function (connection) {
    connection.schema.createTable(USER_EXPERIENCE_TABLE, function (table) {
        table.increments('user_experience_id').primary();

        table.string('user_id');

        table.string('company_id');
        table.string('company_name');
        table.string('company_logo_url');

        table.string('role_id');
        table.string('role_name');

        table.boolean('is_current').defaultTo(false);

        table.string('start_date');
        table.string('end_date');
        table.string('type');
        table.string('type_id');

        table.string('description', 2000);

        table.string('date_verified');
        table.string('date_created');
        table.string('date_updated');

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${USER_EXPERIENCE_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${USER_EXPERIENCE_TABLE} table`);
    });
};