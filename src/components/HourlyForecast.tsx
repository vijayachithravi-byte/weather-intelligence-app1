import React from 'react';
import { Clock, Umbrella } from 'lucide-react';
import { HourlyForecastItem, TemperatureUnit } from '../types/weather';
import { getWeatherConditionInfo } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  unit: TemperatureUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unit }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xl shadow-sky-900/5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">24-Hour Timeline Forecast</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Scroll horizontally →</span>
      </div>

      <div className="flex items-center space-x-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-sky-200">
        {hourly.map((item, idx) => {
          const info = getWeatherConditionInfo(item.weatherCode);
          const temp = unit === 'f' ? item.tempF : item.tempC;

          return (
            <div
              key={`${item.time}-${idx}`}
              className={`flex-shrink-0 w-24 p-3 rounded-2xl border text-center transition-all duration-200 ${
                idx === 0
                  ? 'bg-gradient-to-b from-sky-50 to-blue-50/50 border-sky-300 shadow-2xs'
                  : 'bg-slate-50/50 border-slate-100 hover:border-sky-200 hover:bg-white'
              }`}
            >
              <div className="text-xs font-bold text-slate-700">
                {idx === 0 ? 'Now' : item.formattedTime}
              </div>

              <div className="my-2 flex justify-center">
                <WeatherIcon name={info.iconName} className={`w-7 h-7 ${info.accentColor}`} />
              </div>

              <div className="text-lg font-black text-slate-900">{temp}°</div>

              {item.precipProbability > 10 ? (
                <div className="mt-1 flex items-center justify-center text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                  <Umbrella className="w-2.5 h-2.5 mr-0.5" />
                  {item.precipProbability}%
                </div>
              ) : (
                <div className="mt-1 text-[10px] text-slate-400 font-medium">
                  {item.humidity}% RH
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
