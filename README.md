
# Basic Graphql API



## Installation

After project is cloned and switched to *'dev'* branch, run in project folder:

```bash
  npm install
```

Proceed with:

### Run app

```bash
  npm run start
```

### Build

```bash
  npm run build:ts
```

### Check integrity

```bash
  npm run check-integrity
```

### Run tests
```bash
  npm run test
```

## Usage

### Task 1

Just run tests.

### Task 2 Queries:

**Get users, profiles, posts, memberTypes - 4 operations in one query.**

```bash
  query {  
    users {id}        
    profiles {id},
    posts {id},
    memberTypes {id}      
}

```

**Get user, profile, post, memberType by id - 4 operations in one query.**
```bash
query ($userId: String!, $postId: String!, $profileId: String!, $memberTypeId: String!)
{      
    user (id: $userId) {id}
    post (id: $postId) {id}
    profile (id: $profileId) {id}
    memberType (id: $memberTypeId) {id}    
}
```
Variables (insert the appropriate IDs):
```bash
{
    "userId": "USER_ID",
    "postId": "POST_ID",
    "profileId": "PROFILE_ID",
    "memberTypeId": "MEMBERTYPE_ID"
}
```


**Get users with their posts, profiles, memberTypes.**
```bash
query {  
    users {
        id
        profile {id},
        posts {id},
        memberType {id} 
    } 
}
```

**Get user by id with his posts, profile, memberType.**
```bash
query ($id: String!)
{      
    user (id: $id) {
        id
        posts {id}
        profile {id}
        memberType {id}
        }
    }   
```
Variables (insert the appropriate ID):
```bash
{
    "id": "USER_ID"
}
```
**Get users with their userSubscribedTo, profile.**
```bash
query {      
    users {
        thisUserSubscribedTo{
            profile {id}
        }
    }
}   
```
**Get user by id with his subscribedToUser, posts.**
```bash
query ($id: String!){      
    user (id: $id) {
        id
        subscribedToThisUser {
            posts {id}
        }        
    }
}   
```
Variables (insert the appropriate ID):
```bash
{
    "id": "USER_ID"
}
```
**Get users with their userSubscribedTo, subscribedToUser (additionally for each user in userSubscribedTo, subscribedToUser add their userSubscribedTo, subscribedToUser).**
```bash
query {      
    users {
        id
        thisUserSubscribedTo {
            id
            thisUserSubscribedTo {id}
            subscribedToThisUser {id}
        }
        subscribedToThisUser {
            id
            thisUserSubscribedTo {id}
            subscribedToThisUser {id}
        }
        
    }        
}

```

**Create user.**
```bash
mutation ( $payload: UserInputDTO ) {
    addUser (payload: $payload) {
        id
        firstName
        lastName
        email
    }
}
```

Variables (insert the appropriate data):
```bash
{ 
    "payload": {
        "firstName": "Petr", 
        "lastName": "Ivanov", 
        "email": "petr@ivan.ov"
        }
}   
```


**Create profile.**
```bash
mutation ( $payload: ProfileInputDTO ) {
    createProfile (payload: $payload) 
    {
        id
        userId
        memberTypeId
        avatar
        sex
        birthday
        country
        street
        city
    }
}
```

Variables (insert the appropriate data):
```bash
{ 
"payload": {
    "userId": "USER_ID", 
    "memberTypeId": "basic", 
    "avatar": "Pikachu",
    "sex": "male",
    "birthday": 2000,
    "country": "Neverland",
    "street": "Lenina",
    "city": "Zolotoy"
    }
}   
```
**Create post.**
```bash
mutation ( $payload: PostInputDTO )
{
    addPost (payload: $payload) {
        id
        userId
        title
        content
    }
}

```
Variables (insert the appropriate data):
```bash
{ 
    "payload": {
    "userId": "USER_ID", 
    "title": "Hello, world!", 
    "content": "Have nothing to tell you, my dear reader. Bye!"    
    }
}   
   ```

**Update user.**
```Bash
mutation ( $payload: UserUpdateDTO ) {
    updateUser (payload: $payload) {
        id
    }
}
```
Variables (insert the appropriate data. Any user field(s) can be updated):
```bash
{ 
    "payload": {
    "id": "USER_ID", 
    "lastName": "Mynewlastname"}
}   

}   
   ```

**Update profile.**
```Bash
mutation ( $payload: ProfileUpdateDTO ) {
    updateProfile (payload: $payload) {
        id
        }
}
```
Variables (insert the appropriate data. Any profile field(s) can be updated):
```bash
{ 
    "payload": {
    "id": "PROFILE_ID", 
    "avatar": "SlowPoke"}
    }   
}   
   ```
**Update post.**
```Bash
mutation ( $payload: PostUpdateDTO )
{
    updatePost (payload: $payload) {
        id
        }
    }
```
Variables (insert the appropriate data. Any post field(s) can be updated):
```bash
{ 
    "payload": {
    "id": "POST_ID", 
    "title": "Hello, world!", 
    "content": "Please, subscribe to my Telegram, give a Like to this post, share it, press bell on YouTube, donate via Patreon, buy my merch and btw there's an update on my OnlyFans"    
    }
}   
```
**Update memberType.**
```Bash
mutation ( $payload: MemberTypeUpdateDTO )
{
    updateMemberType (payload: $payload) {
        id  
    }
}
```
Variables (insert the appropriate data. Any memberType field(s) can be updated):
```bash
{ 
    "payload": {
    "id": "MEMBERTYPE_ID", 
    "discount": 300   
    }
}   
```
**Subscribe to**
```Bash
mutation ( $payload: SubscribeInputDTO ) {
    subscribeThisUser (payload: $payload) {
        id
    }
}
```
Variables (insert the appropriate IDs):
```bash
{
    "payload": {
    "followerUserId": "FOLLOWER_ID",
    "followedUserId": "FOLLOWED_ID"
    }
} 
```
**Unsubscribe from**
```Bash
mutation ( $payload: SubscribeInputDTO ) {
    unSubscribeThisUser (payload: $payload) {
        id
    }
}
```
Variables (insert the appropriate IDs):
```bash
{
    "payload": {
    "followerUserId": "FOLLOWER_ID",
    "followedUserId": "FOLLOWED_ID"
    }
} 
```