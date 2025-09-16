import { Trophy } from 'lucide-react';
import { formatTime } from '../helpers';
import { HighScore, ScreenType } from '../shared_types';

interface HighScoreScreenProps {
  highScores: HighScore[];
  setCurrentScreen: React.Dispatch<React.SetStateAction<ScreenType>>;
}

const HighScoreScreen: React.FC<HighScoreScreenProps> = ({ highScores, setCurrentScreen }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4 relative overflow-hidden flex items-center justify-center">
    {/* Animated background elements */}
    <div className="absolute inset-0 z-0">
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/3 w-60 h-60 bg-indigo-500 rounded-full filter blur-3xl opacity-15 animate-pulse"></div>
    </div>

    <div className="bg-gray-800/70 backdrop-blur-md rounded-xl p-6 max-w-md w-full border border-blue-500/30 shadow-xl shadow-blue-900/20 relative z-10">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-yellow-600 to-amber-700 p-2 rounded-xl mr-3 shadow-md shadow-yellow-900/30">
            <Trophy className="w-6 h-6 text-yellow-300" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
            HALL OF FAME
          </h1>
        </div>
        <p className="text-blue-300/90 text-sm">Elite Commanders - Best Performances</p>
      </div>

      <div className="space-y-3 mb-6">
        {highScores.map((score: any, index: any) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg backdrop-blur-sm border ${
              index === 0
                ? 'bg-yellow-600/20 border-yellow-500/50 shadow-md shadow-yellow-900/20'
                : index === 1
                  ? 'bg-gray-300/20 border-gray-400/50 shadow-md shadow-gray-900/20'
                  : index === 2
                    ? 'bg-orange-600/20 border-orange-500/50 shadow-md shadow-orange-900/20'
                    : 'bg-blue-800/30 border-blue-500/30 shadow-sm shadow-blue-900/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full font-bold text-sm ${
                  index === 0
                    ? 'bg-yellow-500 text-yellow-900'
                    : index === 1
                      ? 'bg-gray-400 text-gray-900'
                      : index === 2
                        ? 'bg-orange-500 text-orange-900'
                        : 'bg-blue-600 text-white'
                }`}
              >
                {index === 0 ? '1' : index === 1 ? '2' : index === 2 ? '3' : index + 1}
              </div>
              <div>
                <div className="text-white font-medium text-sm">{score.player || 'Anonymous'}</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-right">
              <div>
                <div className="text-white font-mono text-sm">{formatTime(score.time)}</div>
                <div className="text-blue-300/80 text-xs">Time</div>
              </div>
              <div>
                <div className="text-white font-mono text-sm">{score.accuracy}%</div>
                <div className="text-blue-300/80 text-xs">Accuracy</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setCurrentScreen('menu')}
        className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-md shadow-blue-900/30"
      >
        RETURN TO COMMAND
      </button>
    </div>
  </div>
);

export default HighScoreScreen;
