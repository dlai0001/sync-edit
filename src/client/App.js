import React, { Component } from 'react';

import {Switch, Route} from 'react-router-dom';

import Home from './containers/Home';
import NotFound from './containers/NotFound';
import NavBar from './containers/NavBar';
export default () => (    
    <React.Fragment>
        <NavBar/>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route component={NotFound}/>
        </Switch>
    </React.Fragment>
);