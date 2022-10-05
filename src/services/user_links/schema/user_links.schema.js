const winston = require("winston");
const { USER_LINK_TABLE } = require("../UserLinksService");

module.exports = function (connection) {
    connection.schema.createTable(USER_LINK_TABLE, function (table) {
        table.increments('user_link_id').primary();

        table.string('user_id');

        table.string('link_type_id');
        table.string('link_type');

        table.string('link_name', 2000);

        table.string('link_url', 2000);
        table.string('link_image_url', 2000);

        table.string('link_order');

        table.boolean('is_hidden').defaultTo(false);

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${USER_LINK_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${USER_LINK_TABLE} table`);
    });
};