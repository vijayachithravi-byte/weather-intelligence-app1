import React from 'react';
import {
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Eye,
  Sun,
  Sunrise,
  Sunset,
  Clock,
  ArrowUp,
  ArrowDown,
  CloudRain,
} from 'lucide-react';
import { CurrentWeather, TemperatureUnit } from '../types/weather';
import { getWeatherConditionInfo, formatTime } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  unit: TemperatureUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather, unit }) => {
  const info = getWeatherConditionInfo(weather.weatherCode);

  const displayTemp = unit === 'f' ? weather.tempF : weather.tempC;
  const displayFeelsLike = unit === 'f' ? weather.feelsLikeF : weather.feelsLikeC;
  const displayMax = unit === 'f' ? weather.todayMaxF : weather.todayMaxC;
  const displayMin = unit === 'f' ? weather.todayMinF : weather.todayMinC;
  const unitSymbol = unit === 'f' ? '°F' : '°C';

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${info.bgGradient} p-6 sm:p-8 border border-sky-100 shadow-xl shadow-sky-900/5 transition-all duration-300`}
    >
      {/* Top Header: Location, Badges & Last Updated */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-slate-800">
            <MapPin className="w-5 h-5 text-sky-600 shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {weather.cityName}
            </h2>
            {weather.countryCode && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                {weather.countryCode}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 font-medium ml-7 mt-0.5">
            {[weather.state, weather.country].filter(Boolean).join(', ')}
          </p>
        </div>

        {/* Condition Badge & Updated Time */}
        <div className="flex flex-col items-end space-y-1">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${info.badgeBg}`}
          >
            <WeatherIcon name={info.iconName} className="w-4 h-4 mr-1.5" />
            {info.description}
          </span>
          <span className="text-xs text-slate-500 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Updated {weather.lastUpdated}
          </span>
        </div>
      </div>

      {/* Main Temperature Hero Display */}
      <div className="mt-6 mb-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Big Temperature & Animated Icon */}
        <div className="md:col-span-7 flex items-center justify-between sm:justify-start sm:space-x-8">
          <div>
            <div className="flex items-baseline">
              <span className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tighter">
                {displayTemp}
              </span>
              <span className="text-3xl sm:text-4xl font-bold text-sky-600 ml-1">
                {unitSymbol}
              </span>
            </div>

            <div className="flex items-center space-x-3 mt-2 text-sm text-slate-600 font-medium">
              <span className="flex items-center text-slate-700">
                <Thermometer className="w-4 h-4 mr-1 text-sky-500" />
                Feels like <strong className="ml-1 text-slate-900">{displayFeelsLike}{unitSymbol}</strong>
              </span>

              <span className="text-slate-300">•</span>

              <div className="flex items-center space-x-2">
                <span className="flex items-center text-rose-600 font-bold">
                  <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                  {displayMax}°
                </span>
                <span className="flex items-center text-blue-600 font-bold">
                  <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                  {displayMin}°
                </span>
              </div>
            </div>
          </div>

          {/* Animated Condition Visual Icon */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 p-4 flex items-center justify-center shadow-lg shadow-sky-500/10">
            <WeatherIcon
              name={info.iconName}
              className={`w-16 h-16 ${info.accentColor} animate-bounce-subtle`}
            />
          </div>
        </div>

        {/* Highlight Quick Stats Card (UV & Rain Chance) */}
        <div className="md:col-span-5 bg-white/75 backdrop-blur-md rounded-2xl p-4 border border-white/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center text-slate-600 font-medium">
              <Sun className="w-4 h-4 mr-1.5 text-amber-500" />
              UV Index Today
            </span>
            <span
              className={`font-extrabold px-2 py-0.5 rounded ${
                weather.uvIndex >= 8
                  ? 'bg-rose-100 text-rose-800'
                  : weather.uvIndex >= 5
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {weather.uvIndex} ({weather.uvIndex >= 8 ? 'Very High' : weather.uvIndex >= 5 ? 'Moderate' : 'Low'})
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center text-slate-600 font-medium">
              <CloudRain className="w-4 h-4 mr-1.5 text-blue-500" />
              Max Rain Probability
            </span>
            <span className="font-bold text-slate-900 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
              {weather.precipProbabilityMax}%
            </span>
          </div>

          {/* Solar Path (Sunrise / Sunset) */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2 text-slate-700">
              <Sunrise className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Sunrise</span>
                <span className="font-semibold text-slate-800">{formatTime(weather.sunrise)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-slate-700">
              <Sunset className="w-4 h-4 text-orange-500" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Sunset</span>
                <span className="font-semibold text-slate-800">{formatTime(weather.sunset)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Weather Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-slate-200/60">
        {/* Humidity */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3.5 border border-white/80 shadow-2xs hover:border-sky-200 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span className="flex items-center">
              <Droplets className="w-3.5 h-3.5 mr-1 text-cyan-500" />
              Humidity
            </span>
            <span className="font-mono text-slate-400">RH</span>
          </div>
          <div className="text-xl font-bold text-slate-900">{weather.humidity}%</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full"
              style={{ width: `${Math.min(100, weather.humidity)}%` }}
            />
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3.5 border border-white/80 shadow-2xs hover:border-sky-200 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span className="flex items-center">
              <Wind className="w-3.5 h-3.5 mr-1 text-sky-500" />
              Wind Speed
            </span>
            <span className="font-semibold text-sky-600">{weather.windDirectionText}</span>
          </div>
          <div className="text-xl font-bold text-slate-900">{weather.windSpeed} <span className="text-xs font-normal text-slate-500">km/h</span></div>
          <p className="text-[11px] text-slate-500 mt-1">Dir: {weather.windDirection}°</p>
        </div>

        {/* Atmospheric Pressure */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3.5 border border-white/80 shadow-2xs hover:border-sky-200 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span className="flex items-center">
              <Gauge className="w-3.5 h-3.5 mr-1 text-indigo-500" />
              Pressure
            </span>
            <span className="text-[10px] text-slate-400">MSL</span>
          </div>
          <div className="text-xl font-bold text-slate-900">{weather.pressure} <span className="text-xs font-normal text-slate-500">hPa</span></div>
          <p className="text-[11px] text-slate-500 mt-1">
            {weather.pressure > 1013 ? 'High Pressure' : 'Low Pressure'}
          </p>
        </div>

        {/* Visibility */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3.5 border border-white/80 shadow-2xs hover:border-sky-200 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span className="flex items-center">
              <Eye className="w-3.5 h-3.5 mr-1 text-blue-500" />
              Visibility
            </span>
            <span className="text-[10px] text-slate-400">Horizon</span>
          </div>
          <div className="text-xl font-bold text-slate-900">{weather.visibility} <span className="text-xs font-normal text-slate-500">km</span></div>
          <p className="text-[11px] text-slate-500 mt-1">
            {weather.visibility >= 10 ? 'Clear Range' : weather.visibility >= 5 ? 'Moderate' : 'Foggy'}
          </p>
        </div>
      </div>
    </div>
  );
};
