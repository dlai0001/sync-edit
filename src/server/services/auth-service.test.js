const knex = require('../db');
const { UnauthorizedError } = require('../errors');

describe('auth-service', () => {
    const authService = require('./auth-service');

    beforeEach(async () => {
        // Reset DB state before tests.
        await knex.migrate.latest();
        await knex.seed.run();
    });

    it('should generate token if phone and pin is valid.', async () => {
        await authService.sendShortCode('805-555-5555', '0000');
    });

    it('should throw error if pin does not match.', async () => {
        try {
            await authService.sendShortCode('805-555-5555', '0001');
            throw new Error('Fail');
        } catch(err) {
            return expect(err).toBeInstanceOf(UnauthorizedError);
        }        
    });

    it('should throw error if user cannot be found.', async () => {
        try {
            await authService.sendShortCode('805-555-5556', '0000');
            throw new Error('Fail');
        } catch(err) {
            return expect(err).toBeInstanceOf(UnauthorizedError);
        }        
    });

    it('should throw error if user is deleted.', async () => {
        // Simulate a delete by inserting something with delete
        await knex.insert({ 
            id: '25795751-b418-480c-a09b-9712069e8b31',
            name: 'David Lai', 
            pin: '242423423',
            phoneNumber: '+18055555555', 
            deleted: 1558254999859,
        })
        .into('users');
        try {
            await authService.sendShortCode('805-555-5555', '0000');
            throw new Error('Fail');
        } catch(err) {
            return expect(err).toBeInstanceOf(UnauthorizedError);
        }        
    });
});