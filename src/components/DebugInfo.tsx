import React from 'react';

interface DebugInfoProps {
  isProcessing: boolean;
  error: string | null;
  user: any;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ isProcessing, error, user }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 font-mono text-sm z-50">
      <div className="max-w-4xl mx-auto space-y-2">
        <div>
          <span className="font-bold">Processing:</span>{' '}
          <span className={isProcessing ? 'text-yellow-400' : 'text-green-400'}>
            {isProcessing.toString()}
          </span>
        </div>
        <div>
          <span className="font-bold">Error:</span>{' '}
          <span className={error ? 'text-red-400' : 'text-green-400'}>
            {error || 'null'}
          </span>
        </div>
        <div>
          <span className="font-bold">User:</span>{' '}
          <span className={user ? 'text-green-400' : 'text-red-400'}>
            {user ? JSON.stringify(user, null, 2) : 'null'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DebugInfo;
