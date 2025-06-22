
export interface DetailedGameStats {
  score: number;
  level: number;
  lines: number;
  tetrises: number;
  piecesPlaced: number;
  reactionTimes: number[];
  sessionStart: number;
  keypressCount: number;
  inputMethod: 'keyboard' | 'gamepad';
  // Enhanced stats
  averageReactionTime: number;
  bestReactionTime: number;
  worstReactionTime: number;
  linesPerMinute: number;
  piecesPerMinute: number;
  scorePerMinute: number;
  inputAccuracy: number;
  gameplayIntensity: number;
  timeToFirstTetris: number | null;
  consecutiveTetrisCount: number;
  perfectClears: number;
  tSpinSingles: number;
  tSpinDoubles: number;
  tSpinTriples: number;
  holdCount: number;
  dropSpeed: number[];
  movementPatterns: { [key: string]: number };
  errorCount: number;
  recoveryTime: number[];
}

export class StatsEngine {
  private stats: DetailedGameStats;
  private lastPieceTime: number = 0;
  private lastInputTime: number = 0;
  private validInputCount: number = 0;
  private totalInputCount: number = 0;

  constructor() {
    this.stats = this.initializeStats();
  }

  private initializeStats(): DetailedGameStats {
    return {
      score: 0,
      level: 1,
      lines: 0,
      tetrises: 0,
      piecesPlaced: 0,
      reactionTimes: [],
      sessionStart: Date.now(),
      keypressCount: 0,
      inputMethod: 'keyboard',
      averageReactionTime: 0,
      bestReactionTime: Infinity,
      worstReactionTime: 0,
      linesPerMinute: 0,
      piecesPerMinute: 0,
      scorePerMinute: 0,
      inputAccuracy: 100,
      gameplayIntensity: 0,
      timeToFirstTetris: null,
      consecutiveTetrisCount: 0,
      perfectClears: 0,
      tSpinSingles: 0,
      tSpinDoubles: 0,
      tSpinTriples: 0,
      holdCount: 0,
      dropSpeed: [],
      movementPatterns: {},
      errorCount: 0,
      recoveryTime: []
    };
  }

  recordInput(inputType: string, isValid: boolean = true): void {
    const now = Date.now();
    this.stats.keypressCount++;
    this.totalInputCount++;
    
    if (isValid) {
      this.validInputCount++;
    } else {
      this.stats.errorCount++;
    }

    // Track movement patterns
    this.stats.movementPatterns[inputType] = (this.stats.movementPatterns[inputType] || 0) + 1;

    // Calculate reaction time if we have a previous input
    if (this.lastInputTime > 0) {
      const reactionTime = now - this.lastInputTime;
      if (reactionTime < 2000) { // Only count reasonable reaction times
        this.stats.reactionTimes.push(reactionTime);
        this.updateReactionTimeStats(reactionTime);
      }
    }

    this.lastInputTime = now;
    this.updateInputAccuracy();
    this.updateGameplayIntensity();
  }

  private updateReactionTimeStats(reactionTime: number): void {
    this.stats.bestReactionTime = Math.min(this.stats.bestReactionTime, reactionTime);
    this.stats.worstReactionTime = Math.max(this.stats.worstReactionTime, reactionTime);
    
    if (this.stats.reactionTimes.length > 0) {
      this.stats.averageReactionTime = 
        this.stats.reactionTimes.reduce((a, b) => a + b, 0) / this.stats.reactionTimes.length;
    }
  }

  private updateInputAccuracy(): void {
    this.stats.inputAccuracy = this.totalInputCount > 0 
      ? (this.validInputCount / this.totalInputCount) * 100 
      : 100;
  }

  private updateGameplayIntensity(): void {
    const sessionTime = (Date.now() - this.stats.sessionStart) / 1000 / 60; // minutes
    if (sessionTime > 0) {
      this.stats.gameplayIntensity = this.stats.keypressCount / sessionTime;
    }
  }

  recordPiecePlaced(): void {
    const now = Date.now();
    this.stats.piecesPlaced++;
    
    if (this.lastPieceTime > 0) {
      const dropTime = now - this.lastPieceTime;
      this.stats.dropSpeed.push(dropTime);
    }
    
    this.lastPieceTime = now;
    this.updatePerMinuteStats();
  }

  recordLinesCleared(linesCleared: number, isTetris: boolean = false, isSpecial: boolean = false): void {
    this.stats.lines += linesCleared;
    
    if (isTetris) {
      this.stats.tetrises++;
      this.stats.consecutiveTetrisCount++;
      
      if (this.stats.timeToFirstTetris === null) {
        this.stats.timeToFirstTetris = Date.now() - this.stats.sessionStart;
      }
    } else {
      this.stats.consecutiveTetrisCount = 0;
    }

    if (isSpecial) {
      // This would be expanded based on the type of special clear
      this.stats.perfectClears++;
    }

    this.updateLevel();
    this.updatePerMinuteStats();
  }

  recordScore(scoreIncrease: number): void {
    this.stats.score += scoreIncrease;
    this.updatePerMinuteStats();
  }

  private updateLevel(): void {
    this.stats.level = Math.floor(this.stats.lines / 10) + 1;
  }

  private updatePerMinuteStats(): void {
    const sessionTime = (Date.now() - this.stats.sessionStart) / 1000 / 60; // minutes
    if (sessionTime > 0) {
      this.stats.linesPerMinute = this.stats.lines / sessionTime;
      this.stats.piecesPerMinute = this.stats.piecesPlaced / sessionTime;
      this.stats.scorePerMinute = this.stats.score / sessionTime;
    }
  }

  recordHold(): void {
    this.stats.holdCount++;
  }

  getStats(): DetailedGameStats {
    this.updatePerMinuteStats();
    return { ...this.stats };
  }

  reset(): void {
    this.stats = this.initializeStats();
    this.lastPieceTime = 0;
    this.lastInputTime = 0;
    this.validInputCount = 0;
    this.totalInputCount = 0;
  }
}
