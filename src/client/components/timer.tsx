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
    <div className="text-center bg-blue-900/30 py-1 px-3 rounded-md border border-blue-500/20">
      <div className="text-white font-mono text-base font-bold">{formatTime(currentTime)}</div>
      <div className="text-blue-300 text-xs uppercase tracking-wider">TIME</div>
    </div>
  );
};
export default React.memo(Timer);
