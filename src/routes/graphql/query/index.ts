import {    
    GraphQLObjectType,    
  } from "graphql"; 

  import user from "./user";
  import post from "./post";
  import memberType from "./memberType";
  import profile from "./profile";


  export default new GraphQLObjectType({
    name: "Query",
    fields: () => ({      
   ...user,
   ...post,
   ...memberType,
   ...profile,
    }),
  });