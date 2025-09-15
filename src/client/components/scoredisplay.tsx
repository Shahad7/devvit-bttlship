import React from 'react';
import { Target } from 'lucide-react';
import { Score } from '../shared_types';

interface ScoreDisplayProps {
  score: Score;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
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
  );
};

export default ScoreDisplay;
