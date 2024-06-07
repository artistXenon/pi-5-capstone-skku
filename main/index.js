const { exec } = require('child_process');
const express = require('express');
const ip = require("ip").address();
const { WebSocketServer } = require('ws');

const { getState } = require('./states');
// const { } = require('./io');
const { getTracker } = require('./tracker');

const config_state = getState('config');
const { ports, variant } = config_state.Data;

let server_state = 0b00;

//// HTTP BEGIN
(async function () {
    const app = express();
    const router = require('./http');

    app.use(router);
    app.listen(ports.http, () => { startBrowser(0b01); });
})();
    //// HTTP END

    //// WS BEGIN
(async function () {
    const wss = new WebSocketServer({ port: ports.ws });
    const { messageRouter, onClose } = require('./ws');

    wss.on('connection', function (ws) {
        ws.on('error', console.error);

        const onMessage = messageRouter(ws);
        ws.on('message', onMessage);

        ws.on('close', () => onClose(ws));
    });
    startBrowser(0b10);
})();
    //// WS END

setInterval(() => {
  getTracker()?.onTick();
}, 1000);


function startBrowser(appendState) {
    server_state |= appendState;
    if (server_state === 0b11) {
        const address = `http://${ip}:${ports.http}/?ws=${ports.ws}&ip=${ip}`;
        if (variant === 'windows') exec(`explorer "${address}"`);
        else exec(`DISPLAY=:0 chromium-browser "${address}" --kiosk --autoplay-policy=no-user-gesture-required`);
    }
}

//// SENSORS
