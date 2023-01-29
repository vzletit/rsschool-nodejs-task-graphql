import { FastifyInstance } from "fastify/types/instance";
import {    
    GraphQLID,    
    GraphQLNonNull,
    GraphQLList,      
  } from "graphql"; 
import { Post } from '../types'


export default {
    post: {            
        type: Post,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async ( parent:any, { id }:{ id: string }, context: FastifyInstance) => {          
            const post = await context.db.posts.findOne({ key: "id", equals: id })
            if (!post) { throw context.httpErrors.notFound('Post not found') }
            return post;           
          }
      },
      posts: {
        type: new GraphQLList(Post),        
        resolve: async ( _:any, __:any, context:FastifyInstance ) => {          
          return await context.db.posts.findMany();
        },
      },
}