const fs = require('node:fs');
const state_map = new Map();

function getState(key) {
    return state_map.get(key);
}

class State {
    #path;
    #data;
    #onUpdate;
    // api, stuffs, user
    // (data, payload) => ignore?boolean
    constructor(key, onUpdate) { 
        this.#onUpdate = onUpdate;
        if (key === undefined) {
            this.#path = undefined;
            return;
        }
        this.#path = key + '.json';

        if (fs.existsSync(this.#path)) {
            const raw = fs.readFileSync(this.#path, 'utf8');
            try {
                this.#data = JSON.parse(raw);
            } 
            catch (_) {
                fs.unlinkSync(this.#path);
                this.#data = {};
            }
        } 
    }

    get Data() {
        return this.#data;
    }

    // active call
    update(payload) {
        if (!this.#onUpdate(this.#data, payload) || this.#path === undefined) return;
        if (this.#data === undefined && fs.existsSync(this.#path)) {
            fs.unlinkSync(this.#path);
        }
        if (this.#data !== undefined) {
            fs.writeFileSync(this.#path, JSON.stringify(this.#data));
        }
    }
}

state_map.set('config', new State('config', () => false));
state_map.set('stuffs', new State('stuffs'));
state_map.set('user', new State('user'));


module.exports = { getState };
