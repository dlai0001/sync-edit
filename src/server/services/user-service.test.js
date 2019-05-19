const knex = require('../db');
const { ValidationError, NotFoundError } = require('../errors');

describe('user-service', () => {
    const userService = require('./user-service');

    describe('getUserByPhoneNumber', () => {
        beforeEach(async () => {
            // Reset DB state before tests.
            await knex.migrate.latest();
            await knex.seed.run();
        });

        it('should get user', async () => {
            const user = await userService.getUserByPhoneNumber('805-555-5555');            
            return expect(user).toBeTruthy();
        });

        it('should raise error for non-existent phone number', async () => {
            try {
                await userService.getUserByPhoneNumber('805-555-1212');
            } catch(err) {
                return expect(err).toBeInstanceOf(NotFoundError);
            }                     
        });

        it('should raise error for deleted user', async () => {
            knex.insert({ id: '25795751-b418-480c-a09b-9712069e8b31', name: 'David Lai', phoneNumber: '+18055555555', deleted: new Date() });
            try {
                await userService.getUserByPhoneNumber('18055555555');
            } catch(err) {
                return expect(err).toBeInstanceOf(NotFoundError);
            }                     
        });
    });
    
    describe('registerUser', () => {
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
                expect(err).toBeInstanceOf(ValidationError);
            }
        });

        it('should not allow duplicate phone numbers', async () => {
            await userService.createUser('Bob', '8003330000', '0000');
            try {
                await userService.createUser('Bob', '8003330000', '0000');
                throw new Error('should throw error.');
            } catch (err) {
                expect(err).toBeInstanceOf(ValidationError);
            }
        });

        it('should not allow short pins', async () => {
            try {
                await userService.createUser('Bob', '8003330000', '000');
                throw new Error('should throw error.');
            } catch (err) {
                expect(err).toBeInstanceOf(ValidationError);
            }
        });

        it('should create audit log entry when new users are created', async () => {
            const user = await userService.createUser('Bob', '8003330000', '0000');
            const auditEntries = await knex.select('*').from('audit_log').where({ userId: user.id });
            expect(auditEntries.length).toBe(1);
        });
    });

});