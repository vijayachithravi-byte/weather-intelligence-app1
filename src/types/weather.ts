export type TemperatureUnit = 'c' | 'f';

export interface GeocodingLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  admin1?: string; // State / Province / Region
  elevation?: number;
  timezone: string;
}

export interface CurrentWeather {
  cityName: string;
  country: string;
  countryCode: string;
  state?: string;
  latitude: number;
  longitude: number;
  tempC: number;
  tempF: number;
  feelsLikeC: number;
  feelsLikeF: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number; // km/h
  windDirection: number; // degrees
  windDirectionText: string;
  pressure: number; // hPa
  visibility: number; // km
  uvIndex: number;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  lastUpdated: string;
  todayMaxC: number;
  todayMaxF: number;
  todayMinC: number;
  todayMinF: number;
  precipProbabilityMax: number;
}

export interface DailyForecastItem {
  date: string; // YYYY-MM-DD
  dayName: string; // "Today", "Mon", "Tue"
  formattedDate: string; // "Jul 24"
  weatherCode: number;
  tempMaxC: number;
  tempMaxF: number;
  tempMinC: number;
  tempMinF: number;
  precipProbabilityMax: number;
  precipSum: number; // mm
  uvIndexMax: number;
  windSpeedMax: number; // km/h
  sunrise: string;
  sunset: string;
}

export interface HourlyForecastItem {
  time: string; // ISO
  formattedTime: string; // "3 PM"
  tempC: number;
  tempF: number;
  feelsLikeC: number;
  feelsLikeF: number;
  weatherCode: number;
  precipProbability: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  isDay: boolean;
}

export interface WeatherData {
  location: GeocodingLocation;
  current: CurrentWeather;
  daily: DailyForecastItem[];
  hourly: HourlyForecastItem[];
}

export interface AIRecommendation {
  id: string;
  category: 'clothing' | 'activities' | 'travel' | 'health' | 'hydration' | 'rainAlert' | 'uvAdvice';
  title: string;
  description: string;
  iconName: string;
  badgeText: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AIExecutiveSummary {
  executiveSummary: string;
  clothing: string[];
  activities: string[];
  travel: string[];
  health: string[];
  hydration: string;
  rainAlert: string;
  uvAdvice: string;
  isAiGenerated?: boolean;
}

export interface SearchHistoryItem {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  isFavorite?: boolean;
}

export interface WeatherConditionInfo {
  code: number;
  description: string;
  iconName: string;
  bgGradient: string;
  accentColor: string;
  badgeBg: string;
}
