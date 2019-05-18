
exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            // This will store a uuid to be used a key.
            table.string('id');            

            // data fields
            table.string('name', 255).notNullable();
            table.string('phoneNumber', 255).notNullable();
            table.string('pin', 10).notNullable();

            // Used to track latest version.
            table.integer('timestamp').notNullable();
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
};
