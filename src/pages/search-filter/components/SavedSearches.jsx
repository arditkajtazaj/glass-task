import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SavedSearches = ({ 
  savedSearches = [], 
  onLoadSearch, 
  onSaveSearch, 
  onDeleteSearch,
  currentFilters,
  currentQuery 
}) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSaveSearch = () => {
    if (searchName?.trim()) {
      onSaveSearch({
        id: Date.now()?.toString(),
        name: searchName?.trim(),
        query: currentQuery,
        filters: currentFilters,
        createdAt: new Date()?.toISOString(),
        resultCount: 0 // This would be calculated in the parent
      });
      setSearchName('');
      setShowSaveModal(false);
    }
  };

  const getFilterSummary = (filters) => {
    const parts = [];
    
    if (filters?.dateRange && filters?.dateRange !== 'all') {
      parts?.push(filters?.dateRange?.replace(/([A-Z])/g, ' $1')?.toLowerCase());
    }
    
    if (filters?.priorities && filters?.priorities?.length > 0) {
      parts?.push(`${filters?.priorities?.length} priority${filters?.priorities?.length !== 1 ? 'ies' : 'y'}`);
    }
    
    if (filters?.categories && filters?.categories?.length > 0) {
      parts?.push(`${filters?.categories?.length} categor${filters?.categories?.length !== 1 ? 'ies' : 'y'}`);
    }
    
    if (filters?.status && filters?.status !== 'all') {
      parts?.push(filters?.status);
    }
    
    return parts?.length > 0 ? parts?.join(', ') : 'No filters';
  };

  if (savedSearches?.length === 0 && !showSaveModal) {
    return (
      <div className="glass rounded-xl border border-border/30 p-6 text-center">
        <Icon name="Search" size={32} className="text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Saved Searches</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Save your frequently used search queries and filters for quick access.
        </p>
        <Button
          variant="outline"
          onClick={() => setShowSaveModal(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Save Current Search
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-foreground">Saved Searches</h3>
          <span className="px-2 py-1 text-xs font-medium bg-muted/20 text-muted-foreground rounded-full">
            {savedSearches?.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveModal(true)}
            iconName="Plus"
            iconSize={16}
          >
            Save Current
          </Button>
          {savedSearches?.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted/20 transition-colors duration-200"
              aria-label={isExpanded ? "Show less" : "Show more"}
            >
              <Icon 
                name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-muted-foreground" 
              />
            </button>
          )}
        </div>
      </div>
      {/* Saved Searches List */}
      <div className="space-y-3">
        {savedSearches?.slice(0, isExpanded ? savedSearches?.length : 3)?.map((search) => (
            <div
              key={search?.id}
              className="glass rounded-xl border border-border/30 p-4 hover:border-border/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-foreground truncate">{search?.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(search.createdAt)?.toLocaleDateString()}
                    </span>
                  </div>
                  
                  {search?.query && (
                    <p className="text-sm text-muted-foreground mb-2 truncate">
                      Query: "{search?.query}"
                    </p>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Filters: {getFilterSummary(search?.filters)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLoadSearch(search)}
                    iconName="Search"
                    iconSize={16}
                  >
                    Load
                  </Button>
                  <button
                    onClick={() => onDeleteSearch(search?.id)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                    aria-label="Delete search"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* Save Search Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 modal-backdrop">
          <div className="w-full max-w-md glass rounded-2xl border border-border/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Save Search</h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted/20 transition-colors duration-200"
              >
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Search Name"
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e?.target?.value)}
                placeholder="Enter a name for this search..."
                required
              />
              
              <div className="p-3 bg-muted/10 rounded-lg">
                <h4 className="text-sm font-medium text-foreground mb-2">Current Search:</h4>
                {currentQuery && (
                  <p className="text-sm text-muted-foreground mb-1">
                    Query: "{currentQuery}"
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Filters: {getFilterSummary(currentFilters)}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSaveModal(false)}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleSaveSearch}
                  disabled={!searchName?.trim()}
                  fullWidth
                >
                  Save Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedSearches;