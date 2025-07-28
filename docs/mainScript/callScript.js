import { eventPlayers, round, turnState } from './eventManager.js';
import { hitCheck } from './main.js';

// event handler for player creation
document.querySelector('#create').addEventListener('click', (event) => {
    event.preventDefault();

    const form = document.querySelector('form');

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    };

    const name = form.querySelector('#name').value;
    const type = form.querySelector('input[name="choice"]:checked').value;

    eventPlayers.publish('playerCreationAttempt', { name, type });
    form.remove();
});

// event handler for clicking on a board cell during a player's turn
document.querySelectorAll('.gameArea .bord')[1].addEventListener('click', (event) => {
    if (turnState.isgameOver) return;
    if (!turnState.isPlayerTurn) return;

    const cell = event.target.closest('[data-status]');

    if (cell) {
        const row = Number(cell.dataset.row);
        const col = Number(cell.dataset.col);

        switch (hitCheck(cell, [row, col])) {
            case (true):
                cell.dataset.status = 'hit';
                cell.innerHTML = '&times;';

                round.publish('hit', { row, col });
            break;

            case (false):
                cell.dataset.status = 'miss';
                cell.innerHTML = '&times;';

                round.publish('miss');
            break;
        };
    };
});
