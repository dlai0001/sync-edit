const typeDefs = `
  type User {
    id: ID!,
    name: String,
    phoneNumber: String
  }

  type Query {
    hello(name: String): String!,
    username: String!
  }

  type Mutation {
    registerUser(name:String!, pin:String!, phoneNumber:String!): User
  }
  `

  module.exports = typeDefs;