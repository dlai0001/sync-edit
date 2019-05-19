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
            const tokens = await authService.generateTokens(user);
            return {
                user,
                tokens,
            };
        },
        authRefreshTokens: async (_, { refreshToken }) => {
            const tokens = await authService.refreshTokens(refreshToken);
            return tokens;
        }
    }
};

module.exports = resolvers;