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

export { shipDamageEvent };
