const async = require("async");
const _ = require("lodash");

const DatabaseService = require("../DatabaseService");

let init = false;
let knex = null;

// Load wink-nlp package  & helpers.
const winkNLP = require( 'wink-nlp' );
// Load "its" helper to extract item properties.
const its = require( 'wink-nlp/src/its.js' );
// Load "as" reducer helper to reduce a collection.
const as = require( 'wink-nlp/src/as.js' );
// Load english language model — light version.
const model = require( 'wink-eng-lite-model' );
// Instantiate winkNLP.
const nlp = winkNLP( model );


const DEMO_SOHO_APPLICATION_TABLE = "demo_soho_applications";

module.exports.DEMO_SOHO_APPLICATION_TABLE = DEMO_SOHO_APPLICATION_TABLE;

module.exports.init = function (connection) {
    init = true;
    knex = connection;

    console.log("SQL: Demo Soho Application Service Successfully Initialized");
};

module.exports.get_demo_soho_applications = get_demo_soho_applications;

function get_demo_soho_applications({user_id, application_id}) {

    const query = DatabaseService.generate_query({user_id, application_id});

    let knexQuery = knex(DEMO_SOHO_APPLICATION_TABLE).where(query);

    return new Promise((resolve, reject) => {
        knexQuery.then((rows) => {
            return resolve(rows);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.create_demo_soho_application = create_demo_soho_application;

function create_demo_soho_application({user_id,
  startup_name, startup_location, startup_focus, startup_website, startup_instagram, startup_funding, startup_employees,
  deck_url, elevator_pitch, essay_1, essay_2,
  elevator_pitch_tags_1, elevator_pitch_tags_2, elevator_pitch_tags_3,
  essay_1_tags_1, essay_1_tags_2, essay_1_tags_3,
  essay_2_tags_1, essay_2_tags_2, essay_2_tags_3,
  date_created, date_submitted, submitted, has_co_founders, is_incorporated, incorporation_structure,
}) {
    return new Promise((resolve, reject) => {
        if (!user_id)
            return reject(new Error("Missing user_id"));

        const query = DatabaseService.generate_query({user_id,
            startup_name, startup_location, startup_focus, startup_website, startup_instagram, startup_funding, startup_employees,
            deck_url, elevator_pitch, essay_1, essay_2,
            elevator_pitch_tags_1, elevator_pitch_tags_2, elevator_pitch_tags_3,
            essay_1_tags_1, essay_1_tags_2, essay_1_tags_3,
            essay_2_tags_1, essay_2_tags_2, essay_2_tags_3,
            date_created, date_submitted, submitted, has_co_founders, is_incorporated, incorporation_structure,
        });

        knex(DEMO_SOHO_APPLICATION_TABLE).insert(query).returning("application_id").then((rows) => {
            const application_id = rows[0];

            return resolve(application_id);
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.edit_demo_soho_application = edit_demo_soho_application;

function edit_demo_soho_application({application_id,user_id,

                                   startup_name, startup_location, startup_focus, startup_website, startup_instagram, startup_funding, startup_employees,
                                   deck_url, elevator_pitch, essay_1, essay_2,
                                   elevator_pitch_tags_1, elevator_pitch_tags_2, elevator_pitch_tags_3,
                                   essay_1_tags_1, essay_1_tags_2, essay_1_tags_3,
                                   essay_2_tags_1, essay_2_tags_2, essay_2_tags_3,
                                   date_created, date_submitted, submitted, has_co_founders, is_incorporated, incorporation_structure,}) {
    return new Promise((resolve, reject) => {
        if (!application_id)
            return reject(new Error("Missing application_id"));


        if (elevator_pitch) {
            let doc = nlp.readDoc(elevator_pitch);

            let tags = [];

            doc.tokens().each( (e) => {
                if (e.out(its.pos) === "NOUN") {
                    tags.push(e.out())
                }
            } )

            elevator_pitch_tags_1 = _.uniq(tags).join(" ")
        }

        if (essay_1) {
            let doc = nlp.readDoc(essay_1);

            let tags = [];

            doc.tokens().each( (e) => {
                if (e.out(its.pos) === "NOUN") {
                    tags.push(e.out())
                }
            } )

            essay_1_tags_1 = _.uniq(tags).join(" ")
        }

        if (essay_2) {
            let doc = nlp.readDoc(essay_2);

            let tags = [];

            doc.tokens().each( (e) => {
                if (e.out(its.pos) === "NOUN") {
                    tags.push(e.out())
                }
            } )

            essay_2_tags_1 = _.uniq(tags).join(" ")
        }


        const query = {
            user_id,
            startup_name, startup_location, startup_focus, startup_website, startup_instagram, startup_funding, startup_employees,
            deck_url, elevator_pitch, essay_1, essay_2,
            elevator_pitch_tags_1, elevator_pitch_tags_2, elevator_pitch_tags_3,
            essay_1_tags_1, essay_1_tags_2, essay_1_tags_3,
            essay_2_tags_1, essay_2_tags_2, essay_2_tags_3,
            date_created, date_submitted, submitted, has_co_founders, is_incorporated, incorporation_structure,};

        knex(DEMO_SOHO_APPLICATION_TABLE).where({application_id}).update(query).then(() =>{
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

module.exports.remove_soho_application = remove_soho_application;

function remove_soho_application({application_id}) {
    return new Promise((resolve, reject) => {
        if (!application_id)
            return reject(new Error("Missing application_id"));

        const query = DatabaseService.generate_query({application_id});

        knex(DEMO_SOHO_APPLICATION_TABLE).where(query).del().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}