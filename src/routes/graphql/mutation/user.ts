import { FastifyInstance } from "fastify";
import { UserInput, SubscribeInput, UserUpdate } from "./InputObjectTypes";
import { UserOutput } from "../query/OutputObjectTypes";
import { UserEntity } from "../../../utils/DB/entities/DBUsers";

interface  SubsParams { [key: string]: string }

export default {
  addUser: {
    type: UserOutput,
    args: {
      payload: { type: UserInput }
    },
    resolve: async (_ = {}, { payload }: {payload: UserEntity}, context: FastifyInstance) => {
      return await context.db.users.create(payload);
    },
  },

  subscribeThisUser: {
    type: UserOutput,
    args: {
    payload: { type: SubscribeInput }
    },
    resolve: async (_ = {}, { payload }: { payload: SubsParams}, context: FastifyInstance) => {
      
      if (payload.followerUserId === payload.followedUserId) {
        throw context.httpErrors.badRequest("User cannot follow himself");
      }     
      
      const followerUser = await context.db.users.findOne({
        key: "id",
        equals: payload.followerUserId,
      });
      
      if (!followerUser) {
        throw context.httpErrors.badRequest("User (follower) not found");
      }
      const followedUser = await context.db.users.findOne({
        key: "id",
        equals: payload.followedUserId,
      });
      if (!followedUser) {
        throw context.httpErrors.badRequest("User (to follow) not found");
      }

      if (followerUser.subscribedToUserIds.includes(followedUser.id) ) { 
        throw context.httpErrors.badRequest("User already subscribed"); 
      }
      
      followerUser.subscribedToUserIds.push(followedUser.id);

     return await context.db.users.change(followerUser.id, followerUser);
      
    },
  },

  unSubscribeThisUser: {
    type: UserOutput,
    args: {
    payload: { type: SubscribeInput }
    },

    resolve: async (_ = {}, { payload }: { payload: SubsParams }, context: FastifyInstance) => {
      if (payload.followerUserId === payload.followedUserId) {
        throw context.httpErrors.badRequest("User could not follow himself");
      }

      const followerUser = await context.db.users.findOne({
        key: "id",
        equals: payload.followerUserId,
      });
      if (!followerUser) {
        throw context.httpErrors.badRequest("User (follower) not found");
      }

      const followedUser = await context.db.users.findOne({
        key: "id",
        equals: payload.followedUserId,
      });
      if (!followedUser) {
        throw context.httpErrors.badRequest("User (followed) not found");
      }

      const isFollowing = followerUser.subscribedToUserIds.includes(
        followedUser.id
      );
      if (!isFollowing) {
        throw context.httpErrors.badRequest("User was not following");
      }

      followerUser.subscribedToUserIds.splice(followerUser.subscribedToUserIds.indexOf(followedUser.id), 1)
      return await context.db.users.change(followerUser.id, followerUser);

    },
  },

  updateUser: {
    type: UserOutput,
    args: {
      payload: { type: UserUpdate }
    },    
    resolve: async (_ = {}, { payload }: { payload: UserEntity }, context: FastifyInstance) => {

      const user = await context.db.users.findOne({ key: "id", equals: payload.id});
      if (!user) { throw context.httpErrors.badRequest("User not found") }
      
      const updatedUser = {...user, ...payload}

      return await context.db.users.change(user.id, updatedUser);
    },
  },

  
};

