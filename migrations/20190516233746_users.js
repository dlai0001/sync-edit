
exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            // This will store a uuid to be used a key.
            table.string('id');            

            // data fields
            table.string('name').notNullable();
            table.string('phoneNumber').notNullable();
            table.string('pin').notNullable();

            // Used to track latest version.
            table.timestamp('timestamp', {precision: 6}).notNullable().default(knex.fn.now());
            // Tracks deleted.  If latest version has deleted timestamp, then considered deleted.
            table.timestamp('deleted');
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
};
