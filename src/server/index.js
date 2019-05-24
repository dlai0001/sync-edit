require('dotenv').config()
require('dotenv').config(); // Load env vars.

const path = require('path');
const express = require('express');

const { GraphQLServer } = require('graphql-yoga');
const { formatError } = require('apollo-errors');

const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');
const schemaDirectives = require('./graphql/schema-directives');
const middleware = require('./graphql/middleware');
const { gql } = require('apollo-boost');

const GRAPHQL_PATHS = [
    '/playground',
    '/subscriptions',
    '/graphql',
];

const graphqlserver = new GraphQLServer({ 
    typeDefs,
    resolvers,
    schemaDirectives,
    context: middleware,
});

graphqlserver.express.use(express.static('dist'));
// if non existant route, route to web app.

graphqlserver.express.get('*', (req,res, next) =>{
    // exclude graphql paths
    if (GRAPHQL_PATHS.includes(req.path))
        return next();
    res.sendFile(path.join(__dirname+'../../../dist/index.html'));
});

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
