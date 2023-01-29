import { FastifyInstance } from "fastify";
import { GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLID } from "graphql";
import { Profile } from "../types";
import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";

export default {
  createProfile: {
    type: Profile,
        args: {
          userId: {type: new GraphQLNonNull(GraphQLID), description: "user Id"},
          memberTypeId: {type: new GraphQLNonNull(GraphQLID), description: "member Type Id"},
          
          avatar: { type: new GraphQLNonNull(GraphQLString), description: "Avatar" },
          sex: {type: new GraphQLNonNull(GraphQLString),description: "gender (any of today's 128 or you can invent new one)"},
          birthday: { type: new GraphQLNonNull(GraphQLInt), description: "birth date" },
          country: {type: new GraphQLNonNull(GraphQLString), description: "country"},
          street: {type: new GraphQLNonNull(GraphQLString), description: "street"},
          city: {type: new GraphQLNonNull(GraphQLString), description: "city"},
      
    },
    resolve: async (_: any, args: ProfileEntity, context: FastifyInstance) => {     
    const user = await context.db.users.findOne({key: 'id', equals: args.userId})
    
    if (!user) { throw context.httpErrors.badRequest("User not found.") }          
    return await context.db.profiles.create(args)
    }
  }  
};
