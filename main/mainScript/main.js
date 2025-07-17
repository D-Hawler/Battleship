import { shipDamageEvent } from './eventManager.js';

class Ship {
    constructor(id, length, location) {
        this.id = id;
        this.length = length;
        this.direction = vertical;
        this.location = location;
        this.hitting = 0;
        this.sunk = false;

        shipDamageEvent.subscribe('SHIP_HIT', this.isSunk.bind(this));
    };

    hit() {
        this.hitting += 1;
        shipDamageEvent.publish('SHIP_HIT', this.id);
    };

    isSunk() {
        if (this.hitting === this.length) {
            this.sunk = true;
        };
    };
};

class Gameboard {
    static SIZE = 10;
    static board = Array.from({ length: Gameboard.SIZE }, () => Array(Gameboard.SIZE).fill('blank'));
    static prohibitionOfApproach = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];

    static permissibleMove([locationRow, locationCol]) {
        return (
            locationRow >= 0 && locationRow <= Gameboard.SIZE &&
            locationCol >= 0 && locationCol <= Gameboard.SIZE
        );
    };

    static shipPlacement(shipID, [coordinatesRow, coordinatesCol]) {
        if (shipID.direction === 'vertical') {
            for (let i = 0; i < shipID.length; i++) {
                const row = coordinatesRow + i;
                const col = coordinatesCol;

                if (
                    Gameboard.permissibleMove([row, col]) &&
                    Gameboard.board[row][col] === 'blank'
                ) {
                    Gameboard.board[row][col] = 'ship';
                } else {
                    throw Error('The coordinates of the ship are incorrect, they are outside the board.');
                };
            };

            for (let i = 0; i < shipID.length; i++) {
                const row = coordinatesRow + i;
                const col = coordinatesCol;

                Gameboard.prohibitionOfApproach.forEach((move) => {
                    if (
                        Gameboard.permissibleMove([row + move[0] , col + move[1]]) &&
                        Gameboard.board[row + move[0]][col + move[1]] === 'blank'
                    ) {
                        Gameboard.board[row + move[0]][col + move[1]] = 'block';
                    };
                });
            };
        } else {
            for (let i = 0; i < shipID.length; i++) {
                const row = coordinatesRow;
                const col = coordinatesCol + i;

                if (
                    Gameboard.permissibleMove([row, col]) &&
                    Gameboard.board[row][col] === 'blank'
                ) {
                    Gameboard.board[row][col] = 'ship';
                } else {
                    throw Error('The coordinates of the ship are incorrect, they are outside the board.');
                };
            };

            for (let i = 0; i < shipID.length; i++) {
                const row = coordinatesRow ;
                const col = coordinatesCol + i;

                Gameboard.prohibitionOfApproach.forEach((move) => {
                    if (
                        Gameboard.permissibleMove([row + move[0] , col + move[1]]) &&
                        Gameboard.board[row + move[0]][col + move[1]] === 'blank'
                    ) {
                        Gameboard.board[row + move[0]][col + move[1]] = 'block';
                    };
                });
            };
        };
    };

    receiveAttack([x, y]) {};
};

class Player {};





module.exports = { Gameboard };
