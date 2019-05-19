import { Container } from 'unstated';
import { request } from 'graphql-request'



export default class AuthContainer extends Container {
    state = {
        isAuthenticated: false,
    };

    /**
     * Register for a new account.
     * @param {Object} registrationParams 
     * @param {String} registrationParams.name
     * @param {String} registrationParams.pin
     * @param {String} registrationParams.phoneNumber
     */
    async register(registrationParams) {
        console.log('registered called', registrationParams);
        throw new Error("testing errors");
    }
}
