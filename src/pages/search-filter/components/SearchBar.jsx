import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onClearSearch,
  recentSearches = [],
  onRecentSearchClick,
  onClearRecentSearches 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const suggestions = [
    "high priority tasks",
    "overdue items",
    "completed today",
    "work category",
    "personal tasks",
    "due this week",
    "urgent tasks",
    "meeting notes"
  ];

  const filteredSuggestions = suggestions?.filter(suggestion =>
    suggestion?.toLowerCase()?.includes(searchQuery?.toLowerCase()) && 
    suggestion?.toLowerCase() !== searchQuery?.toLowerCase()
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef?.current && !suggestionsRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    onSearchChange(value);
    setShowSuggestions(value?.length > 0);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    const totalItems = filteredSuggestions?.length + recentSearches?.length;

    switch (e?.key) {
      case 'ArrowDown':
        e?.preventDefault();
        setFocusedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setFocusedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1);
        break;
      case 'Enter':
        e?.preventDefault();
        if (focusedIndex >= 0) {
          const selectedItem = focusedIndex < filteredSuggestions?.length 
            ? filteredSuggestions?.[focusedIndex]
            : recentSearches?.[focusedIndex - filteredSuggestions?.length];
          onSearchChange(selectedItem);
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        searchInputRef?.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
    searchInputRef?.current?.focus();
  };

  const handleClear = () => {
    onClearSearch();
    setShowSuggestions(false);
    searchInputRef?.current?.focus();
  };

  return (
    <div className="relative w-full" ref={suggestionsRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <Icon name="Search" size={20} className="text-muted-foreground" />
        </div>
        
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(searchQuery?.length > 0 || recentSearches?.length > 0)}
          placeholder="Search tasks, categories, or keywords..."
          className="w-full h-14 pl-12 pr-12 glass rounded-2xl border border-border/30 bg-card/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
        />
        
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted/20 transition-colors duration-200"
            aria-label="Clear search"
          >
            <Icon name="X" size={18} className="text-muted-foreground" />
          </button>
        )}
      </div>
      {/* Suggestions Dropdown */}
      {showSuggestions && (filteredSuggestions?.length > 0 || recentSearches?.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl border border-border/30 bg-card/80 backdrop-blur-xl shadow-xl z-50 max-h-80 overflow-y-auto custom-scrollbar">
          {/* Recent Searches */}
          {recentSearches?.length > 0 && (
            <div className="p-4 border-b border-border/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-muted-foreground">Recent Searches</h4>
                <button
                  onClick={onClearRecentSearches}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches?.slice(0, 3)?.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors duration-200 ${
                      focusedIndex === filteredSuggestions?.length + index
                        ? 'bg-primary/10 text-primary' :'hover:bg-muted/20 text-foreground'
                    }`}
                  >
                    <Icon name="Clock" size={16} className="text-muted-foreground" />
                    <span className="text-sm">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {filteredSuggestions?.length > 0 && (
            <div className="p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Suggestions</h4>
              <div className="space-y-1">
                {filteredSuggestions?.slice(0, 5)?.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors duration-200 ${
                      focusedIndex === index
                        ? 'bg-primary/10 text-primary' :'hover:bg-muted/20 text-foreground'
                    }`}
                  >
                    <Icon name="Search" size={16} className="text-muted-foreground" />
                    <span className="text-sm">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;