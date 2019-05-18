
exports.up = function (knex) {
    return knex.schema
        .createTable('audit_log', function (table) {

            table.string('userId', 255).notNullable();
            table.string('action', 255).notNullable();
            table.string('data');

            // Used to track latest version.
            table.timestamp('createdAt', { precision: 6 }).notNullable().defaultTo(knex.fn.now());
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('audit_log');
};
