/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { playSound } from "./Sound";

const MAGNET_DURATION = 7000; // 7 seconds

const Magnet = ({
  eggPos,
  tilePositions,
  setMagnetActive,
  setTilePositions,
}) => {
  useEffect(() => {
    if (!eggPos) return;

    const eggCenterX = eggPos.x + 25;
    const eggCenterY = eggPos.y + 25;

    tilePositions.forEach((tile, tileIndex) => {
      const magnet = tile.magnet;
      if (!magnet) return;

      const magnetX = tile.left + magnet.offsetX + 10;
      const magnetY = tile.top;

      const dx = eggCenterX - magnetX;
      const dy = eggCenterY - magnetY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 30) {
        setMagnetActive(true);
        playSound("magnet");
        setTimeout(() => setMagnetActive(false), MAGNET_DURATION);

        setTilePositions((prev) => {
          const updated = [...prev];
          updated[tileIndex] = { ...updated[tileIndex], magnet: null };
          return updated;
        });
      }
    });
  }, [eggPos]);

  return (
    <>
      {tilePositions.map((tile, index) => {
        if (!tile?.magnet) return null;
        return (
          <div
            key={index}
            className="absolute w-[5vw] h-[5vw] max-w-[20px] max-h-[20px] rounded-full shadow-lg"
            style={{
              left: tile.left + tile.magnet.offsetX,
              top: tile.top - 20,
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
              🧲
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Magnet;
