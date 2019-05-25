const { SchemaDirectiveVisitor } = require('graphql-tools')
const { UnauthenticatedError, RateLimitExceededError } = require('../errors');
const { RateLimiterMemory, RateLimiterRes } = require('rate-limiter-flexible');

/**
 * isAuthenticated middleware.  Check if request has been authenticated by 
 * checking context for authenticated user.
 */
class IsAuthenticatedDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const resolveFn = field.resolve;
        const defaultResolverFn = field.defaultFieldResolver;

        field.resolve = async (...args) => {
            const [obj, /* params */, context, info] = args;

            if (context.authenticatedUser) {
                if (resolveFn) {
                    return await resolveFn.apply(this, args);
                } else if (defaultResolverFn) {
                    return await resolveFn.apply(this, args);
                } else if (obj instanceof Object && info.fieldName) {
                    // This directive was applied to a field, return field value.
                    return obj[info.fieldName];
                } 
                
                return obj;
            }

            throw new UnauthenticatedError();
        }
    }
}


/**
 * Rate limiter middleware.  Limits request rate by IP address.
 */
class RateLimitDirective extends SchemaDirectiveVisitor {
    
    _rateLimiter = null;
    _consumptionRate = 1;

    visitFieldDefinition(field) {
        const { pointsPerRequest, initialPoints } = this.args;
        
        const resolveFn = field.resolve;
        const defaultResolverFn = field.defaultFieldResolver;
        
        const rateLimiterOptions = {
            points: initialPoints || pointsPerRequest,
            duration: 1,
        };
        this._consumptionRate = pointsPerRequest;
        this._rateLimiter = new RateLimiterMemory({ duration: 1, points: this._consumptionRate });

        field.resolve = async (...args) => {
            const [ /*parent*/, /*params*/, {ipAddress}, /*info*/] = args;

            try {
                console.log(await this._rateLimiter.consume(ipAddress, this._consumptionRate));
            } catch (err) {
                throw new RateLimitExceededError();                
            }

            // Rate limit ok, resolve field definition.
            return await (resolveFn || defaultResolverFn).apply(this, args);
        }
    }
}


const directiveResolvers = {
    isAuthenticated: IsAuthenticatedDirective,
    rateLimit: RateLimitDirective,
};


module.exports = directiveResolvers;