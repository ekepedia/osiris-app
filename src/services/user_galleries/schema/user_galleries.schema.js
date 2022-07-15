const winston = require("winston");
const { USER_GALLERY_TABLE } = require("../UserGalleryService");

module.exports = function (connection) {
    connection.schema.alterTable(USER_GALLERY_TABLE, function (table) {
        table.increments('user_gallery_id').primary();
        table.string('user_id');

        table.string('gallery_photo_url');
        table.integer('gallery_order').defaultTo(1);
        table.string('gallery_name');
        table.string('gallery_caption');

        table.timestamps(true, true);
    }).then(function () {
        winston.info(`Created ${USER_GALLERY_TABLE} table`);
    }).catch(function (e) {
        winston.info(`Did not create ${USER_GALLERY_TABLE} table`);
    });
};