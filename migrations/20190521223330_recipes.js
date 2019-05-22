
exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('recipes', function (table) {
            // Integer Id.  I expect to doing more joins on this table, integer joins take up less memory than string joins.
            table.integer('id');  

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

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('recipes');
};
