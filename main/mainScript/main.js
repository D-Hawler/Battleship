import { shipDamageEvent, eventPlayers } from './eventManager.js';

class Ship {
    constructor(length) {
        this.length = length;
        this.direction = 'vertical';
        this.location = [];
        this.hitting = 0;
        this.sunk = false;

        shipDamageEvent.subscribe('SHIP_HIT', this.isSunk.bind(this));
    };

    hit() {
        this.hitting += 1;
        shipDamageEvent.publish('SHIP_HIT');
    };

    isSunk() {
        if (this.hitting === this.length) {
            this.sunk = true;
        };
    };
};

class Gameboard {
    static SIZE = 10;
    static prohibitionOfApproach = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];
    constructor () {
        this.board = Array.from({ length: Gameboard.SIZE }, () => Array(Gameboard.SIZE).fill('blank'));
    };

    static permissibleMove([coordinatesRow, coordinatesCol]) {
        return (
            coordinatesRow >= 0 && coordinatesRow < Gameboard.SIZE &&
            coordinatesCol >= 0 && coordinatesCol < Gameboard.SIZE
        );
    };

    shipPlacement(length, direction, [coordinatesRow, coordinatesCol]) {
        if (direction === 'vertical') {
            let cord = [];

            for (let i = 0; i < length; i++) {
                const row = coordinatesRow + i;
                const col = coordinatesCol;

                if (
                    Gameboard.permissibleMove([row, col]) &&
                    this.board[row][col] === 'blank'
                ) {
                    this.board[row][col] = 'ship';
                    cord.push([row, col]);
                } else {
                    throw Error('The coordinates of the ship are incorrect, they are outside the board.');
                };
            };

            for (let i = 0; i < length; i++) {
                const row = coordinatesRow + i;
                const col = coordinatesCol;

                Gameboard.prohibitionOfApproach.forEach((move) => {
                    if (
                        Gameboard.permissibleMove([row + move[0] , col + move[1]]) &&
                        this.board[row + move[0]][col + move[1]] === 'blank'
                    ) {
                        this.board[row + move[0]][col + move[1]] = 'block';
                    };
                });
            };

            return cord;
        } else {
            let cord = [];

            for (let i = 0; i < length; i++) {
                const row = coordinatesRow;
                const col = coordinatesCol + i;

                if (
                    Gameboard.permissibleMove([row, col]) &&
                    this.board[row][col] === 'blank'
                ) {
                    this.board[row][col] = 'ship';
                    cord.push([row, col]);
                } else {
                    throw Error('The coordinates of the ship are incorrect, they are outside the board.');
                };
            };

            for (let i = 0; i < length; i++) {
                const row = coordinatesRow ;
                const col = coordinatesCol + i;

                Gameboard.prohibitionOfApproach.forEach((move) => {
                    if (
                        Gameboard.permissibleMove([row + move[0] , col + move[1]]) &&
                        this.board[row + move[0]][col + move[1]] === 'blank'
                    ) {
                        this.board[row + move[0]][col + move[1]] = 'block';
                    };
                });
            };

            return cord;
        };
    };

    receiveAttack([coordinatesRow, coordinatesCol]) {
    //     if (Gameboard.permissibleMove([coordinatesRow, coordinatesCol])) throw Error('The coordinates of the ship are incorrect, they are outside the board.');

    //     if (Gameboard.board[coordinatesRow, coordinatesCol] === 'shot') throw Error('This cage has already been shot at');

    //     if (Gameboard.board[coordinatesRow, coordinatesCol] === 'ship') {
    //         Gameboard.board[coordinatesRow, coordinatesCol] === 'hitting';


    //     };

    //     if (
    //         Gameboard.board[coordinatesRow, coordinatesCol] === 'blank' ||
    //         Gameboard.board[coordinatesRow, coordinatesCol] === 'block'
    //     ) {
    //         Gameboard.board[coordinatesRow, coordinatesCol] = 'shot';
    //     };
    };
};

class Player {
    static playersArr = [];
    constructor(name, playerType) {
        this.name = name;
        this.ship = [];
        this.board = new Gameboard();
        this.playerType = playerType;
    };

    addShipToArr(ship) {
        this.ship.push(ship);
    };

    static addArr(player) {
        Player.playersArr.push(player);
    };
};

function createPlayes({ name, type }) {
    const numberOfShip = [
        {quantity: 1, length: 4},
        {quantity: 2, length: 3},
        {quantity: 3, length: 2},
        {quantity: 4, length: 1},
    ];

    const player = new Player(name, type);
    Player.addArr(player);

    numberOfShip.forEach((ship) => {
        for (let i = 0; i < ship.quantity; i++) {
            const newShip = new Ship(ship.length);
            player.addShipToArr(newShip);
        };
    });

    player.ship.forEach((ship) => {
        let x, y;
        let valid = false;

        while (!valid) {
            ship.direction = Math.random() < 0.5 ? 'vertical' : 'horizontal';

            x = Math.floor(Math.random() * Gameboard.SIZE);
            y = Math.floor(Math.random() * Gameboard.SIZE);

            try {
                ship.location = player.board.shipPlacement(
                    ship.length,
                    ship.direction,
                    [x, y]
                );

                valid = true;
            } catch (error) {};
        };
    });

    console.log(player);
};




export { createPlayes, Player, Gameboard };
