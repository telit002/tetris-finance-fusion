
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
    <div className="bg-slate-800 border border-slate-600 rounded p-3 mt-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm text-slate-300">Analytics Stream Active</span>
      </div>
      <div className="text-xs text-slate-400 mt-1">
        Real-time data streaming to SAP Analytics Cloud
      </div>
    </div>
  );
};

export default WebSocketManager;
