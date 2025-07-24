import { createPlayes, hitShipCheck, hitCheck, sunk, computerMove, endgameCheck } from './main.js';
import { placingOnBoard } from './createDOM.js';
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



    eventPlayers.publish('attemptToCreatePlayerComputer', { name: 'comp', type: 'comp' });
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

const turnState = {
    isPlayerTurn: false,
    isgameOver: false,
};

const shipDamageEvent = new EventBus();
const eventPlayers = new EventBus();
const round = new EventBus();
export { shipDamageEvent, eventPlayers, round, turnState };
