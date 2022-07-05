"use strict";
let init = false;
let knex = null;

const winston = require("winston");
const _ = require("lodash");
const axios = require("axios");

const DemoUserService = require("./demo_users/DemoUserService");
const DemoTrackingService = require("./demo_tracking/DemoTrackingService");
const DemoSohoApplicationService = require("./demo_soho_application/DemoSohoApplicationService");
const UserService = require("./users/UserService");
const EmailService = require("./emails/EmailService");

const UserLoginService = require("./user_logins/UserLoginService");
const UserEducationService = require("./user_educations/UserEducationService");
const UserExperienceService = require("./user_experiences/UserExperienceService");
const UserLinksService = require("./user_links/UserLinksService");

const DemoUserSchema = require("./demo_users/schema/demo_users.schema");
const FeedbackUserSchema = require("./demo_users/schema/feedback_users.schema");
const DemoTrackingSchema = require("./demo_tracking/schema/demo_tracking.schema");
const DemoSohoApplicationSchema = require("./demo_soho_application/schema/demo_soho_application.schema");
const UserSchema = require("./users/schema/users.schema");
const EmailSchema = require("./emails/schema/emails.schema");

const UserLoginsSchema = require("./user_logins/schema/user_logins.schema");
const UserEducationSchema = require("./user_educations/schema/user_educations.schema");
const UserExperienceSchema = require("./user_experiences/schema/user_experiences.schema");
const UserLinkSchema = require("./user_links/schema/user_links.schema");

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    winston.info("Database Service Successfully Initialized");

    DemoUserService.init(connection);
    DemoTrackingService.init(connection);
    DemoSohoApplicationService.init(connection);
    UserService.init(connection);
    EmailService.init(connection);

    UserLoginService.init(connection);
    UserEducationService.init(connection);
    UserExperienceService.init(connection);
    UserLinksService.init(connection);

    init_schema();
};

function init_schema() {
    DemoUserSchema(knex);
    DemoTrackingSchema(knex);
    DemoSohoApplicationSchema(knex);
    FeedbackUserSchema(knex);
    UserSchema(knex);
    EmailSchema(knex);

    UserLoginsSchema(knex);
    UserEducationSchema(knex);
    UserExperienceSchema(knex);
    UserLinkSchema(knex);
}

module.exports.generate_query = function generate_query(queryParams) {
    let query = {};

    _.forEach(queryParams, (val, key) => {
        if (val)
            query[key] = val
    });

    return query;
};

module.exports.clean_string = clean_string

function clean_string (education) {
    if (!education)
        return education

    education = education || "";
    return education.toLowerCase().trim();
}


module.exports.post_to_slack = function post_to_slack(message) {
    const url = "https://hooks.slack.com/services/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";

    axios.post(url, {"text": message}).then((res) => {
        console.log(res);
    })
}