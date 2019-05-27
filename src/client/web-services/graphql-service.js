import ApolloClient from 'apollo-boost';

let _client = new ApolloClient();


/**
 * Get graphQL client.  This should be called for each request so we have
 * a client with the latest headers set.
 */
export function getGraphqlClient() {
    return _client;
}

/**
 * Sets the access token sent in the headers so future requests are authenticated.
 * @param {String} accessToken 
 */
export function setClientAccessToken(accessToken) {
    const newClient = new ApolloClient({
        request: async operation => {
            operation.setContext({
                headers: {
                    Authorization: accessToken ? `Bearer ${accessToken}` : ''
                }
            });
        }
    });
    _client = newClient;
}
