const winston = require("winston");
const { DEMO_SOHO_APPLICATION_TABLE } = require("../DemoSohoApplicationService");

module.exports = function (connection) {
    connection.schema.createTable(DEMO_SOHO_APPLICATION_TABLE, function (table) {

        table.increments('application_id').primary();

        table.string('user_id');

        table.string('startup_name');
        table.string('startup_location');
        table.string('startup_focus');
        table.string('startup_website');
        table.string('startup_instagram');
        table.string('startup_funding');
        table.string('startup_employees');

        table.string('deck_url');
        table.string('elevator_pitch', 2000);
        table.string('essay_1', 2000);
        table.string('essay_2', 2000);

        table.string('elevator_pitch_tags_1', 2000);
        table.string('elevator_pitch_tags_2', 2000);
        table.string('elevator_pitch_tags_3', 2000);
        table.string('essay_1_tags_1', 2000);
        table.string('essay_1_tags_2', 2000);
        table.string('essay_1_tags_3', 2000);
        table.string('essay_2_tags_1', 2000);
        table.string('essay_2_tags_2', 2000);
        table.string('essay_2_tags_3', 2000);

        table.string('date_created');
        table.string('date_submitted');
        table.string('submitted');
        table.string('has_co_founders');
        table.string('is_incorporated');
        table.string('incorporation_structure');

        table.timestamps(true, true);

    }).then(function () {
        winston.info(`Created ${DEMO_SOHO_APPLICATION_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${DEMO_SOHO_APPLICATION_TABLE} table`);
    });
};