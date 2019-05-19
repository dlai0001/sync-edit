const knex = require('../db');
const { ValidationError } = require('../errors');

describe('user-service', () => {
    const userService = require('./user-service');

    beforeEach(async () => {
        // Reset DB state before tests.
        await knex.migrate.latest();
        await knex.seed.run();
    });

    it('should create user', async () => {
        await userService.createUser('Bob', '8003331121', '0000');
        // Phone number gets normalized to E164
        const users = await knex.select('*').from('users').where({ phoneNumber: '+18003331121' });
        return expect(users.length).toBe(1);
    });

    it('should not allow bad phone numbers', async () => {
        try {
            await userService.createUser('Bob', '123', '0000');
            throw new Error('should throw error');
        } catch (err) {            
            expect(err instanceof ValidationError).toBeTruthy();
        }
    });

    it('should not allow duplicate phone numbers', async () => {
        await userService.createUser('Bob', '8003330000', '0000');
        try {
            await userService.createUser('Bob', '8003330000', '0000');
            throw new Error('should throw error.');
        } catch (err) {
            debugger;
            expect(err instanceof ValidationError).toBeTruthy();
        }
    });

    it('should not allow short pins', async () => {
        try {
            await userService.createUser('Bob', '8003330000', '000');
            throw new Error('should throw error.');
        } catch (err) {
            expect(err instanceof ValidationError).toBeTruthy();
        }
    });

    it('should audit log new users created', async () => {
        const user = await userService.createUser('Bob', '8003330000', '0000');
        const auditEntries = await knex.select('*').from('audit_log').where({ userId: user.id });
        expect(auditEntries.length).toBe(1);
    });
});