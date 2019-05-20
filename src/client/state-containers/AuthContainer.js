import { Container } from 'unstated';
import { get } from 'lodash';
import { decode } from 'jsonwebtoken';
import { gql } from 'apollo-boost';
import { getGraphqlClient, setClientAccessToken } from '../web-services/graphql-client';

const REFRESH_TOKEN_LOCALSTORAGE_KEY = 'REFRESH_TOKEN';

export default class AuthContainer extends Container {

    state = {
        isAuthenticated: false,

        userId: null,
        userName: null,
                    
        refreshToken: null,
        accessToken: null,
    };

    constructor() {
        super();

        const prevRefreshToken = localStorage.getItem(REFRESH_TOKEN_LOCALSTORAGE_KEY);
        if (prevRefreshToken) {
            this.state.refreshToken = prevRefreshToken;
            this.refreshToken();
        }
    }

    /**
     * Register for a new account.
     * @param {Object} registrationParams 
     * @param {String} registrationParams.name
     * @param {String} registrationParams.pin
     * @param {String} registrationParams.phoneNumber
     */
    register(registrationParams) {
        console.debug('registered called', registrationParams);
        this.setState({
            ...this.register.state,
        });

        const REGISTER_USER = gql`
            mutation RegisterUser($name:String!, $pin:String!, $phoneNumber:String!) {
                authRegisterUser(name:$name, pin:$pin, phoneNumber:$phoneNumber) {
                    user {
                        id,
                        name,
                        phoneNumber
                    },
                    tokens {
                        accessToken,
                        refreshToken
                    }
                }
            }
        `;

        return getGraphqlClient().mutate({
            mutation: REGISTER_USER,
            variables: registrationParams,
        }).then(resp => {
            if (get(resp, 'data.authRegisterUser.user')) {                
                this._processNewTokens(get(resp, 'data.authRegisterUser.tokens'));

                const newState = {
                    ...this.state,                    
                    userId: get(resp, 'data.authRegisterUser.user.id'),
                    userName: get(resp, 'data.authRegisterUser.user.name'),                    
                };

                console.debug(`Registration successful. New state:`, newState);                
            }
        }).catch(err => {
            console.error('Error registering user', err);
            if (err.graphQLErrors) {
                // Collapse graphQL errors into 1 error.
                const errs = err.graphQLErrors.map(x => Object.values(x.data)[0]);
                throw new Error(errs.join('  '));
            }
            throw err;
        });
    }

    refreshToken() {
        console.debug('refreshing tokens');

        const REFRESH_TOKENS = gql`
            mutation RegisterUser($refreshToken:String!) {
                authRefreshTokens(refreshToken: $refreshToken) {
                    accessToken,
                    refreshToken
                }
            }
        `;

        return getGraphqlClient().mutate({
            mutation: REFRESH_TOKENS,
            variables: { refreshToken: this.state.refreshToken },
        }).then((resp) => {
            console.debug('Got new tokens', resp.data);            

            this._processNewTokens(get(resp, 'data.authRefreshTokens'));            
        }).catch((err) => {            
            console.debug('Error refreshing tokens', err);

            // If we weren't logged in to begin with, don't schedule refresh.
            if(!this.state || !this.state.accessToken) {
                return;
            }
            
            const accessToken = this.state.accessToken;
            const claims = decode(accessToken);
            const secondsTillExp = claims.exp - (Date.now() / 1000);
            console.debug(`access token will expire in ${secondsTillExp} seconds`);

            // if current access token not expired, try again in 5 seconds.
            if (secondsTillExp > 0) {
                setTimeout(this.refreshToken.bind(this), 5000);
            } else {
                console.log('accessToken has already expired, session is no longer authenticated.')
            }
            
        });
    }

    /**
     * Process receiving a new pair of tokens.  This will update the state,
     * schedule the next token refresh, save the refreshToken to localstorage, 
     * and update our graphql client to use updated access token.
     * @param {Object} tokens 
     * @param {String} tokens.accessToken
     * @param {String} tokens.refreshToken
     */
    _processNewTokens(tokens) {
        // Get access token to calculate the expiration later.
        const accessToken = tokens.accessToken;
        const claims = decode(accessToken);
        const secondsTillExp = claims.exp - (Date.now() / 1000);
        console.log(`access token will expire in ${secondsTillExp} seconds`);

        // update the client token.
        setClientAccessToken(accessToken);

        // store refresh token in localstorage
        const refreshToken = tokens.refreshToken;
        localStorage.setItem(REFRESH_TOKEN_LOCALSTORAGE_KEY, refreshToken);

        const newState = {
            ...this.state,
            isAuthenticated: true,                        
            refreshToken: refreshToken,
            accessToken: accessToken,
        };

        console.log(`Token update successful. New state:`, newState);
        this.setState(newState);

        // Set a timeout to renew out refresh token.
        //attempt to renew token 5 sec before expiration.
        const nextTokenRefresh = (secondsTillExp * 1000) - (5 * 1000);
        console.log(`Scheduling next token refresh in ${nextTokenRefresh} milliseconds`);
        setTimeout(this.refreshToken.bind(this), nextTokenRefresh);
    }
}
