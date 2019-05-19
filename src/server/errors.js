/**
 * Error constants.
 */

const { createError } = require('apollo-errors');

const AuthorizationError = createError('AuthorizationError', {
    message: 'An anuthorization error has ocurred.'
});

const NotFoundError = createError('NotFoundError', {
    message: 'Unable to find entity.'
});

const UnauthorizedError = createError('UnauthorizedError', {
    message: 'User is not authorized.'
});

const ValidationError = createError('ValidationError', {
    message: 'A validation error has ocurred.'
});


module.exports = {
    AuthorizationError,
    NotFoundError,
    UnauthorizedError,
    ValidationError,    
};