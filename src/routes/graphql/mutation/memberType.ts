import { FastifyInstance } from "fastify";
import { MemberTypeEntity } from "../../../utils/DB/entities/DBMemberTypes";
import { MemberTypeOutput } from '../query/OutputObjectTypes'
import { MemberTypeUpdate } from "./InputObjectTypes";


export default {
  updateMemberType: {
    
    type: MemberTypeOutput,
    args: { payload: { type: MemberTypeUpdate } },        
    resolve: async (_ = {}, { payload }: {payload: MemberTypeEntity }, context: FastifyInstance) => {
      const memberType = await context.db.memberTypes.findOne({ key: "id", equals: payload.id});
      if (!memberType) { throw context.httpErrors.badRequest("MemberType not found") }
      
      const updatedMemberType = {...memberType, ...payload}
      return await context.db.memberTypes.change(memberType.id, updatedMemberType);
    },
  },


}