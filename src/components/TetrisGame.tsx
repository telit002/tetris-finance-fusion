
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';

export interface GameStats {
  score: number;
  level: number;
  lines: number;
  tetrises: number;
  piecesPlaced: number;
  reactionTimes: number[];
  sessionStart: number;
  lastPieceTime: number;
  keypressCount: number;
  inputMethod: 'keyboard' | 'gamepad';
}

interface TetrisGameProps {
  playerNumber: number;
  playerName: string;
  onStatsUpdate: (stats: GameStats) => void;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 30;

const PIECES = [
  { shape: [[1,1,1,1]], color: '#00FFFF' }, // I
  { shape: [[1,1],[1,1]], color: '#FFFF00' }, // O
  { shape: [[0,1,0],[1,1,1]], color: '#800080' }, // T
  { shape: [[0,1,1],[1,1,0]], color: '#00FF00' }, // S
  { shape: [[1,1,0],[0,1,1]], color: '#FF0000' }, // Z
  { shape: [[1,0,0],[1,1,1]], color: '#FF7F00' }, // J
  { shape: [[0,0,1],[1,1,1]], color: '#0000FF' }, // L
];

const TetrisGame: React.FC<TetrisGameProps> = ({ playerNumber, playerName, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const [gameState, setGameState] = useState({
    board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)),
    currentPiece: null as any,
    currentX: 0,
    currentY: 0,
    gameOver: false,
    isPaused: false
  });

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    level: 1,
    lines: 0,
    tetrises: 0,
    piecesPlaced: 0,
    reactionTimes: [],
    sessionStart: Date.now(),
    lastPieceTime: Date.now(),
    keypressCount: 0,
    inputMethod: 'keyboard'
  });

  const spawnPiece = useCallback(() => {
    const piece = PIECES[Math.floor(Math.random() * PIECES.length)];
    const newPieceTime = Date.now();
    
    setStats(prev => ({
      ...prev,
      lastPieceTime: newPieceTime
    }));

    setGameState(prev => ({
      ...prev,
      currentPiece: piece,
      currentX: Math.floor(BOARD_WIDTH / 2) - 1,
      currentY: 0
    }));
  }, []);

  const checkCollision = (board: number[][], piece: any, x: number, y: number) => {
    for (let py = 0; py < piece.shape.length; py++) {
      for (let px = 0; px < piece.shape[py].length; px++) {
        if (piece.shape[py][px]) {
          const newX = x + px;
          const newY = y + py;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const placePiece = useCallback(() => {
    const newBoard = [...gameState.board];
    const { currentPiece, currentX, currentY } = gameState;
    
    for (let py = 0; py < currentPiece.shape.length; py++) {
      for (let px = 0; px < currentPiece.shape[py].length; px++) {
        if (currentPiece.shape[py][px]) {
          const boardY = currentY + py;
          const boardX = currentX + px;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = 1;
          }
        }
      }
    }

    // Check for line clears
    const clearedLines: number[] = [];
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        clearedLines.push(y);
      }
    }

    // Remove cleared lines
    clearedLines.forEach(line => {
      newBoard.splice(line, 1);
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    });

    const linesCleared = clearedLines.length;
    const isTetrises = linesCleared === 4;

    setStats(prev => ({
      ...prev,
      score: prev.score + (linesCleared * 100 * prev.level),
      lines: prev.lines + linesCleared,
      tetrises: prev.tetrises + (isTetrises ? 1 : 0),
      piecesPlaced: prev.piecesPlaced + 1,
      level: Math.floor(prev.lines / 10) + 1
    }));

    setGameState(prev => ({
      ...prev,
      board: newBoard
    }));

    spawnPiece();
  }, [gameState, spawnPiece]);

  const rotatePiece = (piece: any) => {
    const rotated = piece.shape[0].map((_: any, index: number) =>
      piece.shape.map((row: any) => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  };

  const handleInput = useCallback((action: string) => {
    if (gameState.gameOver || gameState.isPaused) return;

    const currentTime = Date.now();
    const reactionTime = currentTime - stats.lastPieceTime;

    setStats(prev => ({
      ...prev,
      keypressCount: prev.keypressCount + 1,
      reactionTimes: prev.reactionTimes.length < 100 
        ? [...prev.reactionTimes, reactionTime]
        : [...prev.reactionTimes.slice(1), reactionTime]
    }));

    const { board, currentPiece, currentX, currentY } = gameState;

    switch (action) {
      case 'left':
        if (!checkCollision(board, currentPiece, currentX - 1, currentY)) {
          setGameState(prev => ({ ...prev, currentX: prev.currentX - 1 }));
        }
        break;
      case 'right':
        if (!checkCollision(board, currentPiece, currentX + 1, currentY)) {
          setGameState(prev => ({ ...prev, currentX: prev.currentX + 1 }));
        }
        break;
      case 'down':
        if (!checkCollision(board, currentPiece, currentX, currentY + 1)) {
          setGameState(prev => ({ ...prev, currentY: prev.currentY + 1 }));
        } else {
          placePiece();
        }
        break;
      case 'rotate':
        const rotated = rotatePiece(currentPiece);
        if (!checkCollision(board, rotated, currentX, currentY)) {
          setGameState(prev => ({ ...prev, currentPiece: rotated }));
        }
        break;
      case 'drop':
        let newY = currentY;
        while (!checkCollision(board, currentPiece, currentX, newY + 1)) {
          newY++;
        }
        setGameState(prev => ({ ...prev, currentY: newY }));
        placePiece();
        break;
    }
  }, [gameState, stats.lastPieceTime, placePiece]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          handleInput('left');
          break;
        case 'ArrowRight':
          handleInput('right');
          break;
        case 'ArrowDown':
          handleInput('down');
          break;
        case 'ArrowUp':
        case ' ':
          handleInput('rotate');
          break;
        case 'z':
        case 'Z':
          handleInput('drop');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleInput]);

  // Gamepad controls
  useEffect(() => {
    let gamepadIndex = -1;
    const checkGamepads = () => {
      const gamepads = navigator.getGamepads();
      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
          gamepadIndex = i;
          setStats(prev => ({ ...prev, inputMethod: 'gamepad' }));
          break;
        }
      }
    };

    const handleGamepadInput = () => {
      if (gamepadIndex >= 0) {
        const gamepad = navigator.getGamepads()[gamepadIndex];
        if (gamepad) {
          // D-pad and analog stick controls
          if (gamepad.axes[0] < -0.5 || gamepad.buttons[14]?.pressed) {
            handleInput('left');
          }
          if (gamepad.axes[0] > 0.5 || gamepad.buttons[15]?.pressed) {
            handleInput('right');
          }
          if (gamepad.axes[1] > 0.5 || gamepad.buttons[13]?.pressed) {
            handleInput('down');
          }
          if (gamepad.buttons[0]?.pressed || gamepad.buttons[12]?.pressed) {
            handleInput('rotate');
          }
          if (gamepad.buttons[1]?.pressed) {
            handleInput('drop');
          }
        }
      }
    };

    checkGamepads();
    const gamepadInterval = setInterval(() => {
      checkGamepads();
      handleGamepadInput();
    }, 100);

    return () => clearInterval(gamepadInterval);
  }, [handleInput]);

  // Game loop
  useEffect(() => {
    if (!gameState.currentPiece) {
      spawnPiece();
    }

    const gameLoop = () => {
      if (!gameState.gameOver && !gameState.isPaused) {
        const { board, currentPiece, currentX, currentY } = gameState;
        if (currentPiece && !checkCollision(board, currentPiece, currentX, currentY + 1)) {
          setGameState(prev => ({ ...prev, currentY: prev.currentY + 1 }));
        } else if (currentPiece) {
          placePiece();
        }
      }
      gameLoopRef.current = setTimeout(gameLoop, Math.max(50, 1000 - (stats.level * 50)));
    };

    gameLoopRef.current = setTimeout(gameLoop, 1000);

    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
      }
    };
  }, [gameState, stats.level, spawnPiece, placePiece]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);
      ctx.stroke();
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(BOARD_WIDTH * CELL_SIZE, y * CELL_SIZE);
      ctx.stroke();
    }

    // Draw board pieces
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (gameState.board[y][x]) {
          ctx.fillStyle = '#666';
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    // Draw current piece
    if (gameState.currentPiece) {
      ctx.fillStyle = gameState.currentPiece.color;
      for (let py = 0; py < gameState.currentPiece.shape.length; py++) {
        for (let px = 0; px < gameState.currentPiece.shape[py].length; px++) {
          if (gameState.currentPiece.shape[py][px]) {
            const x = (gameState.currentX + px) * CELL_SIZE;
            const y = (gameState.currentY + py) * CELL_SIZE;
            ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
          }
        }
      }
    }
  }, [gameState]);

  // Update stats callback
  useEffect(() => {
    onStatsUpdate(stats);
  }, [stats, onStatsUpdate]);

  return (
    <Card className="bg-slate-900 border-slate-600 p-4">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white">{playerName}</h3>
        <p className="text-slate-300">Player {playerNumber}</p>
      </div>
      
      <div className="flex gap-4">
        <div>
          <canvas
            ref={canvasRef}
            width={BOARD_WIDTH * CELL_SIZE}
            height={BOARD_HEIGHT * CELL_SIZE}
            className="border border-slate-600 bg-black"
          />
        </div>
        
        <div className="text-white space-y-2 min-w-[120px]">
          <div>
            <div className="text-sm text-slate-400">Score</div>
            <div className="text-lg font-mono">{stats.score.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400">Level</div>
            <div className="text-lg font-mono">{stats.level}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400">Lines</div>
            <div className="text-lg font-mono">{stats.lines}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400">Tetrises</div>
            <div className="text-lg font-mono">{stats.tetrises}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400">Pieces</div>
            <div className="text-lg font-mono">{stats.piecesPlaced}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400">Avg Reaction</div>
            <div className="text-lg font-mono">
              {stats.reactionTimes.length > 0 
                ? Math.round(stats.reactionTimes.reduce((a, b) => a + b, 0) / stats.reactionTimes.length)
                : 0}ms
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-400">Input</div>
            <div className="text-sm text-blue-400 capitalize">{stats.inputMethod}</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-slate-400 space-y-1">
        <div>Controls: Arrow keys / Gamepad</div>
        <div>Space/A: Rotate • Z/B: Drop</div>
        <div>Session: {Math.round((Date.now() - stats.sessionStart) / 1000)}s</div>
      </div>
    </Card>
  );
};

export default TetrisGame;
