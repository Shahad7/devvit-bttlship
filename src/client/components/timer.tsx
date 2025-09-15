import { Clock } from 'lucide-react';
import { formatTime } from '../helpers';
import { memo, useEffect, useState } from 'react';

interface TimerProps {
  gameOver: boolean; //ms
  gameStartTime: number | null;
}

const Timer: React.FC<TimerProps> = memo(({ gameOver, gameStartTime }) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  //timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameStartTime && !gameOver) {
      interval = setInterval(() => {
        setCurrentTime(Date.now() - gameStartTime);
      }, 10);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStartTime, gameOver]);
  return (
    <div className="flex items-center space-x-2 text-white">
      <Clock className="w-5 h-5" />
      <span className="font-mono text-xl">{formatTime(currentTime)}</span>
    </div>
  );
});
export default Timer;
