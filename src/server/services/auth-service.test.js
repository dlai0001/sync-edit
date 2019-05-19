const knex = require('../db');
const { UnauthorizedError, ValidationError } = require('../errors');
const sinon = require('sinon');

describe('auth-service', () => {

    describe('sendShortCode', () => {
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
            } catch (err) {
                return expect(err).toBeInstanceOf(UnauthorizedError);
            }
        });

        it('should throw error if user cannot be found.', async () => {
            try {
                await authService.sendShortCode('805-555-5556', '0000');
                throw new Error('Fail');
            } catch (err) {
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
            } catch (err) {
                return expect(err).toBeInstanceOf(UnauthorizedError);
            }
        });
    });

    describe('verifyShortCode', () => {
        const authService = require('./auth-service');
        const { getLastSms } = require('../libs/sms');
        // let sandbox;

        beforeEach(async () => {
            // sandbox = sinon.sandbox.create();

            // Reset DB state before tests.
            await knex.migrate.latest();
            await knex.seed.run();
        });        

        it('should return tokens when validation succeeds.', async () => {
            await authService.sendShortCode('805-555-5555', '0000');
            const lastSms = getLastSms();
            const shortCode = /\d+/.exec(lastSms.text)[0];

            const results = await authService.authenticate('805-555-5555', shortCode);

            expect(results.accessToken).toBeDefined();
            return expect(results.refreshToken).toBeDefined();
        });

        it('should throw ValidationError for invalid code.', async () => {
            await authService.sendShortCode('805-555-5555', '0000');            

            try {
                await authService.authenticate('805-555-5555', '999999');
                throw new Error('Should not succeed');
            } catch (err) {
                return expect(err).toBeInstanceOf(ValidationError);
            }   
        });
    });

    describe('validateAccessToken', () => {
        const authService = require('./auth-service');
        const { getLastSms } = require('../libs/sms');
        // let sandbox;

        beforeEach(async () => {
            // sandbox = sinon.sandbox.create();

            // Reset DB state before tests.
            await knex.migrate.latest();
            await knex.seed.run();
        });

        it('should return with claims if access token is valid', async () => {
            await authService.sendShortCode('805-555-5555', '0000');
            const lastSms = getLastSms();
            const shortCode = /\d+/.exec(lastSms.text)[0];

            const results = await authService.authenticate('805-555-5555', shortCode);
            const claims = authService.validateAccessToken(results.accessToken);
            return expect(claims.userId).toBe('25795751-b418-480c-a09b-9712069e8b31');
        });

        it('should throw UnauthorizedError if token is invalid', () => {
            return expect(() =>
                authService.validateAccessToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyNTc5NTc1MS1iNDE4LTQ4MGMtYTA5Yi05NzEyMDY5ZThiMzEiLCJpYXQiOjE1NTgyOTA5MTYsImV4cCI6MTU1ODI5MTUxNn0.jPsPDol0Fb8g9-Mq6vs4gFlNQ6aaIB3llngeiDUdznA')
            ).toThrow(UnauthorizedError);
        });
    });

    describe('refreshTokens', () => {
        const authService = require('./auth-service');
        const { getLastSms } = require('../libs/sms');

        beforeEach(async () => {
            // Reset DB state before tests.
            await knex.migrate.latest();
            await knex.seed.run();
        });

        it('should generate new tokens when refresh token is valid.', async () => {
            await authService.sendShortCode('805-555-5555', '0000');
            const lastSms = getLastSms();
            const shortCode = /\d+/.exec(lastSms.text)[0];
    
            const tokens = await authService.authenticate('805-555-5555', shortCode);
            
            const newTokens = await authService.refreshTokens(tokens.refreshToken);
            expect(newTokens.accessToken).toBeDefined();
            return expect(newTokens.refreshToken).toBeDefined();
        });

        it('should throw UnauthorizedError if refreshing logged off token', async () => {
            await authService.sendShortCode('805-555-5555', '0000');
            const lastSms = getLastSms();
            const shortCode = /\d+/.exec(lastSms.text)[0];
    
            const tokens = await authService.authenticate('805-555-5555', shortCode);
            authService.logoff(tokens.accessToken);
            
            try {
                await authService.refreshTokens(tokens.refreshToken);
                throw new Error('should not succeed');
            } catch (err) {
                expect(err).toBeInstanceOf(UnauthorizedError);
            }
        });
    });
});