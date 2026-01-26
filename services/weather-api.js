import axios from 'axios';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

const getWeather = async (lat, lon) => {
  const params = {
    latitude: lat,
    longitude: lon,
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'weather_code',
      'wind_speed_10m'
    ].join(','),
    hourly: 'temperature_2m',
    daily: 'temperature_2m_max,temperature_2m_min',
    timezone: 'auto'
  };

  try {
    const response = await axios.get(OPEN_METEO_URL, { params });
    return response.data;
  } catch (error) {
    console.error('open-meteo api error:', error.message);
    throw error;
  }
};

export default getWeather;
