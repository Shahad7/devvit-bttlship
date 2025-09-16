import React, { useState } from 'react';
import MenuScreen from './components/menu';
import { GameBoard, Score, ScreenType, HighScore, LastAttackResult } from './shared_types';
import HighScoreScreen from './components/high-scores';
import { createGameBoard } from './helpers';
import Header from './components/header';
import GameOver from './components/game-over';
import LastAttackDetails from './components/last-attack-result';

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
    console.log('setting start time : ' + Date.now());
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
      const currentInstant = Date.now();

      const finalTime = Math.floor(currentInstant - (gameStartTime || 0));
      console.log(finalTime);
      console.log(currentInstant);
      console.log(gameStartTime);
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

  //not as a React.FC since it leads to timer flickering when score changes (hacky)
  const GameScreen = (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full filter blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-indigo-500 rounded-full filter blur-2xl opacity-15 animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 min-h-screen flex flex-col p-2">
        <Header
          score={score}
          gameOver={gameOver}
          gameStartTime={gameStartTime}
          setCurrentScreen={setCurrentScreen}
        />
        {/* Game board*/}
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

            {/* Last attack result */}
            <LastAttackDetails lastAttackResult={lastAttackResult} />
          </div>
        </div>

        {/* Game Over modal */}
        {gameOver && (
          <GameOver setCurrentScreen={setCurrentScreen} startNewGame={startNewGame} score={score} />
        )}
      </div>
    </div>
  );

  // menu switch logic
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

      {currentScreen === 'game' && GameScreen}

      {currentScreen === 'scores' && (
        <HighScoreScreen highScores={highScores} setCurrentScreen={setCurrentScreen} />
      )}
    </div>
  );
};
export default BattleshipGame;
