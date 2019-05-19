
const bcrypt = require('bcrypt');

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(() => bcrypt.hashSync('0000', 1))
    .then((pinHash) => {      
      // Inserts seed entries
      return knex('users').insert([
        { id: '25795751-b418-480c-a09b-9712069e8b31', name: 'David Lai', phoneNumber: '+18055555555', pin: pinHash, timestamp: Date.now() },
        { id: 'e5bf6f4a-8f2d-419f-9903-9382dcf4798a', name: 'John Smith', phoneNumber: '+15555555555', pin: pinHash, timestamp: Date.now() },
        { id: '58ae7b83-6767-4c01-a8c8-305189651972', name: 'Stacy Keebler', phoneNumber: '+13105555555', pin: pinHash, timestamp: Date.now() },
      ]);
    });
};
