import React, { useState, useRef } from 'react';
import connectGlobal from '../globalHook';
import styles from './searchBox.css';

const SearchBox = () => {
	const [state, actions] = connectGlobal(['suggests'], ['getLocations', 'getWeather']);
	const { suggests = [] } = state;
	const { getLocations, getWeather } = actions;

	const inputRef = useRef(null);
	const [isFocused, setFocus] = useState(false);

	const handleOnClickOutside = e => {
		if (e.target.nodeName !== 'INPUT' && !e.target.dataset.id) {
			setFocus(false);
		}
	};

	const handleEscKey = e => {
		if (e.keyCode === 27) {
			setFocus(false);
		}
	};

	React.useEffect(() => {
		document.addEventListener('click', handleOnClickOutside, true);
		document.addEventListener('keydown', handleEscKey, true);

		return () => {
			document.removeEventListener('click', handleOnClickOutside, true);
			document.removeEventListener('keydown', handleEscKey, true);		
		};
	}, []);

	const handleOnChange = e => {
		getLocations(e.target.value);
	};

	const handleOnClick = e => {
		if (e.target.nodeName === 'INPUT') {
			if (!isFocused) {
				getLocations(e.target.value);
				setFocus(true);
			}

			return;
		}

		if (e.target.dataset.id) {
			if (inputRef.current) {
				inputRef.current.value = e.target.innerText;
			}

			getWeather(e.target.dataset.id);
			setFocus(false);
		}
	};

	const suggestBox = suggests.length > 0 && isFocused && (
		<ul>
			{suggests.map(item => (
				<li key={item.woeid} data-id={item.woeid}>{item.title}</li>
			))}
		</ul>
	);

	return (
		<div className={styles.container} onClick={e => handleOnClick(e)}>
			<input onChange={e => handleOnChange(e)} ref={inputRef} />
			{suggestBox}
		</div>
	);
};

export default SearchBox;
