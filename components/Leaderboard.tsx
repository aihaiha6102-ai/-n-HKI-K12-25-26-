
import React from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  const sorted = [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeSpent - b.timeSpent;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-teal-100">
      <h2 className="text-2xl font-bold text-teal-800 mb-6 flex items-center">
        <span className="mr-2">🏆</span> Bảng Thành Tích
      </h2>
      <div className="space-y-4">
        {sorted.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có kết quả nào được ghi nhận.</p>
        ) : (
          sorted.map((entry, idx) => (
            <div 
              key={idx} 
              className={`flex items-center justify-between p-4 rounded-lg border ${
                idx === 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-100'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className={`text-xl font-bold ${idx === 0 ? 'text-yellow-600' : 'text-gray-400'}`}>
                  #{idx + 1}
                </span>
                <div>
                  <p className="font-semibold text-gray-800">{entry.name}</p>
                  <p className="text-xs text-gray-500">Lớp: {entry.className}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-teal-600 font-bold text-lg">{entry.score.toFixed(2)}đ</p>
                <p className="text-xs text-gray-400">{Math.floor(entry.timeSpent / 60)}p {entry.timeSpent % 60}s</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
