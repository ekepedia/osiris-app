const winston = require("winston");
const { USER_TABLE } = require("../UserService");

module.exports = function (connection) {
    connection.schema.createTable(USER_TABLE, function (table) {
        table.increments('user_id').primary();

        table.string('first_name');
        table.string('last_name');
        table.string('username').unique();

        table.string('profile_photo_url');
        table.string('cover_photo_url');
        table.string('bio', 2000);

        table.boolean('disabled').defaultTo(false);
        table.boolean('archived').defaultTo(false);

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${USER_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${USER_TABLE} table`);
    });
};