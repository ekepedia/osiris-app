const winston = require("winston");
const { USER_UNIVERSITY_TABLE } = require("../UserUniversityService");

module.exports = function (connection) {
    connection.schema.createTable(USER_UNIVERSITY_TABLE, function (table) {
        table.increments('user_university_id').primary();

        table.string('user_id');
        table.string('university_id');

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${USER_UNIVERSITY_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${USER_UNIVERSITY_TABLE} table`);
    });
};