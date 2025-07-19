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

const shipDamageEvent = {
    events: {},

    subscribe(eventName, handler) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        };

        this.events[eventName].push(handler);
    },

    publish(eventName, payload) {
        if (!this.events[eventName]) return;
        this.events[eventName].forEach(fn => fn(payload));
    }
};

// const eventPlayers = {
//     events: {},

//     subscribe(eventName, callback) {
//         if (!this.events[eventName]) {
//             this.events[eventName] = [];
//         };

//         this.events[eventName].push(callback);
//     },

//     publish(eventName, data) {
//         if (this.events[eventName]) {
//             this.events[eventName].forEach(callback => callback(data));
//         };
//     }
// };


const eventPlayers = new EventBus()
export { shipDamageEvent, eventPlayers };
