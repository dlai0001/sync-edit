import React, { Component } from 'react';

import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

const client = new ApolloClient();

import './Home.css';

/**
 * Home - Entry point for unauthenticated.
 */
export default class Home extends Component {
    state = { username: null };

    async componentDidMount() {
        const query = `{
            username
          }`

        //const data = await request('/graphql', query);
        try {
            const response = await client.query({
                query: gql`
                    query {
                        username
                    }                  
                `,
            });
            this.setState({ username: response.data.username });
        } catch (err) {
            console.error(err);
            this.setState({ username: 'unavailable' })
        }
    }

    render() {
        const { username } = this.state;
        return (
            <React.Fragment>
                <section className="hero is-primary is-large has-bg-img">
                    <div className="hero-body">
                        <div className="container home-title">
                            <h1 className="title">
                                <i className="fas fa-mortar-pestle"></i>&nbsp;
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
