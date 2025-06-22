import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { DetailedGameStats } from '@/utils/statsEngine';
import { Activity, Clock, TrendingUp, Target } from 'lucide-react';

interface RealTimeAnalyticsProps {
  player1Stats: DetailedGameStats | null;
  player2Stats: DetailedGameStats | null;
}

const RealTimeAnalytics: React.FC<RealTimeAnalyticsProps> = ({ player1Stats, player2Stats }) => {
  const [realtimeData, setRealtimeData] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = Date.now();
      const newDataPoint = {
        time: new Date().toLocaleTimeString(),
        timestamp,
        player1Score: player1Stats?.score || 0,
        player2Score: player2Stats?.score || 0,
        player1Intensity: player1Stats?.gameplayIntensity || 0,
        player2Intensity: player2Stats?.gameplayIntensity || 0,
        player1ReactionTime: player1Stats?.averageReactionTime || 0,
        player2ReactionTime: player2Stats?.averageReactionTime || 0
      };

      setRealtimeData(prev => [...prev.slice(-19), newDataPoint]);
    }, 1000);

    return () => clearInterval(interval);
  }, [player1Stats, player2Stats]);

  const getPerformanceRadarData = (stats: DetailedGameStats | null) => {
    if (!stats) return [];

    return [
      { metric: 'Speed', value: Math.min(stats.piecesPerMinute * 2, 100) },
      { metric: 'Accuracy', value: stats.inputAccuracy },
      { metric: 'Efficiency', value: Math.min(stats.linesPerMinute * 10, 100) },
      { metric: 'Consistency', value: stats.reactionTimes.length > 0 ? 
        Math.max(0, 100 - (stats.worstReactionTime - stats.bestReactionTime) / 10) : 50 },
      { metric: 'Intensity', value: Math.min(stats.gameplayIntensity, 100) }
    ];
  };

  const formatTime = (ms: number) => {
    return ms === Infinity ? '∞' : `${Math.round(ms)}ms`;
  };

  // Define performanceData for the bar chart
  const performanceData = [
    { range: '0-20', value: Math.round(player1Stats?.gameplayIntensity || 0) },
    { range: '21-40', value: Math.round(player1Stats?.linesPerMinute || 0) },
    { range: '41-60', value: Math.round(player1Stats?.inputAccuracy || 0) },
    { range: '61-80', value: Math.round(player1Stats?.averageReactionTime || 0) },
    { range: '81-100', value: Math.round(player1Stats?.piecesPerMinute || 0) }
  ];

  return (
    <div className="space-y-6">
      {/* Real-time Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Gameplay Intensity</p>
                <p className="text-2xl font-bold text-blue-800">
                  {Math.round(player1Stats?.gameplayIntensity || 0)}
                </p>
                <p className="text-xs text-blue-500">inputs/min</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Avg Reaction Time</p>
                <p className="text-2xl font-bold text-green-800">
                  {formatTime(player1Stats?.averageReactionTime || 0)}
                </p>
                <p className="text-xs text-green-500">
                  Best: {formatTime(player1Stats?.bestReactionTime || 0)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Input Accuracy</p>
                <p className="text-2xl font-bold text-purple-800">
                  {Math.round(player1Stats?.inputAccuracy || 100)}%
                </p>
                <p className="text-xs text-purple-500">
                  {player1Stats?.errorCount || 0} errors
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Lines/Min</p>
                <p className="text-2xl font-bold text-orange-800">
                  {Math.round(player1Stats?.linesPerMinute || 0)}
                </p>
                <p className="text-xs text-orange-500">efficiency</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">Real-time Intensity Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CDCDCD" />
                <XAxis dataKey="time" stroke="#100C2A" fontSize={12} />
                <YAxis stroke="#100C2A" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CDCDCD',
                    borderRadius: '8px',
                    color: '#100C2A'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="player1Intensity"
                  stroke="#5B26B7"
                  strokeWidth={2}
                  name="P1 Intensity"
                />
                <Line
                  type="monotone"
                  dataKey="player2Intensity"
                  stroke="#3C4BC8"
                  strokeWidth={2}
                  name="P2 Intensity"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">Performance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CDCDCD" />
                <XAxis dataKey="range" stroke="#100C2A" />
                <YAxis stroke="#100C2A" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CDCDCD',
                    borderRadius: '8px',
                    color: '#100C2A'
                  }}
                />
                <Bar
                  name="Player 1"
                  dataKey="value"
                  stroke="#5B26B7"
                  fill="#5B26B7"
                  fillOpacity={0.3}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Movement Analysis */}
      <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-800">Movement Pattern Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {player1Stats && Object.entries(player1Stats.movementPatterns).map(([key, count]) => (
              <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-800">{count}</div>
                <div className="text-sm text-gray-600">{key.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAnalytics;
