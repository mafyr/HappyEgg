import { motion } from "framer-motion";
import { FaHome, FaRedo } from "react-icons/fa";

const Scorecard = ({ score, onRestart, onGoHome }) => {
  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-green-100 to-yellow-200 overflow-hidden flex items-center justify-center">

      {/* Card Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-90 rounded-xl shadow-2xl p-8 sm:p-10 text-center z-50 max-w-md mx-auto"
      >
        <div className="text-[5vw] sm:text-3xl font-bold text-red-600 mb-6 drop-shadow-md">
          Game Over
        </div>

        <div className="text-[4vw] sm:text-2xl font-semibold text-gray-800 mb-8">
          Score: <span className="text-green-600">{score}</span>
        </div>

        <div className="flex flex-col space-y-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onRestart}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-full cursor-pointer shadow-md text-[4vw] sm:text-xl flex items-center justify-center gap-2"
          >
            <FaRedo />
            Restart
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onGoHome}
            className="bg-yellow-400 hover:bg-yellow-500 cursor-pointer text-white font-bold py-3 px-6 rounded-full shadow-md text-[4vw] sm:text-xl flex items-center justify-center gap-2"
          >
            <FaHome />
            Home Page
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Scorecard;
