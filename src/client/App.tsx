import React, { useState, useEffect } from 'react';
import { Clock, Trophy, RotateCcw, Target } from 'lucide-react';
import MenuScreen from './components/menuscreen';
import {
  GameBoard,
  Score,
  ScreenType,
  Ship,
  ShipDefinition,
  AttackResult,
  HighScore,
  LastAttackResult,
} from './shared_types';
import HighScoreScreen from './components/highscorescreen';
import { createGameBoard, formatTime } from './helpers';
import Timer from './components/timer';

const BattleshipGame: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('menu');
  const [gameBoard, setGameBoard] = useState<GameBoard | null>(null);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<Score>({ hits: 0, misses: 0, time: 0 });
  const [highScores, setHighScores] = useState<HighScore[]>([
    { rank: 1, player: 'Admiral Nelson', time: 45, accuracy: 95 },
    { rank: 2, player: 'Captain Hook', time: 52, accuracy: 88 },
    { rank: 3, player: 'Sailor Moon', time: 67, accuracy: 82 },
    { rank: 4, player: 'Pirate Pete', time: 73, accuracy: 79 },
    { rank: 5, player: 'Sea Wolf', time: 89, accuracy: 75 },
  ]);
  const [lastAttackResult, setLastAttackResult] = useState<LastAttackResult | null>(null);
  const [playerName, setPlayerName] = useState<string>('');

  const startNewGame = (): void => {
    // console.log('starting new game...');
    setGameBoard(createGameBoard());
    setGameStartTime(Date.now());
    setGameOver(false);
    setScore({ hits: 0, misses: 0, time: 0 });
    setLastAttackResult(null);
    setCurrentScreen('game');
  };

  const handleCellClick = (x: number, y: number): void => {
    if (gameOver || !gameBoard) return;

    // console.log(`coordinates of attack : (${x}, ${y})`);
    const result = gameBoard.receiveAttack(x, y);
    console.log('attack result:', result);

    if (result.alreadyAttacked) return;

    setScore((prev) => ({
      ...prev,
      hits: result.hit ? prev.hits + 1 : prev.hits,
      misses: result.hit ? prev.misses : prev.misses + 1,
    }));

    setLastAttackResult({
      x,
      y,
      ...result,
    });

    if (gameBoard.allShipsSunk()) {
      const finalTime = Math.floor((Date.now() - (gameStartTime || 0)) / 1000);
      const accuracy = Math.round(
        ((score.hits + (result.hit ? 1 : 0)) / (score.hits + score.misses + 1)) * 100
      );
      setScore((prev) => ({ ...prev, time: finalTime }));
      setGameOver(true);

      // Add to high scores if good enough
      const newScore: HighScore = {
        rank: 0,
        player: playerName || 'Anonymous',
        time: finalTime,
        accuracy,
      };

      const updatedScores = [...highScores, newScore]
        .sort((a, b) => a.time - b.time || b.accuracy - a.accuracy)
        .slice(0, 10)
        .map((score, index) => ({ ...score, rank: index + 1 }));

      setHighScores(updatedScores);
    }
  };

  const getCellContent = (x: number, y: number): string => {
    if (!gameBoard) return '';
    const cell = gameBoard.board[x]![y];

    if (cell === 'h') return '🎯';
    if (cell === 'm') return '💧';
    return '';
  };

  const getCellClass = (x: number, y: number): string => {
    if (!gameBoard) return 'bg-blue-500 hover:bg-blue-400';
    const cell = gameBoard.board[x]![y];

    if (cell === 'h') return 'bg-red-500';
    if (cell === 'm') return 'bg-gray-500';
    return 'bg-blue-500 hover:bg-blue-400 cursor-pointer';
  };

  const GameScreen: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-black/20 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-6">
            <Timer gameOver={gameOver} gameStartTime={gameStartTime} />
            <div className="flex items-center space-x-4 text-white">
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4 text-red-400" />
                <span>{score.hits} hits</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-4 h-4 text-blue-400">💧</span>
                <span>{score.misses} misses</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentScreen('menu')}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
            >
              Exit Game
            </button>
          </div>
        </div>

        {/* Game Board */}
        <div className="flex justify-center">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-white text-center text-xl font-bold mb-4">Enemy Waters</h2>
            <div className="grid grid-cols-10 gap-1 p-4 bg-blue-900/30 rounded-lg">
              {Array.from({ length: 100 }, (_, i) => {
                const x = Math.floor(i / 10);
                const y = i % 10;
                return (
                  <div
                    key={`${x}-${y}`}
                    onClick={() => handleCellClick(x, y)}
                    className={`w-8 h-8 border border-blue-300/30 rounded flex items-center justify-center text-lg transition-all duration-200 ${getCellClass(x, y)}`}
                  >
                    {getCellContent(x, y)}
                  </div>
                );
              })}
            </div>

            {/* Last attack result */}
            {lastAttackResult && (
              <div className="mt-4 text-center">
                <p
                  className={`text-lg font-bold ${lastAttackResult.hit ? 'text-red-400' : 'text-blue-400'}`}
                >
                  {lastAttackResult.hit ? '🎯 HIT!' : '💧 MISS'}
                  {lastAttackResult.sunk && ` - ${lastAttackResult.shipName} SUNK!`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Game Over Modal */}
        {gameOver && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-blue-900 rounded-2xl p-8 max-w-md w-full text-center border border-blue-400">
              <div className="mb-6">
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Victory!</h2>
                <p className="text-blue-200">All enemy ships destroyed!</p>
              </div>

              <div className="bg-black/20 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-white">
                  <div>
                    <div className="text-2xl font-bold">{formatTime(score.time)}</div>
                    <div className="text-blue-300">Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {Math.round((score.hits / (score.hits + score.misses)) * 100)}%
                    </div>
                    <div className="text-blue-300">Accuracy</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={startNewGame}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Play Again</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('menu')}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Main Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="font-mono">
      {currentScreen === 'menu' && (
        <MenuScreen
          playerName={playerName}
          setPlayerName={setPlayerName}
          startNewGame={startNewGame}
          setCurrentScreen={setCurrentScreen}
        />
      )}
      {currentScreen === 'game' && <GameScreen />}
      {currentScreen === 'scores' && (
        <HighScoreScreen highScores={highScores} setCurrentScreen={setCurrentScreen} />
      )}
    </div>
  );
};

export default BattleshipGame;
