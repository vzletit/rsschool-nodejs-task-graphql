import { FastifyInstance } from "fastify";
import { ProfileOutput } from "../query/OutputObjectTypes";
import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";
import { ProfileInput, ProfileUpdate } from "./InputObjectTypes";

export default {
  createProfile: {
    type: ProfileOutput,
    args: { payload: { type: ProfileInput } },    
    resolve: async (_ = {}, { payload }: {payload: ProfileEntity }, context: FastifyInstance) => {
    const user = await context.db.users.findOne({key: 'id', equals: payload.userId})
    if (!user) { throw context.httpErrors.badRequest("User not found.") }          
    
    const memberType = await context.db.memberTypes.findOne({key: 'id', equals: payload.memberTypeId})
    if (!memberType) { throw context.httpErrors.badRequest("Member type not found.") }          
    
    const profile = await context.db.profiles.findOne({key: 'userId', equals: payload.userId})
    if (profile) { throw context.httpErrors.badRequest("User already has profile.") }          
    
    return await context.db.profiles.create(payload)
    }
  },
  
  updateProfile: {
    type: ProfileOutput,
    args: { payload: { type: ProfileUpdate } },        
    resolve: async (_ = {}, { payload }: {payload: ProfileEntity }, context: FastifyInstance) => {
      const profile = await context.db.profiles.findOne({ key: "id", equals: payload.id});
      if (!profile) { throw context.httpErrors.badRequest("Profile not found") }
      
      const updatedProfile = {...profile, ...payload}
      return await context.db.profiles.change(profile.id, updatedProfile);
    },
  },


};
