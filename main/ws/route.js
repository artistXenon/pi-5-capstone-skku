const { toDataURL } = require('qrcode');
const ip = require("ip").address();

const { getState } = require('../states');
const { getCalendar } = require('../api/google');
const getWeather = require('../api/weather');
const { getHandle } = require('../io');
function onWeather(data) {
    return getWeather();
}

function onStuffs(data) {
    switch (data.action) {
        case 'read':
            const handle = getHandle();
            const sensors = handle.Sensors;
            // TODO: read and decide if we have it or not
            return sensors;
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
    }
    return [];
}

async function onToday(data) {
    const calendar = await getCalendar();
    if (calendar === undefined) {
        return new Promise((res, rej) => {
            const config_state = getState('config');
            const { ports } = config_state.Data;
            toDataURL(
                `http://${ip}:${ports.http}/app/connect`,
                function (err, url) {
                if (err) rej(err);
                else res({
                    code: 1, // 0: correct calendar, 1: no google
                    data: url
                });
            });
        });
    }
//     if google { give google today calendar }
//     else { app config qrcode }
    return JSON.stringify(calendar);
}

function onPing(data) {
    // on ping
    // if not app nor pi { return wrong pi, disconnect }
    // log, pong
}


module.exports = {
    onWeather, onStuffs, onToday, onPing
};
