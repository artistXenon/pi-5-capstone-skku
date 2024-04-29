const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 5000 });

wss.on('connection', function connection(ws) {
    console.log('started ws');

    ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log('server received: %s', data);
    });

    ws.send('something');
});