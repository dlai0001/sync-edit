import React, { Component } from 'react';

import { Columns, Button } from 'react-bulma-components/full';

import './app.css';
import ReactImage from './react.png';

export default class App extends Component {
    state = { username: null };

    componentDidMount() {
        fetch('/api/getUsername')
            .then(res => res.json())
            .then(user => this.setState({ username: user.username }));
    }

    render() {
        const { username } = this.state;
        return (
            <div>
                {username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1>}
                <img src={ReactImage} alt="react" />
                <Columns>
                    <Columns.Column>
                        First Column
                    </Columns.Column>
                    <Columns.Column>
                        Second Column
                    </Columns.Column>
                    <Columns.Column>
                        Third Column
                    </Columns.Column>
                    <Columns.Column>
                        <Button color="primary">
                            Button
                        </Button>
                    </Columns.Column>
                </Columns>
            </div>
        );
    }
}
