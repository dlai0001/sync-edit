import React from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { Subscribe } from 'unstated';
import { Redirect } from 'react-router-dom';

import AuthContainer from '../state-containers/AuthContainer';
import SimpleTextInputField from '../components/SimpleTextInputField';

/**
 * Form validator
 */
const LoginSchema = Yup.object().shape({
    pin: Yup.string()
        .matches(/^[0-9]+$/, 'Pin must be numeric.')
        .min(4, 'Too Short!')
        .max(10, 'Too Long!')
        .required('Required'),
    phoneNumber: Yup.string()
        .matches(/^[0-9\+\-., ()]{6,}$/, 'Invalid phone number format.')
        .required('Required'),
});

const ShortCodeSchema = Yup.object().shape({
    shortCode: Yup.string()
        .matches(/^[0-9]{7}$/, 'Please enter valid code'),
})

/**
 * Login page
 */
class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = { phoneNumber: null, pin: null };
    }

    reenterPhone = () => {
        this.setState({phoneNumber: null, pin: null });
    }

    render() {
        const {pin, phoneNumber} = this.state;
        const shortCodeSent = pin && phoneNumber;

        return (
            <Subscribe to={[AuthContainer]}>
                {auth => (
                    <React.Fragment>
                        {auth.state.isAuthenticated && (
                            //Redirect to dashboard when registration successful and we get authenticated.
                            <Redirect to="/dashboard"></Redirect>
                        )}
                        {!shortCodeSent && (
                            <div className="container">
                                <div className="column">
                                    <h1 className="title">Recipe Sync - Login</h1>
                                    <Formik
                                        initialValues={{ pin: '', phoneNumber: '' }}
                                        validationSchema={LoginSchema}
                                        onSubmit={(values, actions) => {
                                            auth.sendShortCode(values.phoneNumber, values.pin)
                                            .then(() => {
                                                actions.setSubmitting(false);
                                                this.setState({ ...this.state, pin: values.pin, phoneNumber: values.phoneNumber });
                                            })
                                            .catch(err => {
                                                actions.setStatus({ serverError: err.message });
                                                actions.setSubmitting(false);
                                            });
                                        }}
                                        render={(props) => (
                                            <form onSubmit={props.handleSubmit}>
                                                {props.status && props.status.serverError && (
                                                    <div className="box has-background-danger has-text-white">
                                                        {props.status.serverError}
                                                    </div>
                                                )}

                                                <SimpleTextInputField
                                                    props={props}
                                                    name="phoneNumber"
                                                    icon="fas fa-mobile-alt"
                                                    label="Phone Number"
                                                    placeholder="+1-555-555-5555"
                                                />

                                                <SimpleTextInputField
                                                    props={props}
                                                    name="pin"
                                                    icon="fas fa-unlock"
                                                    label="PIN code"
                                                    placeholder="1234"
                                                />

                                                <div className="field">
                                                    <button type="submit"
                                                        className={"button is-primary " + (props.isSubmitting ? 'is-loading' : '')}>
                                                        Login
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {shortCodeSent && (
                            <div className="container">
                                <div className="column">
                                    <h1 className="title">Recipe Sync - Login</h1>
                                    <Formik
                                        initialValues={{ shortCode:'', phoneNumber: this.state.phoneNumber, pin: this.state.pin, action: null }}
                                        validationSchema={ShortCodeSchema}
                                        onSubmit={(values, actions) => {
                                            
                                            
                                            if (values.action == 'confirm') {
                                                console.debug('submitting shortcode');
                                                auth.authenticate(values.phoneNumber, values.shortCode)
                                                    .then(() => {
                                                        actions.setSubmitting(false);
                                                    })
                                                    .catch(err => {
                                                        actions.setStatus({ serverError: err.message });
                                                        actions.setSubmitting(false);
                                                    });
                                            } else if(values.action == 'resend') {
                                                console.debug('resending shortcode');
                                                auth.sendShortCode(values.phoneNumber, values.pin)
                                                    .then(() => {
                                                        actions.setSubmitting(false);
                                                        this.setState({ ...this.state, pin: values.pin, phoneNumber: values.phoneNumber });
                                                        actions.setStatus({serverSuccess: 'Code has been resent'})
                                                    })
                                                    .catch(err => {
                                                        actions.setStatus({ serverError: err.message });
                                                        actions.setSubmitting(false);
                                                    });
                                            }
                                            
                                        }}
                                        render={(props) => (
                                            <form onSubmit={props.handleSubmit}>
                                                {props.status && props.status.serverError && (
                                                    <div className="box has-background-danger has-text-white">
                                                        {props.status.serverError}
                                                    </div>
                                                )}

                                                {props.status && props.status.serverSuccess && (
                                                    <div className="box has-background-success has-text-white">
                                                        {props.status.serverSuccess}
                                                    </div>
                                                )}

                                                <SimpleTextInputField
                                                    props={props}
                                                    name="shortCode"
                                                    icon="fas fa-mobile-alt"
                                                    label="Please enter the code you were texted."
                                                    placeholder="1234567"
                                                />                                                

                                                <div className="field is-grouped">
                                                    <p className="control">
                                                        <button type="submit"
                                                            className={"button is-primary " + (props.isSubmitting ? 'is-loading' : '')}
                                                            onClick={() => {
                                                                props.setFieldValue('action','confirm');
                                                                props.submitForm();
                                                            }}
                                                        >
                                                            Confirm
                                                        </button>
                                                    </p>
                                                    <p className="control">
                                                        <button type="submit"                                                        
                                                            className={"button is-primary " + (props.isSubmitting ? 'is-loading' : '')}
                                                            onClick={() => {
                                                                props.setFieldValue('action','resend');
                                                                props.submitForm();
                                                            }}
                                                        >
                                                            Resend Code
                                                        </button>
                                                    </p>
                                                    
                                                </div>
                                                <div className="field">
                                                    <a onClick={this.reenterPhone}
                                                        className="is-link is-secondary">
                                                        Re-Enter Phone Number
                                                    </a>
                                                </div>
                                                {process.env.DEBUG && (
                                                    <div className="field">
                                                    DEBUG IS ON: You can enter '0000000' as the confirmation code.
                                                    </div>
                                                )}                                                
                                            </form>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                    </React.Fragment>
                )}
            </Subscribe>
        );
    }
}
export default Login;

