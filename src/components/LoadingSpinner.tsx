import React from 'react';
import { CloudSun, Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Fetching atmospheric weather intelligence...',
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto my-12 p-8 bg-white/90 backdrop-blur-md rounded-3xl border border-sky-100 shadow-xl text-center space-y-4 animate-pulse">
      <div className="relative inline-flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-300">
          <CloudSun className="w-8 h-8 animate-bounce" />
        </div>
        <Loader2 className="w-20 h-20 text-sky-500 animate-spin absolute -inset-2" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-800">{message}</h3>
        <p className="text-xs text-slate-500">Retrieving real-time data from Open-Meteo & AI Models</p>
      </div>

      {/* Skeleton Cards */}
      <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
        <div className="h-16 bg-slate-100 rounded-xl" />
        <div className="h-16 bg-slate-100 rounded-xl" />
        <div className="h-16 bg-slate-100 rounded-xl" />
        <div className="h-16 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
};
