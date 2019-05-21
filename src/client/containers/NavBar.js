import React from 'react';
import {Subscribe} from 'unstated';
import {withRouter} from 'react-router-dom';

import logo from '../assets/logo.png';
import './NavBar.css';

import AuthContainer from '../state-containers/AuthContainer';

class NavBar extends React.Component {
    state = { open: false };

    componentDidMount() {
        this.setState({ open: false });
    }

    toggle = () => {
        this.setState({
            open: !this.state.open,
            loggingOut: false,
        });
    }

    render() {
        return (
            <Subscribe to={[AuthContainer]}>
                {auth => (
                    <nav className="navbar main-nav" role="navigation" aria-label="main navigation">
                        <div className="navbar-brand">
                            <a className="navbar-item" href="/">
                                <img src={logo} />
                            </a>

                            <a role="button"
                                className={'navbar-burger ' + (this.state.open ? 'is-active' : '')}
                                data-target="navMenu" aria-label="menu"
                                aria-expanded="false"
                                onClick={this.toggle}>
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                            </a>
                        </div>
                        <div className={'navbar-menu ' + (this.state.open ? 'is-active' : '')}>                        
                            <div className="navbar-end">
                                {!auth.state.isAuthenticated && (
                                    <div className="navbar-item">
                                        <div className="buttons">
                                            <a href="/signup" className="button is-primary">
                                                <strong>Sign up</strong>
                                            </a>
                                            <a href="/login" className="button is-light">
                                                Log in
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {auth.state.isAuthenticated && (
                                    <div className={'navbar-item' + (auth.state.isAuthenticated?' is-active':'')}>
                                        <div className="buttons">
                                            <i className="fas fa-user"></i>&nbsp;
                                            {auth.state.userName} 
                                        </div>
                                    </div>
                                )}

                                {auth.state.isAuthenticated && (
                                    <div className="navbar-item">                                    
                                        <div className="buttons">                                            
                                            <a className="button is-light" onClick={auth.logout.bind(auth)}>
                                                Logout&nbsp;<i className="fas fa-sign-out-alt"></i>
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </nav>
                )}
            </Subscribe>
        );
    }
};

export default withRouter(NavBar);