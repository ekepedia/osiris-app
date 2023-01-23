import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";

let DataService = {}

DataService.openPageSession = ({client, user_id, site, page}) => {
    return new Promise((resolve, reject) => {
        const NewSessionTrackingMutation = gql`
            mutation NewSessionTrackingMutation(
                $user_id: String!,
                $version: String,
                $type: String,
                $timestamp: String,
                $custom_1: String,
                $custom_2: String,
                $custom_3: String,
            ){
                add_demo_tracking(input:{
                    user_id: $user_id,
                    version: $version,
                    type: $type, 
                    custom_1: $custom_1, 
                    custom_2: $custom_2, 
                    custom_3: $custom_3, 
                    timestamp: $timestamp})
            }
        `;

        let variables = {
            user_id,
            version: "1",
            type: site ? "4" : "5",
            timestamp: new Date().getTime().toString(),
            custom_1: "0",
            custom_2: new Date().getTime().toString(),
            custom_3: page
        };

        client.mutate({mutation: NewSessionTrackingMutation, variables}).then((response) => {
            resolve(response.data.add_demo_tracking)
        }).catch((err) => {
            resolve();
        })
    })
}

DataService.updatePageSession = ({client, tracking_id, custom_1}) => {
    return new Promise((resolve, reject) => {
        const EditTrackingMutation = gql`
            mutation EditTrackingMutation($tracking_id: String!, $custom_1: String, $custom_2: String) {
                edit_demo_tracking(input:{tracking_id: $tracking_id, custom_1: $custom_1, custom_2: $custom_2})
            }
        `;

        let variables = {
            tracking_id,
            custom_1,
            custom_2: new Date().getTime().toString()
        };

        client.mutate({mutation: EditTrackingMutation, variables}).then((data) => {
            resolve()
        }).catch((err) => {
            resolve();
        })

    })
}

DataService.updateUser = ({
                              client,
                              user_id,
                              first_name,
                              last_name,
                              phone_number,
                              instagram,
                              email_address,
                              linkedin,
                              sexual_orientation,
                              gender,
                          }) => {
    return new Promise((resolve, reject) => {
        const EditUserMutation = gql`
            mutation EditUserMutation(
                $user_id: String!,
                $first_name: String,
                $last_name: String,
                
                $phone_number: String,
                $instagram: String,
                $email_address: String,
                $linkedin: String,
                $sexual_orientation: String,
                $gender: String,
            ) {
                edit_demo_user(input:{
                    user_id: $user_id, 
                    first_name: $first_name, 
                    last_name: $last_name,
                    
                    phone_number: $phone_number,
                    instagram: $instagram,
                    email_address: $email_address,
                    linkedin: $linkedin,
                    sexual_orientation: $sexual_orientation,
                    gender: $gender,
                })
            }
        `;

        let variables = {
            user_id,
            first_name,
            last_name,
            phone_number,
            instagram,
            email_address,
            linkedin,
            sexual_orientation,
            gender,
        };

        client.mutate({mutation: EditUserMutation, variables}).then((data) => {
            resolve()
        }).catch((err) => {
            resolve();
        })

    })
}

DataService.updateApplication = ({
                                     client,
                                     application_id,
                                     startup_name,
                                     startup_location,
                                     startup_focus,
                                     startup_website,
                                     startup_instagram,
                                     startup_funding,
                                     startup_employees,

                                     deck_url,
                                     elevator_pitch,
                                     essay_1,
                                     essay_2,

                                     date_created,
                                     date_submitted,
                                     submitted,
                                     has_co_founders,
                                     is_incorporated,
                                     incorporation_structure,
                                 }) => {
    return new Promise((resolve, reject) => {
        const EditApplicationMutation = gql`
            mutation EditApplicationMutation(
                $application_id: String!,
                
                $startup_name: String,
                $startup_location: String,
                $startup_focus: String,
                $startup_website: String,
                $startup_instagram: String,
                $startup_funding: String,
                $startup_employees: String,

                $deck_url: String,
                $elevator_pitch: String,
                $essay_1: String,
                $essay_2: String,

                $date_created: String,
                $date_submitted: String,
                $submitted: String,
                $is_incorporated: String,
                $incorporation_structure: String,
            ) {
                edit_demo_soho_application(input:{
                    application_id: $application_id,
                    
                    startup_name: $startup_name,
                    startup_location: $startup_location,
                    startup_focus: $startup_focus,
                    startup_website: $startup_website,
                    startup_instagram: $startup_instagram,
                    startup_funding: $startup_funding,
                    startup_employees: $startup_employees,

                    deck_url: $deck_url,
                    elevator_pitch: $elevator_pitch,
                    essay_1: $essay_1,
                    essay_2: $essay_2,

                    date_created: $date_created,
                    date_submitted: $date_submitted,
                    submitted: $submitted,
                    is_incorporated: $is_incorporated,
                    incorporation_structure: $incorporation_structure,
                })
            }
        `;

        let variables = {
            application_id,
            startup_name,
            startup_location,
            startup_focus,
            startup_website,
            startup_instagram,
            startup_funding,
            startup_employees,

            deck_url,
            elevator_pitch,
            essay_1,
            essay_2,

            date_created,
            date_submitted,
            submitted,
            has_co_founders,
            is_incorporated,
            incorporation_structure,
        };

        client.mutate({mutation: EditApplicationMutation, variables}).then((data) => {
            resolve()
        }).catch((err) => {
            resolve();
        })

    })
}

DataService.updateFeedback = ({
                                  client,
                                  feedback_id,
                                  stage,

                                  is_native,
                                  is_asian,
                                  is_black,
                                  is_hispanic,
                                  is_middle_eastern,
                                  is_hawaiian,
                                  is_white,
                                  is_not_respond,

                                  question_1,
                                  question_2,
                                  question_3,
                                  question_4,
                                  question_5,

                                  wants_mentors,
                                  wants_peers,
                                  wants_internships,
                                  wants_jobs,
                                  wants_other,
                                  other,

                                  heard_seo,
                                  heard_mlt,
                                  heard_jopwell,
                                  heard_valence,
                                  heard_yc,
                                  heard_elpha,
                                  heard_lh,

                                  school_1,
                                  school_2,
                                  school_3,
                                  school_4,
                                  school_5,

                                  city,

                                  gender,
                                  phone_number,
                                  linkedin

                              }) => {
    return new Promise((resolve, reject) => {
        const EditFeedbackMutation = gql`
            mutation EditFeedbackMutation(
                $feedback_id: String!,
                $stage: String,
                
                $is_native: String,
                $is_asian: String,
                $is_black: String,
                $is_hispanic: String,
                $is_middle_eastern: String,
                $is_hawaiian: String,
                $is_white: String,
                $is_not_respond: String,

                $question_1: String,
                $question_2: String,
                $question_3: String,
                $question_4: String,
                $question_5: String,

                $wants_mentors: String,
                $wants_peers: String,
                $wants_internships: String,
                $wants_jobs: String,
                $wants_other: String,
                $other: String,

                $heard_seo: String,
                $heard_mlt: String,
                $heard_jopwell: String,
                $heard_valence: String,
                $heard_yc: String,
                $heard_elpha: String,
                $heard_lh: String,

                $school_1: String,
                $school_2: String,
                $school_3: String,
                $school_4: String,
                $school_5: String,
                
                $city: String,
                $gender: String,
                $phone_number: String,
                $linkedin: String,
            ) {
                edit_feedback_user(input:{
                    feedback_id: $feedback_id,
                    stage: $stage,

                    is_native: $is_native,
                    is_asian: $is_asian,
                    is_black: $is_black,
                    is_hispanic: $is_hispanic,
                    is_middle_eastern: $is_middle_eastern,
                    is_hawaiian: $is_hawaiian,
                    is_white: $is_white,
                    is_not_respond: $is_not_respond,

                    question_1: $question_1,
                    question_2: $question_2,
                    question_3: $question_3,
                    question_4: $question_4,
                    question_5: $question_5,

                    wants_mentors: $wants_mentors,
                    wants_peers: $wants_peers,
                    wants_internships: $wants_internships,
                    wants_jobs: $wants_jobs,
                    wants_other: $wants_other,
                    other: $other,

                    heard_seo: $heard_seo,
                    heard_mlt: $heard_mlt,
                    heard_jopwell: $heard_jopwell,
                    heard_valence: $heard_valence,
                    heard_yc: $heard_yc,
                    heard_elpha: $heard_elpha,
                    heard_lh: $heard_lh,

                    school_1: $school_1,
                    school_2: $school_2,
                    school_3: $school_3,
                    school_4: $school_4,
                    school_5: $school_5,

                    city: $city,
                    gender: $gender,
                    phone_number: $phone_number,
                    linkedin: $linkedin
                })
            }
        `;

        let variables = {
            feedback_id,
            stage,
            is_native,
            is_asian,
            is_black,
            is_hispanic,
            is_middle_eastern,
            is_hawaiian,
            is_white,
            is_not_respond,

            question_1,
            question_2,
            question_3,
            question_4,
            question_5,

            wants_mentors,
            wants_peers,
            wants_internships,
            wants_jobs,
            wants_other,
            other,

            heard_seo,
            heard_mlt,
            heard_jopwell,
            heard_valence,
            heard_yc,
            heard_elpha,
            heard_lh,

            school_1,
            school_2,
            school_3,
            school_4,
            school_5,

            city,
            gender,
            phone_number,
            linkedin
        };

        client.mutate({mutation: EditFeedbackMutation, variables}).then((data) => {
            resolve(data)
        }).catch((err) => {
            resolve();
        })

    })
}

DataService.createFeedback = ({client, email_address, first_name, last_name}) => {
    return new Promise((resolve, reject) => {

        const NewFeedbackMutation = gql`
            mutation NewFeedbackMutation(
                $email_address: String,
                $first_name: String,
                $last_name: String,
            ){
                add_feedback_user(input:{
                    email_address: $email_address,
                    first_name: $first_name,
                    last_name: $last_name,
                })
            }
        `;

        let variables = {
            email_address,
            first_name,
            last_name,
        };

        client.mutate({mutation: NewFeedbackMutation, variables}).then((response) => {
            resolve(response.data.add_feedback_user)
        }).catch((err) => {
            resolve();
        })

    })
}

DataService.createUser = ({client, email_address}) => {
    return new Promise((resolve, reject) => {

        const NewUserMutation = gql`
            mutation NewUserMutation(
                $email_address: String,
            ){
                add_demo_user(input:{
                    email_address: $email_address,
                })
            }
        `;

        let variables = {
            email_address
        };

        client.mutate({mutation: NewUserMutation, variables}).then((response) => {
            resolve(response.data.add_demo_user)
        }).catch((err) => {
            resolve();
        })

    })
}

DataService.createApplication = ({client, user_id}) => {
    return new Promise((resolve, reject) => {

        const NewApplicationMutation = gql`
            mutation NewApplicationMutation(
                $user_id: String,
            ){
                add_demo_demo_soho_application(input:{
                    user_id: $user_id,
                })
            }
        `;

        let variables = {
            user_id
        };

        client.mutate({mutation: NewApplicationMutation, variables}).then((response) => {
            resolve(response.data.add_demo_demo_soho_application)
        }).catch((err) => {
            resolve();
        })

    })
}

DataService.trackEvent = ({client, user_id, type, custom_1, custom_2, custom_3}) => {
    return new Promise((resolve, reject) => {
        const NewTrackingMutation = gql`
            mutation NewTrackingMutation(
                $user_id: String!,
                $version: String,
                $type: String,
                $timestamp: String,
                $custom_1: String,
                $custom_2: String,
                $custom_3: String,
            ){
                add_demo_tracking(input:{
                    user_id: $user_id,
                    version: $version,
                    type: $type,
                    custom_1: $custom_1,
                    custom_2: $custom_2,
                    custom_3: $custom_3,
                    timestamp: $timestamp})
            }
        `;

        let variables = {
            user_id,
            version: "1",
            type,
            timestamp: new Date().getTime().toString(),
            custom_1,
            custom_2,
            custom_3,
        };

        client.mutate({mutation: NewTrackingMutation, variables}).then((response) => {
            resolve(response.data.add_demo_tracking)
        }).catch((err) => {
            resolve();
        })
    })
}

DataService.getCompletionStatus = ({user, soho_application}) => {

    user = user || {};
    soho_application = soho_application || {};

    let status = 0;
    let progress = 0;

    let user_progress = 0;
    let company_progress = 0;
    let essay_progress = 0;

    if (
        user.email_address
    ) {
        status = 1;
        if (
            user.first_name &&
            user.last_name &&
            user.phone_number
        ) {
            status = 2;
            if (
                user.instagram &&
                user.linkedin
            ) {
                status = 3;

                if (
                    user.gender &&
                    user.sexual_orientation
                ) {
                    status = 4;
                }
            }
        }
    }

    const user_fields = [
        'first_name',
        'last_name',
        'email_address',
        'phone_number',
        'gender',
        'sexual_orientation',
        'instagram',
        'linkedin',
    ];

    const soho_fields = [
        'startup_name',
        'startup_location',
        'startup_focus',
        'startup_website',
        'startup_instagram',
        'startup_funding',
        'startup_employees',

        'deck_url',
        'elevator_pitch',
    ];

    const essay_fields = [
        'essay_1',
        'essay_2',
    ];

    user_fields.forEach((field) => {
        if (user[field]) {
            progress++;
            user_progress++;
        }
    })

    soho_fields.forEach((field) => {
        if (soho_application[field]) {
            progress++;
            company_progress++;
        }
    })

    essay_fields.forEach((field) => {
        if (soho_application[field]) {
            progress++;
            essay_progress++;
        }
    })

    return {
        status,
        progress,
        progress_percent: progress / (user_fields.length + soho_fields.length + essay_fields.length),
        user_progress,
        user_progress_percent: user_progress / (user_fields.length),
        company_progress,
        company_progress_percent: company_progress / (soho_fields.length),
        essay_progress,
        essay_progress_percent: essay_progress / (essay_fields.length),
    }
}

DataService.ping = (client) => {
    console.log("pong");
}

DataService.getInitial = (user) => {
    if (!user) {
        return "O"
    }

    if (user.first_name) {
        if (user.last_name) {
            return user.first_name[0] + user.last_name[0]
        } else {
            return user.first_name[0]
        }
    } else {
        if (user.last_name) {
            return user.last_name[0]
        } else {
            return "O"
        }
    }
}

DataService.trackGoogle = trackGoogle;

function trackGoogle (name, category, label, value) {
    if (gtag) {
        gtag('event', name, {
            'event_category': category,
            'event_label': label,
            'value': value
        });
    }
}

DataService.trackPage = trackPage;

function trackPage (page) {
    trackGoogle("submit_page", "page_submission", "page", page);
}

DataService.trackFormEntry = trackFormEntry;

function trackFormEntry (field, value) {
    trackGoogle("submit_page", "form_entry", field, value);
    trackGoogle(`submit_${field}`, "form_entry", field, value);
}

DataService.trackNavigation = trackNavigation;

function trackNavigation (name, field, value) {
    trackGoogle(name, "navigation", field, value);
}


DataService.getJobs = getJobs;

function getJobs ({
    companies,
    locations,
    max,
    industries,
    job_titles,
    seniorities,
    job_ids,
    glassdoor_overall,
    glassdoor_culture,
    glassdoor_work_life,
    glassdoor_compensation,
}) {
    return new Promise((resolve, reject) => {
        axios.post("/api/jobs/v2", {
            companies,
            locations,
            max,
            industries,
            job_titles,
            seniorities,
            job_ids,
            glassdoor_overall,
            glassdoor_culture,
            glassdoor_work_life,
            glassdoor_compensation,
        }).then((res) => {
            console.log(res.data)
            return resolve(res.data);
        })
    });

}

DataService.getLocations = getLocations;

function getLocations () {
    return new Promise((resolve, reject) => {
        axios.get("/api/locations/v2").then((res) => {
            console.log("locations", res.data)
            return resolve(res.data && res.data.locations ? res.data.locations : null);
        })

    });
}

DataService.getCompanies = getCompanies;

function getCompanies () {
    return new Promise((resolve, reject) => {
        axios.get("/api/companies/v2").then((res) => {
            console.log(res.data)
            return resolve(res.data && res.data.companies ? res.data.companies : null);
        })
    });
}

DataService.getJobTitles = getJobTitles;

function getJobTitles() {
    return new Promise((resolve, reject) => {
        axios.get("/api/job-titles/v2").then((res) => {
            console.log("job titles", res.data)
            return resolve(res.data && res.data.job_titles ? res.data.job_titles : null);
        })

    });
}

DataService.getIndustries = getIndustries;

function getIndustries() {
    return new Promise((resolve, reject) => {
        axios.get("/api/industries/v2").then((res) => {
            console.log("industries", res.data)
            return resolve(res.data && res.data.industries ? res.data.industries : null);
        })

    });
}

DataService.getSeniorities = getSeniorities;

function getSeniorities() {
    return new Promise((resolve, reject) => {
        axios.get("/api/senorities/v2").then((res) => {
            console.log("senorities", res.data)
            return resolve(res.data && res.data.senorities ? res.data.senorities : null);
        })

    });
}

DataService.getDegreeRequirements = getDegreeRequirements;

function getDegreeRequirements () {
    return new Promise((resolve, reject) => {
        axios.get("/api/degree-requirements").then((res) => {
            console.log(res.data)
            return resolve(res.data);
        })

    });
}

DataService.getRoles = getRoles;

function getRoles() {
    return new Promise((resolve, reject) => {
        axios.get("/api/roles").then((res) => {
            console.log(res.data)
            return resolve(res.data);
        })

    });
}

DataService.getAffinities = getAffinities;

function getAffinities() {
    return new Promise((resolve, reject) => {
        axios.get("/api/affinities").then((res) => {
            console.log(res.data)
            return resolve(res.data);
        })

    });
}

export default DataService
