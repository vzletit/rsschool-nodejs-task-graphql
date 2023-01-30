import {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLInt,
} from "graphql";

export const UserInput = new GraphQLInputObjectType({
  name: "UserInputDTO",
  fields: () => ({
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const UserUpdate = new GraphQLInputObjectType({
  name: "UserUpdateDTO",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString), description: "user Id" },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

export const SubscribeInput = new GraphQLInputObjectType({
  name: "SubscribeInputDTO",
  fields: () => ({
    followerUserId: {
      type: new GraphQLNonNull(GraphQLString),
      description: "ID of follower",
    },
    followedUserId: {
      type: new GraphQLNonNull(GraphQLString),
      description: "ID of followed",
    },
  }),
});

export const PostInput = new GraphQLInputObjectType({
  name: "PostInputDTO",
  fields: () => ({
    userId: { type: new GraphQLNonNull(GraphQLString), description: "user Id" },
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Post title",
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Post content",
    },
  }),
});

export const PostUpdate = new GraphQLInputObjectType({
  name: "PostUpdateDTO",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString), description: "Post ID" },
    title: { type: GraphQLString, description: "Post title" },
    content: { type: GraphQLString, description: "Post content" },
  }),
});

export const MemberTypeUpdate = new GraphQLInputObjectType({
  name: "MemberTypeUpdateDTO",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Member Type ID",
    },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }),
});

export const ProfileInput = new GraphQLInputObjectType({
  name: "ProfileInputDTO",
  fields: () => ({
    userId: { type: new GraphQLNonNull(GraphQLString), description: "user Id" },
    memberTypeId: {
      type: new GraphQLNonNull(GraphQLString),
      description: "member Type Id",
    },

    avatar: { type: new GraphQLNonNull(GraphQLString), description: "Avatar" },
    sex: {
      type: new GraphQLNonNull(GraphQLString),
      description: "gender (any of today's 128 or you can invent new one)",
    },
    birthday: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "birth date",
    },
    country: {
      type: new GraphQLNonNull(GraphQLString),
      description: "country",
    },
    street: { type: new GraphQLNonNull(GraphQLString), description: "street" },
    city: { type: new GraphQLNonNull(GraphQLString), description: "city" },
  }),
});

export const ProfileUpdate = new GraphQLInputObjectType({
  name: "ProfileUpdateDTO",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString), description: "Profile ID" },
    memberTypeId: {
      type: GraphQLString,
      description: "memberType Id",
    },

    avatar: { type: GraphQLString, description: "Avatar" },
    sex: {
      type: GraphQLString,
      description: "gender (any of today's 128 or you can invent new one)",
    },
    birthday: {
      type: GraphQLInt,
      description: "birth date",
    },
    country: {
      type: GraphQLString,
      description: "country",
    },
    street: { type: GraphQLString, description: "street" },
    city: { type: GraphQLString, description: "city" },
  }),
});
