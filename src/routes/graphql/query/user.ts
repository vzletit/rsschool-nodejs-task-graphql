import {FastifyInstance } from 'fastify'
import {    
    
    GraphQLString,    
    GraphQLNonNull,
    GraphQLList,  
  } from "graphql"; 

import { UserOutput } from './OutputObjectTypes'

export default {

    user: {
    type: UserOutput,
    args: { id: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async ( parent:any, { id }:{ id: string }, context: FastifyInstance) => {
        const user = await context.db.users.findOne({ key: "id", equals: id })
        if (!user) { throw context.httpErrors.notFound('User not found') }
        return user;            
    },
  },
  
   users: {
    type: new GraphQLList(UserOutput),
    resolve: async ( parent:any, arg:any, context:FastifyInstance ) => {
      return await context.db.users.findMany();
    },
  },  
}