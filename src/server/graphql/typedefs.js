const {gql} = require('apollo-boost');

const typeDefs = gql`
    """
    Directive to block access if not authenticated.
    """
    directive @isAuthenticated on FIELD | FIELD_DEFINITION
    
    """
    User type
    """
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
        accessToken: String!
        refreshToken: String!
    }

    """
    Authentication profile, contains a user and tokens.
    """
    type AuthProfile {
        user: User
        tokens: TokenPair
    }

    """
    Input for creating new recipes
    """
    input RecipeInput {
        title: String!
        about: String
        recipeText: String
    }

    """
    Recipe entry
    """
    type Recipe {
        id: ID!
        title: String!
        about: String
        recipeText: String
        ownerId: String!
        owner: User!
    }

    type Query {
        """ Hello Testing Query """
        hello(name: String): String
        """ Get username the server is running under. """
        username: String!
    }     

    type Mutation {
        """
        Creates a new user
        """
        authRegisterUser(name:String!, pin:String!, phoneNumber:String!): AuthProfile
        """
        Get a set of new tokens using refresh token.
        """
        authRefreshTokens(refreshToken:String!): TokenPair
        """
        Request SMS short code
        """
        authRequestShortCode(phoneNumber:String!, pin:String!): Boolean
        """
        Authenticate using phone number and short code
        """
        authAuthenticate(phoneNumber:String!, shortCode:String!) : AuthProfile
        """
        Logout and invalidate refresh token.
        """
        authLogout : Boolean

        """
        Create a new recipe
        """
        recipeCreate(input: RecipeInput!) : Recipe! @isAuthenticated
    }
`;

module.exports = typeDefs;