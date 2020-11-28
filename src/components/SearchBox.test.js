import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';

import SearchBox from './SearchBox';
import { store } from '../globalHook';

jest.mock('../actions/getLocations');
import getLocations from '../actions/getLocations';

jest.mock('../actions/getWeather');
import getWeather from '../actions/getWeather';

configure({ adapter: new Adapter() });

describe('<SearchBox />', () => {
	let wrapper, addEvents = {}, removeEvents = {}, cleanupFunc;

	document.addEventListener = jest.fn((event, cb) => {
		addEvents[event] = cb;
	});

	document.removeEventListener = jest.fn((event, cb) => {
		removeEvents[event] = cb;
	});

	beforeAll(() => {
		getLocations.mockImplementation(() => {
			store.setState({
				suggests: [
					{
						'title': 'San Francisco',
						'location_type': 'City',
						'woeid': 2487956,
						'latt_long': '37.777119, -122.41964'
					},
					{
						'title': 'Philadelphia',
						'location_type': 'City',
						'woeid': 2471217,
						'latt_long': '39.952271,-75.162369'
					},
				]
			});
		});
		getWeather.mockImplementation(() => { });

		jest.spyOn(React, 'useEffect').mockImplementation(f => cleanupFunc = f());
	});

	it('must render only input with empty store', () => {
		wrapper = shallow(<SearchBox />);

		expect(wrapper.find('div')).toHaveLength(1);
		expect(wrapper.find('input')).toHaveLength(1);
		expect(wrapper.find('ul')).toHaveLength(0);
		expect(wrapper.find('li')).toHaveLength(0);
	});

	it('must call getLocations on clicking on container', () => {
		wrapper.find('.container').simulate('click', { target: { nodeName: 'INPUT', value: '' } });
		expect(getLocations).toHaveBeenCalledWith(store, '');
	});

	it('must call getLocations on input change', () => {
		wrapper.update();

		wrapper.find('input').simulate('change', { target: { value: 'Saigon' } });
		expect(getLocations).toHaveBeenCalledWith(store, 'Saigon');
	});

	it('must call getWeather on clicking on li', () => {
		wrapper.update();

		wrapper.find('.container').simulate('click', { target: { dataset: { id: '123' } } });
		expect(getWeather).toHaveBeenCalledWith(store, '123');
	});

	it('must not render items after hitting ESC key', () => {
		addEvents.keydown({ keyCode: 27 });

		wrapper.update();

		expect(wrapper.find('.container')).toHaveLength(1);
		expect(wrapper.find('input')).toHaveLength(1);
		expect(wrapper.find('ul')).toHaveLength(0);
		expect(wrapper.find('li')).toHaveLength(0);
	});

	it('must render items after clicking on input', () => {
		wrapper.find('.container').simulate('click', { target: { nodeName: 'INPUT', value: '' } });

		wrapper.update();

		expect(wrapper.find('ul')).toHaveLength(1);
		expect(wrapper.find('li:first-child').text()).toBe('San Francisco');
		expect(wrapper.find('li:last-child').text()).toBe('Philadelphia');
	});

	it('must not render items after clicking outside', () => {
		addEvents.click({ target: { nodeName: 'BODY', dataset: {} } });

		wrapper.update();

		expect(wrapper.find('.container')).toHaveLength(1);
		expect(wrapper.find('input')).toHaveLength(1);
		expect(wrapper.find('ul')).toHaveLength(0);
		expect(wrapper.find('li')).toHaveLength(0);

	});
	
	it('should remove event listeners when unmount', () => {
		cleanupFunc();
		
		expect(removeEvents).toMatchObject(addEvents);
	});
});
