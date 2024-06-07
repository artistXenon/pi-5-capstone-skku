const { onWeather, onStuffs, onToday, onPing, onReset } = require("./route");

let app_conn = undefined, pi_conn = undefined;

module.exports = {
    messageRouter: function (ws) {
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
                    const [ name, _res ] = await onPing(data);
                    if (name === "app") {
                        console.log("app connection preserved");
                        app_conn = ws;
                    } else if (name === "pi") {
                        pi_conn = ws;
                    }
                    break;
                case 'reset':
                    onReset();
            }
            if (res === undefined) return;
            ws.send(JSON.stringify({
                type: data.type,
                data: res
            }));
        };
    },
    onClose: function(ws) {
        if (ws === app_conn) app_conn = undefined;
        if (ws === pi_conn) pi_conn = undefined;
    },
    getConn: function(device) {
        if (device === "app") return app_conn;
        if (device === "pi") return pi_conn;
        return undefined;
    }
}

