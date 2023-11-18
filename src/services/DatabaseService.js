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

const GroupService = require("./groups/GroupService");
const GroupPostService = require("./group_posts/GroupPostService");
const GroupPostResponseService = require("./group_post_responses/GroupPostResponseService");
const GroupMemberService = require("./group_members/GroupMemberService");


const UserLoginService = require("./user_logins/UserLoginService");
const UserEducationService = require("./user_educations/UserEducationService");
const UserExperienceService = require("./user_experiences/UserExperienceService");
const UserLinksService = require("./user_links/UserLinksService");
const UserGalleryService = require("./user_galleries/UserGalleryService");
const UserRaceService = require("./user_races/UserRaceService");
const UserUniversityService = require("./user_universities/UserUniversityService");
const UserPreferenceService = require("./user_preferences/UserPreferenceService");

const CompanyService = require("./companies/CompanyService");
const CompanyDemographicService = require("./company_demographics/CompanyDemographicService");
const JobService = require("./jobs/JobService");
const SavedJobService = require("./saved_jobs/SavedJobService");
const SavedJobNoteService = require("./saved_jobs_notes/SavedJobNoteService");
const SavedJobReminderService = require("./saved_jobs_reminders/SavedJobReminderService");

const DemoUserSchema = require("./demo_users/schema/demo_users.schema");
const FeedbackUserSchema = require("./demo_users/schema/feedback_users.schema");
const DemoTrackingSchema = require("./demo_tracking/schema/demo_tracking.schema");
const DemoSohoApplicationSchema = require("./demo_soho_application/schema/demo_soho_application.schema");
const UserSchema = require("./users/schema/users.schema");
const EmailSchema = require("./emails/schema/emails.schema");

const GroupsSchema = require("./groups/schema/groups.schema");
const GroupPostsSchema = require("./group_posts/schema/group_posts.schema");
const GroupPostResponsesSchema = require("./group_post_responses/schema/group_post_responses.schema");
const GroupMembersSchema = require("./group_members/schema/group_members.schema");


const UserLoginsSchema = require("./user_logins/schema/user_logins.schema");
const UserEducationSchema = require("./user_educations/schema/user_educations.schema");
const UserExperienceSchema = require("./user_experiences/schema/user_experiences.schema");
const UserLinkSchema = require("./user_links/schema/user_links.schema");
const UserGallerySchema = require("./user_galleries/schema/user_galleries.schema");
const UserRaceSchema = require("./user_races/schema/user_races.schema");
const UserUniversitySchema = require("./user_universities/schema/user_races.schema");
const UserPreferencesSchema = require("./user_preferences/schema/user_preferences.schema");

const CompaniesSchema = require("./companies/schema/companies.schema");
const CompanyDemographicsSchema = require("./company_demographics/schema/company_demographics.schema");
const JobsSchema = require("./jobs/schema/jobs.schema");
const JobsBufferSchema = require("./jobs/schema/jobs_buffer.schema");
const SavedJobsSchema = require("./saved_jobs/schema/saved_jobs.schema");
const SavedJobNotesSchema = require("./saved_jobs_notes/schema/saved_job_notes.schema");
const SavedJobRemindersSchema = require("./saved_jobs_reminders/schema/saved_jobs_reminders.schema");

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
    UserGalleryService.init(connection);
    UserRaceService.init(connection);
    UserUniversityService.init(connection);
    UserPreferenceService.init(connection);

    GroupService.init(connection);
    GroupPostService.init(connection);
    GroupPostResponseService.init(connection);
    GroupMemberService.init(connection);

    CompanyDemographicService.init(connection);
    CompanyService.init(connection);
    JobService.init(connection);
    SavedJobService.init(connection);
    SavedJobNoteService.init(connection);
    SavedJobReminderService.init(connection);

    init_schema();
};

function init_schema() {
    DemoUserSchema(knex);
    DemoTrackingSchema(knex);
    DemoSohoApplicationSchema(knex);
    FeedbackUserSchema(knex);
    UserSchema(knex);
    EmailSchema(knex);

    GroupsSchema(knex);
    GroupPostsSchema(knex);
    GroupPostResponsesSchema(knex);
    GroupMembersSchema(knex);

    UserLoginsSchema(knex);
    UserEducationSchema(knex);
    UserExperienceSchema(knex);
    UserLinkSchema(knex);
    UserGallerySchema(knex);
    UserRaceSchema(knex);
    UserUniversitySchema(knex);
    UserPreferencesSchema(knex);

    CompaniesSchema(knex);
    CompanyDemographicsSchema(knex);
    JobsSchema(knex);
    JobsBufferSchema(knex);
    SavedJobsSchema(knex);
    SavedJobNotesSchema(knex);
    SavedJobRemindersSchema(knex);
}

module.exports.generate_query = function generate_query(queryParams) {
    let query = {};

    _.forEach(queryParams, (val, key) => {
        if (val !== undefined && val !== null)
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

module.exports.post_to_slack = post_to_slack

function post_to_slack(message) {

    return console.warn("slack disabled");

    const url = "https://hooks.slack.com/services/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";

    axios.post(url, {"text": message}).then((res) => {
        console.log(res);
    })
}

module.exports.return_standard_error = return_standard_error

function return_standard_error ({error}) {
    return {
        success: false,
        error
    }
}
module.exports.return_standard_success = return_standard_success

function return_standard_success ({data}) {
    return {
        success: true,
        data
    }
}

const BUCKET_NAME = 'osiris-public-img';

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET
});

module.exports.upload_img = upload_img;

function upload_img(name, mimetype, data) {
    return new Promise((resolve, reject) => {
        // Read content from the file

        // Setting up S3 upload parameters
        const params = {
            Bucket: BUCKET_NAME,
            Key: `post/${name}`, // File name you want to save as in S3
            Body: data,
            ContentType: mimetype
        };

        // Uploading files to the bucket
        s3.upload(params, function(err, data) {
            if (err) {
                console.error("ERROR UPLOADING");
                console.error("Upload error", err);
                return reject(err);
            }

            console.log(`File uploaded successfully. ${data.Location}`);

            resolve({
                url: data.Location
            })
        });
    })

}