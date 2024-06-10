const { getCalendar } = require("./api/google");
const getWeather = require("./api/weather");
const { getHandle } = require("./io");
const { getState } = require("./states");
const { getConn } = require("./ws");
const { onStuffs } = require("./ws/route");

const stuffs_state = getState('stuffs');

const DEBUG_SWITCH = false;

const allow_rain = false;

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
        const stuffs = getState("stuffs");

        const sensorNow = this.#handle.Sensors;

        if (DEBUG_SWITCH) console.log("tick current state: " + this.#state);
        if (DEBUG_SWITCH) console.log("tick Sensors: " + sensorNow);

        if (this.#state === 0) {
            if (this.#prevSensors[HUMAN_SENSOR_INDEX] === '0' &&
                sensorNow[HUMAN_SENSOR_INDEX] === '1'
            ) {
                // TODO: had app in network
                const conn = getConn("app");
                if (conn != null) this.#state = 1;
                else this.#state = 2;
                console.log("new state: " + this.#state);
            }
        } else if (sensorNow[HUMAN_SENSOR_INDEX] === '0' && this.#prev0 < Date.now() - 1000 * 60) {
            this.#state = 0;
        }

        if (this.#prevSensors[HUMAN_SENSOR_INDEX] === '1' &&
            sensorNow[HUMAN_SENSOR_INDEX] === '0'
        ) {
            this.#prev0 = Date.now();
        }

        if (DEBUG_SWITCH) console.log("tick led now: " + this.#handle.LEDs);
        if (DEBUG_SWITCH) console.log("tick updated state: " + this.#state);

        stuffs.Data.stuffs[0].state = sensorNow[1];
        stuffs.Data.stuffs[1].state = sensorNow[2];
        stuffs.Data.stuffs[2].state = sensorNow[3];
        stuffs.update();


        switch (this.#state) {
            case 0:
                this.#handle.LEDs[0] = 0;
                this.#handle.LEDs[1] = 0;
                this.#handle.LEDs[2] = 0;
                this.#handle.LEDs[3] = 0;

                break;
            case 1:
                let take = [0, 0, 0, 0];
                const wet = await getWeather();
                take[3] = allow_rain ? 1 : wet?.weather?.[0]?.main === 'Rain' ? 1 : 0;

                const cal = await getCalendar();
                const pfname = cal?.items?.[0]?.summary;
                let somethingFound = false;
                for (const prf of stuffs.Data.profile) {
                    if (prf.name === pfname) {
                        somethingFound = true;
                        for (const item of prf.items) {
                            take[item] = 1;
                        }
                    } 
                }
                if (!somethingFound) {   
                        take[0] = 1;
                        take[1] = 1;
                        take[2] = 1;
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
        if (DEBUG_SWITCH) console.log("tick led sent: " + this.#handle.LEDs + "\n");
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
    getTracker: () => instance,
    setRain: (a) => {
        allow_rain = a;
    }
};
