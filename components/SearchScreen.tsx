import React, { useState } from 'react';
import { RiskLevel, FilterMode } from '../types';
import { PlusIcon, TrashIcon } from './icons';
import { playClickSound } from '../utils/sfx';

interface SearchScreenProps {
  onSearch: (criteria: RiskLevel | string[]) => void;
  onViewFavorites: () => void;
  isLoading: boolean;
}

const defaultCustomFilters = [
    'VC Funding',
    'Team Transparency',
    'Community Size / Activity',
    'Audit / Security',
    'Narrative Alignment',
];

export const SearchScreen: React.FC<SearchScreenProps> = ({ onSearch, onViewFavorites, isLoading }) => {
  const [mode, setMode] = useState<FilterMode>(FilterMode.Default);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(RiskLevel.Moderate);
  const [customFilters, setCustomFilters] = useState<string[]>(defaultCustomFilters);
  const [newFilter, setNewFilter] = useState('');

  const handleModeChange = (newMode: FilterMode) => {
    playClickSound();
    setMode(newMode);
  }

  const handleRiskChange = (newRisk: RiskLevel) => {
    playClickSound();
    setRiskLevel(newRisk);
  }

  const handleAddFilter = () => {
    playClickSound();
    if (newFilter.trim() && !customFilters.includes(newFilter.trim())) {
      setCustomFilters([...customFilters, newFilter.trim()]);
      setNewFilter('');
    }
  };

  const handleRemoveFilter = (filterToRemove: string) => {
    playClickSound();
    setCustomFilters(customFilters.filter(f => f !== filterToRemove));
  };
  
  const handleToggleCustomFilter = (filter: string) => {
    playClickSound();
    if (customFilters.includes(filter)) {
        handleRemoveFilter(filter);
    } else {
        setCustomFilters([...customFilters, filter]);
    }
  };

  const handleSearchClick = () => {
    playClickSound();
    if (mode === FilterMode.Default) {
      onSearch(riskLevel);
    } else {
      onSearch(customFilters);
    }
  };

  const handleViewFavoritesClick = () => {
    playClickSound();
    onViewFavorites();
  }

  const isSearchDisabled = isLoading || (mode === FilterMode.Custom && customFilters.length === 0);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#0D1117] text-gray-200 font-sans">
      <div className="w-full max-w-lg mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-wider">
            THE FINDER
          </h1>
          <p className="text-cyan-400 mt-2 text-lg">AI-Powered Project Discovery</p>
        </div>

        <div className="bg-[#161B22] border border-gray-700/50 rounded-xl p-6 shadow-2xl shadow-cyan-500/10 space-y-6">
          
          {/* Mode Toggle */}
          <div className="flex bg-gray-800/50 p-1 rounded-lg">
            <button 
              onClick={() => handleModeChange(FilterMode.Default)}
              className={`w-1/2 py-2.5 text-sm font-bold rounded-md transition-all active:scale-95 ${mode === FilterMode.Default ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20' : 'text-gray-400 hover:bg-gray-700/50'}`}
            >
              {FilterMode.Default}
            </button>
            <button 
              onClick={() => handleModeChange(FilterMode.Custom)}
              className={`w-1/2 py-2.5 text-sm font-bold rounded-md transition-all active:scale-95 ${mode === FilterMode.Custom ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20' : 'text-gray-400 hover:bg-gray-700/50'}`}
            >
              {FilterMode.Custom}
            </button>
          </div>

          {/* Conditional UI */}
          {mode === FilterMode.Default ? (
             <div>
                <label className="block text-sm font-medium text-cyan-400 mb-2">Choose Your Risk Profile</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[RiskLevel.Safest, RiskLevel.Moderate, RiskLevel.Risky].map(level => (
                    <button 
                      key={level}
                      onClick={() => handleRiskChange(level)} 
                      className={`py-3 px-4 rounded-lg transition-all border-2 text-base font-semibold active:scale-95
                        ${riskLevel === level ? 
                          (level === RiskLevel.Safest ? 'bg-green-500/20 border-green-400 text-white scale-105 shadow-lg' : 
                           level === RiskLevel.Moderate ? 'bg-yellow-500/20 border-yellow-400 text-white scale-105 shadow-lg' : 
                           'bg-red-500/20 border-red-400 text-white scale-105 shadow-lg') : 
                           'bg-gray-700/50 border-gray-600 hover:bg-gray-700'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Select & Add Custom Filters</label>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                    {defaultCustomFilters.map(filter => (
                        <button 
                          key={filter} 
                          onClick={() => handleToggleCustomFilter(filter)}
                          className={`px-3 py-1.5 text-sm rounded-full border transition-all active:scale-95 ${customFilters.includes(filter) ? 'bg-blue-500/80 border-blue-400 text-white' : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newFilter}
                    onChange={(e) => setNewFilter(e.target.value)}
                    placeholder="Add a new filter..."
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFilter()}
                  />
                  <button onClick={handleAddFilter} className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-all active:scale-95">
                    <PlusIcon className="w-6 h-6"/>
                  </button>
                </div>
                {customFilters.length > 0 && (
                    <div className="border-t border-gray-700/50 mt-4 pt-3 space-y-2">
                        {customFilters.map(filter => (
                            <div key={filter} className="flex justify-between items-center bg-gray-800/60 p-2 rounded-md">
                                <span className="text-sm">{filter}</span>
                                <button onClick={() => handleRemoveFilter(filter)} className="text-red-400 hover:text-red-300 transition-transform active:scale-95">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-3">
            <button
              onClick={handleSearchClick}
              disabled={isSearchDisabled}
              className="w-full py-4 text-lg font-bold font-display tracking-widest text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 active:scale-95"
            >
              {isLoading ? 'ANALYZING...' : 'FIND ME A PROJECT'}
            </button>
             <button
                onClick={handleViewFavoritesClick}
                className="w-full py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors active:scale-95"
              >
                View Favorites
            </button>
        </div>
      </div>
    </div>
  );
};