import React from 'react';
import { shallow } from 'enzyme';

// Components
import App from './App';
import {BrowserRouter} from 'react-router-dom';

function setup() {
    const wrapper = shallow(<App/>);
    return { wrapper };
}

describe.skip('App Test Suite', () => {
    it('should render', () => {
        const { wrapper } = setup();
        expect(wrapper.find('NavBar').exists()).toBe(true);
    });
});
