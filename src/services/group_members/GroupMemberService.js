const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

const GROUP_MEMBER_TABLE = "group_members";
const SERVICE_NAME = "Group Member Service";
const SERVICE_DEFAULT_TABLE = GROUP_MEMBER_TABLE;

module.exports.GROUP_MEMBER_TABLE = GROUP_MEMBER_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);
};

module.exports.get_group_members = get_group_members;

function get_group_members({
                               group_member_id,
                               group_id,
                               user_id,
                               type_id,
                               notification_preferences,
                               role_in_group_id,
                               role_in_group_name,
                               join_date,
                               leave_date,
                               date_verified,
                               is_current,
                               is_alumni,
                               is_recruiter,
                               is_group_admin,
                               is_verified,
                               is_hidden,

}) {

    const query = DatabaseService.generate_query({
        group_member_id,
        group_id,
        user_id,
        type_id,
        notification_preferences,
        role_in_group_id,
        role_in_group_name,
        join_date,
        leave_date,
        date_verified,
        is_current,
        is_alumni,
        is_recruiter,
        is_group_admin,
        is_verified,
        is_hidden
    });

    let knexQuery = knex(SERVICE_DEFAULT_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.add_group_member = add_group_member;

function add_group_member({
                              group_member_id,
                              group_id,
                              user_id,
                              type_id,
                              notification_preferences,
                              role_in_group_id,
                              role_in_group_name,
                              join_date,
                              leave_date,
                              date_verified,
                              is_current,
                              is_alumni,
                              is_recruiter,
                              is_group_admin,
                              is_verified,
                              is_hidden
}) {
    return new Promise((resolve, reject) => {
        if (!user_id || !type_id || !group_id)
            return reject(new Error("Missing user_id or type_id or group_id"));

        const query = DatabaseService.generate_query({
            group_member_id,
            group_id,
            user_id,
            type_id,
            notification_preferences,
            role_in_group_id,
            role_in_group_name,
            join_date,
            leave_date,
            date_verified,
            is_current,
            is_alumni,
            is_recruiter,
            is_group_admin,
            is_verified,
            is_hidden
        });

        knex(SERVICE_DEFAULT_TABLE).insert(query).returning("group_member_id").then((rows) => {
            const group_member_id = rows[0];

            return resolve(group_member_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_group_member = edit_group_member;

function edit_group_member({
                               group_member_id,
                               group_id,
                               user_id,
                               type_id,
                               notification_preferences,
                               role_in_group_id,
                               role_in_group_name,
                               join_date,
                               leave_date,
                               date_verified,
                               is_current,
                               is_alumni,
                               is_recruiter,
                               is_group_admin,
                               is_verified,
                               is_hidden
}) {
    return new Promise((resolve, reject) => {
        if (!group_member_id)
            return reject(new Error("Missing group_member_id,"));

        const query = {
            group_member_id,
            group_id,
            user_id,
            type_id,
            notification_preferences,
            role_in_group_id,
            role_in_group_name,
            join_date,
            leave_date,
            date_verified,
            is_current,
            is_alumni,
            is_recruiter,
            is_group_admin,
            is_verified,
            is_hidden
        };

        knex(SERVICE_DEFAULT_TABLE).where({group_member_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_group_member = remove_group_member;

function remove_group_member({group_member_id}) {
    return new Promise((resolve, reject) => {
        if (!group_member_id)
            return reject(new Error("Missing group_member_id"));

        const query = DatabaseService.generate_query({group_member_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}