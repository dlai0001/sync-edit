const typeDefs = `
  type User {
    id: ID!,
    name: String,
    phoneNumber: String
  }

  type TokenPair {
    accessToken: String!,
    refreshToken: String!,
  }

  type RegistrationInfo {
    user: User,
    tokens: TokenPair
  }

  type Query {
    hello(name: String): String!,
    username: String!
  }

  type Mutation {
    authRegisterUser(name:String!, pin:String!, phoneNumber:String!): RegistrationInfo,
    authRefreshTokens(refreshToken:String!): TokenPair
  }
  `

  module.exports = typeDefs;