// Update with your config settings.

module.exports = {

  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true,
  },

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true,
  },

  staging: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'postgresql',
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true,
  }
};
