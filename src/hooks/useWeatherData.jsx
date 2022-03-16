import * as React from 'react';

const addDay = (day) => {
	// get the date for the specified 'day'
	const currDate = new Date();
	const futureDate = new Date(currDate);
	futureDate.setDate(futureDate.getDate() + day);
	return futureDate.toDateString();
};

const formatDays = (numDays, data) => {
	let dayInfo = [];

	data.map((el, i, arr) => {
		if (numDays > arr.length) {
			throw new Error(
				`This free API version only allows up to ${arr.length} day forecast.
				If you need to forecast more days, please visit https://openweathermap.org/price`
			);
		} else if (numDays > i) {
			dayInfo.push({
				day: addDay(i),
				weather: { ...el.weather[0] },
				lowTemp: el.temp.min,
				highTemp: el.temp.max,
			});
		}
		return null;
	});
	return dayInfo;
};

const reducerFunction = (state, action) => {
	switch (action.status) {
		case 'pending': {
			return { status: 'pending', data: null, error: null };
		}
		case 'resolved': {
			return { status: 'resolved', data: action.data, error: null };
		}
		case 'rejected': {
			return { status: 'rejected', data: null, error: action.error };
		}
		default: {
			throw new Error(`Unhandled action status: ${action.status}`);
		}
	}
};

export default function useWeatherData(fetchWeatherData, initialState = {}) {
	const [state, dispatch] = React.useReducer(reducerFunction, {
		status: 'idle',
		data: null,
		error: null,
		...initialState,
	});

	const { status, data, error } = state;

	const run = React.useCallback((fetchPromise, numDays = 5) => {
		fetchPromise()
			.then((data) => formatDays(numDays, data.daily))
			.then((formattedData) => {
				dispatch({
					status: 'resolved',
					data: formattedData,
				});
			})
			.catch((error) => {
				dispatch({
					status: 'rejected',
					data: null,
					error: error,
				});
			});
	}, []);

	return {
		status,
		data,
		error,
		run,
	};
}
