import { WeatherConditionInfo } from '../types/weather';

export const WMO_WEATHER_CODES: Record<number, WeatherConditionInfo> = {
  0: {
    code: 0,
    description: 'Clear Sky',
    iconName: 'Sun',
    bgGradient: 'from-amber-50 to-amber-100/50',
    accentColor: 'text-amber-600',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  1: {
    code: 1,
    description: 'Mainly Clear',
    iconName: 'SunDim',
    bgGradient: 'from-amber-50 to-sky-50',
    accentColor: 'text-amber-500',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  2: {
    code: 2,
    description: 'Partly Cloudy',
    iconName: 'CloudSun',
    bgGradient: 'from-sky-50 to-blue-50',
    accentColor: 'text-sky-600',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  3: {
    code: 3,
    description: 'Overcast',
    iconName: 'Cloud',
    bgGradient: 'from-slate-100 to-slate-200/60',
    accentColor: 'text-slate-600',
    badgeBg: 'bg-slate-200 text-slate-800 border-slate-300',
  },
  45: {
    code: 45,
    description: 'Foggy',
    iconName: 'CloudFog',
    bgGradient: 'from-slate-100 to-zinc-100',
    accentColor: 'text-zinc-600',
    badgeBg: 'bg-zinc-200 text-zinc-800 border-zinc-300',
  },
  48: {
    code: 48,
    description: 'Depositing Rime Fog',
    iconName: 'CloudFog',
    bgGradient: 'from-slate-100 to-cyan-50',
    accentColor: 'text-cyan-700',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  },
  51: {
    code: 51,
    description: 'Light Drizzle',
    iconName: 'CloudDrizzle',
    bgGradient: 'from-blue-50 to-cyan-100/40',
    accentColor: 'text-cyan-600',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  },
  53: {
    code: 53,
    description: 'Moderate Drizzle',
    iconName: 'CloudDrizzle',
    bgGradient: 'from-blue-100/50 to-sky-100',
    accentColor: 'text-blue-600',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  55: {
    code: 55,
    description: 'Dense Drizzle',
    iconName: 'CloudRain',
    bgGradient: 'from-blue-100 to-sky-200/50',
    accentColor: 'text-blue-700',
    badgeBg: 'bg-blue-200 text-blue-900 border-blue-300',
  },
  56: {
    code: 56,
    description: 'Light Freezing Drizzle',
    iconName: 'CloudHail',
    bgGradient: 'from-cyan-50 to-blue-100',
    accentColor: 'text-cyan-700',
    badgeBg: 'bg-cyan-100 text-cyan-900 border-cyan-300',
  },
  57: {
    code: 57,
    description: 'Dense Freezing Drizzle',
    iconName: 'CloudHail',
    bgGradient: 'from-cyan-100 to-slate-200',
    accentColor: 'text-cyan-800',
    badgeBg: 'bg-cyan-200 text-cyan-900 border-cyan-300',
  },
  61: {
    code: 61,
    description: 'Slight Rain',
    iconName: 'CloudRain',
    bgGradient: 'from-sky-50 to-blue-100/60',
    accentColor: 'text-blue-600',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  63: {
    code: 63,
    description: 'Moderate Rain',
    iconName: 'CloudRain',
    bgGradient: 'from-blue-100 to-indigo-100/60',
    accentColor: 'text-blue-700',
    badgeBg: 'bg-blue-200 text-blue-900 border-blue-300',
  },
  65: {
    code: 65,
    description: 'Heavy Rain',
    iconName: 'CloudRainWind',
    bgGradient: 'from-blue-100 to-slate-200',
    accentColor: 'text-indigo-700',
    badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  },
  66: {
    code: 66,
    description: 'Light Freezing Rain',
    iconName: 'CloudHail',
    bgGradient: 'from-cyan-100 to-blue-200',
    accentColor: 'text-teal-700',
    badgeBg: 'bg-teal-100 text-teal-900 border-teal-300',
  },
  67: {
    code: 67,
    description: 'Heavy Freezing Rain',
    iconName: 'CloudHail',
    bgGradient: 'from-cyan-200 to-slate-300',
    accentColor: 'text-teal-800',
    badgeBg: 'bg-teal-200 text-teal-900 border-teal-400',
  },
  71: {
    code: 71,
    description: 'Slight Snow Fall',
    iconName: 'CloudSnow',
    bgGradient: 'from-indigo-50 to-slate-100',
    accentColor: 'text-indigo-600',
    badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  },
  73: {
    code: 73,
    description: 'Moderate Snow Fall',
    iconName: 'CloudSnow',
    bgGradient: 'from-indigo-100/60 to-blue-100',
    accentColor: 'text-indigo-700',
    badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  },
  75: {
    code: 75,
    description: 'Heavy Snow Fall',
    iconName: 'Snowflake',
    bgGradient: 'from-blue-100 to-slate-200',
    accentColor: 'text-blue-800',
    badgeBg: 'bg-blue-200 text-blue-900 border-blue-300',
  },
  77: {
    code: 77,
    description: 'Snow Grains',
    iconName: 'Snowflake',
    bgGradient: 'from-slate-100 to-indigo-50',
    accentColor: 'text-indigo-600',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  80: {
    code: 80,
    description: 'Slight Rain Showers',
    iconName: 'CloudRain',
    bgGradient: 'from-sky-100 to-blue-100',
    accentColor: 'text-blue-600',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  81: {
    code: 81,
    description: 'Moderate Rain Showers',
    iconName: 'CloudRain',
    bgGradient: 'from-blue-100 to-indigo-200/50',
    accentColor: 'text-blue-700',
    badgeBg: 'bg-blue-200 text-blue-900 border-blue-300',
  },
  82: {
    code: 82,
    description: 'Violent Rain Showers',
    iconName: 'CloudRainWind',
    bgGradient: 'from-blue-200 to-slate-300',
    accentColor: 'text-indigo-800',
    badgeBg: 'bg-indigo-200 text-indigo-900 border-indigo-400',
  },
  85: {
    code: 85,
    description: 'Slight Snow Showers',
    iconName: 'CloudSnow',
    bgGradient: 'from-sky-50 to-indigo-100',
    accentColor: 'text-indigo-600',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  86: {
    code: 86,
    description: 'Heavy Snow Showers',
    iconName: 'Snowflake',
    bgGradient: 'from-indigo-100 to-slate-200',
    accentColor: 'text-indigo-800',
    badgeBg: 'bg-indigo-200 text-indigo-900 border-indigo-300',
  },
  95: {
    code: 95,
    description: 'Thunderstorm',
    iconName: 'CloudLightning',
    bgGradient: 'from-amber-100/50 to-purple-100/60',
    accentColor: 'text-purple-700',
    badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
  },
  96: {
    code: 96,
    description: 'Thunderstorm with Hail',
    iconName: 'CloudLightning',
    bgGradient: 'from-purple-100 to-slate-200',
    accentColor: 'text-purple-800',
    badgeBg: 'bg-purple-200 text-purple-900 border-purple-400',
  },
  99: {
    code: 99,
    description: 'Heavy Thunderstorm with Hail',
    iconName: 'CloudLightning',
    bgGradient: 'from-purple-200 to-slate-300',
    accentColor: 'text-purple-900',
    badgeBg: 'bg-purple-300 text-purple-950 border-purple-500',
  },
};

export function getWeatherConditionInfo(code: number): WeatherConditionInfo {
  return (
    WMO_WEATHER_CODES[code] || {
      code,
      description: 'Variable Weather',
      iconName: 'SunMedium',
      bgGradient: 'from-sky-50 to-slate-100',
      accentColor: 'text-sky-600',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
    }
  );
}

export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function fahrenheitToCelsius(f: number): number {
  return Math.round(((f - 32) * 5) / 9);
}

export function getWindDirectionText(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function formatTime(isoString: string): string {
  if (!isoString) return '--:--';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDateShort(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function getDayName(dateString: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const date = new Date(dateString);
  return date.toLocaleDateString([], { weekday: 'short' });
}
