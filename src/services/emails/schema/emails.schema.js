const winston = require("winston");
const { EMAIL_TABLE } = require("../EmailService");

module.exports = function (connection) {
    connection.schema.createTable(EMAIL_TABLE, function (table) {
        table.increments('email_id').primary();

        table.string('user_id');
        table.string('email_address').unique();

        table.boolean('verified').defaultTo(false);
        table.boolean('is_primary').defaultTo(false);

        table.string('date_verified');
        table.string('date_created');
        table.string('date_updated');

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${EMAIL_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${EMAIL_TABLE} table`);
    });
};