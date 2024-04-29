const { onWeather, onStuffs, onToday } = require("./route");

module.exports = function (ws) {
    return async function (raw) {
        console.log('client received: %s', raw);

        const data = JSON.parse(raw);
        let res;
        switch (data.type) {
            case 'weather':
                res = await onWeather(data);
                break;
            case 'stuffs':
                res = onStuffs(data);
                break;
            case 'today':
                res = onToday(data);
                break;
            case 'ping':
                res = onPing(data);
                break;
        }
        if (res === undefined) return;
        res = {
            type: data.type,
            data: res
        };
        ws.send(JSON.stringify(res));
    };
};

