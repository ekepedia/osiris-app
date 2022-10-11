import EventEmitter from 'eventemitter3';

const eventEmitter = new EventEmitter();

const Emitter = {
    on: (event, fn) => {
        // console.log("DEBUG: ON", event, fn);
        eventEmitter.on(event, fn);
    },
    once: (event, fn) => eventEmitter.once(event, fn),
    off: (event, fn) => eventEmitter.off(event, fn),
    emit: (event, payload) => {
        // console.log("DEBUG: EMIT", event, payload);
        eventEmitter.emit(event, payload)
    },
    events: {
        UPDATE_USER: 1,
    }
}

Object.freeze(Emitter);

export default Emitter;