module.exports = api => {
	const isTest = api.env('test');

	if (isTest) {
		return {
			presets: [
				['@babel/preset-env'],
				['@babel/preset-react']
			]
		};
	}
	return {
		presets: [
			['@babel/preset-react'],
		],
	};
};