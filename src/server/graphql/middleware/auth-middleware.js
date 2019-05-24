const authService = require('../../services/auth-service');
const { get } = require('lodash');

/**
 * GraphQL middleware for adding claims from Authorization header
 * to our request context.
 */
module.exports = async (req, _context) => {
    let authenticatedUser = null;

    // extract JWT token from header
    const accessToken = req.request.headers.authorizaton;
    if (accessToken) {
        try {
            const claims = authService.validateAccessToken(accessToken);
            authenticatedUser = claims;
        } catch {
            // do nothing, token not valid.
        }
    }

    return {
        authenticatedUser,
    };
};