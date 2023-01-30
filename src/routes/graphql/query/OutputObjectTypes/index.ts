import {
  GraphQLOutputType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} from "graphql";

export const UserOutput: GraphQLOutputType = new GraphQLObjectType({
  name: "User",

  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },

    thisUserSubscribedTo: {
      type: new GraphQLList(UserOutput),

      resolve: async (user, _, context) =>
        context.db.users.findMany({
          key: "id",
          equalsAnyOf: user.subscribedToUserIds,
        }),
    },

    subscribedToThisUser: {
      type: new GraphQLList(UserOutput),
      resolve: async (user, _, context) =>
        context.db.users.findMany({
          key: "subscribedToUserIds",
          inArray: user.id,
        }),
    },

    memberType: {
      type: MemberTypeOutput,
      resolve: async (user, _, context) => {
        const profile = await context.db.profiles.findOne({
          key: "userId",
          equals: user.id,
        });
        if (!profile) {
          throw context.httpErrors.badRequest(
            "memberType not assigned to user (create profile first)"
          );
        }
        return await context.db.memberTypes.findOne({
          key: "id",
          equals: profile.memberTypeId,
        });
      },
    },

    profile: {
      type: ProfileOutput,
      resolve: async (user, _, context) =>
        await context.db.profiles.findOne({ key: "userId", equals: user.id }),
    },

    posts: {
      type: new GraphQLList(PostOutput),
      resolve: async (user, _, context) =>
        await context.db.posts.findMany({
          key: "userId",
          equals: user.id,
        }),
    },
  }),
});

export const ProfileOutput: GraphQLOutputType = new GraphQLObjectType({
  name: "Profile",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const PostOutput: GraphQLOutputType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const MemberTypeOutput: GraphQLOutputType = new GraphQLObjectType({
  name: "MemberType",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    discount: { type: new GraphQLNonNull(GraphQLInt) },
    monthPostsLimit: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});
