import React from 'react';

import {Switch, Route} from 'react-router-dom';

import NavBar from './containers/NavBar';

import Home from './containers/Home';
import SignUp from './containers/SignUp';
import NotFound from './containers/NotFound';
import Dashboard from './containers/Dashboard';
import Login from './containers/Login';

export default () => (    
    <React.Fragment>
        <NavBar/>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/signup" component={SignUp}/>
            <Route path="/dashboard" component={Dashboard}/>
            <Route path="/login" component={Login}/>
            <Route component={NotFound}/>
        </Switch>
    </React.Fragment>
);