const bcrypt = require('bcrypt');
const NodeCache = require( "node-cache" );
const jwt = require('jsonwebtoken');
const { RandomToken } = require('@sibevin/random-token')

const { formatPhoneNumber} = require('../libs/phone-number');
const userService = require('./user-service');
const sendSms = require('../libs/sms');
const {UnauthorizedError} = require('../errors');

const refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION || '3h';
const accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION || '10m';
const jwtSecret = process.env.JWT_SECRET || 'SECRET';

const cache = new NodeCache({
    stdTTL: process.env.SHORT_CODE_EXP || 300, 
    checkperiod: 120
});

class AuthService {
    constructor() {
        this._cache = cache;
    }

    async sendShortCode(phoneNumber, pin) {
        let user;
        try {
            user = await userService.getUserByPhoneNumber(phoneNumber);
        } catch {
            throw new UnauthorizedError('Phone number and PIN did not match.');
        }

        // Validate pin hash
        const pinMatch = await bcrypt.compare(pin, user.pin);
        if(!pinMatch) {
            throw new UnauthorizedError('Phone number and PIN did not match.');
        }

        const token = RandomToken.gen({length:7, seed:'number'});    

        this._cache.set(phoneNumber, token);

        const message = `Your validation code is:\n ${token}`;
        const formattedNumber = formatPhoneNumber(phoneNumber);
        sendSms(formattedNumber, message);
    }

    async verifyShortCode(phoneNumber, shortCode) {

    }

    async refreshTokens(refreshToken) {

    }

    async _generateTokens(user) {

    }


}

module.exports = new AuthService();