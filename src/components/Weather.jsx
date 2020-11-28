import React from 'react';
import connectGlobal from '../globalHook';
import styles from './weather.css';

const baseAPI = process.env.NODE_ENV === 'production'
	? 'https://asia-east2-confetti-faca0.cloudfunctions.net/question' : '';

const Weather = () => {
	const [state] = connectGlobal(['weather'], null);
	const { weather } = state;

	if (!weather) {
		return null;
	}

	return (
		<div className={styles.container}>
			{weather.map(item => (
				<div key={item.id} className={styles.weatherItem}>
					<img src={`${baseAPI}/static/img/weather/png/64/${item.weather_state_abbr}.png`} />
					<div className={styles.minTemp}>Min: {Math.floor(item.min_temp)}°C</div>
					<div className={styles.maxTemp}>Max: {Math.floor(item.max_temp)}°C</div>
					<div>{item.applicable_date}</div>
				</div>
			))}
		</div>
	);
};

export default Weather;
