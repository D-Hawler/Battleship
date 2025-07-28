import { Player } from './constructors.js';

(function () {
    const bord = [...document.querySelectorAll('.bord')];

    const cord = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    bord.forEach((bord) => {
        cord.forEach((row) => {
            let col = 0;
        
            for (let i = 0; i < 10; i ++) {
                const cell = document.createElement('div');
                cell.dataset.row = row;
                cell.dataset.col =col;
                cell.dataset.status = 'empty';
                col += 1;

                const anim = document.createElement('div');
                
                cell.appendChild(anim);
                bord.appendChild(cell);
            };
        });
    });
})();

function placingOnBoard({ player: { ship } }) {
    const bord = document.querySelector('.gameArea .bord');

    ship.forEach((cell) => {
        cell.location.forEach((cord) => {
           const cell = bord.querySelector(`[data-row="${cord[0]}"][data-col="${cord[1]}"]`);
           cell.dataset.status = 'ship';
        });
    });

    const plaeyrBord = Player.playersArr.find((obj) => obj.playerType === 'human').board.board;
    plaeyrBord.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (col === 'block') {
                const cell = bord.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`);

                cell.innerHTML = '&#9679;';
            };
        });
    });
};



function signs() {
    const area = document.querySelectorAll('main > div > div');

    const namePlayer = Player.playersArr.find((elm) => elm.playerType === 'human');

    const playerSign = document.createElement('h2');
    playerSign.textContent = namePlayer.name;

    area[0].appendChild(playerSign);


    const nameComp = Player.playersArr.find((elm) => elm.playerType === 'comp');

    const compSign = document.createElement('h2');
    compSign.textContent = nameComp.name;

    area[1].appendChild(compSign);
};











export { placingOnBoard, signs };