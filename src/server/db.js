const knexConfig = require('../../knexfile');

const config = knexConfig[process.env.NODE_ENV] || knexConfig.development;
console.log('Using db config', config);

const knex = require('knex')(config);

module.exports = knex;