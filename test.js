const{ getHandle } = require('./main/io');
const handle = getHandle();
const { getTracker } = require('./main/tracker');
const t = getTracker();

setInterval(() => {
	t.onTick();
//handle.LEDs[0] = true;
//handle.LEDs[1] = false;
//handle.LEDs[2] = true;
//handle.LEDs[3] = true;
}, 1000);
