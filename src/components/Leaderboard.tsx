import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Trash2, Eye, BarChart3, RefreshCw } from 'lucide-react';
import { playerAPI, Player } from '../services/api';

interface LeaderboardProps {
  currentGameStats?: any;
  onViewPlayerDetails?: (player: Player) => void;
  isAdmin?: boolean;
  onDeletePlayer?: (id: string) => void;
  className?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  currentGameStats, 
  onViewPlayerDetails, 
  isAdmin = false, 
  onDeletePlayer,
  className
}) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'level' | 'lines' | 'date'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterMode, setFilterMode] = useState<'all' | 'single' | 'multiplayer'>('all');

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await playerAPI.getLeaderboard();
      setPlayers(data);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const saveGameResult = (stats: any, playerData: any) => {
    const newRecord: Player = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: playerData.nickname,
      email: playerData.email,
      company: playerData.company,
      realName: playerData.realName,
      score: stats.score,
      level: stats.level,
      linesCleared: stats.lines,
      tetrises: stats.tetrises,
      piecesPlaced: stats.piecesPlaced,
      averageReactionTime: stats.averageReactionTime,
      inputAccuracy: stats.inputAccuracy,
      gameplayIntensity: stats.gameplayIntensity,
      linesPerMinute: stats.linesPerMinute,
      piecesPerMinute: stats.piecesPerMinute,
      gameTime: Date.now() - stats.sessionStart,
      timestamp: new Date().toISOString(),
      gameMode: 'single' // or 'multiplayer' based on game type
    };

    const updatedData = [...players, newRecord];
    localStorage.setItem('tetris-leaderboard', JSON.stringify(updatedData));
    setPlayers(updatedData);
  };

  const handleDeletePlayer = (id: string) => {
    if (onDeletePlayer) {
      onDeletePlayer(id);
    } else {
      const updatedData = players.filter(player => player.id !== id);
      localStorage.setItem('tetris-leaderboard', JSON.stringify(updatedData));
      setPlayers(updatedData);
    }
  };

  const getSortedAndFilteredData = () => {
    let filtered = players;
    
    if (filterMode !== 'all') {
      filtered = players.filter(player => player.gameMode === filterMode);
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'desc') {
        return bValue - aValue;
      } else {
        return aValue - bValue;
      }
    });
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-sm font-medium text-gray-500">#{index + 1}</span>;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card className={`${className} bg-white shadow-lg`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading leaderboard...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`${className} bg-white shadow-lg`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchLeaderboard} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedData = getSortedAndFilteredData();

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
          <p className="text-gray-600">Top Tetris Champions</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="score">Sort by Score</option>
            <option value="level">Sort by Level</option>
            <option value="lines">Sort by Lines</option>
            <option value="date">Sort by Date</option>
          </select>
          
          <select 
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Games</option>
            <option value="single">Single Player</option>
            <option value="multiplayer">Multiplayer</option>
          </select>
          
          <Button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            variant="outline"
            size="sm"
          >
            {sortOrder === 'desc' ? '↓' : '↑'}
          </Button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Player Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Player</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Level</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Lines</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Accuracy</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  {isAdmin && (
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {sortedData.slice(0, 20).map((player, index) => (
                  <tr key={player.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(index)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-semibold text-gray-800">{player.name}</div>
                        {player.company && (
                          <div className="text-sm text-gray-500">{player.company}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-lg font-bold text-gray-800">
                      {player.score.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{player.level}</td>
                    <td className="py-3 px-4 text-gray-700">{player.linesCleared}</td>
                    <td className="py-3 px-4 text-gray-700">{Math.round(player.inputAccuracy)}%</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(player.timestamp).toLocaleDateString()}
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => onViewPlayerDetails?.(player)}
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeletePlayer(player.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {sortedData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No games played yet. Be the first to set a record!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Summary */}
      {sortedData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-800">
                {sortedData.length}
              </div>
              <div className="text-sm text-yellow-600">Total Games</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-800">
                {Math.max(...sortedData.map(p => p.score)).toLocaleString()}
              </div>
              <div className="text-sm text-blue-600">Highest Score</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-800">
                {Math.max(...sortedData.map(p => p.level))}
              </div>
              <div className="text-sm text-green-600">Highest Level</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-800">
                {Math.round(sortedData.reduce((sum, p) => sum + p.inputAccuracy, 0) / sortedData.length)}%
              </div>
              <div className="text-sm text-purple-600">Avg Accuracy</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Leaderboard; 