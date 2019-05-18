const express = require('express');

const { GraphQLServer } = require('graphql-yoga');
const { formatError } = require('apollo-errors');

const typeDefs = require('./graphql/typedefs');

const resolvers = require('./graphql/resolvers');


const graphqlserver = new GraphQLServer({ 
    typeDefs,
    resolvers, 
});

graphqlserver.express.use(express.static('dist'));

graphqlserver.start(
    {
        port: process.env.PORT || 8080,
        endpoint: '/graphql',
        subscriptions: '/subscriptions',
        playground: '/playground',
        formatError,
    },
    ({ port }) => console.log(`Server is running on localhost:${port}`)
);
