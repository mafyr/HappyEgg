/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Egg from "./Egg";
import Tile from "./Tile";
import SharpTile from "./SharpTile";
import Coin from "./Coin";
import Score from "./Score";
import Scorecard from "./Scorecard";
import HomePage from "./HomePage";

const TILE_COUNT = 5;
const TILE_WIDTH = 135;
const TILE_HEIGHT = 20;
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

const getInitialPositions = () => {
  const positions = [];
  for (let i = 0; i < TILE_COUNT; i++) {
    const left =
      Math.floor(Math.random() * (SCREEN_WIDTH - TILE_WIDTH - 40)) + 20;
    const top = SCREEN_HEIGHT - i * 120;
    const coins = Array.from({ length: Math.floor(Math.random() * 4) }, () => ({
      offsetX: Math.random() * (TILE_WIDTH - 12),
    }));
    positions.push({ left, top, coins, isSharp: false });
  }
  return positions;
};

const App = () => {
  const [tilePositions, setTilePositions] = useState(getInitialPositions());
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameId, setGameId] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameTime, setGameTime] = useState(0);
const [homePageKey, setHomePageKey] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

    const updateHighScore = (currentScore) => {
  const stored = Number(localStorage.getItem('highScore')) || 0;
  if (currentScore > stored) {
    localStorage.setItem('highScore', currentScore);
  }
};

  useEffect(() => {
    const timer = setInterval(() => setGameTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTilePositions((prev) => {
        const updatedTiles = prev
          .map((tile) => ({ ...tile, top: tile.top - 2 }))
          .filter((tile) => tile.top + TILE_HEIGHT > 0);

        const newTiles = [];
        while (updatedTiles.length + newTiles.length < TILE_COUNT) {
          const newLeft =
            Math.floor(Math.random() * (SCREEN_WIDTH - TILE_WIDTH - 40)) + 20;
          const newTop = SCREEN_HEIGHT;
          const coins = Array.from(
            { length: Math.floor(Math.random() * 4) },
            () => ({
              offsetX: Math.random() * (TILE_WIDTH - 12),
            })
          );
          const isSharp = gameTime >= 4 ? Math.random() < 0.3 : false;

          newTiles.push({ left: newLeft, top: newTop, coins, isSharp });
        }

        return [...updatedTiles, ...newTiles];
      });
    }, 30);
    return () => clearInterval(interval);
  }, [gameTime]);

  const handleCoinCollision = (tileIndex, coinIndex) => {
    setTilePositions((prev) => {
      const updated = [...prev];
      const tile = { ...updated[tileIndex] };
      tile.coins.splice(coinIndex, 1);
      updated[tileIndex] = tile;
      return updated;
    });
    setScore((prev) => prev + 10);
  };

  const restartGame = () => {
    setTilePositions(getInitialPositions());
    setScore(0);
    setGameOver(false);
    setGameId((prev) => prev + 1);
    setLives(3);
    setGameTime(0);
      setHomePageKey((prev) => prev + 1); // Force re-render
  };

   // Show homepage if game hasn't started
  if (!gameStarted) {
    return <HomePage onStart={() => setGameStarted(true)} />;
  }

  const goToHome = () => {
  setGameStarted(false);
  setScore(0);
  setGameOver(false);
  setLives(3);
  setGameTime(0);
};


 return (
  <>
    {/* If game over, show only the Scorecard */}
    {gameOver ? (
      <div className="relative min-h-screen bg-yellow-100 flex items-center justify-center">
        <Scorecard score={score} onRestart={restartGame} onGoHome={goToHome}/>
      </div>
    ) : (
      // Otherwise, show the game scene
      <div className="relative min-h-screen bg-gray-100 overflow-hidden">
        <Score score={score} lives={lives} />

        <Egg
          key={gameId}
          tilePositions={tilePositions}
          onCoinCollision={handleCoinCollision}
          setGameOver={setGameOver}
          TILE_WIDTH={TILE_WIDTH}
          TILE_HEIGHT={TILE_HEIGHT}
          setLives={setLives}
           updateHighScore={updateHighScore}
           currentScore={score}
        />

        {tilePositions.map((tile, index) => (
          <React.Fragment key={index}>
            {tile.isSharp ? (
              <SharpTile left={tile.left} top={tile.top} />
            ) : (
              <Tile left={tile.left} top={tile.top} />
            )}
            {tile.coins.map((coin, cIndex) => (
              <Coin
                key={cIndex}
                left={tile.left + coin.offsetX}
                top={tile.top - 12}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    )}
  </>
);
};

export default App;
