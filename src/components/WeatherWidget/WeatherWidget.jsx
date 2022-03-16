import * as React from 'react';
import styles from './weatherWidget.module.css';
import cardStyles from '../WidgetCard/widgetCard.module.css';
import WidgetCard from '../WidgetCard/WidgetCard';
import useWeatherData from '../../hooks/useWeatherData';
import FeedbackMessage from './FeedbackMessage';

const LAT = 50.4501;
const LON = 30.5234;
const EXCLUDE = 'minutely,hourly,alerts,current';
const UNITS = 'imperial';
const LANG = 'en';
const APPID = process.env.REACT_APP_FIVE_DAY_FORECAST;
const PATH = `https://api.openweathermap.org/data/2.5/onecall?lat=${LAT}&lon=${LON}&exclude=${EXCLUDE}&units=${UNITS}&lang=${LANG}&appid=${APPID}`;

export default function WeatherWidget() {
	const numDays = 5;

	const fetchWeatherData = async () => {
		const res = await fetch(PATH);
		if (!res.ok) {
			const result = await res.json();
			throw new Error(`HTTP error! Status: ${res.status}. ${result.message}`);
		}
		return res.json();
	};

	const { status, data, error, run } = useWeatherData(
		fetchWeatherData,
		numDays
	);

	React.useEffect(() => {
		run(fetchWeatherData, numDays);
	}, [run]);

	return (
		<div id={styles.weatherWidget}>
			{status === 'idle' ? (
				<FeedbackMessage
					title='Weather Widget Idle..'
					message="Please check to make sure you've provided a callback function to the
				useFormatWeather hook."
				/>
			) : status === 'resolved' ? (
				data.map((el, i, arr) => {
					const day = el.day.slice(0, 4);
					const iconUrl = `http://openweathermap.org/img/wn/${el.weather.icon}@2x.png`;

					return (
						<WidgetCard key={i} i={i}>
							<h2 className={cardStyles.cardHeader}>{day}</h2>
							<img
								className={cardStyles.cardImage}
								alt='weather icon'
								src={iconUrl}
							/>
							<div className={cardStyles.tempWrapper}>
								<h2 className={cardStyles.lowTemp}>{`${Math.round(
									el.lowTemp
								)}°`}</h2>
								<h2 className={cardStyles.highTemp}>{`${Math.round(
									el.highTemp
								)}°`}</h2>
							</div>
						</WidgetCard>
					);
				})
			) : status === 'pending' ? (
				<FeedbackMessage title='Loading' />
			) : status === 'rejected' ? (
				<div>
					<FeedbackMessage
						title="We're sorry, something went wrong:"
						message={error.message}
					/>
				</div>
			) : null}
		</div>
	);
}
