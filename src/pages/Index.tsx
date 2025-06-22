import React, { useState, useCallback } from 'react';
import PlayerRegistration from '@/components/PlayerRegistration';
import TetrisGame from '@/components/TetrisGame';
import GameDashboard from '@/components/GameDashboard';
import RealTimeAnalytics from '@/components/RealTimeAnalytics';
import WebSocketManager from '@/components/WebSocketManager';
import Leaderboard from '@/components/Leaderboard';
import AdminPanel from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DetailedGameStats } from '@/utils/statsEngine';
import { playerAPI, Player } from '@/services/api';

interface PlayerData {
  nickname: string;
  email?: string;
  company?: string;
  realName?: string;
}

const Index = () => {
  const [gameState, setGameState] = useState<'registration' | 'playing'>('registration');
  const [player1Data, setPlayer1Data] = useState<PlayerData | null>(null);
  const [player2Data, setPlayer2Data] = useState<PlayerData | null>(null);
  const [player1Stats, setPlayer1Stats] = useState<DetailedGameStats | null>(null);
  const [player2Stats, setPlayer2Stats] = useState<DetailedGameStats | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handlePlayer1Ready = (data: PlayerData) => {
    console.log('Player 1 ready:', data);
    setPlayer1Data(data);
  };

  const handlePlayer2Ready = (data: PlayerData) => {
    console.log('Player 2 ready:', data);
    setPlayer2Data(data);
  };

  const startGame = () => {
    console.log('Start game clicked, player1Data:', player1Data);
    if (player1Data) {
      console.log('Setting game state to playing');
      setGameState('playing');
    }
  };

  const resetGame = () => {
    setGameState('registration');
    setPlayer1Data(null);
    setPlayer2Data(null);
    setPlayer1Stats(null);
    setPlayer2Stats(null);
  };

  const handlePlayer1StatsUpdate = useCallback((stats: DetailedGameStats) => {
    setPlayer1Stats(stats);
  }, []);

  const handlePlayer2StatsUpdate = useCallback((stats: DetailedGameStats) => {
    setPlayer2Stats(stats);
  }, []);

  const handleGameEnd = async (playerData: PlayerData, stats: DetailedGameStats) => {
    try {
      const playerRecord: Partial<Player> = {
        name: playerData.nickname,
        email: playerData.email,
        company: playerData.company,
        realName: playerData.realName,
        score: stats.score,
        level: stats.level,
        linesCleared: stats.lines,
        gameTime: Math.floor((Date.now() - stats.sessionStart) / 1000),
        tetrises: stats.tetrises,
        piecesPlaced: stats.piecesPlaced,
        averageReactionTime: stats.averageReactionTime,
        inputAccuracy: stats.inputAccuracy,
        gameplayIntensity: stats.gameplayIntensity,
        linesPerMinute: stats.linesPerMinute,
        piecesPerMinute: stats.piecesPerMinute,
        gameMode: player2Data ? 'multiplayer' : 'single',
        gameData: stats
      };

      await playerAPI.createPlayer(playerRecord);
      console.log('Player score saved to database');
    } catch (error) {
      console.error('Error saving player score:', error);
    }
  };

  console.log('Current game state:', gameState, 'player1Data:', player1Data, 'player2Data:', player2Data);

  if (gameState === 'registration') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-48 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-center">
                <img 
                  src="/valantic-logo.JPG" 
                  alt="Valantic Logo" 
                  className="h-8 w-auto object-contain"
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Valantic Digital Finance
            </h1>
            <h2 className="text-3xl font-bold mb-4" style={{ background: 'linear-gradient(315deg, #FF4B4B 0%, #FF744F 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Multiplayer Tetris Championship
            </h2>
            <p className="text-gray-600 text-lg">
              Real-time gameplay analytics powered by SAP Analytics Cloud
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button 
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
            </Button>
            <Button 
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {showAdminPanel ? 'Hide' : 'Show'} Admin Panel
            </Button>
          </div>

          {/* Leaderboard and Admin Panel */}
          {(showLeaderboard || showAdminPanel) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {showLeaderboard && (
                <Leaderboard className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg" />
              )}
              {showAdminPanel && (
                <AdminPanel className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg" />
              )}
            </div>
          )}

          {/* Player Registration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <PlayerRegistration 
                onPlayerReady={handlePlayer1Ready}
                playerNumber={1}
              />
              {player1Data && (
                <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg text-center shadow-sm">
                  <div className="text-green-600 font-semibold">✓ Player 1 Ready</div>
                  <div className="text-gray-800 font-medium">{player1Data.nickname}</div>
                </div>
              )}
            </div>
            
            <div>
              <PlayerRegistration 
                onPlayerReady={handlePlayer2Ready}
                playerNumber={2}
              />
              {player2Data && (
                <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg text-center shadow-sm">
                  <div className="text-green-600 font-semibold">✓ Player 2 Ready</div>
                  <div className="text-gray-800 font-medium">{player2Data.nickname}</div>
                </div>
              )}
            </div>
          </div>

          {/* Start Game Button */}
          <div className="text-center mb-8">
            <Button 
              onClick={startGame}
              disabled={!player1Data}
              className="px-8 py-4 text-lg text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              style={{ background: 'linear-gradient(315deg, #FF4B4B 0%, #FF744F 100%)' }}
            >
              {player1Data && player2Data ? 'Start 2-Player Game' : 
               player1Data ? 'Start Single Player' : 
               'Need at least Player 1 to start'}
            </Button>
          </div>

          {/* Instructions */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                Game Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold text-purple-700 mb-2">Controls:</div>
                  <div className="space-y-1 text-sm">
                    <div>• ← → Arrow Keys: Move left/right</div>
                    <div>• ↓ Arrow Key: Soft drop</div>
                    <div>• ↑ Arrow / Space: Rotate piece</div>
                    <div>• Z: Hard drop (instant)</div>
                    <div>• Gamepad Support: Xbox Controller</div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-blue-700 mb-2">Analytics:</div>
                  <div className="space-y-1 text-sm">
                    <div>• Real-time gameplay tracking</div>
                    <div>• Reaction time measurement</div>
                    <div>• Performance analytics dashboard</div>
                    <div>• SAP Analytics Cloud integration</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="h-8 w-32 bg-white px-2 py-1 rounded shadow-sm flex items-center justify-center border">
              <img 
                src="/valantic-logo.JPG" 
                alt="Valantic Logo" 
                className="h-5 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Valantic Tetris Championship
              </h1>
              <p className="text-gray-600">Live Analytics Dashboard</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
            </Button>
            <Button 
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {showAdminPanel ? 'Hide' : 'Show'} Admin
            </Button>
            <Button 
              onClick={resetGame}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              New Game
            </Button>
          </div>
        </div>

        {/* Leaderboard and Admin Panel */}
        {(showLeaderboard || showAdminPanel) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {showLeaderboard && (
              <Leaderboard className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg" />
            )}
            {showAdminPanel && (
              <AdminPanel className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg" />
            )}
          </div>
        )}

        {/* Game Area */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <TetrisGame
            playerNumber={1}
            playerName={player1Data?.nickname || 'Player 1'}
            onStatsUpdate={handlePlayer1StatsUpdate}
            onGameEnd={(stats) => player1Data && handleGameEnd(player1Data, stats)}
          />
          {player2Data && (
            <TetrisGame
              playerNumber={2}
              playerName={player2Data.nickname}
              onStatsUpdate={handlePlayer2StatsUpdate}
              onGameEnd={(stats) => handleGameEnd(player2Data, stats)}
            />
          )}
        </div>

        {/* Enhanced Real-Time Analytics */}
        <RealTimeAnalytics 
          player1Stats={player1Stats}
          player2Stats={player2Stats}
        />

        {/* Original Dashboard */}
        <GameDashboard 
          player1Stats={player1Stats}
          player2Stats={player2Stats}
        />

        {/* WebSocket Connection Status */}
        <WebSocketManager
          player1Stats={player1Stats}
          player2Stats={player2Stats}
          player1Name={player1Data?.nickname || 'Player 1'}
          player2Name={player2Data?.nickname || 'Player 2'}
        />
      </div>
    </div>
  );
};

export default Index;
