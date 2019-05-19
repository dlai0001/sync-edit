const knex = require('../db');
const { AuthorizationError } = require('../errors');

describe('auth-service', () => {
    const authService = require('./auth-service');

    beforeEach(async () => {
        // Reset DB state before tests.
        await knex.migrate.latest();
        await knex.seed.run();
    });

    it('should generate token if phone and pin is valid.', () => {
        authService.sendShortCode('805-555-5555', '0000');
    });
});