
exports.up = function (knex, _Promise) {
    return knex.schema
        .createTable('recipes', function (table) {
            // uuid
            table.string('id');  

            // data fields
            table.string('title').notNullable();
            table.string('about');
            table.string('recipeText');

            // foreign key in 'users'
            table.string('ownerId').notNullable();

            // Used to track latest version.
            table.timestamp('timestamp', 10).notNullable().default(knex.fn.now());
            // Tracks deleted.  If latest version has deleted timestamp, then considered deleted.
            table.timestamp('deleted');
        })        
};

exports.down = function (knex, _Promise) {
    return knex.schema.dropTable('recipes');
};
