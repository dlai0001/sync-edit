import React from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    pin: Yup.string()
        .matches(/[0-9]+/, 'Pin must be numeric.')
        .min(4, 'Too Short!')
        .max(10, 'Too Long!')        
        .required('Required'),
    phoneNumber: Yup.string()
        .matches(/[0-9\+\-., ()]{6,}/, 'Invalid phone number format.')
        .required('Required'),
});


export default () => (
    <div className="container">
        <div className="column">
            <h1 className="title">Recipe Sync - Sign Up!</h1>            
            <Formik
                initialValues={{ name: '', pin: '', phoneNumber: '' }}
                validationSchema={SignupSchema}
                onSubmit={(values, actions) => {
                    debugger;
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        actions.setSubmitting(false);
                    }, 1000);
                }}
                render={(props) => (
                    <form onSubmit={props.handleSubmit}>                        
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control has-icons-left">
                                <Field type="text"
                                    className="input"
                                    placeholder="John Smith"
                                    name="name" />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-id-card"></i>
                                </span>                                
                            </div>

                            <p className="help is-danger">
                                {props.errors.name && props.touched.name && props.errors.name}&nbsp;
                            </p>
                        </div>

                        <div className="field">
                            <label className="label">PIN</label>
                            <div className="control has-icons-left">
                                <Field type="text"
                                    className="input"
                                    placeholder="1234"
                                    name="pin" />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-unlock"></i>
                                </span>
                            </div>

                            <p className="help is-danger">
                                {props.errors.pin && props.touched.pin && props.errors.pin}&nbsp;
                            </p>
                        </div>

                        <div className="field">
                            <label className="label">Phone Number</label>
                            <div className="control has-icons-left">
                                <Field type="tel" className="input" placeholder="+1-555-555-5555" name="phoneNumber" />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-mobile-alt"></i>
                                </span>
                            </div>

                            <p className="help is-danger">
                                {props.errors.phoneNumber && props.touched.phoneNumber && props.errors.phoneNumber}&nbsp;
                            </p>
                        </div>


                        <div className="field">
                            <button type="submit" className="button is-primary">
                                Register
                            </button>
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                )}
            />
        </div>
    </div>
);
