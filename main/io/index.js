const { SerialPort } = require('serialport');

let instance;
class Handle {
    #port;
    #buffer = '';
    #sensors = [];
    #leds = [];

    constructor(path, baudRate) {
        this.#port = new SerialPort({ path, baudRate }, (err) => {
            if (err) console.log(err);
            else console.log('serial initiated');
        });

        this.#port.on('data', (data) => {
            this.onData(data);   
        });

        setInterval(() => {
            let write = '';
            for (let i = 0; i < this.#leds.length; i++) {
                write +=`${this.#leds[i] ? 1 : 0} `;
            }
            if (write === '') return;
            write[write.length - 1] = '\n';
            this.#port.write(write);
        }, 1000); // TODO: to slow?
    }

    get Sensors() {
        return this.#sensors;
    }

    get LEDs() {
        return this.#leds;
    }

    onData(data) {
        this.#buffer += data.toString();
        const i = this.#buffer.indexOf('\n');
        if (i === -1) return;
        const line = this.#buffer.substring(0, i);
        this.#buffer = this.#buffer.substring(i + 1);

        this.#sensors = line.split(' ');
    }    
}

instance = new Handle('/dev/ttyACM0', 9600);

// TODO: bring path from config
module.exports = {
    getHandle: () => instance
};
