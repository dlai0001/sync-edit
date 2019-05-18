const express = require('express');
const os = require('os');

const { GraphQLServer } = require('graphql-yoga');
const { formatError } = require('apollo-errors');

const userService = require('./services/user-service');

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
}


const graphqlserver = new GraphQLServer({ 
    typeDefs,
    resolvers, 
});

graphqlserver.express.use(express.static('dist'));

graphqlserver.start(
    {
        port: 8080,
        endpoint: '/graphql',
        subscriptions: '/subscriptions',
        playground: '/playground',
        formatError,
    },
    ({ port }) => console.log(`Server is running on localhost:${port}`)
);
