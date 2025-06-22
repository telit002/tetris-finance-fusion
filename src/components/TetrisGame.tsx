
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface GameStats {
  score: number;
  level: number;
  lines: number;
  tetrises: number;
  piecesPlaced: number;
  reactionTimes: number[];
  sessionStart: number;
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
const BLOCK_SIZE = 25;

const TETROMINOES = {
  I: { shape: [[1,1,1,1]], color: '#00f5ff' },
  O: { shape: [[1,1],[1,1]], color: '#ffff00' },
  T: { shape: [[0,1,0],[1,1,1]], color: '#800080' },
  S: { shape: [[0,1,1],[1,1,0]], color: '#00ff00' },
  Z: { shape: [[1,1,0],[0,1,1]], color: '#ff0000' },
  J: { shape: [[1,0,0],[1,1,1]], color: '#0000ff' },
  L: { shape: [[0,0,1],[1,1,1]], color: '#ffa500' }
};

const TetrisGame: React.FC<TetrisGameProps> = ({ playerNumber, playerName, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const dropTimerRef = useRef<number | null>(null);
  const lastDropTime = useRef<number>(0);
  
  const [board, setBoard] = useState<number[][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0))
  );
  
  const [currentPiece, setCurrentPiece] = useState<any>(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 4, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    level: 1,
    lines: 0,
    tetrises: 0,
    piecesPlaced: 0,
    reactionTimes: [],
    sessionStart: Date.now(),
    keypressCount: 0,
    inputMethod: 'keyboard'
  });

  // Generate random piece
  const generatePiece = useCallback(() => {
    const pieces = Object.keys(TETROMINOES);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)] as keyof typeof TETROMINOES;
    return {
      type: randomPiece,
      shape: TETROMINOES[randomPiece].shape,
      color: TETROMINOES[randomPiece].color
    };
  }, []);

  // Check collision
  const checkCollision = useCallback((piece: any, pos: { x: number; y: number }, gameBoard: number[][]) => {
    if (!piece || !piece.shape) return true;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          
          if (newY >= 0 && gameBoard[newY] && gameBoard[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  // Rotate piece
  const rotatePiece = useCallback((piece: any) => {
    if (!piece || !piece.shape) return piece;
    const rotated = piece.shape[0].map((_: any, index: number) =>
      piece.shape.map((row: any) => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  // Clear lines
  const clearLines = useCallback((gameBoard: number[][]) => {
    const newBoard = gameBoard.filter(row => row.some(cell => cell === 0));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    
    if (linesCleared > 0) {
      const emptyRows = Array(linesCleared).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
      const updatedBoard = [...emptyRows, ...newBoard];
      
      const scoreIncrease = linesCleared === 4 ? 1000 : linesCleared * 100;
      const isTetris = linesCleared === 4;
      
      setStats(prev => ({
        ...prev,
        lines: prev.lines + linesCleared,
        score: prev.score + scoreIncrease,
        tetrises: prev.tetrises + (isTetris ? 1 : 0),
        level: Math.floor((prev.lines + linesCleared) / 10) + 1
      }));
      
      return updatedBoard;
    }
    
    return gameBoard;
  }, []);

  // Place piece on board
  const placePiece = useCallback((piece: any, pos: { x: number; y: number }, gameBoard: number[][]) => {
    if (!piece || !piece.shape) return gameBoard;
    
    const newBoard = gameBoard.map(row => [...row]);
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardX = pos.x + x;
          const boardY = pos.y + y;
          if (boardX >= 0 && boardX < BOARD_WIDTH && boardY >= 0 && boardY < BOARD_HEIGHT) {
            newBoard[boardY][boardX] = 1;
          }
        }
      }
    }
    
    setStats(prev => ({
      ...prev,
      piecesPlaced: prev.piecesPlaced + 1
    }));
    
    return clearLines(newBoard);
  }, [clearLines]);

  // Move piece
  const movePiece = useCallback((dx: number, dy: number, rotate = false) => {
    if (isGameOver || isPaused || !currentPiece) return;

    setStats(prev => ({
      ...prev,
      keypressCount: prev.keypressCount + 1
    }));

    let newPiece = currentPiece;
    if (rotate) {
      newPiece = rotatePiece(currentPiece);
    }

    const newPosition = {
      x: currentPosition.x + dx,
      y: currentPosition.y + dy
    };

    if (!checkCollision(newPiece, newPosition, board)) {
      setCurrentPiece(newPiece);
      setCurrentPosition(newPosition);
    }
  }, [isGameOver, isPaused, currentPiece, currentPosition, board, rotatePiece, checkCollision]);

  // Drop piece
  const dropPiece = useCallback(() => {
    if (isGameOver || isPaused || !currentPiece) return;

    const newPosition = {
      x: currentPosition.x,
      y: currentPosition.y + 1
    };

    if (!checkCollision(currentPiece, newPosition, board)) {
      setCurrentPosition(newPosition);
    } else {
      // Piece has landed
      const newBoard = placePiece(currentPiece, currentPosition, board);
      const newPiece = generatePiece();
      const startPosition = { x: 4, y: 0 };

      if (checkCollision(newPiece, startPosition, newBoard)) {
        setIsGameOver(true);
      } else {
        setBoard(newBoard);
        setCurrentPiece(newPiece);
        setCurrentPosition(startPosition);
      }
    }
  }, [isGameOver, isPaused, currentPiece, currentPosition, board, checkCollision, placePiece, generatePiece]);

  // Keyboard controls
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    switch (event.key) {
      case 'ArrowLeft':
        movePiece(-1, 0);
        break;
      case 'ArrowRight':
        movePiece(1, 0);
        break;
      case 'ArrowDown':
        movePiece(0, 1);
        break;
      case 'ArrowUp':
      case ' ':
        movePiece(0, 0, true);
        break;
      case 'z':
      case 'Z':
        dropPiece();
        break;
    }
  }, [movePiece, dropPiece]);

  // Drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[y] && board[y][x]) {
          ctx.fillStyle = '#666';
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          ctx.strokeStyle = '#333';
          ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
    }

    // Draw current piece
    if (currentPiece && currentPiece.shape) {
      ctx.fillStyle = currentPiece.color;
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const drawX = (currentPosition.x + x) * BLOCK_SIZE;
            const drawY = (currentPosition.y + y) * BLOCK_SIZE;
            ctx.fillRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
            ctx.strokeStyle = '#000';
            ctx.strokeRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
          }
        }
      }
    }

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * BLOCK_SIZE, 0);
      ctx.lineTo(x * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
      ctx.stroke();
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * BLOCK_SIZE);
      ctx.lineTo(BOARD_WIDTH * BLOCK_SIZE, y * BLOCK_SIZE);
      ctx.stroke();
    }
  }, [board, currentPiece, currentPosition]);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      const now = Date.now();
      if (now - lastDropTime.current > 1000) {
        dropPiece();
        lastDropTime.current = now;
      }
      draw();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    if (!isGameOver && !isPaused) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [dropPiece, draw, isGameOver, isPaused]);

  // Initialize game
  useEffect(() => {
    if (!currentPiece) {
      const initialPiece = generatePiece();
      setCurrentPiece(initialPiece);
      setCurrentPosition({ x: 4, y: 0 });
    }
  }, [currentPiece, generatePiece]);

  // Keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Update stats callback
  useEffect(() => {
    onStatsUpdate(stats);
  }, [stats, onStatsUpdate]);

  const resetGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
    setCurrentPiece(generatePiece());
    setCurrentPosition({ x: 4, y: 0 });
    setIsGameOver(false);
    setIsPaused(false);
    setStats({
      score: 0,
      level: 1,
      lines: 0,
      tetrises: 0,
      piecesPlaced: 0,
      reactionTimes: [],
      sessionStart: Date.now(),
      keypressCount: 0,
      inputMethod: 'keyboard'
    });
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-purple-900 border-purple-600 shadow-2xl">
      <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">
          {playerName} (Player {playerNumber})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4 p-6">
        <canvas
          ref={canvasRef}
          width={BOARD_WIDTH * BLOCK_SIZE}
          height={BOARD_HEIGHT * BLOCK_SIZE}
          className="border-2 border-purple-400 bg-black rounded-lg shadow-inner"
        />
        
        <div className="grid grid-cols-2 gap-4 text-white text-sm w-full">
          <div className="text-center bg-purple-800/50 p-2 rounded">
            <div className="font-mono text-lg font-bold">{stats.score.toLocaleString()}</div>
            <div className="text-purple-200">Score</div>
          </div>
          <div className="text-center bg-blue-800/50 p-2 rounded">
            <div className="font-mono text-lg font-bold">{stats.level}</div>
            <div className="text-blue-200">Level</div>
          </div>
          <div className="text-center bg-purple-800/50 p-2 rounded">
            <div className="font-mono text-lg font-bold">{stats.lines}</div>
            <div className="text-purple-200">Lines</div>
          </div>
          <div className="text-center bg-blue-800/50 p-2 rounded">
            <div className="font-mono text-lg font-bold">{stats.tetrises}</div>
            <div className="text-blue-200">Tetrises</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={togglePause}
            disabled={isGameOver}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          
          {isGameOver && (
            <Button
              onClick={resetGame}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Play Again
            </Button>
          )}
        </div>

        {isGameOver && (
          <div className="text-center bg-red-900/80 p-4 rounded-lg border border-red-600">
            <div className="text-red-300 font-bold text-lg mb-2">Game Over!</div>
            <div className="text-white">Final Score: {stats.score.toLocaleString()}</div>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div className="text-center bg-yellow-900/80 p-4 rounded-lg border border-yellow-600">
            <div className="text-yellow-300 font-bold">Game Paused</div>
          </div>
        )}

        <div className="text-xs text-purple-300 text-center bg-purple-900/30 p-2 rounded">
          Input: {stats.inputMethod} | Keypresses: {stats.keypressCount}
          <br />
          Controls: ← → ↓ ↑ (rotate) | Space (rotate) | Z (drop)
        </div>
      </CardContent>
    </Card>
  );
};

export default TetrisGame;
