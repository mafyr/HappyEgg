import React from 'react';

const Tile = ({ left, top, isSharp }) => {
  return (
    <div
      className={`absolute h-[20px] w-[135px] rounded ${
        isSharp ? 'bg-red-600' : 'bg-blue-400'
      }`}
      style={{ left, top }}
    />
  );
};

export default Tile;
