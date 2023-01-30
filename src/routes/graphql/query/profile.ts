import {FastifyInstance } from 'fastify'
import {    
  GraphQLString,    
    GraphQLNonNull,
    GraphQLList,      
  } from "graphql"; 

import { ProfileOutput } from './OutputObjectTypes'


export default {
    profile: {
        type: ProfileOutput,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async ( parent:any, { id }:{ id: string }, context: FastifyInstance) => {          
          const profile = await context.db.profiles.findOne({ key: "id", equals: id })
          if (!profile) { throw context.httpErrors.badRequest('Profile not found') }
          return profile;           
        }
      },
      profiles: {
        type: new GraphQLList(ProfileOutput),
        resolve: async ( _:any, __:any, context:FastifyInstance ) => {
          return await context.db.profiles.findMany();
        },
      },
}