import React from 'react';
import { CloudSun, Navigation, RefreshCw, Sparkles } from 'lucide-react';
import { TemperatureUnit } from '../types/weather';

interface HeaderProps {
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  onDetectLocation: () => void;
  onRefresh: () => void;
  isLocating: boolean;
  isRefreshing: boolean;
  lastUpdated?: string;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onDetectLocation,
  onRefresh,
  isLocating,
  isRefreshing,
  lastUpdated,
}) => {
  return (
    <header className="bg-white/85 backdrop-blur-md border-b border-sky-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-200">
            <CloudSun className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-sky-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent tracking-tight">
                Weather Intelligence
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                <Sparkles className="w-3 h-3 mr-1 text-sky-600" />
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Real-time atmospheric insights & smart forecast recommendations
            </p>
          </div>
        </div>

        {/* Control Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Geolocation Button */}
          <button
            type="button"
            onClick={onDetectLocation}
            disabled={isLocating}
            title="Detect my current location"
            className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 hover:bg-sky-50 hover:text-sky-700 rounded-lg border border-slate-200 transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <Navigation className={`w-4 h-4 mr-1.5 text-sky-600 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">My Location</span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh weather data"
            className="p-2 text-slate-600 bg-slate-50 hover:bg-sky-50 hover:text-sky-700 rounded-lg border border-slate-200 transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`} />
          </button>

          {/* Temperature Unit Toggle (°C / °F) */}
          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center shadow-inner">
            <button
              type="button"
              onClick={onToggleUnit}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all duration-200 cursor-pointer ${
                unit === 'c'
                  ? 'bg-white text-sky-800 shadow-xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={onToggleUnit}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all duration-200 cursor-pointer ${
                unit === 'f'
                  ? 'bg-white text-sky-800 shadow-xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
