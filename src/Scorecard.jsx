import React from "react";

const Scorecard = ({ score, onRestart, onGoHome }) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 rounded-xl shadow-lg p-6 text-center z-50">
      <div className="text-[4vw] sm:text-xl font-bold text-red-600 mb-4">
        Game Over
      </div>
      <div className="text-[4vw] sm:text-xl font-semibold text-gray-800 mb-6">
        Score: <span className="text-green-600">{score}</span>
      </div>

      <div className="flex flex-col space-y-4">
        <button
          type="button"
          onClick={onRestart}
          className="bg-green-500  text-[4vw] sm:text-xl hover:bg-green-700 cursor-pointer text-white font-bold py-2 px-6 rounded"
        >
          Restart
        </button>

        <button
          type="button"
          onClick={onGoHome}
          className="bg-blue-500 text-[4vw] sm:text-xl hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-6 rounded"
        >
          Home Page
        </button>
      </div>
    </div>
  );
};

export default Scorecard;
