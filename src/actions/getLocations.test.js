import getLocations from './getLocations';
import { store } from '../globalHook';
import 'regenerator-runtime';

const data = [
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
	}
];

global.fetch = jest.fn(() =>
	Promise.resolve({
		json: () => Promise.resolve(data),
	})
);

const flushPromises = () => new Promise(setImmediate);

describe('getLocations tests', () => {

	it('should set suggest states to global store with correct results', async () => {
		getLocations(store, 'Sai Gon');

		await flushPromises();

		expect(store.state.suggests).toMatchObject(data);
	});

	it('should save [] to global store if fetch fails', async () => {
		// Reset states in global store to run another test
		store.state = {};

		fetch.mockImplementationOnce(() => Promise.reject('Something is wrong'));
		getLocations(store, 'Sai Gon');

		await flushPromises();

		expect(store.state.suggests).toMatchObject([]);
	});
});