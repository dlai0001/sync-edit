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

    type AuthProfile {
        user: User,
        tokens: TokenPair
    }

    type Query {
        hello(name: String): String!,
        username: String!
    }

    type Mutation {
        authRegisterUser(name:String!, pin:String!, phoneNumber:String!): AuthProfile,
        authRefreshTokens(refreshToken:String!): TokenPair,
        authRequestShortCode(phoneNumber:String!, pin:String!): Boolean,
        authAuthenticate(phoneNumber:String!, shortCode:String!) : AuthProfile,
        authLogout : Boolean
    }
`;

module.exports = typeDefs;