import React, { useState, useEffect } from 'react';

const EGG_WIDTH = 50;
const EGG_HEIGHT = 50;
const SCREEN_HEIGHT = window.innerHeight;
const TILE_SCROLL_SPEED = 2;

const Egg = ({ tilePositions, onCoinCollision, setGameOver, TILE_WIDTH, TILE_HEIGHT, setLives }) => {
  const [x, setX] = useState(600);
  const [y, setY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [velocityY, setVelocityY] = useState(0);
  const [lastTileIndex, setLastTileIndex] = useState(null);
  const [isJumpingFromSharp, setIsJumpingFromSharp] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const eggBottom = y + EGG_HEIGHT;
      const eggCenterX = x + EGG_WIDTH / 2;
      const eggCenterY = y + EGG_HEIGHT / 2;

      const currentTileIndex = tilePositions.findIndex(tile =>
        eggBottom >= tile.top &&
        eggBottom <= tile.top + TILE_HEIGHT &&
        eggCenterX >= tile.left &&
        eggCenterX <= tile.left + TILE_WIDTH
      );

      const tile = tilePositions[currentTileIndex];

      if (tile && !isJumpingFromSharp) {
        if (tile.isSharp && currentTileIndex !== lastTileIndex) {
          setIsJumpingFromSharp(true);
          setVelocityY(-10); // Little jump
          setTimeout(() => {
            setIsJumpingFromSharp(false);
          }, 300);
          setLives(prev => {
            if (prev > 1) return prev - 1;
            else {
              setGameOver(true);
              return 0;
            }
          });
        } else {
          setY(tile.top - EGG_HEIGHT - TILE_SCROLL_SPEED);
          setVelocityY(0);
        }
        setLastTileIndex(currentTileIndex);
      } else {
        setVelocityY(v => {
          const newVelocity = Math.min(v + 0.4, 5); // gravity reset
          setY(prevY => prevY + newVelocity);
          return newVelocity;
        });
        setLastTileIndex(null);
      }

      tilePositions.forEach((tile, tIndex) => {
        tile.coins.forEach((coin, cIndex) => {
          if (!coin) return;
          const coinX = tile.left + coin.offsetX + 6;
          const coinY = tile.top - 6;
          const dx = eggCenterX - coinX;
          const dy = eggCenterY - coinY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 20) onCoinCollision(tIndex, cIndex);
        });
      });

      if (y + EGG_HEIGHT >= SCREEN_HEIGHT) {
        setGameOver(true);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [x, y, tilePositions, setGameOver, onCoinCollision, setLives, isJumpingFromSharp]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setX(prev => prev + 20);
        setRotation(prev => prev + 20);
      } else if (e.key === 'ArrowLeft') {
        setX(prev => prev - 20);
        setRotation(prev => prev - 20);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="absolute transition-transform duration-75 ease-out"
      style={{ left: x, top: y, transform: `rotate(${rotation}deg)` }}
    >
      <div className="relative w-[50px] h-[50px] rounded-full bg-gradient-to-r from-orange-500 to-green-500 shadow-md">
        <div className="absolute w-[7px] h-[7px] bg-black rounded-full top-[30%] left-[25%]"></div>
        <div className="absolute w-[7px] h-[7px] bg-black rounded-full top-[30%] right-[25%]"></div>
        <div className="absolute w-[20px] h-[15px] border-b-4 border-black rounded-b-full bottom-[25%] left-1/2 transform -translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default Egg;
