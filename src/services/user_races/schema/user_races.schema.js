const winston = require("winston");
const { USER_RACE_TABLE } = require("../UserRaceService");

module.exports = function (connection) {
    connection.schema.createTable(USER_RACE_TABLE, function (table) {
        table.increments('user_race_id').primary();

        table.string('user_id');
        table.string('race_id');

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${USER_RACE_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${USER_RACE_TABLE} table`);
    });
};