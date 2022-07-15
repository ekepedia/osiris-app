const { gql } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require("lodash");

const DemoUsers = require("./demo_users");
const Users = require("./users");
const FeedbackUsers = require("./feedback_users");
const DemoTrackings = require("./demo_tracking");
const DemoSohoApplications = require("./demo_soho_application");
const UserEducations = require("./user_educations");
const UserExperiences = require("./user_experiences");
const UserLinks = require("./user_links");
const UserGalleries = require("./user_galleries");

// Main Query Schema
const Query = gql`
    type Query {
        _empty: String
    }
`;

// Main Mutation Schema
const Mutation = gql`
    type Mutation {
        _empty: String
    }
`;

// Main Subscription Scheme
const Subscription = gql`
    type Subscription {
        _empty: String
    }
`;

// Main Resolver
const resolvers = {

};

const jsSchema = makeExecutableSchema({

    typeDefs: [
        Query,
        Mutation,
        Subscription,
        DemoUsers.typeDef,
        Users.typeDef,
        FeedbackUsers.typeDef,
        DemoTrackings.typeDef,
        DemoSohoApplications.typeDef,
        UserEducations.typeDef,
        UserExperiences.typeDef,
        UserLinks.typeDef,
        UserGalleries.typeDef,
    ],
    resolvers: merge(
        resolvers,
        DemoUsers.resolver,
        Users.resolver,
        FeedbackUsers.resolver,
        DemoTrackings.resolver,
        DemoSohoApplications.resolver,
        UserEducations.resolver,
        UserExperiences.resolver,
        UserLinks.resolver,
        UserGalleries.resolver,
    )
});

module.exports = jsSchema;