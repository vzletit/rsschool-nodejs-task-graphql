import { UserEntity } from "../../../utils/DB/entities/DBUsers";
import {        
    GraphQLID,
    GraphQLObjectType,
    GraphQLNonNull,    
    GraphQLInt,
    GraphQLString,
    GraphQLList
  } from "graphql";


  export const User = new GraphQLObjectType({
    name: "User",
    fields: () => ({
      id: { type: GraphQLID },
      firstName: { type: new GraphQLNonNull(GraphQLString) },
      lastName: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },

      memberType: {
        type: MemberType,       
        resolve: async (user: UserEntity, _, context) => context.db.memberTypes.findOne({ key: "userId", equals: user.id })        
      },

      profile: {
        type: Profile,       
        resolve: async (user: UserEntity, _, context) => context.db.posts.findOne({ key: "userId", equals: user.id })        
      },

      posts: { 
        type: new GraphQLList(Post) ,
        resolve: async (user: UserEntity, _, context) => context.db.posts.findMany({
          key: 'userId',
          equals: user.id,
        }),
      },

      subscribedToUserIds: { type: new GraphQLList(GraphQLID) },
    }),
  });

  export const Profile = new GraphQLObjectType({
    name: "Profile",
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLString) },
      userId: { type: new GraphQLNonNull(GraphQLString) },
      memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
      avatar: { type: new GraphQLNonNull(GraphQLString) },
      sex: { type: new GraphQLNonNull(GraphQLString) },
      birthday: { type: new GraphQLNonNull(GraphQLString) },
      country: { type: new GraphQLNonNull(GraphQLString) },
      street: { type: new GraphQLNonNull(GraphQLString) },
      city: { type: new GraphQLNonNull(GraphQLString) },
    }),
  });

  export const Post = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLString) },
      userId: { type: new GraphQLNonNull(GraphQLString) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
    }),
  });

  export const MemberType = new GraphQLObjectType({
    name: "MemberType",
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLString) },
      discount: { type: new GraphQLNonNull(GraphQLInt) },
      monthPostsLimit: { type: new GraphQLNonNull(GraphQLInt) },
    }),
  });
  