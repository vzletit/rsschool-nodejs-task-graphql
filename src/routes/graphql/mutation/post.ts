import { FastifyInstance } from "fastify";
import { PostOutput } from "../query/OutputObjectTypes";
import { PostEntity } from "../../../utils/DB/entities/DBPosts";
import { PostInput, PostUpdate } from "./InputObjectTypes";

export default {
  addPost: {
    type: PostOutput,
        args: { payload: {type: PostInput} },
    resolve: async (_ = {}, { payload }: {payload: PostEntity }, context: FastifyInstance) => {
      const user = await context.db.users.findOne({ key: 'id', equals: payload.userId })    
      if (!user) { throw context.httpErrors.badRequest("User not found.") }               
      return await context.db.posts.create(payload)
    }
  },
  
  updatePost: {
    type: PostOutput,
    args: { payload: { type: PostUpdate} },    
    
    resolve: async (_ = {}, { payload }: {payload: PostEntity }, context: FastifyInstance) => {
      const post = await context.db.posts.findOne({ key: "id", equals: payload.id});
      if (!post) { throw context.httpErrors.badRequest("Post not found") }
      
      const updatedPost = {...post, ...payload}
      return await context.db.posts.change(post.id, updatedPost);
    },
  },



};
