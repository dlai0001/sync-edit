import { Container } from 'unstated';
import ApolloClient, { gql } from 'apollo-boost';
import { get } from 'lodash';
const client = new ApolloClient();

export default class AuthContainer extends Container {
    state = {
        isAuthenticated: false,
        errors: null,
    };

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
            errors: null,
        });

        const REGISTER_USER = gql`
            mutation RegisterUser($name:String!, $pin:String!, $phoneNumber:String!) {
                registerUser(name:$name, pin:$pin, phoneNumber:$phoneNumber) {
                    id
                }
            }
        `;        

        return client.mutate({
            mutation: REGISTER_USER,
            variables: registrationParams,
        })
        .then(resp => {
            if (get(resp, 'data.registerUser.id')) {
                this.setState({ 
                    ...this.register.state,
                    isAuthenticated: true 
                });
            }
        })
        .catch(err => {
            const errs = err.graphQLErrors.map(x => Object.values(x.data)[0]);
            throw new Error(errs[0]);
        })
    }
}
