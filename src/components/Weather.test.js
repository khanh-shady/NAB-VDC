import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';

import Weather from './Weather';
import { store } from '../globalHook';

configure({ adapter: new Adapter() });

describe('<Weather />', () => {
	let wrapper;

	beforeAll(() => {
		jest.spyOn(React, 'useEffect').mockImplementation(f => f());
	});

	it('must render null with empty store', () => {
		wrapper = shallow(<Weather />);

		expect(wrapper.getElement()).toBe(null);
	});

	it('must render weather forecast results with states from store', () => {
		store.setState({
			weather: [
				{
					'id': 5046010142261248,
					'weather_state_abbr': 'hr',
					'applicable_date': '2020-11-26',
					'min_temp': 12.055,
					'max_temp': 18.59,
				},
				{
					'id': 5443011317071872,
					'weather_state_abbr': 'lc',
					'applicable_date': '2020-11-27',
					'min_temp': 8.6,
					'max_temp': 14.925,
				}
			]
		});

		wrapper.update();

		expect(wrapper.find('.container')).toHaveLength(1);
		expect(wrapper.find('.weatherItem')).toHaveLength(2);

		expect(wrapper.find('.weatherItem:first-child img').prop('src')).toBe('/static/img/weather/png/64/hr.png');
		expect(wrapper.find('.weatherItem:first-child .minTemp').text()).toBe('Min: 12°C');
		expect(wrapper.find('.weatherItem:first-child .maxTemp').text()).toBe('Max: 18°C');
		expect(wrapper.find('.weatherItem:first-child div:last-child').text()).toBe('2020-11-26');

		expect(wrapper.find('.weatherItem:last-child img').prop('src')).toBe('/static/img/weather/png/64/lc.png');
		expect(wrapper.find('.weatherItem:last-child .minTemp').text()).toBe('Min: 8°C');
		expect(wrapper.find('.weatherItem:last-child .maxTemp').text()).toBe('Max: 14°C');
		expect(wrapper.find('.weatherItem:last-child div:last-child').text()).toBe('2020-11-27');
	});
});
