// Type definitions
export interface Ship {
  length: number;
  notation: string;
  name: string;
  hits: number;
  isSunk: () => boolean;
  hit: () => void;
}

export interface GameBoard {
  board: string[][];
  ships: Record<string, Ship>;
  receiveAttack: (x: number, y: number) => AttackResult;
  allShipsSunk: () => boolean;
}

export interface AttackResult {
  hit: boolean;
  alreadyAttacked?: boolean;
  sunk?: boolean;
  shipName?: string;
}

export interface Score {
  hits: number;
  misses: number;
  time: number;
}

export interface HighScore {
  player: string;
  time: number;
  accuracy: number;
}

export interface LastAttackResult extends AttackResult {
  x: number;
  y: number;
}

export type ScreenType = 'menu' | 'game' | 'scores' | 'create';

// Ship placement types
export interface ShipDefinition {
  notation: string;
  name: string;
  length: number;
}
