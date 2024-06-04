const{ getHandle } = require('./main/io');
const handle = getHandle();
const { getTracker } = require('./main/tracker');
const t = getTracker();

const getWeather = require('./main/api/weather');
getWeather().then(r => console.log(r?.weather?.[0]?.main));

setInterval(() => {
//	t.onTick();
//handle.LEDs[0] = true;
//handle.LEDs[1] = false;
//handle.LEDs[2] = true;
//handle.LEDs[3] = true;
}, 1000);
