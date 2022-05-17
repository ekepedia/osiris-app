const winston = require("winston");
const { DEMO_USER_TABLE } = require("../DemoUserService");

module.exports = function (connection) {
    connection.schema.createTable(DEMO_USER_TABLE, function (table) {

        table.increments('user_id').primary();

        table.string('email_address').unique();
        table.string('password');
        table.string('phone_number');
        table.string('gender');
        table.string('sexual_orientation');

        table.string('first_name');
        table.string('last_name');
        table.string('instagram');
        table.string('linkedin');

        table.timestamps(true, true);

    }).then(function () {
        winston.info(`Created ${DEMO_USER_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${DEMO_USER_TABLE} table`);
    });
};