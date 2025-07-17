const { Gameboard } = require('../main/mainScript/main.js');

describe('Gameboard.shipPlacement', () => {
    beforeEach(() => {
        // Reset the playing field before each test
        Gameboard.board = Array.from({ length: Gameboard.SIZE }, () => Array(Gameboard.SIZE).fill('blank'));
    });

    it('places the vertical ship correctly', () => {
        const ship = { length: 3, direction: 'vertical' };
        const location = [1, 1];
        Gameboard.shipPlacement(ship, location);
        expect(Gameboard.board[1][1]).toBe('ship');
        expect(Gameboard.board[2][1]).toBe('ship');
        expect(Gameboard.board[3][1]).toBe('ship');
    });

    it('blocks the cells around the vertical ship', () => {
        const ship = { length: 2, direction: 'vertical' };
        const location = [1, 1];
        Gameboard.shipPlacement(ship, location);

        expect(Gameboard.board[0][0]).toBe('block');
        expect(Gameboard.board[0][1]).toBe('block');
        expect(Gameboard.board[0][2]).toBe('block');

        expect(Gameboard.board[1][0]).toBe('block');
        expect(Gameboard.board[1][1]).toBe('ship');
        expect(Gameboard.board[1][2]).toBe('block');

        expect(Gameboard.board[2][0]).toBe('block');
        expect(Gameboard.board[2][1]).toBe('ship');
        expect(Gameboard.board[2][2]).toBe('block');

        expect(Gameboard.board[3][0]).toBe('block');
        expect(Gameboard.board[3][1]).toBe('block');
        expect(Gameboard.board[3][2]).toBe('block');
    });

    it('places the horizontal ship correctly', () => {
        const ship = { length: 3, direction: 'horizontal' };
        const location = [1, 1];
        Gameboard.shipPlacement(ship, location);
        expect(Gameboard.board[1][1]).toBe('ship');
        expect(Gameboard.board[1][2]).toBe('ship');
        expect(Gameboard.board[1][3]).toBe('ship');
    });

    it('blocks the cells around the horizontal ship', () => {
        const ship = { length: 2, direction: 'horizontal' };
        const location = [1, 1];
        Gameboard.shipPlacement(ship, location);

        expect(Gameboard.board[0][0]).toBe('block');
        expect(Gameboard.board[0][1]).toBe('block');
        expect(Gameboard.board[0][2]).toBe('block');
        expect(Gameboard.board[0][3]).toBe('block');

        expect(Gameboard.board[1][0]).toBe('block');
        expect(Gameboard.board[1][1]).toBe('ship');
        expect(Gameboard.board[1][2]).toBe('ship');
        expect(Gameboard.board[1][3]).toBe('block');

        expect(Gameboard.board[2][0]).toBe('block');
        expect(Gameboard.board[2][1]).toBe('block');
        expect(Gameboard.board[2][2]).toBe('block');
        expect(Gameboard.board[2][3]).toBe('block');
    });

    it('throws an out-of-field error', () => {
        const ship = { length: 2, direction: 'vertical' };
        expect(() => Gameboard.shipPlacement(ship, [-1, 11])).toThrow('The coordinates of the ship are incorrect, they are outside the board.');
    });

    it('throws an error when trying to place a ship on a blocked cell', () => {
        const ship1 = { length: 2, direction: 'vertical' };
        const ship2 = { length: 2, direction: 'vertical' };
        Gameboard.shipPlacement(ship1, [1, 1]);
        expect(() => Gameboard.shipPlacement(ship2, [1, 2])).toThrow('The coordinates of the ship are incorrect, they are outside the board.');
    });

    it('throws an error when trying to cross ships', () => {
        const ship1 = { length: 2, direction: 'vertical' };
        const ship2 = { length: 2, direction: 'horizontal' };
        Gameboard.shipPlacement(ship1, [1, 1]);
        expect(() => Gameboard.shipPlacement(ship2, [1, 1])).toThrow('The coordinates of the ship are incorrect, they are outside the board.');
    });
});
