/**
 * Error constants.
 */

const { createError } = require('apollo-errors');


const ValidationError = createError('ValidationError', {
    message: 'A validation error has ocurred.'
});

module.exports = {
    ValidationError,
};