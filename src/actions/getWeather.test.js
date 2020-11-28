import getWeather from './getWeather';
import { store } from '../globalHook';
import 'regenerator-runtime';

const data = {
	consolidated_weather: [
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
};

global.fetch = jest.fn(() =>
	Promise.resolve({
		json: () => Promise.resolve(data),
	})
);

const flushPromises = () => new Promise(setImmediate);

describe('getWeather tests', () => {

	it('should set weather states to global store with correct results', async () => {
		getWeather(store, '123456');

		await flushPromises();

		expect(store.state.weather).toMatchObject(data.consolidated_weather);
	});

	it('should save [] to global store if fetch fails', async () => {
		// Reset states in global store to run another test
		store.state = {};

		fetch.mockImplementationOnce(() => Promise.reject('Something is wrong'));
		getWeather(store, '123456');

		await flushPromises();

		expect(store.state.weather).toMatchObject([]);
	});
});