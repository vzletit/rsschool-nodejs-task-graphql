import {FastifyInstance } from 'fastify'
import { UserEntity } from "../../../utils/DB/entities/DBUsers";
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
    resolve: async ( _:any, { id }:{ id: string }, context: FastifyInstance): Promise<UserEntity | null> => {
        const user = await context.db.users.findOne({ key: "id", equals: id })
        if (!user) { throw context.httpErrors.notFound('User not found') }
        return user;            

    },
  },
  
   users: {
    type: new GraphQLList(User),
    resolve: async ( _:any, __:any, context:any ) => {
      return await context.db.users.findMany();
    },
  },
}