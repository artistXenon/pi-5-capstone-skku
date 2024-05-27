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
                res = await onToday(data);
                break;
            case 'ping':
                res = onPing(data);
                break;
        }
        if (res === undefined) return;
        ws.send(JSON.stringify({
            type: data.type,
            data: res
        }));
    };
};
