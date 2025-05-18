import React, { useEffect, useState } from 'react';

const HomePage = ({ onStart }) => {
  const [soundOn, setSoundOn] = useState(true);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const soundPref = localStorage.getItem('soundOn');
    if (soundPref !== null) {
      setSoundOn(soundPref === 'true');
    }

    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('highScore');
    if (savedHighScore) {
      setHighScore(Number(savedHighScore));
    }
  }, []);
  const toggleSound = () => {
    setSoundOn((prev) => !prev);
    localStorage.setItem('soundOn', !soundOn);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 text-center">
      <h1 className="text-5xl font-bold mb-8 text-orange-700 drop-shadow-md">
         Welcome to Happy Egg 
      </h1>

      <button
        onClick={onStart}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded mb-4 shadow-md transition duration-300"
      >
        Start Game
      </button>

      <button
        onClick={toggleSound}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded mb-4 shadow-md transition duration-300"
      >
        {soundOn ? '🔊 Sound: ON' : '🔇 Sound: OFF'}
      </button>

      <div className="text-xl font-semibold text-gray-700">
        🏆 Highest Score: <span className="text-black">{highScore}</span>
      </div>
    </div>
  );
};

export default HomePage;
