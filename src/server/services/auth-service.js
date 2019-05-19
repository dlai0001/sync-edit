const jwt = require('jsonwebtoken');

const refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION || '3h';
const accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION || '10m';
const jwtSecret = process.env.JWT_SECRET || 'SECRET';

class AuthService {

    async sendShortCode(phoneNumber, pin) {

    }

    async verifyShortCode(phoneNumber, shortCode) {

    }

    async refreshTokens(refreshToken) {

    }

    async _generateTokens(user) {

    }


}

module.exports = new AuthService();