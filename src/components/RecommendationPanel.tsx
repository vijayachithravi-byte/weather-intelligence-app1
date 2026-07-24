import React, { useState } from 'react';
import {
  Sparkles,
  Shirt,
  Bike,
  Car,
  HeartPulse,
  GlassWater,
  Umbrella,
  Sun,
  RefreshCw,
  Quote,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { WeatherData, AIRecommendation, AIExecutiveSummary, TemperatureUnit } from '../types/weather';
import { generateLocalRecommendations, fetchGeminiAiSummary } from '../utils/recommendations';
import { WeatherIcon } from './WeatherIcon';

interface RecommendationPanelProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

type RecommendationCategory = 'all' | 'clothing' | 'activities' | 'travel' | 'health' | 'hydration' | 'rainAlert' | 'uvAdvice';

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({ weather, unit }) => {
  const [selectedCategory, setSelectedCategory] = useState<RecommendationCategory>('all');
  const [aiSummary, setAiSummary] = useState<AIExecutiveSummary | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Local rule-based AI recommendations
  const localRecs = generateLocalRecommendations(weather, unit);

  // Filter recommendations
  const filteredRecs =
    selectedCategory === 'all'
      ? localRecs
      : localRecs.filter((r) => r.category === selectedCategory);

  // Fetch Gemini AI deep synthesis
  const handleGenerateAiInsight = async () => {
    setIsGeneratingAi(true);
    const summary = await fetchGeminiAiSummary(weather, unit);
    if (summary) {
      setAiSummary(summary);
    } else {
      // Fallback message
      alert('Using local Weather Intelligence engine for instant recommendations.');
    }
    setIsGeneratingAi(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xl shadow-sky-900/5 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-200">
            <Sparkles className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                AI Weather Intelligence
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                Smart Advisor
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalized clothing, travel, health, outdoor activities & UV guidance
            </p>
          </div>
        </div>

        {/* Gemini AI Deep Analysis Trigger Button */}
        <button
          type="button"
          onClick={handleGenerateAiInsight}
          disabled={isGeneratingAi}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-sky-200 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-1.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
          {isGeneratingAi ? 'Synthesizing Gemini AI...' : 'Generate Gemini AI Deep Analysis'}
        </button>
      </div>

      {/* Highlights & Quote Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 flex items-start space-x-3">
          <Quote className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wide">UV Guidance</h4>
            <p className="text-xs text-amber-800 font-medium mt-0.5">
              {weather.current.uvIndex >= 5
                ? 'High UV index today—apply SPF 30+ sunscreen and wear a sun hat.'
                : 'Minimal UV hazard today. Safe for extended daylight walking.'}
            </p>
          </div>
        </div>

        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 flex items-start space-x-3">
          <Quote className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wide">Rain Outlook</h4>
            <p className="text-xs text-blue-800 font-medium mt-0.5">
              {weather.current.precipProbabilityMax >= 40
                ? 'Rain chance elevated tomorrow—keep an umbrella in your vehicle.'
                : 'Low rain risk today. Enjoy dry roads and clear atmospheric visibility.'}
            </p>
          </div>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start space-x-3">
          <Quote className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wide">Outdoor Comfort</h4>
            <p className="text-xs text-emerald-800 font-medium mt-0.5">
              {weather.current.tempC >= 15 && weather.current.tempC <= 25
                ? 'Ideal pleasant temperatures make it perfect for outdoor walking or cycling.'
                : 'Adjust physical pace to current temperature & maintain hydration goals.'}
            </p>
          </div>
        </div>
      </div>

      {/* Gemini AI Executive Summary Box (If generated) */}
      {aiSummary && (
        <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-blue-50 border border-sky-200 rounded-2xl p-5 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="flex items-center text-xs font-extrabold text-indigo-900 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 mr-1.5 text-indigo-600" />
              Gemini AI Executive Forecast Synthesis
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-indigo-100 text-indigo-800 rounded">
              Gemini 3.6 Flash
            </span>
          </div>

          <p className="text-sm text-slate-800 font-medium leading-relaxed">
            {aiSummary.executiveSummary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
            {aiSummary.clothing?.[0] && (
              <div className="flex items-start space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Clothing:</strong> {aiSummary.clothing[0]}</span>
              </div>
            )}
            {aiSummary.activities?.[0] && (
              <div className="flex items-start space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Activities:</strong> {aiSummary.activities[0]}</span>
              </div>
            )}
            {aiSummary.travel?.[0] && (
              <div className="flex items-start space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Travel:</strong> {aiSummary.travel[0]}</span>
              </div>
            )}
            {aiSummary.health?.[0] && (
              <div className="flex items-start space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>Health:</strong> {aiSummary.health[0]}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Advice', icon: Sparkles },
          { id: 'clothing', label: 'Clothing', icon: Shirt },
          { id: 'activities', label: 'Activities', icon: Bike },
          { id: 'travel', label: 'Travel', icon: Car },
          { id: 'health', label: 'Health', icon: HeartPulse },
          { id: 'hydration', label: 'Hydration', icon: GlassWater },
          { id: 'rainAlert', label: 'Rain Alert', icon: Umbrella },
          { id: 'uvAdvice', label: 'UV Care', icon: Sun },
        ].map((cat) => {
          const IconComp = cat.icon;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as RecommendationCategory)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <IconComp className="w-3.5 h-3.5 mr-1" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Recommendation Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecs.map((rec) => (
          <div
            key={rec.id}
            className={`p-4 rounded-2xl border transition-all duration-200 flex items-start space-x-3.5 ${
              rec.priority === 'high'
                ? 'bg-rose-50/40 border-rose-200'
                : rec.priority === 'medium'
                ? 'bg-amber-50/30 border-amber-200'
                : 'bg-slate-50/50 border-slate-100'
            }`}
          >
            <div
              className={`p-2.5 rounded-xl text-white shrink-0 shadow-xs ${
                rec.priority === 'high'
                  ? 'bg-rose-500'
                  : rec.priority === 'medium'
                  ? 'bg-amber-500'
                  : 'bg-sky-500'
              }`}
            >
              <WeatherIcon name={rec.iconName} className="w-5 h-5" />
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    rec.priority === 'high'
                      ? 'bg-rose-100 text-rose-800'
                      : rec.priority === 'medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}
                >
                  {rec.badgeText}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {rec.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
