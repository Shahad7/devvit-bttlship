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
    <div className="bg-gray-800/70 backdrop-blur-md rounded-lg p-3 border border-blue-500/30 shadow-lg shadow-blue-900/20 flex-shrink-0 w-full max-w-xs mx-auto mt-4">
      <div className="flex items-center justify-between space-x-2">
        {/* Hits - Made wider */}
        <div className="text-center bg-gradient-to-b from-green-700/40 to-green-900/60 py-1 px-3 rounded-md border border-green-500/30 shadow-md shadow-green-900/20 flex items-center justify-center space-x-1 h-8 min-w-[50px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-green-400 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-green-300 font-bold text-xs leading-none">{score.hits}</span>
        </div>

        {/* Misses - Made wider */}
        <div className="text-center bg-gradient-to-b from-blue-700/40 to-blue-900/60 py-1 px-3 rounded-md border border-blue-500/30 shadow-md shadow-blue-900/20 flex items-center justify-center space-x-1 h-8 min-w-[50px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-blue-400 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.967.744L14.146 7.2 17 7.5a1 1 0 01.78 1.625l-3.1 4.4-1.15 4.2a1 1 0 01-1.941-.002l-1.15-4.2-3.1-4.4A1 1 0 017 7.5l2.846-.3L12 2a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-blue-300 font-bold text-xs leading-none">{score.misses}</span>
        </div>

        {/* Timer with Clock Icon - Same size */}
        <div className="flex-1 max-w-[120px]">
          <Timer gameOver={gameOver} gameStartTime={gameStartTime} />
        </div>

        {/* Exit Button with Cross Icon - Same size */}
        <button
          onClick={() => setCurrentScreen('menu')}
          className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-md transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-red-900/30 flex items-center justify-center p-2 h-8 w-8 flex-shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
export default Header;
