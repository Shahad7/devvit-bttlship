import { formatTime } from '../helpers';
import { useEffect, useRef, useState } from 'react';
import React from 'react';

interface TimerProps {
  gameOver: boolean; //ms
  gameStartTime: number | null;
}

const Timer: React.FC<TimerProps> = ({ gameOver, gameStartTime }) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (gameStartTime) {
      setCurrentTime(0);
    }
  }, [gameStartTime]);

  useEffect(() => {
    if (gameStartTime && !gameOver) {
      const tick = () => {
        const elapsed = Date.now() - gameStartTime;
        setCurrentTime(elapsed);
        frameRef.current = requestAnimationFrame(tick);
      };

      frameRef.current = requestAnimationFrame(tick);

      return () => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      };
    }
  }, [gameStartTime, gameOver]);
  return (
    <div className="text-center bg-blue-900/30 py-1 px-2 rounded-md border border-blue-500/20 w-full h-8 flex items-center justify-center space-x-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3 text-blue-300 flex-shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-white font-mono text-sm font-bold leading-none">
        {formatTime(currentTime)}
      </span>
    </div>
  );
};

export default React.memo(Timer);
