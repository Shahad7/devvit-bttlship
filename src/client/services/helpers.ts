import { AttackResult, GameBoard, Ship, ShipDefinition } from '../types/shared_types';

const formatTime = (timeMs: number | string): string => {
  const numericTime = Number(timeMs);

  if (isNaN(numericTime)) {
    return '0:00.00';
  }

  const totalSeconds = Math.floor(numericTime / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const ms = Math.floor((numericTime % 1000) / 10);

  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};

//Ship factory function
const createShip = (length: number, notation: string, name: string): Ship => ({
  length,
  notation,
  name,
  hits: 0,
  isSunk: function (): boolean {
    return this.hits >= this.length;
  },
  hit: function (): void {
    this.hits++;
  },
});

//Random ship placement logic
const generateRandomBoard = (): { board: string[][]; ships: Record<string, Ship> } => {
  //Initialize empty board
  const board: string[][] = Array(10)
    .fill(null)
    .map(() => Array(10).fill('_'));

  //Ship definitions
  const shipDefinitions: ShipDefinition[] = [
    { notation: 'c', name: 'Carrier', length: 5 },
    { notation: 'b1', name: 'Battleship', length: 4 },
    { notation: 'b2', name: 'Battleship', length: 4 },
    { notation: 'c1', name: 'Cruiser', length: 3 },
    { notation: 'c2', name: 'Cruiser', length: 3 },
    { notation: 'c3', name: 'Cruiser', length: 3 },
    { notation: 'd1', name: 'Destroyer', length: 2 },
    { notation: 'd2', name: 'Destroyer', length: 2 },
    // { notation: 'd3', name: 'Destroyer', length: 2 },
    // { notation: 'd4', name: 'Destroyer', length: 2 },
    // { notation: 'd5', name: 'Destroyer', length: 2 },
  ];

  //Helper function to check if a ship can be placed at given position
  const canPlaceShip = (x: number, y: number, length: number, isHorizontal: boolean): boolean => {
    // Check if ship goes out of bounds
    if (isHorizontal) {
      if (y + length > 10) return false;
    } else {
      if (x + length > 10) return false;
    }

    //Check for overlaps and adjacent ships (including diagonals)
    for (let i = 0; i < length; i++) {
      const checkX = isHorizontal ? x : x + i;
      const checkY = isHorizontal ? y + i : y;

      //Check all 8 surrounding cells plus the cell itself
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const newX = checkX + dx;
          const newY = checkY + dy;

          if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10) {
            if (board[newX]![newY] !== '_') {
              return false;
            }
          }
        }
      }
    }

    return true;
  };

  //Helper function to place a ship on the board
  const placeShip = (
    x: number,
    y: number,
    length: number,
    isHorizontal: boolean,
    notation: string
  ): void => {
    for (let i = 0; i < length; i++) {
      if (isHorizontal) {
        board[x]![y + i] = notation;
      } else {
        board[x + i]![y] = notation;
      }
    }
  };

  //Attempt to place each ship randomly
  for (const shipDef of shipDefinitions) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 1000;
    while (!placed && attempts < maxAttempts) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const isHorizontal = Math.random() < 0.5;

      if (canPlaceShip(x, y, shipDef.length, isHorizontal)) {
        placeShip(x, y, shipDef.length, isHorizontal, shipDef.notation);
        placed = true;
      } else {
        attempts++;
      }
    }

    //If we couldn't place a ship after many attempts, retry
    if (!placed) {
      return generateRandomBoard();
    }
  }
  console.log('Final board after placing ships : ', board);

  //create ship objects
  const ships: Record<string, Ship> = {};
  shipDefinitions.forEach((shipDef) => {
    ships[shipDef.notation] = createShip(shipDef.length, shipDef.notation, shipDef.name);
  });

  return { board, ships };
};

//Game board factory
const createGameBoard = (): GameBoard => {
  const { board, ships } = generateRandomBoard();

  return {
    board: board,
    ships,
    receiveAttack: function (x: number, y: number): AttackResult {
      if (this.board[x]![y] === 'h' || this.board[x]![y] === 'm') {
        return { hit: false, alreadyAttacked: true };
      }

      if (this.ships[this.board[x]![y]!]) {
        this.ships[this.board[x]![y]!]!.hit();
        const shipName = this.ships[this.board[x]![y]!]!.name;
        const sunk = this.ships[this.board[x]![y]!]!.isSunk();
        this.board[x]![y] = 'h';
        return { hit: true, sunk, shipName };
      } else {
        this.board[x]![y] = 'm';
        return { hit: false };
      }
    },
    allShipsSunk: function (): boolean {
      return Object.values(this.ships).every((ship) => ship.isSunk());
    },
  };
};

export { formatTime, createGameBoard, generateRandomBoard };
