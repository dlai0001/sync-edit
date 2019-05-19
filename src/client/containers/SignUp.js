import React from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { Subscribe } from 'unstated';
import {Redirect} from 'react-router-dom';

import AuthContainer from '../state-containers/AuthContainer';
import SimpleTextInputField from '../components/SimpleTextInputField';

/**
 * Form validator
 */
const SignupSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    pin: Yup.string()
        .matches(/^[0-9]+$/, 'Pin must be numeric.')
        .min(4, 'Too Short!')
        .max(10, 'Too Long!')
        .required('Required'),
    phoneNumber: Yup.string()
        .matches(/^[0-9\+\-., ()]{6,}$/, 'Invalid phone number format.')
        .required('Required'),
});

/**
 * Signup page
 */
export default () => (
    <Subscribe to={[AuthContainer]}>
        {auth => (
            <div className="container">
                { auth.state.isAuthenticated && (
                    //Redirect to dashboard when registration successful and we get authenticated.
                    <Redirect to="/dashboard"></Redirect>
                )}
                <div className="column">
                    <h1 className="title">Recipe Sync - Sign Up!</h1>
                    <Formik
                        initialValues={{ name: '', pin: '', phoneNumber: '' }}
                        validationSchema={SignupSchema}
                        onSubmit={ (values, actions) => {                            
                            // auth.register(values)
                            // .then(() => {
                            //     actions.setSubmitting(false);
                            // })
                            // .catch(err => {
                            //     actions.setStatus({serverError: err.message});
                            //     actions.setSubmitting(false);
                            // });
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
                                    name="name"
                                    icon="fas fa-id-card"
                                    label="Name"
                                    placeholder="John Smith"
                                />

                                <SimpleTextInputField
                                    props={props}
                                    name="pin"
                                    icon="fas fa-unlock"
                                    label="PIN code"
                                    placeholder="1234"
                                />

                                <SimpleTextInputField
                                    props={props}
                                    name="phoneNumber"
                                    icon="fas fa-mobile-alt"
                                    label="Phone Number"
                                    placeholder="+1-555-555-5555"
                                />

                                <div className="field">
                                    <button type="submit" 
                                    className={"button is-primary " + (props.isSubmitting?'is-loading':'')}>
                                        Register
                                    </button>
                                </div>
                            </form>
                        )}
                    />
                </div>
            </div>
        )}
    </Subscribe>
);

