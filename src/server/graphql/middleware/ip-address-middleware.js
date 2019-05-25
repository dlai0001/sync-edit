const {get} = require('lodash');

/**
 * GraphQL middleware for adding ip address to the context.
 */
module.exports = async (req, _context) => {
    const ipAddress = get(req, 'request.connection.remoteAddress') || get(req, 'request.ip');

    return {
        ipAddress,
    };
};