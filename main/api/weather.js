const axios = require('axios');
const { getState } = require('../states');

let coordinate = undefined;

let cache = [0, undefined];

async function getWeather() {
    const now = Date.now();
    if (cache[0] > now - 1000 * 60 * 5) return cache[1];
    try {
        if (!coordinate) {
            const { data } = await axios.get('http://ip-api.com/json');
            coordinate = data;
        } 

        const state = getState('config');
        const { weather } = state.Data.api;
        const { data } = await axios
            .get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinate.lat}&lon=${coordinate.lon}&appid=${weather}`);
        
        cache[0] = now;
        cache[1] = data;
        return data;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

module.exports = getWeather;
