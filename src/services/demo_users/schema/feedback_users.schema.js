const winston = require("winston");
const { FEEDBACK_USER_TABLE } = require("../DemoUserService");

module.exports = function (connection) {
    connection.schema.createTable(FEEDBACK_USER_TABLE, function (table) {

        table.increments('feedback_id').primary();

        table.string('email_address');
        table.string('college_email');

        table.string('password');
        table.string('phone_number');
        table.string('gender');
        table.string('sexual_orientation');

        table.string('first_name');
        table.string('last_name');
        table.string('instagram');
        table.string('linkedin');

        table.string('date_of_birth');

        table.integer('stage_id');

        table.string('stage');

        table.integer('is_native');
        table.integer('is_asian');
        table.integer('is_black');
        table.integer('is_hispanic');
        table.integer('is_middle_eastern');
        table.integer('is_hawaiian');
        table.integer('is_white');
        table.integer('is_not_respond');

        table.integer('gender_id');
        table.integer('sexual_orientation_id');

        table.integer('city_id');
        table.string('city');

        table.integer('question_1');
        table.integer('question_2');
        table.integer('question_3');
        table.integer('question_4');
        table.integer('question_5');
        table.integer('question_6');
        table.integer('question_7');
        table.integer('question_8');
        table.integer('question_9');
        table.integer('question_10');

        table.integer('wants_mentors');
        table.integer('wants_peers');
        table.integer('wants_internships');
        table.integer('wants_jobs');
        table.integer('wants_other');

        table.string('other', 3000);

        table.integer('heard_seo');
        table.integer('heard_mlt');
        table.integer('heard_jopwell');
        table.integer('heard_valence');
        table.integer('heard_yc');
        table.integer('heard_elpha');
        table.integer('heard_lh');

        table.string('school_1');
        table.string('school_2');
        table.string('school_3');
        table.string('school_4');
        table.string('school_5');

        table.integer('school_1_id');
        table.integer('school_2_id');
        table.integer('school_3_id');
        table.integer('school_4_id');
        table.integer('school_5_id');
        table.integer('school_6_id');

        table.integer('school_7_id');

        table.timestamps(true, true);

    }).then(function () {
        winston.info(`Created ${FEEDBACK_USER_TABLE} table`);
    }).catch(function () {
        winston.info(`Did not create ${FEEDBACK_USER_TABLE} table`);
    });
};