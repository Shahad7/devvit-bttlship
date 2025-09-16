import { LastAttackResult } from '../shared_types';

interface LastAttackResultProps {
  lastAttackResult: LastAttackResult | null;
}

const LastAttackDetails: React.FC<LastAttackResultProps> = ({ lastAttackResult }) => {
  return (
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
  );
};

export default LastAttackDetails;
