import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, History, Star, ArrowRight } from 'lucide-react';
import { GeocodingLocation, SearchHistoryItem } from '../types/weather';
import { searchLocations } from '../utils/weatherApi';

interface SearchBarProps {
  onSelectLocation: (location: GeocodingLocation) => void;
  history: SearchHistoryItem[];
  onSelectHistory: (item: SearchHistoryItem) => void;
  onClearHistory: () => void;
  onToggleFavorite: (id: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectLocation,
  history,
  onSelectHistory,
  onClearHistory,
  onToggleFavorite,
  isLoading,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodingLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced geocoding search as user types
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setErrorMessage(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setErrorMessage(null);
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
        if (results.length === 0) {
          setErrorMessage(`No matching city found for "${query}". Please check spelling.`);
        }
        setIsOpen(true);
      } catch (err: any) {
        setErrorMessage(err.message || 'Error searching locations');
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setErrorMessage('Please enter a city name to search.');
      return;
    }

    if (suggestions.length > 0) {
      const selected = selectedIndex >= 0 ? suggestions[selectedIndex] : suggestions[0];
      handlePickLocation(selected);
      return;
    }

    // Direct search trigger
    setIsSearching(true);
    setErrorMessage(null);
    try {
      const results = await searchLocations(query);
      if (results.length > 0) {
        handlePickLocation(results[0]);
      } else {
        setErrorMessage(`City "${query}" not found. Try searching popular cities like London, Paris, Tokyo, or New York.`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to complete search');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePickLocation = (loc: GeocodingLocation) => {
    setQuery(`${loc.name}${loc.country ? `, ${loc.country}` : ''}`);
    setIsOpen(false);
    setSuggestions([]);
    setErrorMessage(null);
    onSelectLocation(loc);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClearInput = () => {
    setQuery('');
    setSuggestions([]);
    setErrorMessage(null);
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3" ref={containerRef}>
      {/* Search Bar Form */}
      <form onSubmit={handleFormSubmit} className="relative shadow-lg rounded-2xl bg-white border border-sky-100">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-sky-500">
            <Search className={`w-5 h-5 ${isSearching ? 'animate-spin text-sky-600' : ''}`} />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search city name (e.g., Tokyo, London, Paris, San Francisco)..."
            className="w-full pl-12 pr-28 py-4 bg-transparent text-slate-800 placeholder-slate-400 font-medium text-base sm:text-lg focus:outline-none rounded-2xl"
          />

          {query && (
            <button
              type="button"
              onClick={handleClearInput}
              className="absolute right-20 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || isSearching}
            className="absolute right-2.5 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-md shadow-sky-200 cursor-pointer disabled:opacity-50 flex items-center"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </form>

      {/* Validation Error Banner */}
      {errorMessage && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm rounded-xl flex items-center justify-between animate-fade-in">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-amber-600 hover:text-amber-900 ml-2 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-100">
          <div className="px-4 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Matching Locations ({suggestions.length})
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {suggestions.map((loc, idx) => (
              <li key={`${loc.id}-${idx}`}>
                <button
                  type="button"
                  onClick={() => handlePickLocation(loc)}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                    idx === selectedIndex ? 'bg-sky-50 text-sky-900' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900">{loc.name}</span>
                      {loc.admin1 && <span className="text-sm text-slate-500">, {loc.admin1}</span>}
                      {loc.country && <span className="text-sm text-slate-500">, {loc.country}</span>}
                    </div>
                  </div>
                  {loc.countryCode && (
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono uppercase">
                      {loc.countryCode}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Search History / Favorite Pills */}
      {history.length > 0 && !isOpen && (
        <div className="flex items-center flex-wrap gap-2 pt-1 text-xs text-slate-500">
          <span className="flex items-center font-medium text-slate-600 mr-1">
            <History className="w-3.5 h-3.5 mr-1 text-slate-400" />
            Recent:
          </span>

          {history.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="inline-flex items-center bg-white border border-slate-200 rounded-full pl-3 pr-2 py-1 shadow-2xs hover:border-sky-300 transition-all group"
            >
              <button
                type="button"
                onClick={() => onSelectHistory(item)}
                className="font-medium text-slate-700 hover:text-sky-600 transition-colors cursor-pointer mr-1"
              >
                {item.name}
                {item.countryCode && <span className="ml-1 text-[10px] text-slate-400">({item.countryCode})</span>}
              </button>

              <button
                type="button"
                onClick={() => onToggleFavorite(item.id)}
                title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                className="text-slate-300 hover:text-amber-400 p-0.5 transition-colors cursor-pointer"
              >
                <Star
                  className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={onClearHistory}
            className="text-slate-400 hover:text-slate-600 text-xs underline ml-auto cursor-pointer"
          >
            Clear History
          </button>
        </div>
      )}
    </div>
  );
};
