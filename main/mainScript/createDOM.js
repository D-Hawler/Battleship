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
    const bord = document.querySelector('.gameArea');

    ship.forEach((cell) => {
        cell.location.forEach((cord) => {
           const cell = bord.querySelector(`[data-row="${cord[0]}"][data-col="${cord[1]}"]`);
           cell.dataset.status = 'ship';
        });
    });
};

export { placingOnBoard };