const getWeather = require('../api/weather');
function onWeather(data) {
    return getWeather();
}

function onStuffs(data) {
    switch (data.action) {
        case 'read':
            // send sensors
            break;
        case 'write':
            // update stuffs state
            // send sensors
            break;
        case 'calibrate':
            // TODO: not critical
            // if { action: calibrate, id } {
            //     if { step: start } { save calib id, time send full }
            //     if no calib return fail
            //     if { step: empty } { save calib value, if full clear calib else send full }
            //     if { step: full } { save calib value, if empty clear calib else send empty }
            // }
            break;
        default:
            return undefined;
    }
    return [];
}

function onToday(data) {
//     if google { give google today calendar }
//     else { app config qrcode }
    return undefined;
}

function onPing(data) {
    // on ping
    // if not app nor pi { return wrong pi, disconnect }
    // log, pong
}


module.exports = {
    onWeather, onStuffs, onToday, onPing
};
