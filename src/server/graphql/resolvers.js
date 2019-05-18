const os = require('os');
const userService = require('./services/user-service');

const resolvers = {
    Query: {
        hello: (_, { name }) => `Hello ${name || 'World'}`,
        username: (_, { }) => os.userInfo().username,
    },
    Mutation: {
        registerUser: async (_, { name, pin, phoneNumber }) => {
            const user = await userService.createUser(name, phoneNumber, pin);
            return user;
        },
    }
};

module.exports = resolvers;