const { exec } = require('child_process');
const express = require('express');
const ip = require("ip").address();
const { WebSocketServer } = require('ws');

const { getState } = require('./states');
const {  } = require('./io');

const config_state = getState('config');
const { ports, variant } = config_state.Data;

let server_state = 0b00;

//// HTTP BEGIN
(async function(){
    const app = express();
    const router = require('./http');

    app.use(router);
    app.listen(ports.http, () => { startBrowser(0b01); });
})();
//// HTTP END

//// WS BEGIN
(async function() {
    const wss = new WebSocketServer({ port: ports.ws });
    const messageRouter = require('./ws');

    wss.on('connection', function (ws) {
        ws.on('error', console.error);
    
        const onMessage = messageRouter(ws);
        ws.on('message', onMessage);
    });
    startBrowser(0b10);
})();
//// WS END

function startBrowser(appendState) {
    server_state |= appendState;
    if (server_state === 0b11) {
        const address = `http://${ip}:${ports.http}/?ws=${ports.ws}&ip=${ip}`;
        if (variant === 'windows') exec(`explorer "${address}"`);
        else exec(`chromium-browser "${address}" `); //--kiosk --autoplay-policy=no-user-gesture-required
    }         
}

//// SENSORS
