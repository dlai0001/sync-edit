import { Container } from 'unstated';
import ApolloClient, { gql } from 'apollo-boost';
import { get } from 'lodash';
const client = new ApolloClient();

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

        const REGISTER_USER = gql`
            mutation RegisterUser($name:String!, $pin:String!, $phoneNumber:String!) {
                registerUser(name:$name, pin:$pin, phoneNumber:$phoneNumber) {
                    id
                }
            }
        `;
        try {

            const response = await client.mutate({
                mutation: REGISTER_USER,
                variables: registrationParams,
            });
            if (get(response, 'data.registerUser.id')) {
                this.setState({ isAuthenticated: true });
            }
        } catch (err) {
            console.error(err);
            console.log(err.data);
            debugger;
        }
    }
}
