import React from 'react';
import SearchBox from './SearchBox.jsx';
import Weather from './Weather.jsx';
import styles from './app.css';

const App = () => {
	return (
		<div className={styles.app}>
			<h1>Weather forecast</h1>
			<SearchBox />
			<Weather />
		</div>
	);
};

export default App;
