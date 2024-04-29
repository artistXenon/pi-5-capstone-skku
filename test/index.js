const getWeather = require('../main/api/weather');
getWeather().then(({weather, main}) =>console.log(weather, main));