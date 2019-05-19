import React from 'react';
import {Field} from 'formik';

/**
 * Simple form text input with Bulma styling and error display.
 * @param {Object} params
 * @param {String} params.props Form props from <Formik> form.
 * @param {String} params.name name of this property
 * @param {String} params.icon font awesome icon to use.
 * @param {String} params.label label for this field
 * @param {String} params.placeholder place holder text.
 */
export default ({ props, name, icon, label, placeholder }) => (
    <div className="field">
        <label className="label">{label}</label>
        <div className="control has-icons-left">
            <Field type="tel" className="input" placeholder={placeholder} name={name} />
            <span className="icon is-small is-left">
                <i className={icon}></i>
            </span>
        </div>

        <p className="help is-danger">
            {props.errors[name] && props.touched[name] && props.errors[name]}&nbsp;
        </p>
    </div>
);
