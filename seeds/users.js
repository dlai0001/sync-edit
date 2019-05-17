
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { name: 'David Lai', phone_number: '555-555-5555', pin: '0000' },
        { name: 'John Smith', phone_number: '555-555-5555', pin: '0000' },
        { name: 'Stacy Keebler', phone_number: '555-555-5555', pin: '0000' },
      ]);
    });
};
