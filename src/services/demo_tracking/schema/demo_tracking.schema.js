const winston = require("winston");
const { DEMO_TRACKING_TABLE } = require("../DemoTrackingService");

module.exports = function (connection) {
    connection.schema.createTable(DEMO_TRACKING_TABLE, function (table) {

        table.increments('tracking_id').primary();

        table.string('user_id');
        table.integer('type');
        table.integer('version');
        table.string('timestamp');

        table.string('custom_1');
        table.string('custom_2');
        table.string('custom_3');
        table.string('custom_4');
        table.string('custom_5');
        table.string('custom_6');
        table.string('custom_7');
        table.string('custom_8');
        table.string('custom_9');
        table.string('custom_10');

        table.timestamps(true, true);

    }).then(function () {
        winston.info(`Created ${DEMO_TRACKING_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${DEMO_TRACKING_TABLE} table`);
    });
};