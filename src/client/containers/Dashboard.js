import React, { Component } from 'react';
import AuthenticatedRoute from '../components/AuthenticatedRoute';

/**
 * Dashboard page.  Entrypoint for post login.
 */
export default () => (
    <AuthenticatedRoute>
        <div>
            Placeholder for Dashboard an authenticated route.
        </div>
    </AuthenticatedRoute>
);