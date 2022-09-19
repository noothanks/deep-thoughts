//imoprt gql template function 
const { gql } = require('apollo-server-express');


//define query via type Query {}
//all queries must specify data type to expect
//user will return all the data in the user mongoose model
//friends populated by an arr of users
//thoughts populated by an arr of thoughts
//ID type def will look for unique string
//auth type must return a unique token
//can optionally include user data
//thoughts can receive username but not required (username: String)
//parameters with ! are required
//define thought type def
//also be sure to define nested type defs
//mutations allow for CRUD operations
//set mutations to include Auth when necessary
//will generate new tokens for logged in or newly created users
//reactions will return the parent Thought
//reactions tracked on Thought parent model
//reactions are interactions with Thought on front end
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
  }

  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
  }

  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addThought(thoughtText: String!): Thought
    addReaction(thoughtId: ID!, reactionBody: String!): Thought
    addFriend(friendId: ID!): User
  }
`;

module.exports = typeDefs;
