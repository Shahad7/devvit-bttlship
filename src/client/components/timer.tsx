import { Clock } from 'lucide-react';
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
    <div className="flex items-center space-x-2 text-white">
      <Clock className="w-5 h-5" />
      <span className="font-mono text-xl">{formatTime(currentTime)}</span>
    </div>
  );
};
export default React.memo(Timer);
