const { getCalendar } = require("./api/google");
const getWeather = require("./api/weather");
const { getHandle } = require("./io");
const { getState } = require("./states");
const { getConn } = require("./ws");

const stuffs_state = getState('stuffs');

let instance;
class Tracker {
    #handle;
    #prev0 = 0;
    #state = 0; //0: idle, 1: going, 2: coming
    #prevSensors = [];

    constructor() {
        this.#handle = getHandle();
        // reset handle
        // load from stuffs state in or out
    }
    /**
     * save state of sensors, app connection
     * give led controls
     * 
     * 
     */

    async onTick() {
        const HUMAN_SENSOR_INDEX = 0;

        const sensorNow = this.#handle.Sensors;

        if (this.#state === 0) {
            if (this.#prevSensors[HUMAN_SENSOR_INDEX] === '0' &&
                sensorNow[HUMAN_SENSOR_INDEX] === '1'
            ) {
                // TODO: had app in network
                const conn = getConn("app");
                if (conn != null) this.#state = 1;
                else this.#state = 2;
            }
        } else if (sensorNow[HUMAN_SENSOR_INDEX] === '0' && this.#prev0 < Date.now() - 1000 * 60) {
            this.#state = 0;
        }

        if (this.#prevSensors[HUMAN_SENSOR_INDEX] === '1' &&
            sensorNow[HUMAN_SENSOR_INDEX] === '0'
        ) {
            this.#prev0 = Date.now();
        }


        const stuffs = getState("stuffs");
        switch (this.#state) {
            // TODO: pi socket 메시지도 보내도록            
            case 0:
                this.#handle.LEDs[0] = 0;
                this.#handle.LEDs[1] = 0;
                this.#handle.LEDs[2] = 0;
                this.#handle.LEDs[3] = 0;

                break;
            case 1:
                let take = [1, 1, 1, 0];
                const wet = await getWeather();
                take[3] = wet?.weather?.[0]?.main === 'Rain';

                const cal = await getCalendar();
                const pfname = cal?.items?.[0]?.summary;
                for (const prf of stuffs.Data.profile) {
                    if (prf.name === pfname) {
                        take[0] = prf.items[0];
                        take[1] = prf.items[1];
                        take[2] = prf.items[2];
                    }
                }
                this.#handle.LEDs[0] = take[0];
                this.#handle.LEDs[1] = take[1];
                this.#handle.LEDs[2] = take[2];
                this.#handle.LEDs[3] = take[3];

                break;
            case 2:
                this.#handle.LEDs[0] = 2;
                this.#handle.LEDs[1] = 2;
                this.#handle.LEDs[2] = 2;
                this.#handle.LEDs[3] = 0;

                break;
        }
        getConn("pi")?.send(JSON.stringify({ type: "stuffs", data: onStuffs({ action: "read" }) }));


        // read sensor
        // calculate, update state
        // set led

        this.#prevSensors = sensorNow;
    }
}

instance = new Tracker();

// TODO: bring path from config
module.exports = {
    getTracker: () => instance
};
