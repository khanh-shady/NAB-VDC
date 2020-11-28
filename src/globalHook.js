import React from 'react';
import getLocations from './actions/getLocations';
import getWeather from './actions/getWeather';

const deepCompare = (a, b) => {
	if (a && b && typeof a == 'object' && typeof b == 'object') {
		if (Object.keys(a).length != Object.keys(b).length) {
			return false;
		}

		for (let key in a) {
			if (!deepCompare(a[key], b[key])) {
				return false;
			}
		}

		return true;
	}

	return a === b;
};

const deepClone = inObject => {
	if (typeof inObject !== 'object' || inObject === null) {
		return inObject;
	}

	let outObject, value, key;

	outObject = Array.isArray(inObject) ? [] : {};

	for (key in inObject) {
		value = inObject[key];

		outObject[key] = deepClone(value);
	}

	return outObject;
};

function setState(store, newState, afterUpdateCallback) {
	store.state = { ...store.state, ...newState };

	store.listeners.forEach(listener => {
		listener.run(store.state);
	});

	if (afterUpdateCallback && typeof afterUpdateCallback === 'function') {
		afterUpdateCallback();
	}
}

function useCustom(store, React, mapState, mapActions) {
	const [, originalHook] = React.useState(Object.create(null));
	const state = mapState ? mapState(store.state) : null;
	const actions = mapActions ? mapActions(store.actions) : null;

	React.useEffect(() => {
		if (state) {
			const listener = { oldState: state };

			listener.run = newState => {
				const mappedState = mapState(newState);
				if (!deepCompare(mappedState, listener.oldState)) {
					listener.oldState = deepClone(mappedState);
					originalHook(mappedState);
				}
			};

			store.listeners.push(listener);
		}
	}, []);

	return [state, actions];
}

function associateActions(store, actions) {
	const associatedActions = {};

	Object.keys(actions).forEach(key => {
		associatedActions[key] = actions[key].bind(null, store);
	});

	return associatedActions;
}

let store;

const useStore = (React, actions) => {
	store = { state: {}, listeners: [] };

	store.setState = setState.bind(null, store);
	store.actions = associateActions(store, actions);

	return useCustom.bind(null, store, React);
};

const actions = { getLocations, getWeather };
const useGlobal = useStore(React, actions);

export { store };

export default function connectGlobal(state, actions) {
	return useGlobal(globalState => {
		const connectedState = {};

		for (const s of state || []) {
			connectedState[s] = globalState[s];
		}

		return connectedState;
	}, globalActions => {
		const connectedActions = {};

		for (const s of actions || []) {
			connectedActions[s.name || s] = globalActions[s.name || s];
		}

		return connectedActions;
	});
}
