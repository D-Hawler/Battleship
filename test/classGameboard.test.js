import { createPlayes, Player, Gameboard } from '../main/mainScript/main.js';

describe('Gameboard.shipPlacement', () => {
    beforeEach(() => {
        // Reset the playing field before each test
        bord = new Gameboard()
    });

    it('places the vertical ship correctly', () => {
        const length = 3;
        const direction = 'vertical';
        const location = [1, 1];
        bord.shipPlacement(length, direction, location);

        expect(bord.board[1][1]).toBe('ship');
        expect(bord.board[2][1]).toBe('ship');
        expect(bord.board[3][1]).toBe('ship');
    });

    it('blocks the cells around the vertical ship', () => {
        const length = 2;
        const direction = 'vertical';
        const location = [1, 1];
        bord.shipPlacement(length, direction, location);

        expect(bord.board[0][0]).toBe('block');
        expect(bord.board[0][1]).toBe('block');
        expect(bord.board[0][2]).toBe('block');

        expect(bord.board[1][0]).toBe('block');
        expect(bord.board[1][1]).toBe('ship');
        expect(bord.board[1][2]).toBe('block');

        expect(bord.board[2][0]).toBe('block');
        expect(bord.board[2][1]).toBe('ship');
        expect(bord.board[2][2]).toBe('block');

        expect(bord.board[3][0]).toBe('block');
        expect(bord.board[3][1]).toBe('block');
        expect(bord.board[3][2]).toBe('block');
    });

    it('places the horizontal ship correctly', () => {
        const length = 3;
        const direction = 'horizontal';
        const location = [1, 1];
        bord.shipPlacement(length, direction, location);

        expect(bord.board[1][1]).toBe('ship');
        expect(bord.board[1][2]).toBe('ship');
        expect(bord.board[1][3]).toBe('ship');
    });

    it('blocks the cells around the horizontal ship', () => {
        const length = 2;
        const direction = 'horizontal';
        const location = [1, 1];
        bord.shipPlacement(length, direction, location);

        expect(bord.board[0][0]).toBe('block');
        expect(bord.board[0][1]).toBe('block');
        expect(bord.board[0][2]).toBe('block');
        expect(bord.board[0][3]).toBe('block');

        expect(bord.board[1][0]).toBe('block');
        expect(bord.board[1][1]).toBe('ship');
        expect(bord.board[1][2]).toBe('ship');
        expect(bord.board[1][3]).toBe('block');

        expect(bord.board[2][0]).toBe('block');
        expect(bord.board[2][1]).toBe('block');
        expect(bord.board[2][2]).toBe('block');
        expect(bord.board[2][3]).toBe('block');
    });

    it('throws an out-of-field error', () => {
        const length = 2;
        const direction = 'vertical';
        expect(() => bord.shipPlacement(length, direction, [-1, 11])).toThrow('The coordinates of the ship are incorrect, they are outside the board.');
    });

    it('throws an error when trying to place a ship on a blocked cell', () => {
        const length = 2;
        const direction = 'vertical';
        bord.shipPlacement(length, direction, [1, 1]);
        expect(() => bord.shipPlacement(length, direction, [1, 2])).toThrow('The coordinates of the ship are incorrect, they are outside the board.');
    });

    it('throws an error when trying to cross ships', () => {
        const length = 2;
        const ship1 = 'vertical';
        const ship2 = 'horizontal';
        bord.shipPlacement(length, ship1, [1, 1]);
        expect(() => bord.shipPlacement(length, ship2, [1, 1])).toThrow('The coordinates of the ship are incorrect, they are outside the board.');
    });
});




describe('createPlayes function', () => {
  test('creates a player with the correct number of ships', () => {
    createPlayes('Alice', 'human');
    const player = Player.playersArr.find(p => p.name === 'Alice');

    expect(player).toBeDefined();

    expect(player.ship.length).toBe(10);
  });

  test('all ships have coordinates after placement', () => {
    createPlayes('Bob', 'human');
    const player = Player.playersArr.find(p => p.name === 'Bob');

    player.ship.forEach(ship => {
      expect(Array.isArray(ship.location)).toBe(true);
      expect(ship.location.length).toBe(ship.length);

      ship.location.forEach(([row, col]) => {
        expect(row).toBeGreaterThanOrEqual(0);
        expect(row).toBeLessThan(Gameboard.SIZE);
        expect(col).toBeGreaterThanOrEqual(0);
        expect(col).toBeLessThan(Gameboard.SIZE);
      });
    });
  });
});