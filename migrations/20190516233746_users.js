
exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            // This will store a uuid to be used a key.
            table.string('id');            

            // data fields
            table.string('name', 255).notNullable();
            table.string('phone_number', 255).notNullable();
            table.string('pin', 255).notNullable();

            // Used to track latest version.
            table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
};
