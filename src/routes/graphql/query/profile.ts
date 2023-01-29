import {FastifyInstance } from 'fastify'
import {    
    GraphQLID,    
    GraphQLNonNull,
    GraphQLList,      
  } from "graphql"; 

import { Profile } from '../types'


export default {
    profile: {
        type: Profile,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async ( parent:any, { id }:{ id: string }, context: FastifyInstance) => {          
          const profile = await context.db.profiles.findOne({ key: "id", equals: id })
          if (!profile) { throw context.httpErrors.badRequest('Profile not found') }
          return profile;           
        }
      },
      profiles: {
        type: new GraphQLList(Profile),
        resolve: async ( _:any, __:any, context:FastifyInstance ) => {
          return await context.db.profiles.findMany();
        },
      },
}