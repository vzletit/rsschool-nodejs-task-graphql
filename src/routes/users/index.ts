import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return fastify.db.users.findMany()
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> { 
        const user = await fastify.db.users.findOne({ 
        key: 'id', 
        equals: request.params.id 
    });
    
    if (!user) { throw fastify.httpErrors.notFound('User not found') }
    return user;
}
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
   return await fastify.db.users.create(request.body) }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
        const user = await fastify.db.users.findOne({key: 'id', equals: request.params.id});
        if (!user) { throw fastify.httpErrors.badRequest('User not found') }

        // удаляем подписоту
        const followers = await fastify.db.users.findMany(
            { key: 'subscribedToUserIds', 
            inArray: request.params.id });       

        if (followers) {
          followers.forEach(async (follower) => {
                const filteredList = follower.subscribedToUserIds.filter((followedId) => followedId !== user.id)
                await fastify.db.users.change(follower.id, { subscribedToUserIds: filteredList })                
            })}

        // удаляем профиль
        const userProfile = await fastify.db.profiles.findOne({key: 'userId', equals: request.params.id});
        if (!userProfile) { throw fastify.httpErrors.badRequest('Profile not found') }
        await fastify.db.profiles.delete(userProfile.id)

        // удаляем посты
        const userPosts = await fastify.db.posts.findMany(
            { key: 'userId', equals: request.params.id } )
            
            if (!userPosts) { throw fastify.httpErrors.badRequest('Posts not found') }
            userPosts.forEach(async (post) => { await fastify.db.posts.delete(post.id) })

            return await fastify.db.users.delete(user.id)
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
        const followed = await fastify.db.users.findOne({key: 'id', equals: request.params.id});
        if (!followed) { throw fastify.httpErrors.notFound('User (followed) not found') }
        
        const follower = await fastify.db.users.findOne({key: 'id', equals: request.body.userId});
        if (!follower) { throw fastify.httpErrors.badRequest('User (follower) not found') }
        
        return await fastify.db.users.change(follower.id, 
            { subscribedToUserIds: [...follower.subscribedToUserIds, request.params.id] }
            )}

  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
        const followed = await fastify.db.users.findOne({key: 'id', equals: request.params.id});
        if (!followed) { throw fastify.httpErrors.notFound('User (unsubscribing) not found') }
        
        const follower = await fastify.db.users.findOne({key: 'id', equals: request.body.userId});
        if (!follower) { throw fastify.httpErrors.badRequest('User (unfollowed) not found') }
        if (!follower.subscribedToUserIds.includes(followed.id)) { throw fastify.httpErrors.badRequest('User was not subscribed') }        
        return await fastify.db.users.change(follower.id, 
            { subscribedToUserIds: follower.subscribedToUserIds
                .filter(id => id !== request.params.id)
             })
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
        const user = await fastify.db.users.findOne({key: 'id', equals: request.params.id});
        if (!user) { throw fastify.httpErrors.badRequest('User not found') }
        return await fastify.db.users.change(user.id, request.body)
    }
  );
};

export default plugin;
