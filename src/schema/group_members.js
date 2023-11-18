const { gql } = require('apollo-server-express');

const GroupMemberService = require("../services/group_members/GroupMemberService");

// Construct a schema, using GraphQL schema language
const typeDef = gql`
    extend type Query {
        group_members(input: QueryGroupMember): [GroupMember]
    }

    extend type Mutation {
        add_group_member(input: CreateGroupMemberInput!): String
        edit_group_member(input: EditGroupMemberInput!): Boolean
        remove_group_member(group_member_id: String!): Boolean
    }

    type GroupMember {
        group_member_id: String,
        group_id: String,
        user_id: String,
        type_id: String,
        notification_preferences: String,
        role_in_group_id: String,
        role_in_group_name: String,
        join_date: String,
        leave_date: String,
        date_verified: String,

        is_current: Boolean,
        is_alumni: Boolean,
        is_recruiter: Boolean,
        is_group_admin: Boolean,
        is_verified: Boolean,
        is_hidden: Boolean,
    }

    input CreateGroupMemberInput {
        group_member_id: String,
        group_id: String,
        user_id: String,
        type_id: String,
        notification_preferences: String,
        role_in_group_id: String,
        role_in_group_name: String,
        join_date: String,
        leave_date: String,
        date_verified: String,
        
        is_current: Boolean,
        is_alumni: Boolean,
        is_recruiter: Boolean,
        is_group_admin: Boolean,
        is_verified: Boolean,
        is_hidden: Boolean,
    }

    input EditGroupMemberInput {
        group_member_id: String,
        group_id: String,
        user_id: String,
        type_id: String,
        notification_preferences: String,
        role_in_group_id: String,
        role_in_group_name: String,
        join_date: String,
        leave_date: String,
        date_verified: String,

        is_current: Boolean,
        is_alumni: Boolean,
        is_recruiter: Boolean,
        is_group_admin: Boolean,
        is_verified: Boolean,
        is_hidden: Boolean,
    }

    input QueryGroupMember {
        group_member_id: String,
        group_id: String,
        user_id: String,
        type_id: String,
        notification_preferences: String,
        role_in_group_id: String,
        role_in_group_name: String,
        join_date: String,
        leave_date: String,
        date_verified: String,

        is_current: Boolean,
        is_alumni: Boolean,
        is_recruiter: Boolean,
        is_group_admin: Boolean,
        is_verified: Boolean,
        is_hidden: Boolean,
    }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        group_members: (_, { input }) => new Promise((res, rej) => {
            GroupMemberService.get_group_members(input).then((group_members) => {
                console.log("RE", group_members)
                return res(group_members);
            });
        }),
    },
    Mutation: {
        add_group_member: (_, {input}) => new Promise((res, rej) => {
            GroupMemberService.add_group_member(input).then( (group_member_id) => {
                return res(group_member_id)
            }).catch((err) => {
                return rej(err);
            });
        }),
        edit_group_member: (_, {input}) => new Promise((res, rej) => {
            GroupMemberService.edit_group_member(input).then( () => {
                return res(true);
            }).catch(() => {
                return res(false);
            })
        }),
        remove_group_member: (_, {group_member_id}) => new Promise((res, rej) => {
            GroupMemberService.remove_group_member({group_member_id}).then( () => {
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