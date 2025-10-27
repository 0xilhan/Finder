import React, { useState, useEffect } from 'react';
import type { AnalysisResult, Founder, FilterAnalysis, GroundingSource } from '../types';
import { TwitterIcon, ExternalLinkIcon, StarIcon } from './icons';
import { playClickSound } from '../utils/sfx';

interface ResultsScreenProps {
  result: AnalysisResult;
  onBack: () => void;
  isFavorited: boolean;
  onAddToFavorites: () => void;
  onRemoveFromFavorites: () => void;
}

// Helper functions for the Avatar component
const getInitials = (name: string): string => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    const first = parts[0][0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return `${first}${last}`.toUpperCase();
};

const nameToColor = (name: string): string => {
    const colors = [
        'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 
        'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
};

// Reusable Avatar component with fallback logic
const Avatar: React.FC<{ src: string; alt: string; fallbackText: string; className?: string }> = ({ src, alt, fallbackText, className }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false); // Reset error state if the src changes
    }, [src]);

    const initials = getInitials(fallbackText);
    const colorClass = nameToColor(fallbackText);

    if (hasError || !src) {
        return (
            <div className={`${className} flex items-center justify-center font-bold text-white ${colorClass}`}>
                <span>{initials}</span>
            </div>
        );
    }

    return (
        <img 
            src={src} 
            alt={alt} 
            className={className} 
            onError={() => setHasError(true)} 
        />
    );
};


const getScoreColor = (score: number): { text: string; border: string; bg: string; shadow: string } => {
  if (score >= 75) return { text: 'text-green-400', border: 'border-green-400', bg: 'bg-green-500/10', shadow: 'shadow-green-500/20' };
  if (score >= 50) return { text: 'text-yellow-400', border: 'border-yellow-400', bg: 'bg-yellow-500/10', shadow: 'shadow-yellow-500/20' };
  return { text: 'text-red-400', border: 'border-red-400', bg: 'bg-red-500/10', shadow: 'shadow-red-500/20' };
};

const getVerdictChipClass = (verdict: 'Positive' | 'Negative' | 'Neutral'): string => {
    switch(verdict) {
        case 'Positive': return 'bg-green-500/20 text-green-300';
        case 'Negative': return 'bg-red-500/20 text-red-300';
        case 'Neutral': return 'bg-gray-500/20 text-gray-300';
        default: return 'bg-gray-700';
    }
}

const ProjectHeader: React.FC<{ result: AnalysisResult }> = ({ result }) => (
    <div className="flex flex-col items-center text-center space-y-4">
        <Avatar
            src={result.iconUrl}
            alt={`${result.projectName} logo`}
            fallbackText={result.projectName}
            className="w-24 h-24 rounded-full border-2 border-gray-600 shadow-lg text-3xl"
        />
        <div>
            <h1 className="text-4xl font-display font-bold text-white tracking-wider">{result.projectName}</h1>
            <a href={result.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center justify-center gap-1 mt-1">
                <TwitterIcon className="w-4 h-4" />
                <span>@{result.twitterUrl.split('/').pop()}</span>
            </a>
        </div>
    </div>
);

const ScoreCard: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    const scoreColors = getScoreColor(result.overallScore);
    return (
        <div className={`p-6 rounded-xl border ${scoreColors.border} ${scoreColors.bg} shadow-2xl ${scoreColors.shadow} flex flex-col items-center space-y-3`}>
            <div className={`flex-shrink-0 flex items-center justify-center w-28 h-28 rounded-full border-2 bg-[#0D1117] ${scoreColors.border}`}>
                <span className={`font-bold text-5xl ${scoreColors.text}`}>{result.overallScore}</span>
            </div>
            <div className="text-center">
                <p className={`font-bold text-lg ${scoreColors.text}`}>Quick Verdict</p>
                <p className="text-gray-300">{result.scoreRationale}</p>
            </div>
        </div>
    );
};

const PrimeSourceCard: React.FC<{ source: GroundingSource }> = ({ source }) => (
    <a
        href={source.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="group block w-full bg-red-900/20 hover:bg-red-900/30 border-2 border-red-500 rounded-xl p-4 transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transform hover:-translate-y-1"
    >
        <div className="flex items-center mb-2">
            <StarIcon className="w-6 h-6 text-red-400 mr-3 flex-shrink-0" isFilled={true} />
            <h3 className="font-display text-lg font-bold text-white tracking-wider">THE PRIME SOURCE</h3>
        </div>
        <div className="pl-9">
            <p className="font-semibold text-white truncate" title={source.title}>
                {source.title}
            </p>
            <p className="text-sm text-red-300/80 truncate" title={source.uri}>
                {source.uri}
            </p>
        </div>
    </a>
);


const FoundersSection: React.FC<{ founders: Founder[] }> = ({ founders }) => (
    <div>
        <h2 className="text-2xl font-bold font-display text-white mb-4">Founders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {founders.map(founder => (
                <div key={founder.name} className="bg-gray-800/50 p-4 rounded-lg flex items-start space-x-4">
                    <Avatar
                        src={founder.imageUrl}
                        alt={founder.name}
                        fallbackText={founder.name}
                        className="w-16 h-16 rounded-full border border-gray-600 text-xl"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                             <h3 className="font-bold text-white">{founder.name}</h3>
                             {founder.profileUrl && (
                                <a href={founder.profileUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                                    <ExternalLinkIcon className="w-4 h-4" />
                                </a>
                             )}
                        </div>
                        <p className="text-sm text-gray-400">{founder.achievements}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const FilterAnalysisSection: React.FC<{ filters: FilterAnalysis[] }> = ({ filters }) => (
    <div>
        <h2 className="text-2xl font-bold font-display text-white mb-4">Filter Analysis</h2>
        <div className="space-y-3">
            {filters.map(filter => (
                <div key={filter.filterName} className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-white">{filter.filterName}</h3>
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getVerdictChipClass(filter.verdict)}`}>
                            {filter.verdict} - {filter.level}
                        </span>
                    </div>
                    <p className="text-sm text-gray-400">{filter.description}</p>
                </div>
            ))}
        </div>
    </div>
);

const AirdropTasksSection: React.FC<{ tasks: string[] }> = ({ tasks }) => (
    <div>
        <h2 className="text-2xl font-bold font-display text-white mb-4">Airdrop Tasks</h2>
        {tasks.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-gray-300 bg-gray-800/50 p-4 rounded-lg">
                {tasks.map((task, index) => <li key={index}>{task}</li>)}
            </ul>
        ) : (
            <p className="text-gray-400 bg-gray-800/50 p-4 rounded-lg">No specific airdrop tasks are publicly known at this time.</p>
        )}
    </div>
);

const GroundingSourcesSection: React.FC<{ sources: GroundingSource[] }> = ({ sources }) => (
    <div>
        <h2 className="text-xl font-bold font-display text-white mb-3">Sources</h2>
        {sources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sources.map((source, index) => (
                    <a href={source.uri} key={index} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 bg-gray-800/50 p-3 rounded-lg hover:bg-gray-700/80 transition-colors flex items-center justify-between gap-2 truncate">
                        <span className="truncate">{source.title}</span>
                        <ExternalLinkIcon className="w-4 h-4 flex-shrink-0"/>
                    </a>
                ))}
            </div>
        ) : (
             <p className="text-gray-500 text-sm">No web sources were cited for this analysis.</p>
        )}
    </div>
);


export const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onBack, isFavorited, onAddToFavorites, onRemoveFromFavorites }) => {

    const handleFavoriteClick = () => {
        playClickSound();
        if (isFavorited) {
            onRemoveFromFavorites();
        } else {
            onAddToFavorites();
        }
    }
    
    const handleBackClick = () => {
        playClickSound();
        onBack();
    }

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 bg-[#0D1117] text-gray-200 font-sans">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <ProjectHeader result={result} />
        
        <div className="bg-[#161B22] border border-gray-700/50 rounded-xl p-6 shadow-2xl shadow-cyan-500/10 space-y-8">
            <ScoreCard result={result} />
            {result.primeSource && <PrimeSourceCard source={result.primeSource} />}
            <FoundersSection founders={result.founders} />
            <FilterAnalysisSection filters={result.filterAnalysis} />
            <AirdropTasksSection tasks={result.airdropTasks} />
            <GroundingSourcesSection sources={result.groundingAttribution} />
        </div>

        <div className="flex items-center space-x-4">
            <button
                onClick={handleBackClick}
                className="w-full py-3 text-base font-bold text-white bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg transition-all active:scale-95"
            >
                Back to Search
            </button>
            <button onClick={handleFavoriteClick} className="p-3 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg transition-all active:scale-95">
                <StarIcon className={`w-6 h-6 ${isFavorited ? 'text-yellow-400' : 'text-gray-400'}`} isFilled={isFavorited} />
            </button>
        </div>
      </div>
    </div>
  );
};