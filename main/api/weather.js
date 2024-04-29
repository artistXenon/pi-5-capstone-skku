const axios = require('axios');
const { getState } = require('../states');

let coordinate = undefined;

async function getWeather() {
    try {
        if (!coordinate) {
            const { data } = await axios.get('http://ip-api.com/json');
            coordinate = data;
        } 

        const state = getState('config');
        const { weather } = state.Data.api;
        const { data } = await axios
            .get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinate.lat}&lon=${coordinate.lon}&appid=${weather}`);
        return data;
        
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

module.exports = getWeather;
