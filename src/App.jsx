/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Egg from "./Egg";
import Tile from "./Tile";
import SharpTile from "./SharpTile";
import Score from "./Score";
import Scorecard from "./Scorecard";
import HomePage from "./HomePage";
import Magnet from "./Magnet";

const SCREEN_HEIGHT = window.innerHeight;
const TILE_COUNT = Math.floor(SCREEN_HEIGHT / 60); // More tiles on mobile
const TILE_WIDTH = Math.min(window.innerWidth * 0.2, 135);
const TILE_HEIGHT = Math.min(window.innerHeight * 0.035, 30);
const SCREEN_WIDTH = window.innerWidth;

const getInitialPositions = () => {
  const positions = [];
  for (let i = 0; i < TILE_COUNT; i++) {
    const left =
      Math.floor(Math.random() * (SCREEN_WIDTH - TILE_WIDTH - 40)) + 20;
    const top = SCREEN_HEIGHT - i * 80;
    const coins = Array.from({ length: Math.floor(Math.random() * 4) }, () => ({
      offsetX: Math.random() * (TILE_WIDTH - 12),
    }));
    const isSharp = false;
    const isMagnet = Math.random() < 0.05; // 5% percent chance
    const magnet = isMagnet
      ? { offsetX: Math.random() * (TILE_WIDTH - 20) }
      : null;
    positions.push({ left, top, coins, isSharp, magnet });
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
  const [magnetActive, setMagnetActive] = useState(false);
  const [pulledCoins, setPulledCoins] = useState([]);
  const [eggPos, setEggPos] = useState({ x: 600, y: 0 });

  const baseSpeed = 2;
  const tileSpeed =
    gameTime < 5 ? baseSpeed : baseSpeed + Math.min((gameTime - 5) * 0.1, 10);

  const updateHighScore = (currentScore) => {
    const stored = Number(localStorage.getItem("highScore")) || 0;
    if (currentScore > stored) {
      localStorage.setItem("highScore", currentScore);
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
          .map((tile) => ({ ...tile, top: tile.top - tileSpeed }))
          .filter((tile) => tile.top + TILE_HEIGHT > 0);

        const newTiles = [];
        while (updatedTiles.length + newTiles.length < TILE_COUNT) {
          const newLeft =
            Math.floor(Math.random() * (SCREEN_WIDTH - TILE_WIDTH - 40)) + 20;
          const newTop = SCREEN_HEIGHT;
          const coins = Array.from(
            { length: Math.floor(Math.random() * 4) },
            () => ({ offsetX: Math.random() * (TILE_WIDTH - 12) })
          );
          const isSharp = gameTime >= 4 ? Math.random() < 0.3 : false;
          const isMagnet = gameTime > 10 ? Math.random() < 0.06 : false; // 6 percent chance
          const magnet = isMagnet
            ? { offsetX: Math.random() * (TILE_WIDTH - 20) }
            : null;
          newTiles.push({ left: newLeft, top: newTop, coins, isSharp, magnet });
        }
        return [...updatedTiles, ...newTiles];
      });
    }, 30);
    return () => clearInterval(interval);
  }, [gameTime, tileSpeed]);

  const handleCoinCollision = (tileIndex, coinIndex) => {
    setTilePositions((prev) => {
      const updated = [...prev];
      const tile = { ...updated[tileIndex] };

      // Check if the tile or coin exists
      if (!tile.coins || !tile.coins[coinIndex]) return prev;

      tile.coins.splice(coinIndex, 1); // Remove the coin
      updated[tileIndex] = tile;
      return updated;
    });
    setScore((prev) => prev + 10);
  };

  const updateTilePositions = (newTilePositions) => {
    setTilePositions(newTilePositions);
  };

  const restartGame = () => {
    setTilePositions(getInitialPositions());
    setScore(0);
    setGameOver(false);
    setGameId((prev) => prev + 1);
    setLives(3);
    setGameTime(0);
    setHomePageKey((prev) => prev + 1);
    setMagnetActive(false);
  };

  const goToHome = () => {
    setGameStarted(false);
    setScore(0);
    setGameOver(false);
    setLives(3);
    setGameTime(0);
  };

  if (!gameStarted) {
    return <HomePage onStart={() => setGameStarted(true)} />;
  }

  return (
    <>
      {gameOver ? (
        <div className="relative min-h-screen w-screen bg-gray-100 overflow-hidden">
          <Scorecard
            score={score}
            onRestart={restartGame}
            onGoHome={goToHome}
          />
        </div>
      ) : (
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
            setEggPos={setEggPos}
            magnetActive={magnetActive}
            tileSpeed={tileSpeed}
            setTilePositions={setTilePositions}
            updateTilePositions={updateTilePositions}
            gameTime={gameTime}
          />

          {tilePositions.map((tile, index) =>
            tile.coins.map(
              (coin, cIndex) =>
                coin && (
                  <div
                    key={`coin-${index}-${cIndex}`}
                    className="absolute w-[14px] h-[14px] bg-yellow-400 rounded-full shadow-md border border-yellow-600"
                    style={{
                      top: tile.top - 16 + (coin.magnetOffsetY || 0),
                      left: tile.left + coin.offsetX + 6,
                    }}
                  />
                )
            )
          )}

          {tilePositions.map((tile, index) =>
            tile.isSharp ? (
              <SharpTile
                key={`tile-${index}`}
                left={tile.left}
                top={tile.top}
              />
            ) : (
              <Tile
                key={`tile-${index}`}
                left={tile.left}
                top={tile.top}
                isSharp={false}
              />
            )
          )}

          {/* Single active logic handler for Magnet */}
          <Magnet
            eggPos={eggPos}
            tilePositions={tilePositions}
            setMagnetActive={() => {
              if (!magnetActive) {
                setMagnetActive(true);
                setTimeout(() => setMagnetActive(false), 7000);
              }
            }}
            setTilePositions={setTilePositions}
          />
        </div>
      )}
    </>
  );
};

export default App;
