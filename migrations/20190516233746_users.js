
exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id');
            table.string('name', 255).notNullable();
            table.string('phone_number', 255).notNullable();
            table.string('pin', 255).notNullable();
        });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users');
};
