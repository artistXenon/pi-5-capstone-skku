
const _state = [];

function apply() {
    // TODO
    // apply state to physical hardware
}

apply();

module.exports = {
    get: function() {
        return _state;
    },
    set: function(state) {
        for (const s in _state) {
            _state[s] = state[s];
        }
        apply();
    }
}
