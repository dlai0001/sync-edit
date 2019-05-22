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

    input RecipeInput {
        title: String!,
        about: String,
        recipeText: String
    }

    type Recipe {
        id: ID!,
        title: String!,
        about: String,
        recipeText: String,
        owner: User!
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
        authLogout : Boolean,

        recipeCreate(input: RecipeInput!) : Recipe!
    }
`;

module.exports = typeDefs;