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
        },
        authRequestShortCode: async (_, { phoneNumber, pin }) => {
            return await authService.sendShortCode(phoneNumber, pin);
        },
        authAuthenticate: async (_, { phoneNumber, shortCode }) => {            
            console.log('authenticatedUser is ', authenticatedUser);
            const tokens = await authService.authenticate(phoneNumber, shortCode);
            const user = await userService.getUserByPhoneNumber(phoneNumber);

            return {
                user,
                tokens,
            }
        },
        authLogout: async (_, _args, {authenticatedUser}) => {
            console.debug('Logging off ', authenticatedUser);
            if (authenticatedUser) {
                await authService.logoff(authenticatedUser.userId);
            }
            return true;
        },
    }
};

module.exports = resolvers;