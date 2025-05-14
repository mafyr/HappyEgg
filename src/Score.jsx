import React from 'react';

const Score = ({ score,lives }) => {
  return (
    <div className="absolute top-4 left-4 px-4 py-2 bg-white bg-opacity-90 rounded-xl shadow-lg border border-gray-300 text-gray-800 text-lg font-semibold z-50">
      Score: <span className="text-green-600">{score}</span>
       <div className="flex items-center">
        Lives:
        {[...Array(lives)].map((_, i) => (
          <span key={i} className="ml-2 text-2xl">🥚</span>
        ))}
      </div>
    </div>
  );
};

export default Score;
