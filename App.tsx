import React, { useState, useEffect } from 'react';
import { AppScreen, RiskLevel, type AnalysisResult } from './types';
import { SearchScreen } from './components/SearchScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { FavoritesScreen } from './components/FavoritesScreen';
import { findAndAnalyzeProject } from './services/geminiService';
import { getFavorites, addFavorite, removeFavorite, isFavorited } from './utils/favoritesManager';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.Search);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [favorites, setFavorites] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleSearch = async (criteria: RiskLevel | string[]) => {
    setScreen(AppScreen.Loading);
    setIsLoading(true);
    setError(null);
    try {
      const analysisResult = await findAndAnalyzeProject(criteria);
      setResult(analysisResult);
      setScreen(AppScreen.Results);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      setScreen(AppScreen.Search); // Go back to search screen on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewFavorites = () => {
    setFavorites(getFavorites());
    setScreen(AppScreen.Favorites);
  };

  const handleBack = () => {
    setScreen(AppScreen.Search);
    setResult(null);
    setError(null);
  };

  const handleAddFavorite = (project: AnalysisResult) => {
    const newFavorites = addFavorite(project);
    setFavorites(newFavorites);
  };

  const handleRemoveFavorite = (project: AnalysisResult) => {
    const newFavorites = removeFavorite(project.projectName);
    setFavorites(newFavorites);
  };
  
  const handleRemoveFavoriteFromList = (project: AnalysisResult) => {
    const newFavorites = removeFavorite(project.projectName);
    setFavorites(newFavorites);
  };

  const renderScreen = () => {
    switch (screen) {
      case AppScreen.Search:
        return <SearchScreen onSearch={handleSearch} onViewFavorites={handleViewFavorites} isLoading={isLoading} />;
      case AppScreen.Loading:
        return <LoadingScreen />;
      case AppScreen.Results:
        if (result) {
          return (
            <ResultsScreen
              result={result}
              onBack={handleBack}
              isFavorited={isFavorited(result.projectName)}
              onAddToFavorites={() => handleAddFavorite(result)}
              onRemoveFromFavorites={() => handleRemoveFavorite(result)}
            />
          );
        }
        // Fallback if result is null for some reason
        handleBack();
        return null;
      case AppScreen.Favorites:
        return <FavoritesScreen favorites={favorites} onRemove={handleRemoveFavoriteFromList} onBack={handleBack} />;
      default:
        return <SearchScreen onSearch={handleSearch} onViewFavorites={handleViewFavorites} isLoading={isLoading} />;
    }
  };
  
  return (
    <main className="font-sans">
      {error && (
        <div className="bg-red-500 text-white p-4 text-center fixed top-0 left-0 right-0 z-50">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="absolute top-1/2 right-4 transform -translate-y-1/2 font-bold">X</button>
        </div>
      )}
      {renderScreen()}
    </main>
  );
};

export default App;
