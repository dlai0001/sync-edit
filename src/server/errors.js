/**
 * Error constants.
 */

const { createError } = require('apollo-errors');

const AuthorizationError = createError('AuthorizationError', {
    message: 'An anuthorization error has ocurred.'
});

const ValidationError = createError('ValidationError', {
    message: 'A validation error has ocurred.'
});

module.exports = {
    ValidationError,
};