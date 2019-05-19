import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'unstated';

import AuthContainer from './state-containers/AuthContainer';

const auth = new AuthContainer();

const containers = [
    auth,
]

ReactDOM.render(
    <BrowserRouter>
        <Provider inject={containers}>
            <App />
        </Provider>        
    </BrowserRouter>,
    document.getElementById('root'));
