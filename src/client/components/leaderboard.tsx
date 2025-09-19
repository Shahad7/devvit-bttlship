import { useState, useEffect } from 'react';
import {
  Trophy,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Crown,
} from 'lucide-react';
import { formatTime } from '../services/helpers';
import { ScreenType } from '../types/shared_types';

interface LeaderboardEntry {
  username: string;
  score: number;
  accuracy: number;
  rank: number;
}

interface UserRank {
  username: string;
  score: number;
  accuracy: number;
  rank: number;
}

interface LeaderboardResponse {
  page: number;
  totalPages: number;
  entries: LeaderboardEntry[];
  isFirst: boolean;
  isLast: boolean;
}

interface LeaderboardProps {
  setCurrentScreen: React.Dispatch<React.SetStateAction<ScreenType>>;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ setCurrentScreen }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/player/scores?page=${pageNum}`);
      const data: LeaderboardResponse = await res.json();

      setEntries(data.entries);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRank = async () => {
    try {
      const res = await fetch(`/api/player/score`);
      if (res.status == 200) {
        const data: UserRank = await res.json();
        setUserRank(data);
      }
    } catch (err) {
      console.error('Failed to fetch user rank:', err);
    }
  };

  useEffect(() => {
    fetchLeaderboard(page);
    fetchUserRank();
  }, [page]);

  const prevPage = () => setPage((p) => Math.max(p - 1, 1));
  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const firstPage = () => setPage(1);
  const lastPage = () => setPage(totalPages);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-3 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-indigo-500 rounded-full filter blur-3xl opacity-15 animate-pulse"></div>
      </div>

      <div className="bg-gray-800/70 backdrop-blur-md rounded-lg p-4 max-w-sm w-full border border-blue-500/30 shadow-lg shadow-blue-900/20 relative z-10">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-gradient-to-r from-yellow-600 to-amber-700 p-1.5 rounded-lg mr-2 shadow-sm shadow-yellow-900/30">
              <Trophy className="w-5 h-5 text-yellow-300" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
              HALL OF FAME
            </h1>
          </div>
          <p className="text-blue-300/90 text-xs">Elite Commanders - Best Performances</p>
        </div>

        {/* User Rank Section */}
        {userRank ? (
          <div className="mb-3 p-2 bg-blue-900/30 rounded-md border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-sm font-medium">Your Rank</span>
              </div>
              <div className="text-white font-mono text-sm">#{userRank.rank}</div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-blue-300 text-xs">{userRank.username}</span>
              <div className="flex space-x-3">
                <span className="text-white text-xs">{formatTime(userRank.score)}</span>
                <span className="text-green-400 text-xs">{userRank.accuracy}%</span>
              </div>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        ) : (
          <div className="space-y-1.5 mb-4 max-h-60 overflow-y-auto">
            {entries.map((score) => (
              <div
                key={`${score.username}-${score.rank}`}
                className={`flex items-center justify-between p-1.5 rounded-md backdrop-blur-sm border ${
                  score.rank === 1
                    ? 'bg-yellow-600/20 border-yellow-500/40'
                    : score.rank === 2
                      ? 'bg-gray-300/20 border-gray-400/40'
                      : score.rank === 3
                        ? 'bg-orange-600/20 border-orange-500/40'
                        : 'bg-blue-800/30 border-blue-500/20'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`flex items-center justify-center w-5 h-5 rounded-full font-bold text-[10px] ${
                      score.rank === 1
                        ? 'bg-yellow-500 text-yellow-900'
                        : score.rank === 2
                          ? 'bg-gray-400 text-gray-900'
                          : score.rank === 3
                            ? 'bg-orange-500 text-orange-900'
                            : 'bg-blue-600 text-white'
                    }`}
                  >
                    {score.rank}
                  </div>
                  <div className="text-white font-medium text-xs truncate max-w-[80px]">
                    {score.username || 'Anonymous'}
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-right">
                  <div className="text-white font-mono text-xs">{formatTime(score.score)}</div>
                  <div className="text-green-400 font-mono text-xs">{score.accuracy}%</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-1">
            <button
              onClick={firstPage}
              disabled={page === 1}
              className="p-1 bg-blue-700/50 text-white rounded disabled:opacity-30 transition-colors hover:bg-blue-600/50"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={prevPage}
              disabled={page === 1}
              className="p-1 bg-blue-700/50 text-white rounded disabled:opacity-30 transition-colors hover:bg-blue-600/50"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <span className="text-white text-xs font-mono">
            Page {page} of {totalPages}
          </span>

          <div className="flex space-x-1">
            <button
              onClick={nextPage}
              disabled={page === totalPages}
              className="p-1 bg-blue-700/50 text-white rounded disabled:opacity-30 transition-colors hover:bg-blue-600/50"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={lastPage}
              disabled={page === totalPages}
              className="p-1 bg-blue-700/50 text-white rounded disabled:opacity-30 transition-colors hover:bg-blue-600/50"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('menu')}
          className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-medium py-2 px-3 rounded-md transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm shadow-blue-900/30 text-xs"
        >
          RETURN TO MENU
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
