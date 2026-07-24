import React from 'react';
import { AlertTriangle, RefreshCw, MapPin, Search } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onSelectCity?: (city: string) => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onSelectCity,
}) => {
  const popularCities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai'];

  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-6 sm:p-8 bg-rose-50/80 border border-rose-200 rounded-3xl shadow-lg text-center space-y-5 animate-fade-in">
      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-rose-950">Unable to Load Weather</h3>
        <p className="text-sm text-rose-800 font-medium max-w-md mx-auto">{message}</p>
      </div>

      <div className="flex justify-center space-x-3 pt-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-rose-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Try Again
          </button>
        )}
      </div>

      {/* Quick Pick Popular Cities */}
      {onSelectCity && (
        <div className="pt-4 border-t border-rose-200/60 space-y-2">
          <p className="text-xs font-semibold text-rose-900 flex items-center justify-center">
            <Search className="w-3.5 h-3.5 mr-1" />
            Try searching for one of these major cities:
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {popularCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => onSelectCity(city)}
                className="px-3 py-1 bg-white hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-medium rounded-full shadow-2xs transition-colors cursor-pointer flex items-center"
              >
                <MapPin className="w-3 h-3 mr-1 text-rose-500" />
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
