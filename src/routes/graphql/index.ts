import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { GraphQLSchema } from "graphql";
import { graphql } from "graphql/graphql";
import { graphqlBodySchema } from "./schema";
import graphQLquery from "./query";
import graphQMutation from "./mutation";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: {
        body: graphqlBodySchema,
      },
      
    },
    async function (request) {
      const {query, variables} = request.body;


      const schema = new GraphQLSchema({ 
        query: graphQLquery,
        mutation: graphQMutation
       });

      return await graphql({ 
        schema, 
        source: String(query!),
        variableValues: variables,
        contextValue: fastify        
             })
    }
  );
};

export default plugin;
