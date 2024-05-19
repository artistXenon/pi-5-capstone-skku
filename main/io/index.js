const { SerialPort } = require('serialport');

const path = '/dev/ttyACM0', baudRate = 9600;
// Create a port
let port = new SerialPort({ path, baudRate }, (err) => {
    if (err) console.log(err);
    else console.log('serial initiated');
});

let flush = '';

port.on('data', (data) => {
    const d = data.toString();
    if (d !== '\n') {
        flush += d;
        return;
    }
    console.log(flush);
    flush = '';
});

setInterval(() => {
    const val = Math.floor(Math.random() * 8);
    port.write(`${val >> 2 & 1} ${val >> 1 & 1} ${val & 1}`);
}, 1000);

function initSerial(cb) {
    port = new SerialPort({ path, baudRate }, (err) => {
        if (err) console.log(err);
        else console.log('serial initiated');
    });

    port.on('data', cb);
}

function writeLED(...led) {
    let write = '';
    for (let i = 0; i < led.length; i++) {
        write +=`${array[i] ? 1 : 0} `;
    }
    if (write === '') return;
    port.write(write.substring(0, write.length - 1));
}

module.exports = {
    writeLED,
    onSensor: initSerial
}
