const express = require('express');
const os = require('os');
const { GraphQLServer } = require('graphql-yoga');


const typeDefs = `
  type Query {
    hello(name: String): String!,
    username: String!
  }
`

const resolvers = {
    Query: {
        hello: (_, { name }) => `Hello ${name || 'World'}`,
        username: (_, {}) => os.userInfo().username,
    },
}


const graphqlserver = new GraphQLServer({ typeDefs, resolvers });

graphqlserver.express.use(express.static('dist'));

graphqlserver.start(
    {
        port: 8080,
        endpoint: '/graphql',
        subscriptions: '/subscriptions',
        playground: '/playground',
    },
    ({ port }) => console.log(`Server is running on localhost:${port}`)
);
