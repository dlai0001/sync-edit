const { SchemaDirectiveVisitor } = require('graphql-tools')
const { UnauthenticatedError } = require('../errors');

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



const directiveResolvers = {
    isAuthenticated: IsAuthenticatedDirective,
};


module.exports = directiveResolvers;