const baseAPI = process.env.NODE_ENV === 'production'
	? 'https://asia-east2-confetti-faca0.cloudfunctions.net/question' : '';


const getWeather = (store, props) => {
	if (props) {
		fetch(`${baseAPI}/api/location/?id=${props}`)
			.then(e => e.json())
			.then(results => store.setState({ weather: results.consolidated_weather }))
			.catch(e => {
				store.setState({ weather: [] });

				if (process.env.NODE_ENV === 'development') {
					console.error(e);
				}
			});
	}
};

export default getWeather;
