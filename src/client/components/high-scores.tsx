import { Trophy } from 'lucide-react';
import { formatTime } from '../helpers';
import { HighScore, ScreenType } from '../shared_types';

interface HighScoreScreenProps {
  highScores: HighScore[];
  setCurrentScreen: React.Dispatch<React.SetStateAction<ScreenType>>;
}

const HighScoreScreen: React.FC<HighScoreScreenProps> = ({ highScores, setCurrentScreen }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 max-w-2xl w-full border border-blue-400/30">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Trophy className="w-12 h-12 text-yellow-400 mr-3" />
          <h1 className="text-4xl font-bold text-white">HIGH SCORES</h1>
        </div>
        <p className="text-blue-200">Hall of Fame - Best Commanders</p>
      </div>

      <div className="space-y-3 mb-8">
        {highScores.map((score: any, index: any) => (
          <div
            key={index}
            className={`flex items-center justify-between p-4 rounded-lg ${
              index === 0
                ? 'bg-yellow-600/20 border border-yellow-400/50'
                : index === 1
                  ? 'bg-gray-300/20 border border-gray-400/50'
                  : index === 2
                    ? 'bg-orange-600/20 border border-orange-400/50'
                    : 'bg-blue-800/30 border border-blue-400/30'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                {score.rank === 1
                  ? '🥇'
                  : score.rank === 2
                    ? '🥈'
                    : score.rank === 3
                      ? '🥉'
                      : score.rank}
              </div>
              <div>
                <div className="text-white font-semibold">{score.player}</div>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-right">
              <div>
                <div className="text-white font-mono">{formatTime(score.time)}</div>
                <div className="text-blue-300 text-sm">Time</div>
              </div>
              <div>
                <div className="text-white font-mono">{score.accuracy}%</div>
                <div className="text-blue-300 text-sm">Accuracy</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setCurrentScreen('menu')}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
      >
        Back to Menu
      </button>
    </div>
  </div>
);

export default HighScoreScreen;
