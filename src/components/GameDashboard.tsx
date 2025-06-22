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
      fill: '#3C4BC8'
    },
    {
      player: 'Player 2',
      avgReaction: player2Stats?.reactionTimes.length 
        ? Math.round(player2Stats.reactionTimes.reduce((a, b) => a + b, 0) / player2Stats.reactionTimes.length)
        : 0,
      fill: '#FF4B4B'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-800">Score Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#CDCDCD" />
              <XAxis dataKey="time" stroke="#100C2A" />
              <YAxis stroke="#100C2A" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CDCDCD',
                  borderRadius: '8px',
                  color: '#100C2A'
                }}
              />
              {player1Stats && (
                <Line 
                  data={generateScoreData(player1Stats)}
                  type="monotone" 
                  dataKey="score" 
                  stroke="#5B26B7" 
                  strokeWidth={2}
                  name="Player 1"
                />
              )}
              {player2Stats && (
                <Line 
                  data={generateScoreData(player2Stats)}
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3C4BC8" 
                  strokeWidth={2}
                  name="Player 2"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-800">Average Reaction Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={reactionTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CDCDCD" />
              <XAxis dataKey="player" stroke="#100C2A" />
              <YAxis stroke="#100C2A" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CDCDCD',
                  borderRadius: '8px',
                  color: '#100C2A'
                }}
              />
              <Bar dataKey="avgReaction" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-800">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[player1Stats, player2Stats]
              .filter(stats => stats !== null)
              .sort((a, b) => (b?.score || 0) - (a?.score || 0))
              .map((stats, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <div className="text-gray-800 font-semibold">Player {stats === player1Stats ? '1' : '2'}</div>
                    <div className="text-gray-600 text-sm">
                      Level {stats?.level} • {stats?.tetrises} Tetrises
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-mono text-gray-800 font-bold">{stats?.score.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{stats?.lines} lines</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-800">Session Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-2xl font-mono text-gray-800 font-bold">
                {player1Stats?.keypressCount || 0}
              </div>
              <div className="text-sm text-gray-600">P1 Keypresses</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-2xl font-mono text-gray-800 font-bold">
                {player2Stats?.keypressCount || 0}
              </div>
              <div className="text-sm text-gray-600">P2 Keypresses</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-2xl font-mono text-gray-800 font-bold">
                {((player1Stats?.piecesPlaced || 0) + (player2Stats?.piecesPlaced || 0))}
              </div>
              <div className="text-sm text-gray-600">Total Pieces</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-2xl font-mono text-gray-800 font-bold">
                {Math.round(((Date.now() - (player1Stats?.sessionStart || Date.now())) / 1000))}s
              </div>
              <div className="text-sm text-gray-600">Session Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameDashboard;