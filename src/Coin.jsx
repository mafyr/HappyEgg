import React from "react";

const Coin = ({ left, top }) => {
  return (
    <div
      className="absolute w-[4vw] h-[4vw] max-w-[20px] max-h-[20px] rounded-full bg-yellow-300 border-2 border-orange-500 shadow-md flex items-center justify-center text-[2vw] max-text-xs font-bold text-orange-700"
      style={{ left, top }}
    >
      $
    </div>
  );
};

export default Coin;
