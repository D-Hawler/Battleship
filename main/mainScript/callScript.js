import { eventPlayers } from './eventManager.js';
import { createPlayes } from './main.js';
document.addEventListener('DOMContentLoaded', () => {
    eventPlayers.subscribe('playerCreation', createPlayes);
})

document.querySelector('#create').addEventListener('click', (event) => {
    event.preventDefault();

    const form = document.querySelector('form');

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    };

    const name = form.querySelector('#name').value;
    const type = form.querySelector('input[name="choice"]:checked').value;

    eventPlayers.publish('playerCreation', {name, type});
    form.remove();
});











(function () {
    const bord = document.querySelectorAll('.bord');

    const cord = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    bord.forEach((bord) => {
        cord.forEach((row) => {
        let col = 0;
        
        for (let i = 0; i < 10; i ++) {
                const cell = document.createElement('div')
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.dataset.status = 'empty';

                col += 1;

                bord.appendChild(cell);
            };
        });
    });
})();
