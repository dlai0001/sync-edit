const os = require('os');
const userService = require('../services/user-service');
const authService = require('../services/auth-service');

const resolvers = {
    Query: {
        hello: (_, { name }) => `Hello ${name || 'World'}`,
        username: (_, { }) => os.userInfo().username,
    },
    Mutation: {
        authRegisterUser: async (_, { name, pin, phoneNumber }) => {
            const user = await userService.createUser(name, phoneNumber, pin);
            return {
                user,
                tokens: async () => authService.generateTokens(user),
            };
        },
        authRefreshTokens: async (_, { refreshToken }) => {
            const tokens = await authService.refreshTokens(refreshToken);
            return tokens;
        },
        authRequestShortCode: async (_, { phoneNumber, pin }) => {
            return await authService.sendShortCode(phoneNumber, pin);
        },
        authAuthenticate: async (_, { phoneNumber, shortCode }) => {
            // tokens must succeed before other resolvers can run to ensure
            // phoneNumber/shortCode matches.
            const tokens = await authService.authenticate(phoneNumber, shortCode);

            return {
                user: async () => userService.getUserByPhoneNumber(phoneNumber),
                tokens,
            }
        },
        authLogout: async (_, _args, {authenticatedUser}) => {
            if (authenticatedUser) {
                await authService.logoff(authenticatedUser.userId);
            }
            return true;
        },
        recipeCreate: async (_obj, _args, _context, _info, _foobarr) => {
            
            return {
                id: 1,
                title: 'Foobar',
                about: 'About Foo',
                recipeText: 'Bar recipe',
                owner_id: 'Foo',
                owner: () => userService.getUserById('Foo'),
            };
        }
    }
};

module.exports = resolvers;