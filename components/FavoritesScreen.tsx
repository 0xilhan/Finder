import React from 'react';
import type { AnalysisResult } from '../types';
import { TrashIcon } from './icons';
import { playClickSound } from '../utils/sfx';

interface FavoritesScreenProps {
  favorites: AnalysisResult[];
  onRemove: (project: AnalysisResult) => void;
  onBack: () => void;
}

const getScoreColor = (score: number): string => {
  if (score >= 75) return 'border-green-400 text-green-400';
  if (score >= 50) return 'border-yellow-400 text-yellow-400';
  return 'border-red-400 text-red-400';
};


export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ favorites, onRemove, onBack }) => {
  const handleRemoveClick = (project: AnalysisResult) => {
    playClickSound();
    onRemove(project);
  }

  const handleBackClick = () => {
    playClickSound();
    onBack();
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 bg-[#0D1117] text-gray-200 font-sans">
      <div className="w-full max-w-lg mx-auto space-y-6">
        <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-white tracking-wider">
            FAVORITES
            </h1>
            <p className="text-cyan-400 mt-1">Saved Projects</p>
        </div>

        {favorites.length > 0 ? (
          <div className="space-y-4">
            {favorites.map(project => (
              <div key={project.projectName} className="bg-[#161B22] border border-gray-700/50 rounded-lg p-4 flex items-center justify-between space-x-4">
                <div className="flex-grow">
                  <h2 className="font-bold text-lg text-white">{project.projectName}</h2>
                  <p className="text-sm text-gray-400">{project.scoreRationale}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full border-2 bg-[#0D1117] ${getScoreColor(project.overallScore)}`}>
                        <span className="font-bold text-xl">{project.overallScore}</span>
                    </div>
                    <button onClick={() => handleRemoveClick(project)} className="p-2 text-gray-500 hover:text-red-400 transition-all active:scale-90">
                        <TrashIcon className="w-6 h-6" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-[#161B22] border border-gray-700/50 rounded-lg p-8">
            <p className="text-gray-400">You haven't favorited any projects yet.</p>
          </div>
        )}

        <button
          onClick={handleBackClick}
          className="w-full py-3 text-base font-bold text-white bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg transition-all active:scale-95"
        >
          Back to Search
        </button>
      </div>
    </div>
  );
};