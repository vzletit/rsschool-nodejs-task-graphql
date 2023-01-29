import { FastifyInstance } from "fastify";
import {    
    GraphQLID,    
    GraphQLNonNull,
    GraphQLList,      
  } from "graphql"; 
import { MemberType } from '../types'


export default {
    memberType: {
        type: MemberType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async ( parent:any, { id }:{ id: string }, context: FastifyInstance) => {          
            const memberType = await context.db.memberTypes.findOne({ key: "id", equals: id })
            if (!memberType) { throw context.httpErrors.badRequest('Member Type not found') }
            return MemberType;           
          }
      },

      memberTypes: {
        type: new GraphQLList(MemberType),         
        resolve: async ( _:any, __:any, context:FastifyInstance ) => {
          return await context.db.memberTypes.findMany()
        }
      },

}