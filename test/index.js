const { getCalendar } = require('../main/api/google');
getCalendar().then(r => {console.log(r)});