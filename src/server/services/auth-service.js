const jwt = require('jsonwebtoken');

const refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION || '3h';
const accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION || '10m';
const jwtSecret = process.env.JWT_SECRET || 'SECRET';
const NodeCache = require( "node-cache" );

const { RandomToken } = require('@sibevin/random-token')

const { formatPhoneNumber} = require('../libs/phone-number');

const sendSms = require('../libs/sms');
class AuthService {
    constructor() {
        this._cache = new NodeCache({
            stdTTL: process.env.SHORT_CODE_EXP || 300, 
            checkperiod: 120
        });
    }

    async sendShortCode(phoneNumber, pin) {
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