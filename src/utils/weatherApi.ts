import {
  GeocodingLocation,
  WeatherData,
  CurrentWeather,
  DailyForecastItem,
  HourlyForecastItem,
} from '../types/weather';
import {
  celsiusToFahrenheit,
  getWindDirectionText,
  formatDateShort,
  getDayName,
} from './weatherCodes';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Search for cities using Open-Meteo Geocoding API
 */
export async function searchLocations(query: string): Promise<GeocodingLocation[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error('Please enter a city name to search.');
  }

  try {
    const response = await fetch(
      `${GEOCODING_API_URL}?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`
    );

    if (!response.ok) {
      throw new Error(`Geocoding search failed (HTTP ${response.status})`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '',
      elevation: item.elevation,
      timezone: item.timezone || 'auto',
    }));
  } catch (error: any) {
    if (error.message && error.message.includes('Please enter')) {
      throw error;
    }
    console.error('Location search error:', error);
    throw new Error('Unable to find location. Please check your connection and try again.');
  }
}

/**
 * Get Reverse Geocoding information for latitude and longitude
 */
export async function getReverseGeocoding(
  latitude: number,
  longitude: number
): Promise<GeocodingLocation> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    if (response.ok) {
      const data = await response.json();
      const cityName =
        data.locality || data.city || data.principalSubdivision || 'Current Location';
      const countryName = data.countryName || '';
      const countryCode = data.countryCode || '';
      const admin1 = data.principalSubdivision || '';

      return {
        id: Math.round(latitude * 1000 + longitude),
        name: cityName,
        latitude,
        longitude,
        country: countryName,
        countryCode,
        admin1,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
      };
    }
  } catch (e) {
    console.warn('Reverse geocoding failed, falling back to default name', e);
  }

  return {
    id: Math.round(latitude * 1000 + longitude),
    name: 'Current Location',
    latitude,
    longitude,
    country: '',
    countryCode: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
  };
}

/**
 * Fetch full weather data from Open-Meteo Forecast API
 */
export async function fetchWeatherData(location: GeocodingLocation): Promise<WeatherData> {
  const { latitude, longitude, timezone } = location;

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'visibility',
      'wind_speed_10m',
      'uv_index',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
    timezone: timezone || 'auto',
  });

  try {
    const response = await fetch(`${FORECAST_API_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Weather API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.current || !data.daily || !data.hourly) {
      throw new Error('Incomplete weather data received from Open-Meteo');
    }

    // Process current weather
    const cTemp = Math.round(data.current.temperature_2m);
    const cFeelsLike = Math.round(data.current.apparent_temperature);
    const cWindSpeed = Math.round(data.current.wind_speed_10m);
    const cPressure = Math.round(
      data.current.pressure_msl || data.current.surface_pressure || 1013
    );

    // Get current hourly index or first hour
    const currentHourIndex = findCurrentHourIndex(data.hourly.time);
    const cVisibility = data.hourly.visibility
      ? Math.round(data.hourly.visibility[currentHourIndex] / 1000)
      : 10; // in km
    const cUvIndex = data.hourly.uv_index
      ? Math.round(data.hourly.uv_index[currentHourIndex] || 0)
      : 0;

    const todaySunrise = data.daily.sunrise?.[0] || '';
    const todaySunset = data.daily.sunset?.[0] || '';
    const todayMaxC = Math.round(data.daily.temperature_2m_max[0]);
    const todayMinC = Math.round(data.daily.temperature_2m_min[0]);
    const precipProbabilityMax = data.daily.precipitation_probability_max?.[0] || 0;

    const current: CurrentWeather = {
      cityName: location.name,
      country: location.country,
      countryCode: location.countryCode,
      state: location.admin1,
      latitude: location.latitude,
      longitude: location.longitude,
      tempC: cTemp,
      tempF: celsiusToFahrenheit(cTemp),
      feelsLikeC: cFeelsLike,
      feelsLikeF: celsiusToFahrenheit(cFeelsLike),
      weatherCode: data.current.weather_code,
      humidity: Math.round(data.current.relative_humidity_2m),
      windSpeed: cWindSpeed,
      windDirection: data.current.wind_direction_10m || 0,
      windDirectionText: getWindDirectionText(data.current.wind_direction_10m || 0),
      pressure: cPressure,
      visibility: cVisibility,
      uvIndex: cUvIndex,
      isDay: Boolean(data.current.is_day),
      sunrise: todaySunrise,
      sunset: todaySunset,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      todayMaxC,
      todayMaxF: celsiusToFahrenheit(todayMaxC),
      todayMinC,
      todayMinF: celsiusToFahrenheit(todayMinC),
      precipProbabilityMax,
    };

    // Process 7-Day Daily Forecast
    const daily: DailyForecastItem[] = [];
    const daysCount = Math.min(7, data.daily.time.length);

    for (let i = 0; i < daysCount; i++) {
      const maxC = Math.round(data.daily.temperature_2m_max[i]);
      const minC = Math.round(data.daily.temperature_2m_min[i]);
      const dateStr = data.daily.time[i];

      daily.push({
        date: dateStr,
        dayName: getDayName(dateStr, i),
        formattedDate: formatDateShort(dateStr),
        weatherCode: data.daily.weather_code[i],
        tempMaxC: maxC,
        tempMaxF: celsiusToFahrenheit(maxC),
        tempMinC: minC,
        tempMinF: celsiusToFahrenheit(minC),
        precipProbabilityMax: data.daily.precipitation_probability_max?.[i] || 0,
        precipSum: Math.round((data.daily.precipitation_sum?.[i] || 0) * 10) / 10,
        uvIndexMax: Math.round(data.daily.uv_index_max?.[i] || 0),
        windSpeedMax: Math.round(data.daily.wind_speed_10m_max?.[i] || 0),
        sunrise: data.daily.sunrise?.[i] || '',
        sunset: data.daily.sunset?.[i] || '',
      });
    }

    // Process Hourly Forecast (next 24 hours)
    const hourly: HourlyForecastItem[] = [];
    const startIndex = Math.max(0, currentHourIndex);
    const endIndex = Math.min(data.hourly.time.length, startIndex + 24);

    for (let i = startIndex; i < endIndex; i++) {
      const tC = Math.round(data.hourly.temperature_2m[i]);
      const flC = Math.round(data.hourly.apparent_temperature[i]);
      const isoTime = data.hourly.time[i];
      const timeObj = new Date(isoTime);

      hourly.push({
        time: isoTime,
        formattedTime: timeObj.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
        tempC: tC,
        tempF: celsiusToFahrenheit(tC),
        feelsLikeC: flC,
        feelsLikeF: celsiusToFahrenheit(flC),
        weatherCode: data.hourly.weather_code[i],
        precipProbability: data.hourly.precipitation_probability[i] || 0,
        humidity: Math.round(data.hourly.relative_humidity_2m[i]),
        windSpeed: Math.round(data.hourly.wind_speed_10m[i]),
        uvIndex: Math.round(data.hourly.uv_index[i] || 0),
        isDay: Boolean(data.hourly.is_day[i]),
      });
    }

    return {
      location,
      current,
      daily,
      hourly,
    };
  } catch (error: any) {
    console.error('Fetch weather data error:', error);
    throw new Error('Failed to retrieve weather details. Please try again or check city name.');
  }
}

function findCurrentHourIndex(timeArray: string[]): number {
  if (!timeArray || timeArray.length === 0) return 0;
  const now = new Date();
  const currentIso = now.toISOString().slice(0, 13); // "YYYY-MM-DDTHH"

  const index = timeArray.findIndex((t) => t.startsWith(currentIso));
  return index !== -1 ? index : 0;
}
