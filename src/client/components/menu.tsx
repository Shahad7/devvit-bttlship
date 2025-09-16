import { Play, Trophy, Ship } from 'lucide-react';
import { ScreenType } from '../shared_types';

interface MenuScreenProps {
  playerName: string;
  setPlayerName: React.Dispatch<React.SetStateAction<string>>;
  startNewGame: () => void;
  setCurrentScreen: React.Dispatch<React.SetStateAction<ScreenType>>;
}

const MenuScreen: React.FC<MenuScreenProps> = ({
  playerName,
  setPlayerName,
  startNewGame,
  setCurrentScreen,
}) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4 relative overflow-hidden flex items-center justify-center">
    {/* Animated background elements */}
    <div className="absolute inset-0 z-0">
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/3 w-60 h-60 bg-indigo-500 rounded-full filter blur-3xl opacity-15 animate-pulse"></div>
    </div>

    <div className="bg-gray-800/70 backdrop-blur-md rounded-xl p-6 max-w-sm w-full border border-blue-500/30 shadow-xl shadow-blue-900/20 relative z-10">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-xl mr-3 shadow-md shadow-blue-900/30">
            <Ship className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            BATTLESHIP
          </h1>
        </div>
        <p className="text-blue-300/90 text-sm">Sink all enemy ships before they sink you!</p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter commander name"
          value={playerName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-900/50 border border-blue-500/30 rounded-lg text-white placeholder-blue-300/60 focus:outline-none focus:border-blue-400 backdrop-blur-sm transition-all duration-200 text-center text-sm"
        />

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={startNewGame}
            className="w-full flex items-center bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-medium py-2.5 px-18 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-md shadow-blue-900/30"
          >
            <div className="flex items-center justify-center w-5 h-5 bg-blue-500/20 rounded-full flex-shrink-0">
              <Play className="w-3.5 h-3.5 text-blue-300" />
            </div>
            <span className="text-sm whitespace-nowrap flex-1 text-center">START GAME</span>
          </button>

          <button
            onClick={() => setCurrentScreen('scores')}
            className="w-full flex items-center bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-medium py-2.5 px-18 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-md shadow-amber-900/30"
          >
            <div className="flex items-center justify-center w-5 h-5 bg-amber-500/20 rounded-full flex-shrink-0">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <span className="text-sm whitespace-nowrap flex-1 text-center">HIGH SCORES</span>
          </button>
        </div>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-blue-500/10 rounded-full blur-xl"></div>
      <div className="absolute -top-3 -right-3 w-10 h-10 bg-indigo-500/10 rounded-full blur-xl"></div>
    </div>
  </div>
);

export default MenuScreen;
