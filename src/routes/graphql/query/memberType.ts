import { FastifyInstance } from "fastify";
import {    
    GraphQLString,    
    GraphQLNonNull,
    GraphQLList,      
  } from "graphql"; 
import { MemberTypeOutput } from './OutputObjectTypes'


export default {
    memberType: {
        type: MemberTypeOutput,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async ( _:any, { id }:{ id: string }, context: FastifyInstance) => {          
            const memberType = await context.db.memberTypes.findOne({ key: "id", equals: id })
            if (!memberType) { throw context.httpErrors.badRequest('Member Type not found') }
            return memberType;           
          }
      },

      memberTypes: {
        type: new GraphQLList(MemberTypeOutput),         
        resolve: async ( _:any, __:any, context:FastifyInstance ) => {
          return await context.db.memberTypes.findMany()
        }
      },

}