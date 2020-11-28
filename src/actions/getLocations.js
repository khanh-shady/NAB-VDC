const baseAPI = process.env.NODE_ENV === 'production'
	? 'https://asia-east2-confetti-faca0.cloudfunctions.net/question' : '';

const getLocations = (store, props) => {
	if (props) {
		fetch(`${baseAPI}/api/location/search/?query=${props}`)
			.then(e => e.json())
			.then(results => store.setState({ suggests: results }))
			.catch(e => {
				store.setState({ suggests: [] });
	
				if (process.env.NODE_ENV === 'development') {
					console.error(e);
				}
			});
	}
};

export default getLocations;
