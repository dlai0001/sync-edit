const uuid = require('uuid/v4');
const bcrypt = require('bcryptjs');

const { ValidationError, NotFoundError } = require('../errors');

const knex = require('../db');
const auditService = require('./audit-service');

const {validatePhoneNumber, formatPhoneNumber} = require('../libs/phone-number');

const hashRounds = process.env.HASH_ROUNDS || 10;

const USER_TABLE = 'users';

class UserService {

    constructor() {
        this._knex = knex;
        this.auditService = auditService;
    }

    async getUserByPhoneNumber(phoneNumber) {
        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
        const user = await this._knex.select('*')
            .from(USER_TABLE)
            .where({'phoneNumber':formattedPhoneNumber})
            .orderBy('timestamp', 'DESC')
            .limit(1);
     
        if (user.length == 0 || user[0].deleted) {
            throw new NotFoundError(`Unable to find user by number: ${formattedPhoneNumber}`);
        }

        return user[0];
    }

    async getUserById(userId) {
        const user = await this._knex.select('*')
            .from(USER_TABLE)
            .where({'id':userId})
            .orderBy('timestamp', 'DESC')
            .limit(1);
     
        if (user.length == 0 || user[0].deleted) {
            throw new NotFoundError(`Unable to find user id: ${userId}`);
        }

        return user[0];
    }

    /**
     * Creates a new user.
     * @param {String} name full name of user
     * @param {String} phoneNumber valid phone number string
     * @param {String} pin numeric string 4-10 digits long
     */
    async createUser(name, phoneNumber, pin, createdBy=null) {
        // Validate phone number
        if (!validatePhoneNumber(phoneNumber)) {
            throw new ValidationError({
                data: {
                    phoneNumber: `Phone number must be valid format.`,
                }
            });
        }
        // normalize phone number to international E164 format.
        const toNumber = formatPhoneNumber(phoneNumber);

        // Phone number should be unique
        const existingUser = await this._knex.select('*').from(USER_TABLE).where({ phoneNumber: toNumber }).limit(1);
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
        const salt = bcrypt.genSaltSync(hashRounds);
        var pinHash = bcrypt.hashSync(pin, salt);

        const id = uuid();
        const newUser = {
            id,
            name,
            phoneNumber: toNumber,
            pin: pinHash,            
        };
        
        await this._knex(USER_TABLE).insert(newUser);
        
        await auditService.log(newUser, 'USERSERVICE_CREATE_USER', createdBy || id);

        return newUser;
    }
}

module.exports = new UserService();