const async = require("async");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");
const bcrypt = require("bcrypt");

const DatabaseService = require("../DatabaseService");
const UserService = require("../users/UserService");

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

    // get_user_logins({}).then((logins) => {
    //     console.log("logins", logins)
    // });
    // remove_user_login({user_login_id: "17"}).then()
    //
    // login_user({user_id: "eke", password: "pass123"}).then((g) => {
    //     console.log("GOOD", g)
    // }).catch((b) => {
    //     console.log("BAD", b)
    // })

    // login_user_by_username({username: "jason", password: "password"}).then((data) => {
    //     console.log("LOGO ", data);
    // }).catch((e) => {
    //     console.log("e", e);
    // })
    //
    // create_user_login({user_id: 7, password: "pass123"}).then((ul) => {
    //     console.log("created login", ul)
    //
    // }).catch((e) => {
    //     console.log("Error creating user", e)
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

        get_user_logins({user_id}).then((user_logins) => {

            if (user_logins && user_logins.length) {
                DatabaseService.post_to_slack(`Someone is trying to double claim this user: ${user_id}`)
                return reject(new Error("Already created a login for this user"));
            }

            bcrypt.hash(password, saltRounds, function(err, hash) {
                const password_hash = hash;

                const query = DatabaseService.generate_query({user_id, password_hash});

                knex(SERVICE_DEFAULT_TABLE).insert(query).returning("user_login_id").then((rows) => {
                    const user_login_id = rows[0];

                    DatabaseService.post_to_slack(`User #${user_id} has been claimed :)`)

                    return resolve(user_login_id);
                }).catch((err) => {
                    return reject(err);
                });
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

module.exports.login_user_by_username = login_user_by_username;

function login_user_by_username({username, password}) {
    return new Promise((resolve, reject) => {
        UserService.get_users({username}).then((users) => {
            if (users && users.length) {
                const user = users[0];
                login_user({
                    user_id: user.user_id,
                    password
                }).then((data) => {
                    resolve(data)
                }).catch((error) => {
                    reject(error);
                })
            } else {
                reject(new Error("User not found"));
            }
        })
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
                    resolve({
                        user_login,
                        token: "TBD"
                    })
                // })

            });
        }).catch(reject)
    });
}

module.exports.set_routes = set_routes;

function set_routes (app) {
    app.post("/api/login", function (req, res) {
        const { username, password } = req.body;
        console.log("Logging in for user:", username);
        login_user_by_username({username, password}).then((data)=>{
            console.log("data", data)
            res.json(DatabaseService.return_standard_success({data}));
        }).catch((error) => {
            console.log("error", error, error.toString())
            error = error && error.toString ? error.toString() : error;
            res.json(DatabaseService.return_standard_error({error}));
        });
    });

    app.post("/api/sign-up", function (req, res) {
        const { user_id, password } = req.body;
        console.log("Creating login in for user:", user_id);
        create_user_login({user_id, password}).then((data)=>{
            console.log("data", data)
            res.json(DatabaseService.return_standard_success({data:{...data, user_id}}));
        }).catch((error) => {
            console.log("error", error, error.toString())
            error = error && error.toString ? error.toString() : error;
            res.json(DatabaseService.return_standard_error({error}));
        });
    });
}