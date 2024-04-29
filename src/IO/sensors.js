
const cbs = [
    // { type: "", cb }
]

// TODO
// listen to sensors 
// trigger cbs




function onEvent(type, cb) {
    cbs.push({ type, cb });
}

module.exports = {
    onEvent
}