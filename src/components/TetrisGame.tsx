
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const gamepadRef = useRef<Gamepad | null>(null);
  
  const [gameState, setGameState] = useState({
    board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)),
    currentPiece: null as any,
    currentPosition: { x: 0, y: 0 },
    isGameOver: false,
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
    keypressCount: 0,
    inputMethod: 'keyboard'
  });

  const [lastPieceTime, setLastPieceTime] = useState<number>(0);

  // Generate random piece
  const generatePiece = useCallback(() => {
    const pieces = Object.keys(TETROMINOES);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)] as keyof typeof TETROMINOES;
    setLastPieceTime(Date.now());
    return {
      type: randomPiece,
      shape: TETROMINOES[randomPiece].shape,
      color: TETROMINOES[randomPiece].color
    };
  }, []);

  // Check collision
  const checkCollision = useCallback((piece: any, position: { x: number; y: number }, board: number[][]) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = position.x + x;
          const newY = position.y + y;
          
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
  }, []);

  // Rotate piece
  const rotatePiece = useCallback((piece: any) => {
    const rotated = piece.shape[0].map((_: any, index: number) =>
      piece.shape.map((row: any) => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  // Clear lines
  const clearLines = useCallback((board: number[][]) => {
    const newBoard = board.filter(row => row.some(cell => cell === 0));
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
    
    return board;
  }, []);

  // Place piece on board
  const placePiece = useCallback((piece: any, position: { x: number; y: number }, board: number[][]) => {
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardX = position.x + x;
          const boardY = position.y + y;
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
    if (gameState.isGameOver || gameState.isPaused) return;

    // Record reaction time for first input after new piece
    if (lastPieceTime > 0) {
      const reactionTime = Date.now() - lastPieceTime;
      setStats(prev => ({
        ...prev,
        reactionTimes: [...prev.reactionTimes.slice(-9), reactionTime],
        keypressCount: prev.keypressCount + 1
      }));
      setLastPieceTime(0);
    } else {
      setStats(prev => ({
        ...prev,
        keypressCount: prev.keypressCount + 1
      }));
    }

    setGameState(prev => {
      let newPiece = prev.currentPiece;
      if (rotate && newPiece) {
        newPiece = rotatePiece(newPiece);
      }

      const newPosition = {
        x: prev.currentPosition.x + dx,
        y: prev.currentPosition.y + dy
      };

      if (newPiece && !checkCollision(newPiece, newPosition, prev.board)) {
        return {
          ...prev,
          currentPiece: newPiece,
          currentPosition: newPosition
        };
      }

      return prev;
    });
  }, [gameState.isGameOver, gameState.isPaused, lastPieceTime, rotatePiece, checkCollision]);

  // Drop piece
  const dropPiece = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    setGameState(prev => {
      if (!prev.currentPiece) return prev;

      const newPosition = {
        x: prev.currentPosition.x,
        y: prev.currentPosition.y + 1
      };

      if (!checkCollision(prev.currentPiece, newPosition, prev.board)) {
        return {
          ...prev,
          currentPosition: newPosition
        };
      } else {
        // Piece has landed
        const newBoard = placePiece(prev.currentPiece, prev.currentPosition, prev.board);
        const newPiece = generatePiece();
        const startPosition = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };

        if (checkCollision(newPiece, startPosition, newBoard)) {
          return {
            ...prev,
            board: newBoard,
            isGameOver: true
          };
        }

        return {
          ...prev,
          board: newBoard,
          currentPiece: newPiece,
          currentPosition: startPosition
        };
      }
    });
  }, [gameState.isGameOver, gameState.isPaused, checkCollision, placePiece, generatePiece]);

  // Gamepad support
  const updateGamepad = useCallback(() => {
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[playerNumber - 1];
    
    if (gamepad) {
      gamepadRef.current = gamepad;
      setStats(prev => ({ ...prev, inputMethod: 'gamepad' }));
      
      // Simple button mapping for common gamepads
      if (gamepad.buttons[12]?.pressed) movePiece(0, -1); // D-pad up (rotate)
      if (gamepad.buttons[13]?.pressed) movePiece(0, 1); // D-pad down
      if (gamepad.buttons[14]?.pressed) movePiece(-1, 0); // D-pad left
      if (gamepad.buttons[15]?.pressed) movePiece(1, 0); // D-pad right
      if (gamepad.buttons[0]?.pressed) movePiece(0, 0, true); // A button (rotate)
    }
  }, [playerNumber, movePiece]);

  // Keyboard controls
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
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
        // Hard drop
        while (!gameState.isGameOver) {
          dropPiece();
        }
        break;
    }
  }, [movePiece, dropPiece, gameState.isGameOver]);

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
        if (gameState.board[y][x]) {
          ctx.fillStyle = '#666';
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          ctx.strokeStyle = '#333';
          ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
    }

    // Draw current piece
    if (gameState.currentPiece) {
      ctx.fillStyle = gameState.currentPiece.color;
      for (let y = 0; y < gameState.currentPiece.shape.length; y++) {
        for (let x = 0; x < gameState.currentPiece.shape[y].length; x++) {
          if (gameState.currentPiece.shape[y][x]) {
            const drawX = (gameState.currentPosition.x + x) * BLOCK_SIZE;
            const drawY = (gameState.currentPosition.y + y) * BLOCK_SIZE;
            ctx.fillRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
            ctx.strokeStyle = '#000';
            ctx.strokeRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
          }
        }
      }
    }

    // Draw grid
    ctx.strokeStyle = '#333';
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
  }, [gameState]);

  // Game loop
  const gameLoop = useCallback(() => {
    updateGamepad();
    draw();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [updateGamepad, draw]);

  // Initialize game
  useEffect(() => {
    const initialPiece = generatePiece();
    setGameState(prev => ({
      ...prev,
      currentPiece: initialPiece,
      currentPosition: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }
    }));

    // Start game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    // Start drop timer
    dropTimerRef.current = window.setInterval(() => {
      dropPiece();
    }, 1000);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      if (dropTimerRef.current) {
        clearInterval(dropTimerRef.current);
      }
    };
  }, [generatePiece, gameLoop, dropPiece]);

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
    setGameState({
      board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)),
      currentPiece: generatePiece(),
      currentPosition: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      isGameOver: false,
      isPaused: false
    });
    
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

  return (
    <Card className="bg-slate-900 border-slate-600">
      <CardHeader className="text-center">
        <CardTitle className="text-white text-xl">
          {playerName} (Player {playerNumber})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <canvas
          ref={canvasRef}
          width={BOARD_WIDTH * BLOCK_SIZE}
          height={BOARD_HEIGHT * BLOCK_SIZE}
          className="border border-slate-600 bg-black"
        />
        
        <div className="grid grid-cols-2 gap-4 text-white text-sm w-full">
          <div className="text-center">
            <div className="font-mono text-lg">{stats.score.toLocaleString()}</div>
            <div className="text-slate-400">Score</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-lg">{stats.level}</div>
            <div className="text-slate-400">Level</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-lg">{stats.lines}</div>
            <div className="text-slate-400">Lines</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-lg">{stats.tetrises}</div>
            <div className="text-slate-400">Tetrises</div>
          </div>
        </div>

        {gameState.isGameOver && (
          <div className="text-center">
            <div className="text-red-400 font-bold mb-2">Game Over!</div>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Play Again
            </button>
          </div>
        )}

        <div className="text-xs text-slate-400 text-center">
          Input: {stats.inputMethod} | Keypresses: {stats.keypressCount}
        </div>
      </CardContent>
    </Card>
  );
};

export default TetrisGame;
