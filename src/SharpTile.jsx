import React from "react";

const SharpTile = ({ left, top }) => {
  return (
    <div
      className="absolute"
      style={{
        left,
        top,
        width: "135px",
        height: "30px", // 10px for spikes + 20px tile
      }}
    >
      {/* Spikes on top */}
      <div
        className="w-full h-[10px] bg-red-700"
        style={{
          clipPath:
            "polygon(0 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%)",
        }}
      />

      {/* Tile base */}
      <div className="w-full h-[15px] bg-gray-700 rounded-b-md shadow-inner border-t border-gray-500" />
    </div>
  );
};

export default SharpTile;
