
// id 0 umbrella, id 1 mask

const { onEvent } = require("../IO/sensors");

let cbs = [];

let states = [{
    name: "우산",
    state: 0 // 0 idle, 1 takeit, 2 taken, 3 returnit
}];

onEvent('each sensor', (event) => {
    //TODO
    // if value is low/high then ~~~~
    // apply to state
    updateState();
}) 


// TODO
function takeThese(items) {

}

function returnStuffs() {
    // check sensor what are absent
    

}

function onStateUpdate(cb) {
    cbs.push(cb);
    // update screen etc
}

function updateState() {
    for (const cb of cbs) {
        cb(states);
    }
}

module.exports = {
    takeThese,
    returnStuffs,
    onStateUpdate
};
