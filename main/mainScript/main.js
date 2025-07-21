import { Player, Gameboard, Ship } from './constructors.js';
import { eventPlayers } from './eventManager.js';

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

    if (player.playerType === 'human') { // fix it, later
        console.log(player);
        eventPlayers.publish('playerCreated', { player });
    };
};

function getAttackResult(row, col) {
    const opponentBoard = Player.playersArr.find((elm) => elm.playerType === 'comp').ship;

    return opponentBoard.some((ship) =>
        ship.location.some(ship => ship[0] === row && ship[1] === col)
    );
};


export { createPlayes, getAttackResult };