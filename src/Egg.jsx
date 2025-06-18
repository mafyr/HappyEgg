/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { playSound } from "./Sound";
import { motion } from "framer-motion";

const EGG_WIDTH = 50;
const EGG_HEIGHT = 50;
const SCREEN_HEIGHT = window.innerHeight;

const Egg = ({
  tilePositions,
  onCoinCollision,
  setGameOver,
  TILE_WIDTH,
  TILE_HEIGHT,
  setLives,
  updateHighScore,
  currentScore,
  magnetActive,
  setEggPos,
  updateTilePositions,
  gameTime,
}) => {
  const hasPlayedGameOverSound = useRef(false);
  const [x, setX] = useState(600);
  const [y, setY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [velocityY, setVelocityY] = useState(0);
  const [lastTileIndex, setLastTileIndex] = useState(null);
  const [isJumpingFromSharp, setIsJumpingFromSharp] = useState(false);
  const [blink, setBlink] = useState(false);
  const [lives, setLocalLives] = useState(3); // local copy for visuals

  useEffect(() => {
    setEggPos({ x, y });
  }, [x, y]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const eggBottom = y + EGG_HEIGHT;
      const eggCenterX = x + EGG_WIDTH / 2;
      const eggCenterY = y + EGG_HEIGHT / 2;

      const currentTileIndex = tilePositions.findIndex((tile) => {
        const tileBottom = tile.top + TILE_HEIGHT;
        const overlapY =
          eggBottom >= tile.top - 10 && eggBottom <= tileBottom + 10;
        const overlapX =
          eggCenterX >= tile.left - 5 &&
          eggCenterX <= tile.left + TILE_WIDTH + 5;
        return overlapX && overlapY;
      });

      const tile = tilePositions[currentTileIndex];

      if (tile && !isJumpingFromSharp) {
        if (tile.isSharp && currentTileIndex !== lastTileIndex) {
          playSound("sharp");
          setIsJumpingFromSharp(true);
          setVelocityY(-5);
          setTimeout(() => setIsJumpingFromSharp(false), 200);

          setLives((prev) => {
            const newVal = prev > 1 ? prev - 1 : 0;
            setLocalLives(newVal);
            if (newVal === 0 && !hasPlayedGameOverSound.current) {
              playSound("gameover");
              hasPlayedGameOverSound.current = true;
              setGameOver(true);
            }
            return newVal;
          });
        } else {
          setY(tile.top - EGG_HEIGHT);
          setVelocityY(0);
        }
        setLastTileIndex(currentTileIndex);
      } else {
        const baseGravity = 0.05;
        const maxGravity = 0.3;
        const scalingFactor = 0.0002;

        const gravity =
          baseGravity +
          (Math.log(1 + gameTime * scalingFactor) / Math.log(10)) *
            (maxGravity - baseGravity);

        const newVelocity = Math.min(velocityY + gravity, 7);
        setVelocityY(newVelocity);
        setY((prevY) => prevY + newVelocity);
        setLastTileIndex(null);
      }

      tilePositions.forEach((tile, tIndex) => {
        tile.coins.forEach((coin, cIndex) => {
          if (!coin) return;
          const coinX = tile.left + coin.offsetX + 6;
          const coinY = tile.top - 16;
          const dx = eggCenterX - coinX;
          const dy = eggCenterY - coinY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (magnetActive) {
            const pullStrength = 0.15;
            const thresholdDistance = 120;

            if (distance < thresholdDistance) {
              const moveX = dx * pullStrength;
              const moveY = dy * pullStrength;

              const updatedTilePositions = [...tilePositions];
              const updatedTile = { ...updatedTilePositions[tIndex] };
              const updatedCoins = [...updatedTile.coins];

              const originalCoin = updatedCoins[cIndex];
              if (!originalCoin) return;

              const newOffsetX = originalCoin.offsetX + moveX;
              const newOffsetY = (originalCoin.magnetOffsetY || 0) + moveY;

              updatedCoins[cIndex] = {
                ...originalCoin,
                offsetX: newOffsetX,
                magnetOffsetY: newOffsetY,
              };

              updatedTile.coins = updatedCoins;
              updatedTilePositions[tIndex] = updatedTile;

              updateTilePositions(updatedTilePositions);

              const newCoinX = tile.left + newOffsetX + 6;
              const newCoinY = tile.top - 16 + newOffsetY;

              const newDist = Math.sqrt(
                (eggCenterX - newCoinX) ** 2 + (eggCenterY - newCoinY) ** 2
              );

              if (newDist < 600) {
                playSound("coin");
                onCoinCollision(tIndex, cIndex);
                const newTilePositions = [...tilePositions];
                newTilePositions[tIndex].coins[cIndex] = null;
                updateTilePositions(newTilePositions);
              }
            }
          } else if (distance < 15) {
            playSound("coin");
            onCoinCollision(tIndex, cIndex);
          }
        });
      });

      if (y + EGG_HEIGHT >= SCREEN_HEIGHT) {
        if (!hasPlayedGameOverSound.current) {
          playSound("gameover");
          hasPlayedGameOverSound.current = true;
        }
        setGameOver(true);
        updateHighScore(currentScore);
      }
    }, 3);

    return () => clearInterval(interval);
  }, [
    x,
    y,
    tilePositions,
    setGameOver,
    onCoinCollision,
    setLives,
    isJumpingFromSharp,
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setX((prev) => Math.min(window.innerWidth - EGG_WIDTH, prev + 20));
        setRotation((prev) => prev + 20);
      } else if (e.key === "ArrowLeft") {
        setX((prev) => Math.max(0, prev - 20));
        setRotation((prev) => prev - 20);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    let startX = null;
    const handleTouchStart = (e) => {
      if (e.touches?.length) startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      if (startX === null) return;
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 30) {
        if (diff > 0) {
          setX((prev) => Math.min(window.innerWidth - EGG_WIDTH, prev + 60));
          setRotation((prev) => prev + 60);
        } else {
          setX((prev) => Math.max(0, prev - 60));
          setRotation((prev) => prev - 60);
        }
      }
      startX = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div
      className="absolute transition-transform duration-75 ease-out"
      style={{ left: x, top: y, transform: `rotate(${rotation}deg)` }}
    >
      {magnetActive && (
        <div className="absolute w-[15vw] h-[15vw] max-w-[60px] max-h-[60px] border-2 border-blue-500 rounded-full animate-pulse" style={{ top: -5, left: -5 }} />
      )}

      <motion.div
        animate={{ rotate: [0, 2, -2, 2, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="relative w-[12vw] h-[12vw] max-w-[50px] max-h-[50px] rounded-full 
                   bg-gradient-to-br from-yellow-300 via-amber-200 to-yellow-400 
                   shadow-xl border-[1px] border-yellow-500"
      >
        {/* Glossy Highlight */}
        <div className="absolute top-1 left-1 w-[50%] h-[40%] 
                        bg-white opacity-20 rounded-full blur-sm" />

        {/* Inner Glow */}
        <div className="absolute inset-0 rounded-full 
                        bg-gradient-radial from-transparent via-white/20 to-transparent 
                        opacity-30" />

        {/* Eyes */}
        <div
          className={`absolute w-[1.5vw] h-[1.5vw] max-w-[7px] max-h-[7px] bg-black rounded-full 
                      top-[30%] left-[25%] ${blink ? "scale-y-[0.1]" : ""} transition-all duration-200`}
        />
        <div
          className={`absolute w-[1.5vw] h-[1.5vw] max-w-[7px] max-h-[7px] bg-black rounded-full 
                      top-[30%] right-[25%] ${blink ? "scale-y-[0.1]" : ""} transition-all duration-200`}
        />

        {/* Smile */}
        <div className="absolute w-[4vw] h-[3vw] max-w-[20px] max-h-[15px] 
                        border-b-[2.5px] border-black rounded-b-full 
                        bottom-[25%] left-1/2 transform -translate-x-1/2" />

        {/* Crack Line */}
  {lives <= 1 && (
  <>
    {/* Central jagged crack */}
    <div className="absolute w-[2px] h-[8%] bg-black top-[35%] left-[50%] rotate-[15deg]" />
    <div className="absolute w-[2px] h-[8%] bg-black top-[40%] left-[52%] rotate-[-15deg]" />
    <div className="absolute w-[2px] h-[8%] bg-black top-[45%] left-[50%] rotate-[15deg]" />
    <div className="absolute w-[2px] h-[8%] bg-black top-[50%] left-[52%] rotate-[-15deg]" />
    <div className="absolute w-[2px] h-[8%] bg-black top-[55%] left-[50%] rotate-[10deg]" />
  </>
)}


      </motion.div>
    </div>
  );
};

export default Egg;
