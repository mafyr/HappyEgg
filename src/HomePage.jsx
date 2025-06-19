import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaVolumeUp, FaVolumeMute, FaTrophy } from "react-icons/fa";

const HomePage = ({ onStart }) => {
  const [soundOn, setSoundOn] = useState(true);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const soundPref = localStorage.getItem("soundOn");
    if (soundPref !== null) {
      setSoundOn(soundPref === "true");
    }
    const savedHighScore = localStorage.getItem("highScore");
    if (savedHighScore) {
      setHighScore(Number(savedHighScore));
    }
  }, []);

  const toggleSound = () => {
    setSoundOn((prev) => {
      localStorage.setItem("soundOn", !prev);
      return !prev;
    });
  };

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-green-100 to-yellow-200 overflow-hidden flex items-center justify-center">
      <div className="absolute left-6 top-1/4 flex flex-col gap-4 z-10">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={onStart}
          className="bg-yellow-400 hover:bg-yellow-500 cursor-pointer w-14 h-14 rounded-full shadow-md flex items-center justify-center text-white text-2xl"
        >
          <FaPlay />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={toggleSound}
          className="bg-yellow-400 hover:bg-yellow-500 cursor-pointer w-14 h-14 rounded-full shadow-md flex items-center justify-center text-white text-2xl"
        >
          {soundOn ? <FaVolumeUp /> : <FaVolumeMute />}
        </motion.button>

        <motion.div
          whileTap={{ scale: 0.95 }}
          className="bg-yellow-400 cursor-default w-14 h-14 rounded-full shadow-md flex items-center justify-center text-white text-xl relative"
        >
          <FaTrophy />
          <span className="absolute top-full mt-1 text-xl font-bold text-orange-700">
            {highScore}
          </span>
        </motion.div>
      </div>

      {/* Title & Image */}
      <div className="flex flex-col items-center justify-center text-center space-y-8">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 8 }}
          className="flex items-center justify-center space-x-4"
        >
          <span className="text-6xl sm:text-7xl font-bold text-orange-600 drop-shadow-xl">
            Happy Egg
          </span>
          <img
            src={"happy_egg.png"}
            alt="Happy Egg"
            className="w-[55px] h-[55px] sm:w-[80px] sm:h-[80px] rounded-full shadow-lg"
          />
        </motion.div>

        <div className="font-bold text-orange-600 text-lg sm:text-2xl">
          ( DESKTOP VERSION ONLY )
        </div>
      </div>
    </div>
  );
};

export default HomePage;
