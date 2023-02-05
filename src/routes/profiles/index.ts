import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    return await fastify.db.profiles.findMany();
    
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {

        const profile = await fastify.db.profiles.findOne({ 
            key: 'id', 
            equals: request.params.id 
        });
        
        if (!profile) { throw fastify.httpErrors.notFound('Profile not found') }
        return profile;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
        const existingProfile = await fastify.db.profiles.findOne({key: 'userId', equals: request.body.userId});
        const memberType = await fastify.db.memberTypes.findOne({key: 'id', equals: request.body.memberTypeId});
        if (existingProfile) { throw fastify.httpErrors.badRequest('Profile already exists'); }
        if (!memberType) { throw fastify.httpErrors.badRequest('Member type not exists'); }
        return await fastify.db.profiles.create(request.body) 
    }    
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
        const userProfile = await fastify.db.profiles.findOne({key: 'id', equals: request.params.id});
        if (!userProfile) { throw fastify.httpErrors.badRequest('Profile not found') }
        return await fastify.db.profiles.delete(request.params.id)
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {

        const profile = await fastify.db.profiles.findOne({key: 'id', equals: request.params.id});
        if (!profile) { throw fastify.httpErrors.badRequest('Profile not found') }
        return await fastify.db.profiles.change(request.params.id, request.body)
    }
  );
};

export default plugin;
