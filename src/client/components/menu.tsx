import { Play, Ship, Trophy } from 'lucide-react';
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
  <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-blue-400/30">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Ship className="w-12 h-12 text-blue-300 mr-3" />
          <h1 className="text-4xl font-bold text-white">BATTLESHIP</h1>
        </div>
        <p className="text-blue-200">Find and sink all enemy ships as fast as possible!</p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter your name (optional)"
          value={playerName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)}
          className="w-full px-4 py-3 bg-blue-900/50 border border-blue-400/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-300"
        />

        <button
          onClick={startNewGame}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          <Play className="w-5 h-5" />
          <span>START GAME</span>
        </button>

        <button
          onClick={() => setCurrentScreen('scores')}
          className="w-full flex items-center justify-center space-x-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          <Trophy className="w-5 h-5" />
          <span>HIGH SCORES</span>
        </button>
      </div>
    </div>
  </div>
);

export default MenuScreen;
