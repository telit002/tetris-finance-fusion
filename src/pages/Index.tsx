
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Valantic Digital Finance
            </h1>
            <h2 className="text-3xl font-bold text-blue-400 mb-4">
              Multiplayer Tetris Championship
            </h2>
            <p className="text-slate-300 text-lg">
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
                <div className="mt-4 p-3 bg-green-900/20 border border-green-600 rounded text-center">
                  <div className="text-green-400 font-semibold">✓ Player 1 Ready</div>
                  <div className="text-white">{player1Data.nickname}</div>
                </div>
              )}
            </div>
            
            <div>
              <PlayerRegistration 
                onPlayerReady={handlePlayer2Ready}
                playerNumber={2}
              />
              {player2Data && (
                <div className="mt-4 p-3 bg-green-900/20 border border-green-600 rounded text-center">
                  <div className="text-green-400 font-semibold">✓ Player 2 Ready</div>
                  <div className="text-white">{player2Data.nickname}</div>
                </div>
              )}
            </div>
          </div>

          {/* Start Game Button */}
          <div className="text-center">
            <Button 
              onClick={startGame}
              disabled={!player1Data}
              className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              {player1Data && player2Data ? 'Start 2-Player Game' : 
               player1Data ? 'Start Single Player' : 
               'Need at least Player 1 to start'}
            </Button>
          </div>

          {/* Instructions */}
          <Card className="mt-8 bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Game Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-2">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Valantic Tetris Championship
            </h1>
            <p className="text-slate-300">Live Analytics Dashboard</p>
          </div>
          <Button 
            onClick={resetGame}
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-800"
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
