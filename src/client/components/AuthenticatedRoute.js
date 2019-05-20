import React from 'react';
import AuthContainer from '../state-containers/AuthContainer';
import { Subscribe } from 'unstated';
import { Redirect } from 'react-router-dom';

const LOGIN_ROUTE = '/login'

export default () => (
    <Subscribe to={[AuthContainer]}>
        {auth => (
            auth.state.isAuthenticated ? this.props.children : <Redirect to={LOGIN_ROUTE}/>
        )}
    </Subscribe>
);