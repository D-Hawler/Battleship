import { Player, Gameboard } from '../main/mainScript/constructors.js';
import { turnState } from '../main/mainScript/eventManager.js';
import * as mainModule from '../main/mainScript/main.js';

const {
    computerMove,
    hitCheck,
    getAttackResult,
    computerMoveSearch,
} = mainModule;

describe('AI Logic Functions', () => {
    let mockBoard;
    let originalMathRandom;

    beforeEach(() => {
        // Сохраняем Math.random
        originalMathRandom = Math.random;

        // Мокаем DOM
        document.body.innerHTML = `
            <div class="gameArea">
                <div class="bord">
                    <div data-row="0" data-col="0" data-status="empty"></div>
                    <div data-row="1" data-col="1" data-status="empty"></div>
                    <div data-row="1" data-col="0" data-status="empty"></div>
                </div>
            </div>
        `;

        mockBoard = document.querySelector('.bord');

        // Гарантируем валидных игроков
        Player.playersArr = [
            {
                playerType: 'human',
                ship: [] // может быть пусто
            },
            {
                playerType: 'comp',
                ship: [
                    { location: [[0, 0]] },
                    { location: [[5, 5]] }
                ]
            }
        ];

        // Начальное состояние
        turnState.isPlayerTurn = false;

        // Настройки доски
        Gameboard.SIZE = 10;
        Gameboard.prohibitionOfApproach = [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ];
    });

    afterEach(() => {
        Math.random = originalMathRandom;
        jest.restoreAllMocks();
    });

    test('getAttackResult returns true if ship is at given cell', () => {
        turnState.isPlayerTurn = true;
        const result = getAttackResult(0, 0);
        expect(result).toBe(true);
    });

    test('getAttackResult returns false if no ship at cell', () => {
        turnState.isPlayerTurn = true;
        const result = getAttackResult(3, 3);
        expect(result).toBe(false);
    });

    test('hitCheck returns true if hit', () => {
        const cell = mockBoard.querySelector('[data-row="0"][data-col="0"]');
        cell.dataset.status = 'empty';
        turnState.isPlayerTurn = true;
        expect(hitCheck(cell, [0, 0])).toBe(true);
    });

    test('hitCheck returns false if miss', () => {
        const cell = mockBoard.querySelector('[data-row="1"][data-col="1"]');
        cell.dataset.status = 'empty';
        turnState.isPlayerTurn = true;
        expect(hitCheck(cell, [1, 1])).toBe(false);
    });

    test('hitCheck returns undefined if already attacked', () => {
        const cell = mockBoard.querySelector('[data-row="0"][data-col="0"]');
        cell.dataset.status = 'hit';
        expect(hitCheck(cell, [0, 0])).toBeUndefined();
    });

    test('computerMove should call computerMoveSearch on hit', () => {
        Math.random = () => 0; // [0, 0]

        const spy = jest.spyOn(mainModule, 'computerMoveSearch').mockImplementation(() => {});
        const cell = mockBoard.querySelector('[data-row="0"][data-col="0"]');

        computerMove();

        expect(cell.dataset.status).toBe('hit');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    test('computerMove should set miss if miss', () => {
        Math.random = () => 0.11; // [1, 1]
        turnState.isPlayerTurn = false;

        const cell = mockBoard.querySelector('[data-row="1"][data-col="1"]');
        cell.dataset.status = 'empty';

        computerMove();

        expect(cell.dataset.status).toBe('miss');
        expect(turnState.isPlayerTurn).toBe(true);
    });

    test('computerMoveSearch finds and attacks surrounding cell', () => {
        const centerCell = document.createElement('div');
        centerCell.dataset.status = 'hit';

        const testCell = document.createElement('div');
        testCell.dataset.status = 'empty';
        testCell.setAttribute('data-row', '1');
        testCell.setAttribute('data-col', '0');
        mockBoard.appendChild(testCell);

        const hitCheckMock = jest.fn((cell, [r, c]) => {
            if (r === 1 && c === 0) return false;
            return undefined;
        });

        jest.spyOn(mainModule, 'hitCheck').mockImplementation(hitCheckMock);

        computerMoveSearch(centerCell, [0, 0]);

        expect(testCell.dataset.status).toBe('miss');
        expect(turnState.isPlayerTurn).toBe(true);
    });
});
