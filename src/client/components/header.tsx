import React from 'react';
import { Score, ScreenType } from '../shared_types';
import Timer from './timer';

interface HeaderProps {
  score: Score;
  gameOver: boolean;
  gameStartTime: number | null;
  setCurrentScreen: React.Dispatch<React.SetStateAction<ScreenType>>;
}

const Header: React.FC<HeaderProps> = ({ score, gameOver, gameStartTime, setCurrentScreen }) => {
  return (
    <div className="bg-gray-800/70 backdrop-blur-md rounded-lg px-4 py-2 border border-blue-500/30 shadow-lg shadow-blue-900/20 flex-shrink-0 max-w-xs mx-auto w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="text-center bg-gradient-to-b from-green-700/40 to-green-900/60 py-1 px-2 rounded-md border border-green-500/30 shadow-md shadow-green-900/20 flex-1 mr-1">
          <div className="flex items-center justify-center space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-green-300 font-bold text-sm">{score.hits}</span>
          </div>
          <div className="text-green-400 text-xs uppercase tracking-wider">HITS</div>
        </div>
        <div className="text-center bg-gradient-to-b from-blue-700/40 to-blue-900/60 py-1 px-2 rounded-md border border-blue-500/30 shadow-md shadow-blue-900/20 flex-1 ml-1">
          <div className="flex items-center justify-center space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.967.744L14.146 7.2 17 7.5a1 1 0 01.78 1.625l-3.1 4.4-1.15 4.2a1 1 0 01-1.941-.002l-1.15-4.2-3.1-4.4A1 1 0 017 7.5l2.846-.3L12 2a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-blue-300 font-bold text-sm">{score.misses}</span>
          </div>
          <div className="text-blue-400 text-xs uppercase tracking-wider">MISSES</div>
        </div>
      </div>

      {/*Timer & Exit */}
      <div className="flex justify-between items-center">
        <Timer gameOver={gameOver} gameStartTime={gameStartTime} />

        <button
          onClick={() => setCurrentScreen('menu')}
          className="px-3 py-1 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-md transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-red-900/30 text-xs font-medium"
        >
          Exit
        </button>
      </div>
    </div>
  );
};
export default Header;
