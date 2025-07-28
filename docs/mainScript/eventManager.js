import { createPlayes, hitShipCheck, hitCheck, sunk, computerMove, endgameCheck } from './main.js';
import { placingOnBoard, signs } from './createDOM.js';
document.addEventListener('DOMContentLoaded', () => {
    eventPlayers.subscribe('playerCreationAttempt', createPlayes);

    eventPlayers.subscribe('playerCreated', placingOnBoard);

    eventPlayers.subscribe('attemptToCreatePlayerComputer', createPlayes);

    round.subscribe('tap', hitCheck);

    round.subscribe('hit', hitShipCheck);

    round.subscribe('miss', () => {
        turnState.isPlayerTurn = false;

        setTimeout(() => {
            computerMove();
        }, 1500);
    });

    round.subscribe('sunk', sunk);
    round.subscribe('sunk', endgameCheck);



    eventPlayers.publish('attemptToCreatePlayerComputer', { name: 'Comp', type: 'comp' });
});

class EventBus {
  constructor() {
    this.events = {};
  }

  subscribe(eventName, callback) {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push(callback);
  }

  publish(eventName, data) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach(cb => cb(data));
  }
}

const turnState = new Proxy({
    isGameStart: false,
    isPlayerTurn: false,
    isgameOver: false,
}, {
  set(target, prop, value) {
    if (target[prop] !== value) {
      target[prop] = value;

      if (prop === 'isGameStart') {
        signs();
        turnState.isPlayerTurn = true;
      }

      // active player visibility switching
      if (prop === 'isPlayerTurn') {
        const area = document.querySelectorAll('main > div > div');
        const playerSign = area[0].querySelector('h2');
        const compSign = area[1].querySelector('h2');

        if (value === true && area) {
          playerSign.classList.add('currentPlayer');

          compSign.classList.remove('currentPlayer');
        } else if (value === false && area) {
          compSign.classList.add('currentPlayer');

          playerSign.classList.remove('currentPlayer');

          document.querySelectorAll('.bord .lastMove').forEach(cell => cell.classList.remove('lastMove'));
        };
      };

      // switching the visibility of the active whiteboard
      if (prop === 'isPlayerTurn') {
        const bord = document.querySelectorAll('.gameArea');

        if (value === true && bord) {
          bord[1].classList.remove('inactiveBoard');
          bord[1].classList.add('activeBoard');

          bord[0].classList.remove('activeBoard');
          bord[0].classList.add('inactiveBoard');
        } else if (value === false && bord) {
          bord[0].classList.remove('inactiveBoard');
          bord[0].classList.add('activeBoard');

          bord[1].classList.remove('activeBoard');
          bord[1].classList.add('inactiveBoard');
        };
      };
    };

    return true;
  }
});

const shipDamageEvent = new EventBus();
const eventPlayers = new EventBus();
const round = new EventBus();
export { shipDamageEvent, eventPlayers, round, turnState };
