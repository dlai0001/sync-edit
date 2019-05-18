import React, { Component } from 'react';

import { request } from 'graphql-request'

import './Home.css';

export default class App extends Component {
    state = { username: null };

    async componentDidMount() {
        const query = `{
            username
          }`

        const data = await request('/graphql', query);
        this.setState({ username: data.username });
    }

    render() {
        const { username } = this.state;
        return (
            <React.Fragment>
                <section className="hero is-primary is-large has-bg-img">
                    <div className="hero-body">
                        <div className="container home-title">
                            <h1 className="title">
                                Recipe Sync
                            </h1>
                            <h2 className="subtitle">
                                A collaborative Recipe Sharing built with React and GraphQL
                            </h2>                            
                        </div>
                    </div>
                </section>

                <footer>                    
                    <div className="columns is-mobile is-centered">
                        <div className="column">
                            <p className="bd-notification has-text-centered has-text-weight-light">
                                Running on {username}
                            </p>
                        </div>
                    </div>
                </footer>
            </React.Fragment>
        );
    }
}
