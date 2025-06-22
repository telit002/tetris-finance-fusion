
import React, { useState, useCallback } from 'react';
import PlayerRegistration from '@/components/PlayerRegistration';
import TetrisGame, { GameStats } from '@/components/TetrisGame';
import GameDashboard from '@/components/GameDashboard';
import WebSocketManager from '@/components/WebSocketManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const [player1Stats, setPlayer1Stats] = useState<GameStats | null>(null);
  const [player2Stats, setPlayer2Stats] = useState<GameStats | null>(null);

  const handlePlayer1Ready = (data: PlayerData) => {
    setPlayer1Data(data);
  };

  const handlePlayer2Ready = (data: PlayerData) => {
    setPlayer2Data(data);
  };

  const startGame = () => {
    if (player1Data) {
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

  const handlePlayer1StatsUpdate = useCallback((stats: GameStats) => {
    setPlayer1Stats(stats);
  }, []);

  const handlePlayer2StatsUpdate = useCallback((stats: GameStats) => {
    setPlayer2Stats(stats);
  }, []);

  if (gameState === 'registration') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=60&fit=crop&crop=center"
                alt="Valantic Logo"
                className="h-16 w-auto bg-white px-4 py-2 rounded-lg shadow-lg"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Valantic Digital Finance
            </h1>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Multiplayer Tetris Championship
            </h2>
            <p className="text-gray-600 text-lg">
              Real-time gameplay analytics powered by SAP Analytics Cloud
            </p>
          </div>

          {/* Player Registration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <PlayerRegistration 
                onPlayerReady={handlePlayer1Ready}
                playerNumber={1}
              />
              {player1Data && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                  <div className="text-green-600 font-semibold">✓ Player 1 Ready</div>
                  <div className="text-gray-800">{player1Data.nickname}</div>
                </div>
              )}
            </div>
            
            <div>
              <PlayerRegistration 
                onPlayerReady={handlePlayer2Ready}
                playerNumber={2}
              />
              {player2Data && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                  <div className="text-green-600 font-semibold">✓ Player 2 Ready</div>
                  <div className="text-gray-800">{player2Data.nickname}</div>
                </div>
              )}
            </div>
          </div>

          {/* Start Game Button */}
          <div className="text-center">
            <Button 
              onClick={startGame}
              disabled={!player1Data}
              className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
            >
              {player1Data && player2Data ? 'Start 2-Player Game' : 
               player1Data ? 'Start Single Player' : 
               'Need at least Player 1 to start'}
            </Button>
          </div>

          {/* Instructions */}
          <Card className="mt-8 bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-800">Game Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-2">
              <div><strong>Controls:</strong></div>
              <div>• Arrow Keys: Move and rotate pieces</div>
              <div>• Space: Rotate piece</div>
              <div>• Z: Instant drop</div>
              <div>• Gamepad Support: Xbox Controller, Logitech F310</div>
              <div className="mt-4">
                <strong>Analytics:</strong> All gameplay data is streamed in real-time to SAP Analytics Cloud
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
        <div className="flex justify-between items-center mb-6 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-4">
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=40&fit=crop&crop=center"
              alt="Valantic Logo"
              className="h-8 w-auto bg-white px-2 py-1 rounded"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Valantic Tetris Championship
              </h1>
              <p className="text-gray-600">Live Analytics Dashboard</p>
            </div>
          </div>
          <Button 
            onClick={resetGame}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            New Game
          </Button>
        </div>

        {/* Game Area */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <TetrisGame
            playerNumber={1}
            playerName={player1Data?.nickname || 'Player 1'}
            onStatsUpdate={handlePlayer1StatsUpdate}
          />
          {player2Data && (
            <TetrisGame
              playerNumber={2}
              playerName={player2Data.nickname}
              onStatsUpdate={handlePlayer2StatsUpdate}
            />
          )}
        </div>

        {/* Analytics Dashboard */}
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
