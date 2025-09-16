import { formatTime } from '../helpers';
import { Score, ScreenType } from '../shared_types';

interface GameOverProps {
  setCurrentScreen: React.Dispatch<React.SetStateAction<ScreenType>>;
  startNewGame: () => void;
  score: Score;
}
const GameOver: React.FC<GameOverProps> = ({ setCurrentScreen, startNewGame, score }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-2 z-50 backdrop-blur-md">
      <div className="bg-gradient-to-br from-gray-800 to-blue-900/80 rounded-xl p-4 max-w-xs w-full mx-3 text-center border-2 border-blue-500/30 shadow-lg shadow-blue-900/30 backdrop-blur-lg">
        <div className="mb-3">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md shadow-yellow-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-800"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-1 tracking-wide">Victory!</h2>
          <p className="text-blue-300 text-xs">All enemy ships destroyed!</p>
        </div>

        <div className="bg-gray-900/50 rounded-md p-3 mb-3 border border-blue-500/20 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-2 text-white">
            <div>
              <div className="text-lg font-bold bg-blue-900/30 py-1 rounded">
                {formatTime(score.time)}
              </div>
              <div className="text-blue-300 mt-1 text-xs uppercase tracking-wider">Time</div>
            </div>
            <div>
              <div className="text-lg font-bold bg-blue-900/30 py-1 rounded">
                {Math.round((score.hits / (score.hits + score.misses)) * 100)}%
              </div>
              <div className="text-blue-300 mt-1 text-xs uppercase tracking-wider">Accuracy</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={startNewGame}
            className="w-full flex items-center justify-center space-x-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold py-2 px-3 rounded-md transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-blue-900/30 text-xs"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              viewBox="0 0 20 20"
              fill="CurrentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs">Play Again</span>
          </button>
          <button
            onClick={() => setCurrentScreen('menu')}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-md transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-gray-900/30 text-xs"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
