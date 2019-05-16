# simple react, graphql, app.
Simple Proof of concept of authentication, pub/sub via graphql, with react front end.

## Getting started
```shell
$ yarn install
$ yarn run dev  # runs dev server.
```

```shell
"client": "webpack-dev-server --mode development --devtool inline-source-map --hot",
"server": "nodemon src/server/index.js",
"dev": "concurrently \"npm run server\" \"npm run client\""
```

## Technologies used
* GraphQL Yoga : GraphQL API
* Express : Backend
* React 16 : Front end Javascript
* Bulma : CSS Framework
* Jest : Unit testing framework
