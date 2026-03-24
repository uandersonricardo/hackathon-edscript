export type Lane = 0 | 1 | 2;
export type GameStatus = 'idle' | 'playing' | 'gameover';

export interface ObstacleData {
  id: number;
  lane: Lane;
  z: number;
  poolIndex: number;
}

export interface GameRef {
  status: GameStatus;
  lane: Lane;
  targetLane: Lane;
  playerX: number;
  playerY: number;
  isJumping: boolean;
  jumpTimer: number;
  speed: number;
  score: number;
  time: number;
  nextObstacleIn: number;
  obstacles: ObstacleData[];
  obstacleCounter: number;
}
