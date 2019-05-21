const bcrypt = require('bcrypt');
const NodeCache = require("node-cache");
const jwt = require('jsonwebtoken');
const { RandomToken } = require('@sibevin/random-token')

const { formatPhoneNumber } = require('../libs/phone-number');
const { sendSms } = require('../libs/sms');

const userService = require('./user-service');
const auditService = require('./audit-service');

const { UnauthorizedError, ValidationError, AuthorizationError } = require('../errors');

const refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION || '1h';
const refreshTokenExpirationSeconds = process.env.REFRESH_TOKEN_EXPIRATION_SECONDS || '3600'; //default 1 hr
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'S3CURE';

const accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION || '1m'; // 1 min access token exp
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'SECRET';


/**
 * @typedef {Object} TokenPair
 * @property {String} accessToken - Access token - short lived token.
 * @property {String} refreshToken - Refresh token - longer lived token.
 */

class AuthService {
    constructor() {
        this._smsCodeCache = new NodeCache({
            stdTTL: process.env.SHORT_CODE_EXP || 5 * 60, // 5 minute default
            checkperiod: 120
        });

        this._refreshTokenCache = new NodeCache({
            stdTTL: refreshTokenExpirationSeconds,
            checkperiod: 120
        });
    }

    /**
     * Send short code for 2FA authentication.
     * @param {String} phoneNumber 
     * @param {String} pin 
     */
    async sendShortCode(phoneNumber, pin) {
        let user;
        try {
            user = await userService.getUserByPhoneNumber(phoneNumber);
        } catch (e) {
            throw new UnauthorizedError('Phone number and PIN did not match.');
        }

        // Validate pin hash
        const pinMatch = await bcrypt.compare(pin, user.pin);
        if (!pinMatch) {
            throw new UnauthorizedError('Phone number and PIN did not match.');
        }

        const token = RandomToken.gen({ length: 7, seed: 'number' });

        await this._smsCodeCache.set(phoneNumber, token);

        const message = `Your validation code is:\n ${token}`;
        const formattedNumber = formatPhoneNumber(phoneNumber);
        auditService.log(user, "AUTHSERVICE_GENERATED_SHORTCODE");
        sendSms(formattedNumber, message);

        return true;
    }

    /**
     * Authenticate user after they entered in their texted short code.
     * @param {String} phoneNumber 
     * @param {String} shortCode 
     */
    async authenticate(phoneNumber, shortCode) {
        const expectedCode = await this._smsCodeCache.get(phoneNumber);
        const debugBypass = (expectedCode && process.env.DEBUG && shortCode === '0000000');
        if (expectedCode !== shortCode && !debugBypass) {
            throw new ValidationError('Code is not correct.')
        }

        const user = await userService.getUserByPhoneNumber(phoneNumber);

        const tokens = this.generateTokens(user);
        auditService.log(user, "AUTHSERVICE_AUTHENTICATED");
        return tokens;
    }

    /**
     * Logs off the user by invalidating the refresh token.  The user will no
     * longer be able to access resources once short lived access token has
     * expired.
     * @param {String} userId 
     */
    async logoff(userId) {
        await this._refreshTokenCache.del(userId);        
        auditService.log(userId, "AUTHSERVICE_LOGGEDOFF");
    }

    /**
     * Validates access token.  Also returns claims embedded in the access token.
     * @param {String} accessToken 
     */
    validateAccessToken(accessToken) {
        try {
            return jwt.verify(accessToken, accessTokenSecret)
        } catch {
            throw new UnauthorizedError('User is unauthenticated.');
        }
    }

    /**
     * Validates and generates a new set of access and refresh tokens.
     * @param {String} refreshToken
     */
    async refreshTokens(refreshToken) {
        let claims;
        try {
            claims = jwt.verify(refreshToken, refreshTokenSecret);
        } catch {
            throw new UnauthorizedError('User is not authorized.');
        }

        // Make sure the refresh token was not invalidated via logout.
        const storedToken = await this._refreshTokenCache.get(claims.userId);
        if (!storedToken) {
            throw new UnauthorizedError('User is not authorized.');
        }

        const user = await userService.getUserById(claims.userId);
        auditService.log(user, "AUTHSERVICE_REFRESHED_TOKENS");
        return this.generateTokens(user);
    }

    /**
     * generates access token/refresh token pairs.
     * @param {Object} user 
     */
    async generateTokens(user) {
        const accessToken = jwt.sign(
            {
                userId: user.id,
                userName: user.name,
            },
            accessTokenSecret,
            {
                expiresIn: accessTokenExpiration,
            }
        );

        const refreshToken = jwt.sign(
            {
                userId: user.id,
                userName: user.name,
            },
            refreshTokenSecret,
            {
                expiresIn: refreshTokenExpiration,
            }
        );
        this._refreshTokenCache.set(user.id, refreshToken)

        return {
            accessToken,
            refreshToken,
        };
    }


}

module.exports = new AuthService();