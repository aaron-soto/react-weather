import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { GrLocation } from 'react-icons/gr';

function App() {
	const [weatherObj, setWeatherObj] = useState();
	const [searchTerm, setSearchTerm] = useState('phoenix');
	const [chartDay, setChartDay] = useState();
	const [degreeType, setDegreeType] = useState('F');
	const [autocompleteTerm, setAutocompleteTerm] = useState('');
	const [autocompleteResults, setAutocompleteResults] = useState([]);
	const forecastURL = 'http://api.weatherapi.com/v1/forecast.json?key=';
	const searchURL = 'http://api.weatherapi.com/v1/search.json?key=';

	useEffect(() => {
		getWeather(searchTerm);
	}, []);

	// useEffect(() => {
	// 	getWeather();
	// }, [searchTerm]);

	const getWeather = (term) => {
		axios
			.get(
				forecastURL +
					process.env.REACT_APP_WEATHER_API_KEY +
					'&q=' +
					term +
					'&days=4&aqi=no&alerts=no'
			)
			.then((resp) => {
				setWeatherObj(resp.data);
				setChartDay(resp.data.forecast.forecastday[0]);
				// console.log(resp.data);
			});
	};

	const toggleDegrees = () => {
		if (degreeType === 'F') {
			setDegreeType('C');
		} else {
			setDegreeType('F');
		}
	};

	const searchLocations = (e) => {
		setAutocompleteTerm(e.target.value);
		axios
			.get(
				searchURL +
					process.env.REACT_APP_WEATHER_API_KEY +
					'&q=' +
					e.target.value
			)
			.then((resp) => {
				// setWeatherObj(resp.data);
				// setChartDay(resp.data.forecast.forecastday[0]);
				setAutocompleteResults(resp.data);
				console.log(resp.data);
			});
	};

	return (
		weatherObj && (
			<>
				<div className='container location-input-wrapper'>
					<div className='input-wrapper'>
						<input
							type='text'
							value={autocompleteTerm}
							autocomplete='off'
							placeholder='Start Typing A City ...'
							onChange={(e) => searchLocations(e)}
						/>
						{autocompleteResults && (
							<ul className='search-results'>
								{autocompleteResults.map((result) => {
									return (
										<li
											onClick={(e) => {
												setSearchTerm(result.name);
												setAutocompleteTerm('');
												setAutocompleteResults([]);
												getWeather(result.name);
											}}
										>
											{result.name}, {result.region} - {result.country}
										</li>
									);
								})}
							</ul>
						)}
						<ul></ul>
					</div>
					{/* <button>Change Location</button> */}
				</div>

				<div className='container weather-card'>
					<div className='current'>
						<h2>{moment(weatherObj.location.localtime).format('dddd')}</h2>
						<h3>
							{moment(weatherObj.location.localtime).format('DD MMM YYYY')}
						</h3>
						<div className='location'>
							<GrLocation /> {weatherObj.location.name},{' '}
							{weatherObj.location.region}
						</div>
						<img
							className='weather-icon'
							src={weatherObj.current.condition.icon}
						></img>
						<p className='temp' onClick={toggleDegrees}>
							{degreeType === 'F'
								? `${Math.round(weatherObj.current.temp_f)}° ${degreeType}`
								: `${Math.round(weatherObj.current.temp_c)}° ${degreeType}`}
						</p>
						<span className='hint'>click to change between °F and °C</span>
						<p>{weatherObj.current.condition.text}</p>
					</div>

					<div className='info'>
						<div className='info_row'>
							<h3>Today:</h3>
						</div>
						<div className='info_row'>
							<p>Feels Like:</p>
							<span>
								{degreeType === 'F'
									? `${Math.round(
											weatherObj.current.feelslike_f
									  )}° ${degreeType}`
									: `${Math.round(
											weatherObj.current.feelslike_c
									  )}° ${degreeType}`}
								{/* {weatherObj.current.feelslike_f}&deg; {degreeType} */}
							</span>
						</div>
						<div className='info_row'>
							<p>Humidity:</p>
							<span>{weatherObj.current.humidity}%</span>
						</div>
						<div className='info_row'>
							<p>Wind:</p>
							<span>{weatherObj.current.wind_mph} mph</span>
						</div>

						<div className='forecast-row'>
							{weatherObj.forecast.forecastday.map((day, idx) => {
								return (
									<div
										className='day'
										key={idx}
										onClick={(e) => {
											setChartDay(weatherObj.forecast.forecastday[idx]);
										}}
									>
										<img src={day.day.condition.icon} alt='' />
										<div className='date'>{moment(day.date).format('ddd')}</div>
										<div>
											{degreeType === 'F'
												? `${Math.round(day.day.maxtemp_f)}° ${degreeType}`
												: `${Math.round(day.day.maxtemp_c)}° ${degreeType}`}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
				{chartDay && (
					<div className='container temp-container'>
						<div className='temp-chart'>
							<p className='week-day'>{moment(chartDay.date).format('dddd')}</p>
							<div className='temp-bars'>
								{chartDay.hour.map((hour, idx) => {
									return (
										<div
											key={idx}
											className='hour-temp'
											style={{
												height: Math.round(hour.temp_f),
												backgroundColor: `${
													moment(weatherObj.location.localtime).format('HH') ==
													moment(hour.time).format('HH')
														? '#4895ef'
														: '#f1f1f1'
													// : '#4895ef'
												}`,
											}}
										>
											<span>
												{degreeType === 'F'
													? `${Math.round(hour.temp_f)}°`
													: `${Math.round(hour.temp_c)}°`}
											</span>
										</div>
									);
								})}
							</div>
							<div className='temp-labels'>
								{weatherObj.forecast.forecastday[0].hour.map((hour, idx) => {
									return (
										<div key={idx}>{moment(hour.time).format('h:mm')}</div>
									);
								})}
							</div>
						</div>
					</div>
				)}
			</>
		)
	);
}

export default App;
