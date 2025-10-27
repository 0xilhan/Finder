
import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="relative flex items-center justify-center w-48 h-48">
        <div className="absolute w-full h-full rounded-full bg-cyan-500/20 animate-ping"></div>
        <div className="absolute w-full h-full rounded-full border-2 border-cyan-400 animate-pulse"></div>
        <div className="relative z-10 text-center">
            <h2 className="text-2xl font-display font-bold tracking-wider">FINDING</h2>
            <p className="text-cyan-300">Our AI is scanning the web...</p>
        </div>
      </div>
    </div>
  );
};
