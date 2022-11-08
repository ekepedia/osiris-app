const winston = require("winston");
const { USER_LOGIN_TABLE } = require("../UserLoginService");

module.exports = function (connection) {
    connection.schema.createTable(USER_LOGIN_TABLE, function (table) {
        table.increments('user_login_id').primary();

        table.string('user_id').notNullable();
        table.string('user_email').unique();
        table.string('password_hash');

        table.string('reset_password_code').unique();

        table.boolean('is_archived').defaultTo(false);

        table.string('date_archived');
        table.string('date_created');
        table.string('date_updated');

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${USER_LOGIN_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${USER_LOGIN_TABLE} table`);
    });
};