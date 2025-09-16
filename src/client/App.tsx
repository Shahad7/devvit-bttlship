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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-2 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full filter blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-indigo-500 rounded-full filter blur-2xl opacity-15 animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 h-full flex flex-col">
        {/* Game Board - Centered with proper spacing */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-gray-800/70 backdrop-blur-md rounded-lg p-3 border border-blue-500/30 shadow-lg shadow-blue-900/20 mx-auto w-full max-w-xs">
            <h2 className="text-white text-center text-lg font-bold mb-3 tracking-wider text-shadow shadow-blue-500/50">
              ENEMY WATERS
            </h2>

            {/* Grid */}
            <div className="grid grid-cols-10 gap-1 p-2 bg-blue-900/20 rounded-md border border-blue-400/20">
              {Array.from({ length: 100 }, (_, i) => {
                const x = Math.floor(i / 10);
                const y = i % 10;
                return (
                  <div
                    key={`${x}-${y}`}
                    onClick={() => handleCellClick(x, y)}
                    className={`w-5 h-5 flex items-center justify-center text-base transition-all duration-300 transform hover:scale-105 rounded-sm border-2 ${getCellClass(
                      x,
                      y
                    )}`}
                    style={{ boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)' }}
                  >
                    {getCellContent(x, y)}
                  </div>
                );
              })}
            </div>

            {/* Last attack result */}
            {lastAttackResult && (
              <div className="mt-3 text-center">
                <div
                  className={`inline-flex items-center justify-center space-x-1 ${
                    lastAttackResult.hit ? 'bg-red-900/40' : 'bg-blue-900/40'
                  } backdrop-blur-sm rounded-full px-3 py-1 border ${
                    lastAttackResult.hit
                      ? 'border-red-500/50 shadow-red-900/30'
                      : 'border-blue-500/50 shadow-blue-900/30'
                  } shadow-md`}
                >
                  <div
                    className={`rounded-full p-1 ${
                      lastAttackResult.hit ? 'bg-red-500/20' : 'bg-blue-500/20'
                    }`}
                  >
                    {lastAttackResult.hit ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.967.744L14.146 7.2 17 7.5a1 1 0 01.78 1.625l-3.1 4.4-1.15 4.2a1 1 0 01-1.941-.002l-1.15-4.2-3.1-4.4A1 1 0 017 7.5l2.846-.3L12 2a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      lastAttackResult.hit ? 'text-red-300' : 'text-blue-300'
                    }`}
                  >
                    {lastAttackResult.hit ? 'HIT!' : 'MISS'}
                    {lastAttackResult.sunk && ` - ${lastAttackResult.shipName} SUNK!`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Game Over Modal */}
        {gameOver && (
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
                    <div className="text-blue-300 mt-1 text-xs uppercase tracking-wider">
                      Accuracy
                    </div>
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
        )}
      </div>
    </div>
  );

  // Fixed menu logic with properly aligned mobile layout
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full filter blur-2xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-indigo-500 rounded-full filter blur-2xl opacity-15 animate-pulse"></div>
          </div>

          <div className="max-w-6xl mx-auto relative z-10 min-h-screen flex flex-col p-2">
            {/* Compact mobile header aligned with gameboard */}
            <div className="bg-gray-800/70 backdrop-blur-md rounded-lg px-4 py-2 border border-blue-500/30 shadow-lg shadow-blue-900/20 flex-shrink-0 max-w-xs mx-auto w-full">
              {/* Top row: Hits & Misses */}
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

              {/* Bottom row: Timer & Exit */}
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

            {/* GameScreen - Remove duplicate wrapper, direct integration */}
            <div className="flex-1 flex flex-col justify-center py-4">
              <div className="bg-gray-800/70 backdrop-blur-md rounded-lg p-3 border border-blue-500/30 shadow-lg shadow-blue-900/20 mx-auto w-full max-w-xs">
                <h2 className="text-white text-center text-lg font-bold mb-3 tracking-wider text-shadow shadow-blue-500/50">
                  ENEMY WATERS
                </h2>

                {/* Grid */}
                <div className="grid grid-cols-10 gap-1 p-2 bg-blue-900/20 rounded-md border border-blue-400/20">
                  {Array.from({ length: 100 }, (_, i) => {
                    const x = Math.floor(i / 10);
                    const y = i % 10;
                    return (
                      <div
                        key={`${x}-${y}`}
                        onClick={() => handleCellClick(x, y)}
                        className={`w-5 h-5 flex items-center justify-center text-base transition-all duration-300 transform hover:scale-105 rounded-sm border-2 ${getCellClass(
                          x,
                          y
                        )}`}
                        style={{ boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)' }}
                      >
                        {getCellContent(x, y)}
                      </div>
                    );
                  })}
                </div>

                {/* Last attack result - Fixed height to prevent shake */}
                <div className="mt-3 text-center h-8 flex items-center justify-center">
                  {lastAttackResult && (
                    <div
                      className={`inline-flex items-center justify-center space-x-1 ${
                        lastAttackResult.hit ? 'bg-red-900/40' : 'bg-blue-900/40'
                      } backdrop-blur-sm rounded-full px-3 py-1 border ${
                        lastAttackResult.hit
                          ? 'border-red-500/50 shadow-red-900/30'
                          : 'border-blue-500/50 shadow-blue-900/30'
                      } shadow-md animate-in fade-in duration-300`}
                    >
                      <div
                        className={`rounded-full p-1 ${
                          lastAttackResult.hit ? 'bg-red-500/20' : 'bg-blue-500/20'
                        }`}
                      >
                        {lastAttackResult.hit ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-red-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-blue-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.967.744L14.146 7.2 17 7.5a1 1 0 01.78 1.625l-3.1 4.4-1.15 4.2a1 1 0 01-1.941-.002l-1.15-4.2-3.1-4.4A1 1 0 017 7.5l2.846-.3L12 2a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          lastAttackResult.hit ? 'text-red-300' : 'text-blue-300'
                        }`}
                      >
                        {lastAttackResult.hit ? 'HIT!' : 'MISS'}
                        {lastAttackResult.sunk && ` - ${lastAttackResult.shipName} SUNK!`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Game Over Modal */}
            {gameOver && (
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
                        <div className="text-blue-300 mt-1 text-xs uppercase tracking-wider">
                          Time
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold bg-blue-900/30 py-1 rounded">
                          {Math.round((score.hits / (score.hits + score.misses)) * 100)}%
                        </div>
                        <div className="text-blue-300 mt-1 text-xs uppercase tracking-wider">
                          Accuracy
                        </div>
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
            )}
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
