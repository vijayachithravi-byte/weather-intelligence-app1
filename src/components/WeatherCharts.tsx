import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { LineChart as LineChartIcon, Droplets, Wind, CloudRain, Thermometer } from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../types/weather';

interface WeatherChartsProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

type ChartTab = 'temperature' | 'precipitation' | 'humidity' | 'wind';

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ weather, unit }) => {
  const [activeTab, setActiveTab] = useState<ChartTab>('temperature');

  const unitSymbol = unit === 'f' ? '°F' : '°C';

  // Format 7-Day Daily Data for charts
  const dailyChartData = weather.daily.map((d) => ({
    name: d.dayName,
    date: d.formattedDate,
    MaxTemp: unit === 'f' ? d.tempMaxF : d.tempMaxC,
    MinTemp: unit === 'f' ? d.tempMinF : d.tempMinC,
    PrecipProb: d.precipProbabilityMax,
    PrecipSum: d.precipSum,
    WindSpeed: d.windSpeedMax,
    UvMax: d.uvIndexMax,
  }));

  // Format 24-Hour Hourly Data for charts
  const hourlyChartData = weather.hourly.map((h) => ({
    time: h.formattedTime,
    Temp: unit === 'f' ? h.tempF : h.tempC,
    FeelsLike: unit === 'f' ? h.feelsLikeF : h.feelsLikeC,
    Humidity: h.humidity,
    PrecipProb: h.precipProbability,
    WindSpeed: h.windSpeed,
  }));

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xl shadow-sky-900/5 space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
            <LineChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Interactive Weather Analytics</h3>
            <p className="text-xs text-slate-500">Visual atmospheric trends & trend insights</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveTab('temperature')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center ${
              activeTab === 'temperature'
                ? 'bg-white text-sky-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5 mr-1 text-amber-500" />
            Temperature
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('precipitation')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center ${
              activeTab === 'precipitation'
                ? 'bg-white text-blue-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 mr-1 text-blue-500" />
            Precipitation
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('humidity')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center ${
              activeTab === 'humidity'
                ? 'bg-white text-cyan-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 mr-1 text-cyan-500" />
            Humidity
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wind')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center ${
              activeTab === 'wind'
                ? 'bg-white text-indigo-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wind className="w-3.5 h-3.5 mr-1 text-indigo-500" />
            Wind
          </button>
        </div>
      </div>

      {/* Chart Display Container */}
      <div className="w-full h-72 sm:h-80 pt-2">
        {/* 1. Temperature Chart */}
        {activeTab === 'temperature' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempMaxGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tempMinGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} unit={unitSymbol} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(val: any) => [`${val}${unitSymbol}`, '']}
              />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="MaxTemp"
                name={`Max Temperature (${unitSymbol})`}
                stroke="#f59e0b"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tempMaxGrad)"
              />
              <Area
                type="monotone"
                dataKey="MinTemp"
                name={`Min Temperature (${unitSymbol})`}
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tempMinGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* 2. Precipitation Chart */}
        {activeTab === 'precipitation' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} unit="%" domain={[0, 100]} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: any, name: any) => [
                  name === 'PrecipProb' ? `${value}%` : `${value} mm`,
                  name === 'PrecipProb' ? 'Rain Chance' : 'Precipitation Volume',
                ]}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="PrecipProb"
                name="Rain Probability (%)"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* 3. Humidity Chart (24-Hour Timeline) */}
        {activeTab === 'humidity' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="humidityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} unit="%" domain={[0, 100]} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(val: any) => [`${val}% RH`, 'Relative Humidity']}
              />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="Humidity"
                name="24-Hour Relative Humidity (%)"
                stroke="#06b6d4"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#humidityGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* 4. Wind Speed Chart */}
        {activeTab === 'wind' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} unit=" km/h" tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(val: any) => [`${val} km/h`, 'Wind Gust Max']}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="WindSpeed"
                name="Daily Max Wind Speed (km/h)"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 5, fill: '#6366f1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
