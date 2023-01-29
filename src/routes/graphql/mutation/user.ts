import { FastifyInstance } from "fastify";
import { GraphQLString, GraphQLNonNull } from "graphql";
import { User } from "../types";
import { UserEntity } from "../../../utils/DB/entities/DBUsers";


export default {
  addUser: {
    type: User,
        args: {
      firstName: {
        type: new GraphQLNonNull(GraphQLString),
        description: "First name",
      },

      lastName: {
        type: new GraphQLNonNull(GraphQLString),
        description: "Last name",
      },

      email: { type: new GraphQLNonNull(GraphQLString), description: "email" },
    },
    resolve: async (_: any, args: UserEntity, context: FastifyInstance) =>
      await context.db.users.create(args),
  }  
};
