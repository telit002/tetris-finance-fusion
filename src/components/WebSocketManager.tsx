import React, { useEffect, useRef } from 'react';
import { GameStats } from './TetrisGame';

interface WebSocketManagerProps {
  player1Stats: GameStats | null;
  player2Stats: GameStats | null;
  player1Name: string;
  player2Name: string;
}

const WebSocketManager: React.FC<WebSocketManagerProps> = ({ 
  player1Stats, 
  player2Stats, 
  player1Name, 
  player2Name 
}) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connectWebSocket = () => {
    try {
      // For now, we'll simulate the WebSocket connection
      // In production, this would connect to your Node.js backend
      console.log('Connecting to WebSocket server...');
      
      // Simulate connection
      const mockWs = {
        send: (data: string) => {
          console.log('Sending to analytics server:', JSON.parse(data));
        },
        close: () => console.log('WebSocket closed'),
        readyState: WebSocket.OPEN
      };
      
      wsRef.current = mockWs as any;
      console.log('WebSocket connected (simulated)');
      
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      
      // Retry connection after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('Retrying WebSocket connection...');
        connectWebSocket();
      }, 5000);
    }
  };

  const sendStatsUpdate = (stats: GameStats, playerName: string, playerNumber: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const payload = {
        timestamp: new Date().toISOString(),
        playerName,
        playerNumber,
        sessionId: `session_${Date.now()}`,
        stats: {
          score: stats.score,
          level: stats.level,
          lines: stats.lines,
          tetrises: stats.tetrises,
          piecesPlaced: stats.piecesPlaced,
          averageReactionTime: stats.reactionTimes.length > 0 
            ? Math.round(stats.reactionTimes.reduce((a, b) => a + b, 0) / stats.reactionTimes.length)
            : 0,
          sessionDuration: Date.now() - stats.sessionStart,
          keypressCount: stats.keypressCount,
          inputMethod: stats.inputMethod,
          recentReactionTimes: stats.reactionTimes.slice(-10) // Last 10 reaction times
        }
      };

      wsRef.current.send(JSON.stringify(payload));
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (player1Stats) {
      sendStatsUpdate(player1Stats, player1Name, 1);
    }
  }, [player1Stats, player1Name]);

  useEffect(() => {
    if (player2Stats) {
      sendStatsUpdate(player2Stats, player2Name, 2);
    }
  }, [player2Stats, player2Name]);

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 mt-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-gray-800 font-medium">SAP Analytics Cloud Connection Active</span>
      </div>
      <div className="text-sm text-gray-600 mt-2 flex items-center gap-2">
        <span>Real-time data streaming to valantic Digital Finance Analytics Dashboard</span>
        <div className="flex gap-1">
          <div className="w-1 h-4 bg-purple-400 animate-pulse"></div>
          <div className="w-1 h-4 bg-blue-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-4 bg-purple-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketManager;
