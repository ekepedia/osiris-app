const winston = require("winston");
const { USER_GALLERY_TABLE } = require("../UserGalleryService");

module.exports = function (connection) {
    connection.schema.createTable(USER_GALLERY_TABLE, function (table) {
        table.increments('user_gallery_id').primary();
        table.string('user_id');

        table.string('gallery_photo_url', 2000);
        table.integer('gallery_order').defaultTo(1);
        table.string('gallery_name', 2000);
        table.string('gallery_caption', 2000);

        table.boolean('is_hidden').defaultTo(false);

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${USER_GALLERY_TABLE} table`);
    }).catch(function (e) {
        winston.info(`Did not create ${USER_GALLERY_TABLE} table`);
    });
};