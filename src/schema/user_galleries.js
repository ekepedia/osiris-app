const { gql } = require('apollo-server-express');

const UserGalleryService = require("../services/user_galleries/UserGalleryService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        user_galleries(input: QueryUserGallery): [UserGallery]
    }

    extend type Mutation {
        add_user_gallery(input: CreateUserGalleryInput!): String
        edit_user_gallery(input: EditUserGalleryInput!): Boolean
    }

    type UserGallery {
        user_gallery_id: String,
        user_id: String,

        gallery_photo_url: String,
        gallery_order: Int
        gallery_name: String
        gallery_caption: String
    }
    
    input CreateUserGalleryInput {
        user_id: String,

        gallery_photo_url: String,
        gallery_order: Int
        gallery_name: String
        gallery_caption: String
    }

    input EditUserGalleryInput {
        user_gallery_id: String,
        gallery_photo_url: String,
        gallery_order: Int
        gallery_name: String
        gallery_caption: String
    }
    
    input QueryUserGallery {
        user_gallery_id: String,
        user_id: String
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        user_galleries: (_, { input }) => new Promise((res, rej) => {
            UserGalleryService.get_user_galleries(input).then((result) => {
                return res(result);
            });
        }),
    },
    Mutation: {
        add_user_gallery: (_, {input}) => new Promise((res, rej) => {
            UserGalleryService.create_user_gallery(input).then((user_gallery_id) => {
                return res(user_gallery_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_user_gallery: (_, {input}) => new Promise((res, rej) => {
            UserGalleryService.edit_user_gallery(input).then( () => {
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