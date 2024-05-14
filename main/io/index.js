const { SerialPort } = require('serialport');

const path = '';
// Create a port
const port = new SerialPort({
    path,
    baudRate: 9600,
}, (err) => {
    if (err) console.log(err);
    else console.log('serial initiated');
});

port.on('data', (data) => {
    console.log(data);
});

setInterval(() => {
    const val = Math.floor(Math.random() * 8);
    port.write(`${val >> 2 & 1} ${val >> 1 & 1} ${val & 1}`);
}, 1000);

