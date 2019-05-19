import { Container } from 'unstated';
import ApolloClient, { gql } from 'apollo-boost';
import { get } from 'lodash';
import { decode } from 'jsonwebtoken';
import { DateTime } from 'luxon';

const REFRESH_TOKEN_LOCALSTORAGE_KEY = 'REFRESH_TOKEN';

export default class AuthContainer extends Container {
    _client = new ApolloClient();

    state = {
        isAuthenticated: false,

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
        console.log('registered called', registrationParams);
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

        return this._client.mutate({
            mutation: REGISTER_USER,
            variables: registrationParams,
        })
            .then(resp => {
                if (get(resp, 'data.authRegisterUser.user')) {

                    // Get access token to calculate the expiration later.
                    const accessToken = get(resp, 'data.authRegisterUser.tokens.accessToken');
                    const claims = decode(accessToken);
                    const secondsTillExp = claims.exp - (Date.now() / 1000);
                    console.log(`access token will expire in ${secondsTillExp} seconds`);

                    // store refresh token in localstorage
                    const refreshToken = get(resp, 'data.authRegisterUser.tokens.refreshToken');
                    localStorage.setItem(, refreshToken);

                    const newState = {
                        ...this.register.state,
                        isAuthenticated: true,
                        userId: get(resp, 'data.authRegisterUser.user.id'),
                        userName: get(resp, 'data.authRegisterUser.user.name'),
                        refreshToken: refreshToken,
                        accessToken: accessToken,
                    };

                    console.log(`Registration successful. New state:`, newState);
                    this.setState(newState);

                    // Set a timeout to renew out refresh token.
                    setTimeout(this.refreshToken.bind(this), (secondsTillExp * 1000) - (5 * 1000)); //attempt to renew token 5 sec before expiration.
                }
            })
            .catch(err => {
                console.error('Error registering user', err);
                if (err.graphQLErrors) {
                    // Collapse graphQL errors into 1 error.
                    const errs = err.graphQLErrors.map(x => Object.values(x.data)[0]);
                    throw new Error(errs.join(' '));
                }
                throw err;
            })
    }

    refreshToken() {
        console.log('refreshing tokens');

        const REFRESH_TOKENS = gql`
            mutation RegisterUser($refreshToken:String!) {
                authRefreshTokens(refreshToken: $refreshToken) {
                    accessToken,
                    refreshToken
                }
            }
        `;

        return this._client.mutate({
            mutation: REFRESH_TOKENS,
            variables: { refreshToken: this.state.refreshToken },
        }).then((resp) => {
            console.log('Got new tokens', resp.data);

            const refreshToken = get(resp, 'data.authRegisterUser.tokens.refreshToken');
            localStorage.setItem('REFRESH_TOKEN', )

            const newState = {
                ...this.register.state,
                isAuthenticated: true,                
                refreshToken: refreshToken,
                accessToken: get(resp, 'data.authRefreshTokens.refreshToken'),
            };
            this.setState(newState);

            console.log(`Refresh token successful successful. New state:`, newState);
            
            // schedule next token refresh.
            const accessToken = get(this, 'state.accessToken');
            const claims = decode(accessToken);
            const secondsTillExp = claims.exp - (Date.now() / 1000);
            setTimeout(this.refreshToken.bind(this), (secondsTillExp * 1000) - (5*1000))

        }).catch((err) => {
            console.error('Error refreshing tokens', err);

            const accessToken = get(this, 'state.accessToken');
            const claims = decode(accessToken);
            const secondsTillExp = claims.exp - (Date.now() / 1000);
            console.log(`access token will expire in ${secondsTillExp} seconds`);

            // if current access token not expired, try again in 5 seconds.
            if(secondsTillExp > 0) {
                setTimeout(this.refreshToken.bind(this), 5000);
            } else {

            }
            console.log('accessToken has expired, session is no longer authenticated.')
        });
    }
}
