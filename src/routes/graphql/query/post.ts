import { FastifyInstance } from "fastify/types/instance";
import {    
  GraphQLString,    
    GraphQLNonNull,
    GraphQLList,      
  } from "graphql"; 
import { PostOutput } from './OutputObjectTypes'


export default {
    post: {            
        type: PostOutput,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async ( parent:any, { id }:{ id: string }, context: FastifyInstance) => {          
            const post = await context.db.posts.findOne({ key: "id", equals: id })
            if (!post) { throw context.httpErrors.notFound('Post not found') }
            return post;           
          }
      },
      posts: {
        type: new GraphQLList(PostOutput),        
        resolve: async ( _:any, __:any, context:FastifyInstance ) => {          
          return await context.db.posts.findMany();
        },
      },
}