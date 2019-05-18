/**
 * Error constants.
 */

const { createError } = require('apollo-errors');


module.ValidationError = createError('ValidationError', {
    message: 'A validation error has ocurred.'
});
