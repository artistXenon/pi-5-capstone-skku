const{ getHandle } = require('./main/io');
const handle = getHandle();

setInterval(() => {
//console.log(handle.Sensors);
handle.LEDs[0] = true;
handle.LEDs[1] = false;
handle.LEDs[2] = true;
}, 1000);