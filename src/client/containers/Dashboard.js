import React, { Component } from 'react';
import AuthenticatedRoute from '../components/AuthenticatedRoute';

/**
 * Dashboard page.  Entrypoint for post login.
 */
export default () => (
    <AuthenticatedRoute>
        <div className="container">
            <div className="column">
                <h1>Coming Soon...</h1>
                <div>
                    More fun things will be arriving into this authenticated route.
                </div>
            </div>

        </div>
    </AuthenticatedRoute>
);