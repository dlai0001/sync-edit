import React from 'react';
import { shallow } from 'enzyme';

// Components
import App from './App';
import {BrowserRouter} from 'react-router-dom';

function setup() {
    const wrapper = shallow(<BrowserRouter><App/></BrowserRouter>);
    return { wrapper };
}

describe('App Test Suite', () => {
    it('should render', () => {
        const { wrapper } = setup();
        debugger;
        expect(wrapper.find('Router').exists()).toBe(true);
    });
});
