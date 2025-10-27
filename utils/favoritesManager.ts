import type { AnalysisResult } from '../types';

const FAVORITES_KEY = 'finder-favorites';

export const getFavorites = (): AnalysisResult[] => {
    try {
        const storedFavorites = localStorage.getItem(FAVORITES_KEY);
        if (storedFavorites) {
            return JSON.parse(storedFavorites);
        }
    } catch (error) {
        console.error("Failed to parse favorites from localStorage", error);
        localStorage.removeItem(FAVORITES_KEY); // Clear corrupted data
    }
    return [];
};

const saveFavorites = (favorites: AnalysisResult[]) => {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error("Failed to save favorites to localStorage", error);
    }
};

export const addFavorite = (project: AnalysisResult): AnalysisResult[] => {
    const currentFavorites = getFavorites();
    if (!currentFavorites.some(fav => fav.projectName === project.projectName)) {
        const newFavorites = [...currentFavorites, project];
        saveFavorites(newFavorites);
        return newFavorites;
    }
    return currentFavorites;
};

export const removeFavorite = (projectName: string): AnalysisResult[] => {
    const currentFavorites = getFavorites();
    const newFavorites = currentFavorites.filter(fav => fav.projectName !== projectName);
    saveFavorites(newFavorites);
    return newFavorites;
};

export const isFavorited = (projectName: string): boolean => {
    const currentFavorites = getFavorites();
    return currentFavorites.some(fav => fav.projectName === projectName);
};
