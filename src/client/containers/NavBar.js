import React from 'react';

import logo from '../assets/logo.png';
import './NavBar.css';

export default class NavBar extends React.Component {
    state = { open: false };

    componentDidMount() {
        this.setState({ open: false });
    }

    toggle = () => {
        this.setState({
            open: !this.state.open,
        });
    }

    render() {
        return (
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
                        <div className="navbar-item">
                            <div className="buttons">
                                <a href="/signup" className="button is-primary">
                                    <strong>Sign up</strong>
                                </a>
                                <a className="button is-light">
                                    Log in
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
};
