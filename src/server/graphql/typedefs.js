const {gql} = require('apollo-boost');

const typeDefs = gql`
    directive @isAuthenticated on FIELD | FIELD_DEFINITION
    
    type User {
        id: ID!,
        name: String,
        phoneNumber: String
    }

    """ 
    Token pair contains a short lived accessToken, 
    and a refreshToken for renewing tokens when they 
    expire. 
    """
    type TokenPair {
        accessToken: String!,
        refreshToken: String!,
    }

    """
    Authentication profile, contains a user and tokens.
    """
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
        ownerId: String!,
        owner: User!
    }

    type Query {
        """ Hello Testing Query """
        hello(name: String): String,
        username: String!
    }     

    type Mutation {
        authRegisterUser(name:String!, pin:String!, phoneNumber:String!): AuthProfile,
        authRefreshTokens(refreshToken:String!): TokenPair,
        authRequestShortCode(phoneNumber:String!, pin:String!): Boolean,
        authAuthenticate(phoneNumber:String!, shortCode:String!) : AuthProfile,
        authLogout : Boolean,

        recipeCreate(input: RecipeInput!) : Recipe! @isAuthenticated
    }
`;

module.exports = typeDefs;