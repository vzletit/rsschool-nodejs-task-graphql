import {    
    GraphQLObjectType,    
  } from "graphql"; 

  import user from "./user";
  import post from "./post";
  import profile from "./profile";
import memberType from "./memberType";


  export default new GraphQLObjectType({
    name: "mutation",
    fields: () => ({      
   ...user,
   ...post,
   ...profile,
   ...memberType
    }),
  });