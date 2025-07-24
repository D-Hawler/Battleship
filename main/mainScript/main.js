import { Player, Gameboard, Ship } from './constructors.js';
import { eventPlayers, round, turnState } from './eventManager.js';

// Creates a player object and fills it with ships
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

    // console.log(player);
    if (player.playerType === 'human') { // fix it, later
        turnState.isPlayerTurn = true;
        eventPlayers.publish('playerCreated', { player });
    };
};


// returns the result of the player's attack
function hitCheck(cell, [row, col]) {
    if (!cell) throw Error('The variable “cell” was not found.');
    if (cell.dataset.status === 'miss' || cell.dataset.status === 'hit') return;

    if (getAttackResult(row, col)) return true;
    
    if (cell.dataset.status === 'empty') return false;
};

// checks if there is a ship in the attacked cell
function getAttackResult(row, col) {
    const opponentBoard = Player.playersArr.find(
        (elm) => elm.playerType === (turnState.isPlayerTurn ? 'comp' : 'human')
    ).ship;

    return opponentBoard.some((ship) =>
        ship.location.some(ship => ship[0] === row && ship[1] === col)
    );
};


// identifies a possible cell to the computer attack
function computerMove() {
    if (turnState.isgameOver) return;
    
    const row = Math.floor(Math.random() * Gameboard.SIZE);
    const col = Math.floor(Math.random() * Gameboard.SIZE);

    const bord = document.querySelectorAll('.gameArea .bord')[0];
    const cell = bord.querySelector(`[data-row="${row}"][data-col="${col}"]`);

    switch (hitCheck(cell, [row, col])) {
        case (true):
            cell.dataset.status = 'hit';
            cell.innerHTML = '&times;';

            round.publish('hit', { row, col });

            setTimeout(() => {
                computerMoveSearch([row, col]);
            }, 1500);
        break;

        case (false):
            cell.dataset.status = 'miss';
            cell.innerHTML = '&times;';

            turnState.isPlayerTurn = true;
        break;

        case (undefined):
            computerMove();
        break;

        default:
            console.warn(`Something went wrong with the computer's move`);
        break;
    };
};

// searches for a cell to attack after hitting an enemy ship
function computerMoveSearch([row, col]) {
    if (turnState.isgameOver) return;

    let emptyCell;
    let hit = false;
    let notFoundCounter = 0;

    for (let value of Gameboard.prohibitionOfApproach) {
        const x = value[0] + row;
        const y = value[1] + col;

        const bord = document.querySelectorAll('.gameArea .bord')[0];
        const cell = bord.querySelector(`[data-row="${x}"][data-col="${y}"]`);
        
        try {
            const result = hitCheck(cell, [x, y]);
    
            if (result === true) {
                cell.dataset.status = 'hit';
                cell.innerHTML = '&times;';
                hit = true;

                round.publish('hit', { row, col });
        
                setTimeout(() => {
                    computerMoveSearch([x, y]);
                }, 1500);
                break;
            } else if (result === false) {
                emptyCell = [x, y];
                continue;
            } else {
                notFoundCounter += 1;
                continue;
            };
        } catch (error) {
            notFoundCounter += 1;
            continue;
        };
    };

    if (notFoundCounter === 8) {
       computerMove();
       return;
    };

    if (emptyCell && !hit) {
        const bord = document.querySelectorAll('.gameArea .bord')[0];
        const cell = bord.querySelector(`[data-row="${emptyCell[0]}"][data-col="${emptyCell[1]}"]`);

        cell.dataset.status = 'miss';
        cell.innerHTML = '&times;';

        turnState.isPlayerTurn = true;
        return;
    };

    if (notFoundCounter !== 8 && !emptyCell && !hit) throw Error('Something went wrong in the “computerMoveSearch” function.');
};


// initializes hits and flood checks
function hitShipCheck({ row, col }) {
    const opponent = Player.playersArr.find(
        (elm) => elm.playerType === (turnState.isPlayerTurn ? 'comp' : 'human')
    );
    
    const ship = opponent.ship.find((arr) => arr.location.some((cord) => cord[0] === row && cord[1] === col));

    if (ship) {
        ship.hit();
        ship.isSunk();

        if (ship.sunk) {
            round.publish('sunk', { opponent, ship });
        };
    };
};

// blocks the cells around the sunken ship
function sunk({ opponent, ship }) {
    if (ship.sunk === false) throw Error('Something went wrong in the "sunk" function.');

    const bordIndex = (opponent.playerType === 'human') ? 0 : 1;
    const bord = document.querySelectorAll('.gameArea .bord')[bordIndex];

    ship.location.forEach((elm) => {
        Gameboard.prohibitionOfApproach.forEach((cord) => {
            const row = elm[0] + cord[0];
            const col = elm[1] + cord[1];

            if (Gameboard.permissibleMove([row, col])) {
                const cell = bord.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                if (cell.dataset.status === 'empty') {
                    cell.dataset.status = 'miss';
                    cell.innerHTML = '&times;';
                };
            };
        });
    });
};


// determines if the game is over
function endgameCheck({ opponent }) {
    if (opponent.ship.every((elm) => elm.sunk === true)) {
        turnState.isgameOver = true;

        console.log(`Game Over: ${opponent} lose.`)
    };
};


export { createPlayes, getAttackResult, hitShipCheck, hitCheck, sunk, computerMove, computerMoveSearch, endgameCheck };
