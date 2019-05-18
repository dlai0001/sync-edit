# simple react, graphql, app.
[![Build Status](https://travis-ci.org/dlai0001/sync-edit.svg?branch=master)](https://travis-ci.org/dlai0001/sync-edit)

Simple Proof of concept of authentication, pub/sub via graphql, with react front end.

This app allows for user registration and login.  The user can then create recipes, add other users as 'editors',
and see edits happening in real time.

A recipe's owner and editor can edit a recipe.  Only an owner can update the recipe's name.  Owner and editors can 
modify the recipe text ingredients.

## Getting started
```shell
$ yarn install
$ yarn run migrate # runs migrations to update DB to latest schema
$ yarn run dev  # runs dev server.
```

Available commands
* `build` - build for production.
* `start` - run production mode. (must run build first)
* `dev` - run development server.
* `test` - run unit tests

See package.json -> scripts for more commands.

## Deployment
Install heroku cli - https://devcenter.heroku.com/articles/heroku-cli
``` bash
$ heroku login
$ git push heroku master
```

## Technologies used
* GraphQL Yoga : GraphQL API
* Express : Backend
* React 16 : Front end Javascript
* Bulma : CSS Framework
* Jest : Unit testing framework
* Heroku : hosting
* TravisCi : Continuous integration
