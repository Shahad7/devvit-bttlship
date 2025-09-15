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
import ScoreDisplay from './components/scoredisplay';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl opacity-15 animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Game Board */}
        <div className="flex justify-center">
          <div className="bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30 shadow-2xl shadow-blue-900/20 w-full max-w-2xl">
            <h2 className="text-white text-center text-2xl font-bold mb-6 tracking-wider text-shadow shadow-blue-500/50">
              ENEMY WATERS
            </h2>
            <div className="grid grid-cols-10 gap-2 p-5 bg-blue-900/20 rounded-xl border border-blue-400/20">
              {Array.from({ length: 100 }, (_, i) => {
                const x = Math.floor(i / 10);
                const y = i % 10;
                return (
                  <div
                    key={`${x}-${y}`}
                    onClick={() => handleCellClick(x, y)}
                    className={`w-10 h-10 flex items-center justify-center text-xl transition-all duration-300 transform hover:scale-105 rounded-lg border-2 ${getCellClass(x, y)}`}
                    style={{ boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)' }}
                  >
                    {getCellContent(x, y)}
                  </div>
                );
              })}
            </div>

            {/* Last attack result */}
            {lastAttackResult && (
              <div className="mt-6 text-center">
                <p
                  className={`text-xl font-bold ${lastAttackResult.hit ? 'text-red-300' : 'text-blue-300'} bg-gray-900/70 py-3 px-6 rounded-xl border ${lastAttackResult.hit ? 'border-red-500/30' : 'border-blue-500/30'} backdrop-blur-sm shadow-lg ${lastAttackResult.hit ? 'shadow-red-900/20' : 'shadow-blue-900/20'}`}
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
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-md">
            <div className="bg-gradient-to-br from-gray-800 to-blue-900/80 rounded-3xl p-8 max-w-md w-full text-center border-2 border-blue-500/30 shadow-2xl shadow-blue-900/30 backdrop-blur-lg">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-yellow-800"
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
                <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">Victory!</h2>
                <p className="text-blue-300">All enemy ships destroyed!</p>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-5 mb-6 border border-blue-500/20 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-5 text-white">
                  <div>
                    <div className="text-2xl font-bold bg-blue-900/30 py-2 rounded-lg">
                      {formatTime(score.time)}
                    </div>
                    <div className="text-blue-300 mt-2 text-sm uppercase tracking-wider">Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-blue-900/30 py-2 rounded-lg">
                      {Math.round((score.hits / (score.hits + score.misses)) * 100)}%
                    </div>
                    <div className="text-blue-300 mt-2 text-sm uppercase tracking-wider">
                      Accuracy
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={startNewGame}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-blue-900/30"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Play Again</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('menu')}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-gray-900/30"
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
      {currentScreen === 'game' && (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl opacity-15 animate-pulse"></div>
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Unified Header with Timer and ScoreDisplay */}
            <div className="flex justify-between items-center mb-8 bg-gray-800/70 backdrop-blur-md rounded-2xl p-5 border border-blue-500/30 shadow-2xl shadow-blue-900/20">
              <ScoreDisplay score={score} />

              {/* Timer integrated into the header */}
              <div className="flex items-center space-x-5">
                <div className="text-center bg-blue-900/30 py-2 px-5 rounded-lg border border-blue-500/20">
                  <div className="text-white font-mono text-2xl font-bold">
                    <Timer gameOver={gameOver} gameStartTime={gameStartTime} />
                  </div>
                  <div className="text-blue-300 text-sm uppercase tracking-wider mt-1">Time</div>
                </div>

                <button
                  onClick={() => setCurrentScreen('menu')}
                  className="px-5 py-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-red-900/30 flex items-center space-x-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Exit Game</span>
                </button>
              </div>
            </div>

            {/* GameScreen with all board logic */}
            <GameScreen />
          </div>
        </div>
      )}
      {currentScreen === 'scores' && (
        <HighScoreScreen highScores={highScores} setCurrentScreen={setCurrentScreen} />
      )}
    </div>
  );
};

export default BattleshipGame;
