import { eventPlayers, round } from './eventManager.js';
import { createPlayes, getAttackResult } from './main.js';
import { placingOnBoard } from './createDOM.js';
document.addEventListener('DOMContentLoaded', () => {
    eventPlayers.subscribe('playerCreationAttempt', createPlayes);
    eventPlayers.subscribe('playerCreated', placingOnBoard);

    eventPlayers.subscribe('attemptToCreatePlayerComputer', createPlayes);



    eventPlayers.publish('attemptToCreatePlayerComputer', { name: 'comp', type: 'comp' });
});

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

document.querySelectorAll('.gameArea .bord')[1].addEventListener('click', (event) => {
    const cell = event.target.closest('[data-status]');

    if (!cell) return;
    if (cell.dataset.status === 'miss' || cell.dataset.status === 'hit') return;

    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    if (getAttackResult(row, col)) {
        cell.dataset.status = 'hit';
        cell.innerHTML = '&times;';
            
        round.publish('hit');
        return;
    };
    
    if (cell.dataset.status === 'empty') {
        cell.dataset.status = 'miss';
        cell.innerHTML = '&times;';
    
        round.publish('miss');
        return;
    };
});
