const winston = require("winston");
const { USER_PREFERENCE_TABLE } = require("../UserPreferenceService");

module.exports = function (connection) {
    connection.schema.createTable(USER_PREFERENCE_TABLE, function (table) {
        table.increments('user_preference_id').primary();

        table.string('user_id');
        table.integer('type_id');
        table.integer('preference_id');
        table.integer('order');
        table.string('preference_value');

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${USER_PREFERENCE_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${USER_PREFERENCE_TABLE} table`);
    });
};