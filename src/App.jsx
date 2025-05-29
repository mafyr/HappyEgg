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
const TILE_COUNT = Math.floor(SCREEN_HEIGHT / 100); // More tiles on mobile
const TILE_WIDTH = 135;
const TILE_HEIGHT = 20;
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
    const isMagnet = Math.random() < 0.15;
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
  const [eggPos, setEggPos] = useState({ x: 600, y: 0 });

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
          .map((tile) => ({ ...tile, top: tile.top - 2 }))
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
          const isMagnet = Math.random() < 0.15;
          const magnet = isMagnet
            ? { offsetX: Math.random() * (TILE_WIDTH - 20) }
            : null;
          newTiles.push({ left: newLeft, top: newTop, coins, isSharp, magnet });
        }
        return [...updatedTiles, ...newTiles];
      });
    }, 30);
    return () => clearInterval(interval);
  }, [gameTime]);

  useEffect(() => {
    if (!magnetActive) return;
    setTilePositions((prev) => {
      let totalCoinsCollected = 0;
      const updated = prev.map((tile) => {
        if (tile.coins.length > 0) {
          totalCoinsCollected += tile.coins.length;
          return { ...tile, coins: [] }; // Only clear coins
        }
        return tile;
      });
      if (totalCoinsCollected > 0) {
        setScore((prev) => prev + totalCoinsCollected * 10);
      }
      return updated;
    });
  }, [magnetActive]);

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
    setHomePageKey((prev) => prev + 1);
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
          />

          {tilePositions.map((tile, index) =>
            tile.coins.map((coin, cIndex) => (
              <div
                key={`coin-${index}-${cIndex}`}
                className="absolute w-[14px] h-[14px] bg-yellow-400 rounded-full shadow-md border border-yellow-600"
                style={{
                  top: tile.top - 16,
                  left: tile.left + coin.offsetX + 6,
                  transition: magnetActive ? "all 0.3s ease-out" : "none",
                  transform: magnetActive
                    ? `translate(${
                        eggPos.x - (tile.left + coin.offsetX + 6)
                      }px, ${eggPos.y - (tile.top - 16)}px)`
                    : "none",
                }}
              />
            ))
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
