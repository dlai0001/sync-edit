const knexInstance = require('../db');
const { ValidationError } = require('../errors');
const uuid = require('uuid/v4');
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const USER_TABLE = 'users';

class UserService {
    constructor(knex = knexInstance) {
        this.knex = knex;
    }

    async createUser(name, phoneNumber, pin) {
        // Validate phone number
        const parsedNumber = phoneUtil.parseAndKeepRawInput(phoneNumber, 'US');
        if (!phoneUtil.isPossibleNumber(parsedNumber)) {
            throw new ValidationError({
                data: {
                    phoneNumber: `Phone number must be valid format.`,
                }
            });
        }
        // normalize phone number to international E164 format.
        const toNumber = phoneUtil.format(parsedNumber, PNF.E164);

        // Phone number should be unique
        const existingUser = await this.knex.select('*').from(USER_TABLE).where({ phoneNumber: toNumber }).limit(1);
        if (existingUser.length) {
            throw new ValidationError({
                data: {
                    phoneNumber: `Phone number must be unique. ${phoneNumber} already exists.`,
                }
            });            
        }

        // Validate PIN, should be at least 4 digits        
        if (!/\d{4,}/.test(pin)) {
            throw new ValidationError({
                data: {
                    pin: 'Must be 4 or more numeric digits',
                }
            });
        }

        const id = uuid();
        const newUser = { id, name, phoneNumber: toNumber, pin };

        await this.knex.insert(newUser).into(USER_TABLE);

        return newUser;
    }
}

module.exports = new UserService();