const { getHandle } = require('./main/io');
const handle = getHandle();
const { getTracker } = require('./main/tracker');
const t = getTracker();

// const getWeather = require('./main/api/weather');
// getWeather().then(r => console.log(r?.weather?.[0]?.main));

setInterval(() => {
//	t.onTick();
console.log("in: ", handle.Sensors);
handle.LEDs[0] = true;
handle.LEDs[1] = true;
handle.LEDs[2] = true;
handle.LEDs[3] = false;
console.log("out: ", handle.LEDs);
}, 1000);

// setInterval(() => {
//   t.onTick();
//
// }, 1000);

