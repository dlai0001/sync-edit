const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const { ValidationError } = require('../errors');

const knex = require('../db');
const auditService = require('./audit-service');

const hashRounds = process.env.HASH_ROUNDS || 10;

const USER_TABLE = 'users';

class UserService {

    constructor() {
        this.knex = knex;
        this.auditService = auditService;
    }

    /**
     * Creates a new user.
     * @param {String} name full name of user
     * @param {String} phoneNumber valid phone number string
     * @param {String} pin numeric string 4-10 digits long
     */
    async createUser(name, phoneNumber, pin, createdBy=null) {
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
        if (!/\d{4,10}/.test(pin)) {
            throw new ValidationError({
                data: {
                    pin: 'Must between 4 and 10 numeric digits',
                }
            });
        }
        // encrypt pin into one way hash.
        const pinHash = await bcrypt.hash(pin, hashRounds);

        const id = uuid();
        const newUser = {
            id,
            name,
            phoneNumber: toNumber,
            pin: pinHash,            
        };
        
        await this.knex(USER_TABLE).insert(newUser);
        
        await auditService.log(newUser, 'Created User', createdBy || id);

        return newUser;
    }
}

module.exports = new UserService();