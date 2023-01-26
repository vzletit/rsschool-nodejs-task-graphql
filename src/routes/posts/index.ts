import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema
 } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    const posts = await fastify.db.posts.findMany();
    return posts;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {        
        const post = await fastify.db.posts.findOne({key: 'id', equals: request.params.id});
        if(!post) { throw fastify.httpErrors.notFound('Post not found'); }
        return post;
     }   
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
        const user = await fastify.db.users.findOne({key: 'id', equals: request.body.userId});
        if (!user) { throw fastify.httpErrors.badRequest('User not found') }        
        return fastify.db.posts.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {

        const post = await fastify.db.posts.findOne({key: 'id', equals: request.params.id});
        if(!post) { throw fastify.httpErrors.badRequest('Post not found'); }
        return await fastify.db.posts.delete(request.params.id);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
        const post = await fastify.db.posts.findOne({key: 'id', equals: request.params.id});
        if (!post) { throw fastify.httpErrors.badRequest('Post not found') }
        return await fastify.db.posts.change(post.id, request.body)
    }
  );
};

export default plugin;
