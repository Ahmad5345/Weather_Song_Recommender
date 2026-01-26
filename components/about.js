import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable
} from 'react-native';
import * as Location from 'expo-location';
import getWeather from '../services/weather-api';

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('Current Location');

  useEffect(() => {
    const fetchWeatherWithLocation = async () => {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          throw new Error('Location permission denied');
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });

        const { latitude, longitude } = location.coords;

        const weatherData = await getWeather(latitude, longitude);
        setWeather(weatherData);

        const reverseGeocode =
          await Location.reverseGeocodeAsync({
            latitude,
            longitude
          });

        if (reverseGeocode.length > 0) {
          const { city, region } = reverseGeocode[0];
          setLocationName(`${city}, ${region}`);
        }
      } catch (err) {
        setError('Failed to load weather or location');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherWithLocation();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  const isRaining =
    (weather.current.rain && weather.current.rain > 0) ||
    (weather.current.weathercode >= 61 &&
      weather.current.weathercode <= 67);

  const isSnowing =
    (weather.current.snowfall && weather.current.snowfall > 0) ||
    (weather.current.weathercode >= 71 &&
      weather.current.weathercode <= 77) ||
    (weather.current.weathercode >= 85 &&
      weather.current.weathercode <= 86);

  const precipitationText = isSnowing
    ? 'Snowing'
    : isRaining
    ? 'Raining'
    : 'Clear';

  return (
    <View style={styles.card}>
      <Text style={styles.location}>{locationName}</Text>

      <Text style={styles.temperature}>
        {weather.current.temperature_2m}°
      </Text>

      <Text style={styles.feelsLike}>
        Feels like {weather.current.apparent_temperature}°
      </Text>

      <View style={styles.stats}>
        <View style={styles.statRow}>
          <Text style={styles.label}>Wind</Text>
          <Text style={styles.value}>
            {weather.current.wind_speed_10m} km/h
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.label}>Tomorrow</Text>
          <Text style={styles.value}>
            {weather.daily.temperature_2m_max[1]}°
          </Text>
        </View>
      </View>

      <View style={styles.badgeContainer}>
        <Text
          style={[
            styles.badge,
            isSnowing && styles.snowBadge,
            !isSnowing && isRaining && styles.rainBadge,
            !isSnowing && !isRaining && styles.clearBadge
          ]}
        >
          {precipitationText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    marginTop: 60,
  },
  card: {
    marginHorizontal: 20,
    marginTop: 90,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#1c1c1e',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  location: {
    fontSize: 15,
    fontWeight: '600',
    color: '#a1a1a6',
    marginBottom: 6,
  },
  temperature: {
    fontSize: 64,
    fontWeight: '700',
    color: '#ffffff',
  },
  feelsLike: {
    fontSize: 14,
    color: '#a1a1a6',
    marginBottom: 20,
  },
  stats: {
    borderTopWidth: 1,
    borderTopColor: '#2c2c2e',
    paddingTop: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#a1a1a6',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  badgeContainer: {
    marginTop: 18,
    alignItems: 'flex-start',
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    fontSize: 13,
    fontWeight: '600',
  },
  rainBadge: {
    backgroundColor: '#2f95dc',
    color: '#ffffff',
  },
  snowBadge: {
    backgroundColor: '#8e8e93',
    color: '#ffffff',
  },
  clearBadge: {
    backgroundColor: '#30d158',
    color: '#1c1c1e',
  },
  button: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#0a84ff',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    marginTop: 60,
    textAlign: 'center',
    color: '#ff453a',
  },
});

export default WeatherCard;