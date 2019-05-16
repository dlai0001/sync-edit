import React from 'react';
import { shallow } from 'enzyme';

// Components
import App from './App';

function setup() {  
  const wrapper = shallow(<App />);
  return { wrapper };
}

describe('App Test Suite', () => {
  it('should render', () => {
    const { wrapper } = setup();
    expect(wrapper.find('div').exists()).toBe(true);
  });
});