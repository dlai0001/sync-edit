// Merge middlewares into one middleware.

const middlewares = [
    require('./auth-middleware'),
];



/**
 * Loops through middlewares and merges the context output.
 * @param {*} req - http request object
 */
const mergedMiddlewares = async req => {
    let context = {};
    for (let middleware of middlewares) {        
        context = {
            ...context,
            ...(await middleware(req, context)),
        };
    }

    return context;
};

module.exports = mergedMiddlewares;