import styles from './app.module.css';
import WeatherWidget from './components/WeatherWidget/WeatherWidget';

function App() {
	return (
		<div className='App'>
			<section id={styles.weatherSection}>
				<WeatherWidget />
			</section>
		</div>
	);
}

export default App;
