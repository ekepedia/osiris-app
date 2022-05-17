const async = require("async");
const axios = require("axios");

const DatabaseService = require("../DatabaseService");
const DemoUserService = require("../demo_users/DemoUserService");

let init = false;
let knex = null;

const DEMO_TRACKING_TABLE = "demo_trackings";

module.exports.DEMO_TRACKING_TABLE = DEMO_TRACKING_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log("SQL: Demo Tracking Service Successfully Initialized");
};

module.exports.get_demo_trackings = get_demo_trackings;

function get_demo_trackings({user_id, tracking_id}) {

    const query = DatabaseService.generate_query({user_id, tracking_id});

    let knexQuery = knex(DEMO_TRACKING_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.create_demo_tracking = create_demo_tracking;

function create_demo_tracking({user_id, type, version, timestamp, custom_1, custom_2, custom_3, custom_4, custom_5, custom_6, custom_7, custom_8, custom_9, custom_10 }) {
    return new Promise((resolve, reject) => {
        if (!user_id)
            return reject(new Error("Missing user_id"));

        const url = "https://29b8-151-203-12-169.ngrok.io/god-view/" + user_id;

        const query = DatabaseService.generate_query({user_id, type, version, timestamp, custom_1, custom_2, custom_3, custom_4, custom_5, custom_6, custom_7, custom_8, custom_9, custom_10 });

        knex(DEMO_TRACKING_TABLE).insert(query).returning("tracking_id").then((rows) => {
            const tracking_id = rows[0];

            if (type === "2") {
                DemoUserService.get_demo_users({user_id}).then((demo_users) => {
                    if (demo_users && demo_users.length) {
                        const demo_user = demo_users[0]

                        const name = demo_user.first_name && demo_user.last_name ? (`${demo_user.first_name} ${demo_user.last_name}`) : (
                            demo_user.first_name ? demo_user.first_name : demo_user.email_address
                        )

                        post_to_slack(`*New Login*\nHey Guys, ${name} just logged into the OSIRIS App :tada:\n<${url}|View Full Activity>`);
                    } else {
                        post_to_slack(`*New Login*\nHey Guys, ${user_id} just logged into the OSIRIS App :tada:\n<${url}|View Full Activity>`);
                    }
                })
            }

            if (type === "1") {
                post_to_slack(`*New Sign Up*\nHey Guys, ${custom_1} just signed up for the OSIRIS App :tada:\n<${url}|View Full Activity>`);
            }

            return resolve(tracking_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_demo_tracking = edit_demo_tracking;

function edit_demo_tracking({tracking_id, user_id, type, version, timestamp, custom_1, custom_2, custom_3, custom_4, custom_5, custom_6, custom_7, custom_8, custom_9, custom_10}) {
    return new Promise((resolve, reject) => {
        if (!tracking_id)
            return reject(new Error("Missing tracking_id"));

        const query = {user_id, type, version, timestamp, custom_1, custom_2, custom_3, custom_4, custom_5, custom_6, custom_7, custom_8, custom_9, custom_10};

        knex(DEMO_TRACKING_TABLE).where({tracking_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_demo_tracking = remove_demo_tracking;

function remove_demo_tracking({tracking_id}) {
    return new Promise((resolve, reject) => {
        if (!tracking_id)
            return reject(new Error("Missing tracking_id"));

        const query = DatabaseService.generate_query({tracking_id});

        knex(DEMO_TRACKING_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

function post_to_slack(message) {
    const url = "https://hooks.slack.com/services/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";

    axios.post(url, {"text": message}).then((res) => {
        console.log(res);
    })
}