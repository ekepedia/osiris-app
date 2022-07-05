const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");
const bcrypt = require("bcrypt");

const DatabaseService = require("../DatabaseService");

const saltRounds = 10;
const jwtSecret = "RnVP6iJZDQOCb4G0Y7Hbk9aybWgFiVvATw4f1i0M";

let init = false;
let knex = null;

const USER_LOGIN_TABLE = "user_logins";
const SERVICE_NAME = "User Login Service";
const SERVICE_DEFAULT_TABLE = USER_LOGIN_TABLE;

module.exports.USER_LOGIN_TABLE = USER_LOGIN_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log(`SQL: ${SERVICE_NAME} Successfully Initialized`);

    // get_user_logins({user_id: "eke"}).then((logins) => {
    //     console.log("logins", logins)
    // });
    //
    // login_user({user_id: "eke", password: "pass123"}).then((g) => {
    //     console.log("GOOD", g)
    // }).catch((b) => {
    //     console.log("BAD", b)
    // })

    // create_user_login({user_id: "eke", password: "pass123"}).then((ul) => {
    //     console.log("created login", ul)
    //
    // })

    // remove_user_login({user_login_id: 1}).then(() => {
    //     console.log("REMOVE D")
    // })
};

module.exports.get_user_logins = get_user_logins;

function get_user_logins({user_id, user_login_id}) {

    const query = DatabaseService.generate_query({user_login_id, user_id});

    let knexQuery = knex(SERVICE_DEFAULT_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.create_user_login = create_user_login;

function create_user_login({user_id, password}) {

    return new Promise((resolve, reject) => {
        if (!user_id || !password)
            return reject(new Error("Missing user_id or password"));

        bcrypt.hash(password, saltRounds, function(err, hash) {
            const password_hash = hash;

            const query = DatabaseService.generate_query({user_id, password_hash});

            knex(SERVICE_DEFAULT_TABLE).insert(query).returning("user_login_id").then((rows) => {
                const user_login_id = rows[0];

                return resolve(user_login_id);
            }).catch((err) => {
                return reject(err);
            });
        });
    });
}

module.exports.remove_user_login = remove_user_login;

function remove_user_login({user_login_id}) {
    return new Promise((resolve, reject) => {
        if (!user_login_id)
            return reject(new Error("Missing user_login_id"));

        const query = DatabaseService.generate_query({user_login_id});

        knex(SERVICE_DEFAULT_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.login_user = login_user;

function login_user({user_id, password}) {

    return new Promise((resolve, reject) => {
        get_user_logins({user_id}).then((user_logins) => {
            console.log(user_logins);

            if (!user_logins || !user_logins.length)
                return reject(new Error("User Not Found"));

            const user_login = user_logins[0];

            bcrypt.compare(password, user_login.password_hash, (err, result) => {

                console.log("Is right password:", result);

                if (!result)
                    return reject(new Error("Wrong Password"));

                // generate_token(user).then((token) => {
                //
                //     delete user["password"];

                    resolve({
                        user_login,
                        token: "TBD"
                    })
                // })

            });
        })
    });
}