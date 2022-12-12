const { gql } = require('apollo-server-express');

const UserService = require("../services/users/UserService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        users(input: QueryUser): [User]
    }

    extend type Mutation {
        add_user(input: CreateUserInput!): String
        edit_user(input: EditUserInput!): Boolean
        archive_user(user_id: String!): Boolean
        unarchive_user(user_id: String!): Boolean
    }

    type User {
        user_id: String!,
        username: String,
        first_name: String
        profile_photo_url: String
        cover_photo_url: String
        claim_page_photo_url: String
        bio: String

        user_twitter_link: String, 
        user_clubhouse_link: String,
        user_instagram_link: String,
        user_website_link: String,
        user_tiktok_link: String,
        user_youtube_link: String,
        user_vimeo_link: String,
        user_main_contact_email: String,
        user_main_contact_phone: String,

        last_name: String
        archived: Boolean

        dob: String
        dob_month: Int,
        dob_day: Int,
        dob_year: Int,

        gender: String
        gender_id: Int,
    }
    
    input CreateUserInput {
        username: String,
        first_name: String
        last_name: String
        profile_photo_url: String
        cover_photo_url: String
        claim_page_photo_url: String
        bio: String

        user_twitter_link: String,
        user_clubhouse_link: String,
        user_instagram_link: String,
        user_website_link: String,
        user_tiktok_link: String,
        
        user_youtube_link: String,
        user_vimeo_link: String,
        user_main_contact_email: String,
        user_main_contact_phone: String,

        dob: String
        dob_month: Int,
        dob_day: Int,
        dob_year: Int,

        gender: String
        gender_id: Int,
    }

    input EditUserInput {
        user_id: String!,
        username: String,
        first_name: String
        last_name: String
        profile_photo_url: String
        cover_photo_url: String
        claim_page_photo_url: String
        bio: String

        user_twitter_link: String,
        user_clubhouse_link: String,
        user_instagram_link: String,
        user_website_link: String,
        user_tiktok_link: String,
        user_youtube_link: String,
        user_vimeo_link: String,
        user_main_contact_email: String,
        user_main_contact_phone: String,
        dob: String
        dob_month: Int,
        dob_day: Int,
        dob_year: Int,

        gender: String
        gender_id: Int,
    }
    
    input QueryUser {
        user_id: String,
        username: String,
        first_name: String
        last_name: String
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        users: (_, { input }) => new Promise((res, rej) => {
            UserService.get_users(input).then((demo_users) => {
                return res(demo_users);
            });
        }),
    },
    Mutation: {
        add_user: (_, {input}) => new Promise((res, rej) => {
            UserService.create_user(input).then( (user_id) => {
                return res(user_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_user: (_, {input}) => new Promise((res, rej) => {
            UserService.edit_user(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        archive_user: (_, {user_id}) => new Promise((res, rej) => {
            UserService.archive_user({user_id}).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        unarchive_user: (_, {user_id}) => new Promise((res, rej) => {
            UserService.archive_user({user_id}, true).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
    }
};

module.exports = {
    typeDef,
    resolver
};