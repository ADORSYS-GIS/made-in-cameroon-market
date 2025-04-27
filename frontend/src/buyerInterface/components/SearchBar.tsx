// components/SearchBar.tsx
import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { Filter } from '../../types';
import { productService } from '../api/products';

interface SearchBarProps {
  onSearch: (term: string, filters: string[]) => void;
  filters?: Filter[];
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  filters = [] 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Main search handler
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      onSearch(searchTerm, activeFilters);
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [searchTerm, activeFilters, onSearch]);

  // Suggestions handler
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length > 2) {
        try {
          const results = await productService.getSearchSuggestions(searchTerm);
          setSuggestions(results);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFilter = (value: string) => {
    setActiveFilters(prev => 
      prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
    );
  };

  const clearAll = () => {
    setSearchTerm('');
    setActiveFilters([]);
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onSearch(suggestion, activeFilters);
    setIsExpanded(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Search Input */}
      <div className="flex items-center relative">
        <FiSearch className="absolute left-3 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsExpanded(true)}
        />
        {(searchTerm || activeFilters.length > 0) && (
          <button
            onClick={clearAll}
            className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <FiX className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isExpanded && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      {filters.length > 0 && (
        <div className={`mt-2 flex flex-wrap gap-2 transition-all duration-300 ${
          isExpanded ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          {filters.map(({ key, label, value }) => (
            <button
              key={key}
              onClick={() => toggleFilter(value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeFilters.includes(value)
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};