"use strict";
let DatabaseService = require("./src/services/DatabaseService");
const winston = require("winston");

function connect() {

    let knex = require('knex')({
        client: 'pg',
        connection: process.env.POSTGRES_URL
    });

    let test = knex.schema;

    console.log("DATABASE URL:", process.env.POSTGRES_URL);

    knex.schema.hasTable('not_found_for_sure').then(function(exists) {
        if (!exists) {
            winston.info("Database connected");
            DatabaseService.init(knex);
        }
    });
}

connect();