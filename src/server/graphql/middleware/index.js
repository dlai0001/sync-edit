// Merge middlewares into one middleware.

const middlewares = [
    require('./auth-middleware'),
];

const mergedMiddlewares = async req => {
    let currentReq = req;
    for (let middleware of middlewares) {
        currentReq = await middleware(req);
    }
    return currentReq;
};

module.exports = mergedMiddlewares;