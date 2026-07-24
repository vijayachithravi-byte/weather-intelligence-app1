import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { HourlyForecast } from './components/HourlyForecast';
import { WeatherCharts } from './components/WeatherCharts';
import { RecommendationPanel } from './components/RecommendationPanel';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';

import {
  WeatherData,
  GeocodingLocation,
  SearchHistoryItem,
  TemperatureUnit,
} from './types/weather';
import {
  searchLocations,
  getReverseGeocoding,
  fetchWeatherData,
} from './utils/weatherApi';

const DEFAULT_CITY = 'London';
const HISTORY_STORAGE_KEY = 'weather_search_history_v1';
const UNIT_STORAGE_KEY = 'weather_temp_unit_v1';

export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<GeocodingLocation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Temperature unit state
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    const saved = localStorage.getItem(UNIT_STORAGE_KEY);
    return saved === 'f' ? 'f' : 'c';
  });

  // Search History state
  const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history changes
  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  // Save unit changes
  useEffect(() => {
    localStorage.setItem(UNIT_STORAGE_KEY, unit);
  }, [unit]);

  const addToHistory = (loc: GeocodingLocation) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.name.toLowerCase() !== loc.name.toLowerCase());
      const newItem: SearchHistoryItem = {
        id: `${loc.latitude}-${loc.longitude}-${Date.now()}`,
        name: loc.name,
        country: loc.country,
        countryCode: loc.countryCode,
        admin1: loc.admin1,
        latitude: loc.latitude,
        longitude: loc.longitude,
        timestamp: Date.now(),
        isFavorite: false,
      };
      return [newItem, ...filtered].slice(0, 10);
    });
  };

  // Main weather loader
  const loadWeatherForLocation = useCallback(async (loc: GeocodingLocation, isSilentRefresh = false) => {
    if (!isSilentRefresh) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const data = await fetchWeatherData(loc);
      setWeatherData(data);
      setCurrentLocation(loc);
      addToHistory(loc);
    } catch (err: any) {
      setError(err.message || 'Failed to load weather data. Please check connection and try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial App Load
  useEffect(() => {
    const initWeather = async () => {
      try {
        const results = await searchLocations(DEFAULT_CITY);
        if (results.length > 0) {
          await loadWeatherForLocation(results[0]);
        }
      } catch (err: any) {
        setError('Welcome! Please search for any city to view live weather.');
        setIsLoading(false);
      }
    };

    initWeather();
  }, [loadWeatherForLocation]);

  // Handler: Select Location from SearchBar
  const handleSelectLocation = (loc: GeocodingLocation) => {
    loadWeatherForLocation(loc);
  };

  // Handler: Select Location from History
  const handleSelectHistoryItem = (item: SearchHistoryItem) => {
    const loc: GeocodingLocation = {
      id: Math.round(item.latitude * 1000 + item.longitude),
      name: item.name,
      country: item.country,
      countryCode: item.countryCode,
      admin1: item.admin1,
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: 'auto',
    };
    loadWeatherForLocation(loc);
  };

  // Handler: Detect Geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const loc = await getReverseGeocoding(lat, lon);
          await loadWeatherForLocation(loc);
        } catch (err: any) {
          setError('Failed to reverse geocode current location. Try searching city manually.');
        } finally {
          setIsLocating(false);
        }
      },
      (geoErr) => {
        setIsLocating(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setError('Location access was denied. Please search for your city in the search bar.');
        } else {
          setError('Unable to detect current position. Please search for your city manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handler: Refresh Weather
  const handleRefresh = () => {
    if (currentLocation) {
      loadWeatherForLocation(currentLocation, true);
    } else {
      handleDetectLocation();
    }
  };

  // Handler: Toggle °C / °F
  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'c' ? 'f' : 'c'));
  };

  // Handler: Clear History
  const handleClearHistory = () => {
    setHistory([]);
  };

  // Handler: Toggle Favorite History Item
  const handleToggleFavorite = (id: string) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  // Handler: Pick quick city from error view
  const handlePickQuickCity = async (cityName: string) => {
    try {
      const results = await searchLocations(cityName);
      if (results.length > 0) {
        await loadWeatherForLocation(results[0]);
      }
    } catch {
      setError(`Unable to search ${cityName}. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Header Bar */}
      <Header
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onDetectLocation={handleDetectLocation}
        onRefresh={handleRefresh}
        isLocating={isLocating}
        isRefreshing={isRefreshing}
        lastUpdated={weatherData?.current.lastUpdated}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Search Bar Section */}
        <section>
          <SearchBar
            onSelectLocation={handleSelectLocation}
            history={history}
            onSelectHistory={handleSelectHistoryItem}
            onClearHistory={handleClearHistory}
            onToggleFavorite={handleToggleFavorite}
            isLoading={isLoading}
          />
        </section>

        {/* Loading State */}
        {isLoading && <LoadingSpinner message="Fetching live atmospheric metrics & 7-day forecast..." />}

        {/* Error State */}
        {!isLoading && error && (
          <ErrorMessage
            message={error}
            onRetry={handleRefresh}
            onSelectCity={handlePickQuickCity}
          />
        )}

        {/* Weather Dashboard View */}
        {!isLoading && weatherData && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            {/* 1. Current Weather Hero Card */}
            <section id="current-weather">
              <CurrentWeatherCard weather={weatherData.current} unit={unit} />
            </section>

            {/* 2. 24-Hour Timeline */}
            <section id="hourly-forecast">
              <HourlyForecast hourly={weatherData.hourly} unit={unit} />
            </section>

            {/* 3. 7-Day Forecast */}
            <section id="daily-forecast">
              <ForecastCard daily={weatherData.daily} unit={unit} />
            </section>

            {/* 4. Interactive Weather Charts */}
            <section id="weather-charts">
              <WeatherCharts weather={weatherData} unit={unit} />
            </section>

            {/* 5. AI Weather Intelligence Recommendations */}
            <section id="ai-recommendations">
              <RecommendationPanel weather={weatherData} unit={unit} />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium">
            Weather Intelligence Dashboard • Powered by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">Open-Meteo API</a> & Gemini 3.6 Flash
          </p>
          <p className="text-slate-400">
            © {new Date().getFullYear()} Weather Intelligence. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
