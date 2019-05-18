const knex = require('../db');
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

describe('user-service', () => {
    const userService = require('./user-service');

    beforeEach(async () => {
        // Reset DB state before tests.
        await knex.migrate.latest();        
        await knex.seed.run();
    });

    it('should create user', async () => {
        await userService.createUser('Bob', '8003331121', '0000');
        const users = await knex.select('*').from('users').where({ phoneNumber: '+18003331121' });
        return expect(users.length).toBe(1);
    });

    it('should not allow bad phone numbers', async () => {
        let hasError = false;
        try {
            await userService.createUser('Bob', '123', '0000');
        } catch /*(err)*/ {
            // figure out why the error is unavailable in JEST
            hasError = true;
        }
        expect(hasError).toBeTruthy();
    });

    it('should not allow duplicate phone numbers', async () => {
        await userService.createUser('Bob', '8003330000', '0000');
        let hasError = false;
        try {
            await userService.createUser('Bob', '8003330000', '0000');
        } catch /*(err)*/ {
            // figure out why the error is unavailable in JEST
            hasError = true;
        }
        expect(hasError).toBeTruthy();
    });

    it('should not allow short pins', async () => {        
        let hasError = false;
        try {
            await userService.createUser('Bob', '8003330000', '000');
        } catch /*(err)*/ {
            // figure out why the error is unavailable in JEST
            hasError = true;
        }
        expect(hasError).toBeTruthy();
    });
});