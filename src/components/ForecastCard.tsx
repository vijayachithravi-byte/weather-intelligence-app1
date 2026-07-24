import React, { useState } from 'react';
import { Calendar, Umbrella, Wind, Sun, ChevronDown, ChevronUp, Droplet } from 'lucide-react';
import { DailyForecastItem, TemperatureUnit } from '../types/weather';
import { getWeatherConditionInfo } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface ForecastCardProps {
  daily: DailyForecastItem[];
  unit: TemperatureUnit;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ daily, unit }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // Default open first day

  // Find overall min and max temps across 7 days for range bar scaling
  const allMax = Math.max(...daily.map((d) => (unit === 'f' ? d.tempMaxF : d.tempMaxC)));
  const allMin = Math.min(...daily.map((d) => (unit === 'f' ? d.tempMinF : d.tempMinC)));
  const tempRange = Math.max(1, allMax - allMin);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xl shadow-sky-900/5 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">7-Day Weather Forecast</h3>
            <p className="text-xs text-slate-500">Daily temperature trends, rain probability & atmospheric outlook</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
          7 Days
        </span>
      </div>

      <div className="space-y-3">
        {daily.map((item, idx) => {
          const info = getWeatherConditionInfo(item.weatherCode);
          const maxTemp = unit === 'f' ? item.tempMaxF : item.tempMaxC;
          const minTemp = unit === 'f' ? item.tempMinF : item.tempMinC;
          const unitSymbol = unit === 'f' ? '°F' : '°C';

          // Calculate bar offsets
          const leftPercent = Math.max(0, Math.min(100, ((minTemp - allMin) / tempRange) * 100));
          const widthPercent = Math.max(8, Math.min(100 - leftPercent, ((maxTemp - minTemp) / tempRange) * 100));

          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={item.date}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'border-sky-200 bg-sky-50/40 shadow-xs'
                  : 'border-slate-100 bg-white hover:border-sky-100 hover:bg-slate-50/50'
              }`}
            >
              {/* Main Collapsible Row */}
              <button
                type="button"
                onClick={() => toggleExpand(idx)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left cursor-pointer focus:outline-none"
              >
                {/* Date & Day */}
                <div className="w-28 sm:w-36 shrink-0">
                  <div className="font-bold text-slate-900 text-sm sm:text-base flex items-center">
                    {item.dayName}
                    {idx === 0 && (
                      <span className="ml-2 text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-sky-500 text-white uppercase">
                        Today
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">{item.formattedDate}</div>
                </div>

                {/* Weather Condition Icon & Title */}
                <div className="flex items-center space-x-2.5 w-36 sm:w-48 shrink-0">
                  <WeatherIcon name={info.iconName} className={`w-6 h-6 ${info.accentColor}`} />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
                    {info.description}
                  </span>
                </div>

                {/* Rain Probability Pill */}
                <div className="hidden sm:flex items-center w-24 shrink-0 justify-center">
                  {item.precipProbabilityMax > 15 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      <Umbrella className="w-3 h-3 mr-1" />
                      {item.precipProbabilityMax}%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">0-10%</span>
                  )}
                </div>

                {/* Min / Max Temp Bar & Numbers */}
                <div className="flex items-center space-x-3 w-40 sm:w-56 justify-end">
                  <span className="text-xs sm:text-sm font-semibold text-slate-500 w-8 text-right">
                    {minTemp}°
                  </span>

                  {/* Range Visual Bar */}
                  <div className="hidden md:block flex-1 bg-slate-100 h-2 rounded-full relative overflow-hidden">
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-amber-500"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs sm:text-sm font-bold text-slate-900 w-8 text-left">
                    {maxTemp}°
                  </span>
                </div>

                {/* Expand Toggle Chevron */}
                <div className="ml-2 text-slate-400 hover:text-slate-600">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded Details Section */}
              {isExpanded && (
                <div className="px-4 py-3 bg-white/80 border-t border-sky-100 text-xs text-slate-600 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
                  <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-xl">
                    <Droplet className="w-4 h-4 text-blue-500" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Precipitation Sum</span>
                      <span className="font-bold text-slate-800">{item.precipSum} mm ({item.precipProbabilityMax}% chance)</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-xl">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Max UV Index</span>
                      <span className="font-bold text-slate-800">Index {item.uvIndexMax}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-xl">
                    <Wind className="w-4 h-4 text-sky-500" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Max Wind Gusts</span>
                      <span className="font-bold text-slate-800">{item.windSpeedMax} km/h</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-xl">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Day Temp Range</span>
                      <span className="font-bold text-slate-800">{minTemp}{unitSymbol} - {maxTemp}{unitSymbol}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
