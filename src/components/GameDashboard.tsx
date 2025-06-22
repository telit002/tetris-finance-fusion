
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { GameStats } from './TetrisGame';

interface GameDashboardProps {
  player1Stats: GameStats | null;
  player2Stats: GameStats | null;
}

const GameDashboard: React.FC<GameDashboardProps> = ({ player1Stats, player2Stats }) => {
  const generateScoreData = (stats: GameStats | null) => {
    if (!stats) return [];
    const sessionDuration = (Date.now() - stats.sessionStart) / 1000;
    const intervals = Math.min(20, Math.floor(sessionDuration / 10));
    
    return Array.from({ length: intervals }, (_, i) => ({
      time: i * 10,
      score: Math.floor(stats.score * (i + 1) / intervals)
    }));
  };

  const reactionTimeData = [
    {
      player: 'Player 1',
      avgReaction: player1Stats?.reactionTimes.length 
        ? Math.round(player1Stats.reactionTimes.reduce((a, b) => a + b, 0) / player1Stats.reactionTimes.length)
        : 0,
      fill: '#3B82F6'
    },
    {
      player: 'Player 2',
      avgReaction: player2Stats?.reactionTimes.length 
        ? Math.round(player2Stats.reactionTimes.reduce((a, b) => a + b, 0) / player2Stats.reactionTimes.length)
        : 0,
      fill: '#EF4444'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card className="bg-slate-900 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Score Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  color: '#fff'
                }} 
              />
              {player1Stats && (
                <Line 
                  data={generateScoreData(player1Stats)}
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Player 1"
                />
              )}
              {player2Stats && (
                <Line 
                  data={generateScoreData(player2Stats)}
                  type="monotone" 
                  dataKey="score" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Player 2"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Average Reaction Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={reactionTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="player" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="avgReaction" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[player1Stats, player2Stats]
              .filter(stats => stats !== null)
              .sort((a, b) => (b?.score || 0) - (a?.score || 0))
              .map((stats, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-800 rounded">
                  <div>
                    <div className="text-white font-semibold">Player {stats === player1Stats ? '1' : '2'}</div>
                    <div className="text-slate-400 text-sm">
                      Level {stats?.level} • {stats?.tetrises} Tetrises
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-mono text-white">{stats?.score.toLocaleString()}</div>
                    <div className="text-sm text-slate-400">{stats?.lines} lines</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Session Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-800 p-3 rounded">
              <div className="text-2xl font-mono text-blue-400">
                {player1Stats?.keypressCount || 0}
              </div>
              <div className="text-sm text-slate-400">P1 Keypresses</div>
            </div>
            <div className="bg-slate-800 p-3 rounded">
              <div className="text-2xl font-mono text-red-400">
                {player2Stats?.keypressCount || 0}
              </div>
              <div className="text-sm text-slate-400">P2 Keypresses</div>
            </div>
            <div className="bg-slate-800 p-3 rounded">
              <div className="text-2xl font-mono text-green-400">
                {((player1Stats?.piecesPlaced || 0) + (player2Stats?.piecesPlaced || 0))}
              </div>
              <div className="text-sm text-slate-400">Total Pieces</div>
            </div>
            <div className="bg-slate-800 p-3 rounded">
              <div className="text-2xl font-mono text-yellow-400">
                {Math.round(((Date.now() - (player1Stats?.sessionStart || Date.now())) / 1000))}s
              </div>
              <div className="text-sm text-slate-400">Session Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameDashboard;
