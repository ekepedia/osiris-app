const winston = require("winston");
const { GROUP_POSTS_TABLE } = require("../GroupPostService");

module.exports = function (connection) {
    connection.schema.createTable(GROUP_POSTS_TABLE, function (table) {
        table.increments('post_id').primary();

        table.string('group_id');
        table.string('poster_id');
        table.string('post_date');
        table.string('owner_id');

        table.string('type_id');
        table.string('subject');
        table.string('description');
        table.boolean('is_shareable').defaultTo(false);

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${GROUP_POSTS_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${GROUP_POSTS_TABLE} table`);
    });
};