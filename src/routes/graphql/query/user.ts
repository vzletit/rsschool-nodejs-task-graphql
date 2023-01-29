import {FastifyInstance } from 'fastify'
import {    
    GraphQLID,    
    GraphQLNonNull,
    GraphQLList,  
  } from "graphql"; 

import { User } from '../types'


export default {

    user: {
    type: User,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: async ( parent:any, { id }:{ id: string }, context: FastifyInstance) => {
        const user = await context.db.users.findOne({ key: "id", equals: id })
        if (!user) { throw context.httpErrors.notFound('User not found') }
        return user;            

    },
  },
  
   users: {
    type: new GraphQLList(User),
    resolve: async ( parent:any, arg:any, context:FastifyInstance ) => {
      return await context.db.users.findMany();
    },
  },
}