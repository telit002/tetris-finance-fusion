import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsEngine, DetailedGameStats } from '@/utils/statsEngine';

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
  onStatsUpdate: (stats: DetailedGameStats) => void;
  onGameEnd?: (stats: DetailedGameStats) => void;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 25;

const TETROMINOES = {
  I: { shape: [[1,1,1,1]], color: '#3C4BC8' },
  O: { shape: [[1,1],[1,1]], color: '#FF744F' },
  T: { shape: [[0,1,0],[1,1,1]], color: '#5B26B7' },
  S: { shape: [[0,1,1],[1,1,0]], color: '#193773' },
  Z: { shape: [[1,1,0],[0,1,1]], color: '#FF4B4B' },
  J: { shape: [[1,0,0],[1,1,1]], color: '#3C4BC8' },
  L: { shape: [[0,0,1],[1,1,1]], color: '#FF744F' }
};

const TetrisGame: React.FC<TetrisGameProps> = ({ playerNumber, playerName, onStatsUpdate, onGameEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const dropTimerRef = useRef<number | null>(null);
  const lastDropTime = useRef<number>(0);
  const statsEngineRef = useRef<StatsEngine>(new StatsEngine());
  
  const [board, setBoard] = useState<number[][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0))
  );
  
  const [currentPiece, setCurrentPiece] = useState<any>(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 4, y: 0 });

  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const generatePiece = useCallback(() => {
    const pieces = Object.keys(TETROMINOES);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)] as keyof typeof TETROMINOES;
    return {
      type: randomPiece,
      shape: TETROMINOES[randomPiece].shape,
      color: TETROMINOES[randomPiece].color
    };
  }, []);

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

  const rotatePiece = useCallback((piece: any) => {
    if (!piece || !piece.shape) return piece;
    const rotated = piece.shape[0].map((_: any, index: number) =>
      piece.shape.map((row: any) => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  // Clear lines with enhanced tracking
  const clearLines = useCallback((gameBoard: number[][]) => {
    const newBoard = gameBoard.filter(row => row.some(cell => cell === 0));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    
    if (linesCleared > 0) {
      const emptyRows = Array(linesCleared).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
      const updatedBoard = [...emptyRows, ...newBoard];
      
      const scoreIncrease = linesCleared === 4 ? 1000 : linesCleared * 100;
      const isTetris = linesCleared === 4;
      
      // Enhanced stats tracking
      statsEngineRef.current.recordLinesCleared(linesCleared, isTetris);
      statsEngineRef.current.recordScore(scoreIncrease);
      
      return updatedBoard;
    }
    
    return gameBoard;
  }, []);

  // Place piece with enhanced tracking
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
    
    // Enhanced stats tracking
    statsEngineRef.current.recordPiecePlaced();
    
    return clearLines(newBoard);
  }, [clearLines]);

  // Move piece with enhanced input tracking
  const movePiece = useCallback((dx: number, dy: number, rotate = false) => {
    if (isGameOver || isPaused || !currentPiece) return;

    // Determine input type and validate move
    let inputType = 'move';
    if (rotate) inputType = 'rotate';
    else if (dx < 0) inputType = 'left';
    else if (dx > 0) inputType = 'right';
    else if (dy > 0) inputType = 'down';

    let newPiece = currentPiece;
    if (rotate) {
      newPiece = rotatePiece(currentPiece);
    }

    const newPosition = {
      x: currentPosition.x + dx,
      y: currentPosition.y + dy
    };

    const isValidMove = !checkCollision(newPiece, newPosition, board);
    
    // Record input with validation
    statsEngineRef.current.recordInput(inputType, isValidMove);

    if (isValidMove) {
      setCurrentPiece(newPiece);
      setCurrentPosition(newPosition);
    }
  }, [isGameOver, isPaused, currentPiece, currentPosition, board, rotatePiece, checkCollision]);

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
          ctx.fillStyle = '#CDCDCD';
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          ctx.strokeStyle = '#100C2A';
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
            ctx.strokeStyle = '#100C2A';
            ctx.strokeRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
          }
        }
      }
    }

    // Draw grid
    ctx.strokeStyle = '#100C2A';
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

  useEffect(() => {
    if (!currentPiece) {
      const initialPiece = generatePiece();
      setCurrentPiece(initialPiece);
      setCurrentPosition({ x: 4, y: 0 });
    }
  }, [currentPiece, generatePiece]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Update stats callback with enhanced data
  useEffect(() => {
    const currentStats = statsEngineRef.current.getStats();
    onStatsUpdate(currentStats);
  }, [onStatsUpdate, currentPiece, currentPosition, board]);

  // Call onGameEnd when game ends
  useEffect(() => {
    if (isGameOver && onGameEnd) {
      const finalStats = statsEngineRef.current.getStats();
      onGameEnd(finalStats);
    }
  }, [isGameOver, onGameEnd]);

  const resetGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
    setCurrentPiece(generatePiece());
    setCurrentPosition({ x: 4, y: 0 });
    setIsGameOver(false);
    setIsPaused(false);
    statsEngineRef.current.reset();
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <Card className="bg-white border-gray-200 shadow-2xl">
      <CardHeader className="text-center bg-gray-800 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">
          {playerName} (Player {playerNumber})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4 p-6">
        <canvas
          ref={canvasRef}
          width={BOARD_WIDTH * BLOCK_SIZE}
          height={BOARD_HEIGHT * BLOCK_SIZE}
          className="border-2 border-gray-300 bg-white rounded-lg shadow-inner"
        />
        
        <div className="grid grid-cols-2 gap-4 text-gray-800 text-sm w-full">
          <div className="text-center bg-gray-100 p-2 rounded">
            <div className="font-mono text-lg font-bold">{statsEngineRef.current.getStats().score.toLocaleString()}</div>
            <div className="text-gray-800">Score</div>
          </div>
          <div className="text-center bg-blue-500 p-2 rounded">
            <div className="font-mono text-lg font-bold text-white">{statsEngineRef.current.getStats().level}</div>
            <div className="text-white">Level</div>
          </div>
          <div className="text-center bg-purple-500 p-2 rounded">
            <div className="font-mono text-lg font-bold text-white">{statsEngineRef.current.getStats().lines}</div>
            <div className="text-white">Lines</div>
          </div>
          <div className="text-center bg-orange-500 p-2 rounded">
            <div className="font-mono text-lg font-bold text-white">{Math.round(statsEngineRef.current.getStats().inputAccuracy)}%</div>
            <div className="text-white">Accuracy</div>
          </div>
        </div>

        {/* Enhanced Stats Display */}
        <div className="grid grid-cols-3 gap-2 text-gray-800 text-xs w-full">
          <div className="text-center bg-blue-600 p-2 rounded">
            <div className="font-mono font-bold text-white">{Math.round(statsEngineRef.current.getStats().linesPerMinute)}</div>
            <div className="text-white">L/min</div>
          </div>
          <div className="text-center bg-orange-500 p-2 rounded">
            <div className="font-mono font-bold text-white">{Math.round(statsEngineRef.current.getStats().averageReactionTime)}ms</div>
            <div className="text-white">Avg RT</div>
          </div>
          <div className="text-center bg-red-500 p-2 rounded">
            <div className="font-mono font-bold text-white">{Math.round(statsEngineRef.current.getStats().gameplayIntensity)}</div>
            <div className="text-white">Intensity</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={togglePause}
            disabled={isGameOver}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          
          {isGameOver && (
            <Button
              onClick={resetGame}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Play Again
            </Button>
          )}
        </div>

        {isGameOver && (
          <div className="text-center bg-red-500 p-4 rounded-lg border border-red-600">
            <div className="text-white font-bold text-lg mb-2">Game Over!</div>
            <div className="text-white">Final Score: {statsEngineRef.current.getStats().score.toLocaleString()}</div>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div className="text-center bg-orange-500 p-4 rounded-lg border border-orange-600">
            <div className="text-white font-bold">Game Paused</div>
          </div>
        )}

        <div className="text-xs text-gray-600 text-center bg-gray-100 p-2 rounded">
          Input: keyboard | Keypresses: {statsEngineRef.current.getStats().keypressCount}
          <br />
          Controls: ← → ↓ ↑ (rotate) | Space (rotate) | Z (drop)
        </div>
      </CardContent>
    </Card>
  );
};

export default TetrisGame;
