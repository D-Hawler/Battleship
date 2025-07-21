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

const shipDamageEvent = new EventBus();
const eventPlayers = new EventBus();
const round = new EventBus();
export { shipDamageEvent, eventPlayers, round };
