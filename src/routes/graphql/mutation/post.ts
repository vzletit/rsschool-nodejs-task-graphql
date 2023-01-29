import { FastifyInstance } from "fastify";
import { GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";
import { Post } from "../types";
import { PostEntity } from "../../../utils/DB/entities/DBPosts";

export default {
  addPost: {
    type: Post,
        args: {
          userId: {type: new GraphQLNonNull(GraphQLID), description: "user Id"},

          title: { type: new GraphQLNonNull(GraphQLString), description: "Post title" },
          content: {type: new GraphQLNonNull(GraphQLString),description: "Post content"},
    },
    resolve: async (_: any, args: PostEntity, context: FastifyInstance) => {
      const user = await context.db.users.findOne({ key: 'id', equals: args.userId })    
      if (!user) { throw context.httpErrors.badRequest("User not found.") }               
      return await context.db.posts.create(args)
    }
  }  
};
