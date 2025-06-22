
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">Real-Time Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="player1Intensity" 
                  stroke="#7C3AED" 
                  strokeWidth={2}
                  name="P1 Intensity"
                />
                <Line 
                  type="monotone" 
                  dataKey="player2Intensity" 
                  stroke="#2563EB" 
                  strokeWidth={2}
                  name="P2 Intensity"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">Performance Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={getPerformanceRadarData(player1Stats)}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Player 1"
                  dataKey="value"
                  stroke="#7C3AED"
                  fill="#7C3AED"
                  fillOpacity={0.3}
                />
              </RadarChart>
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
