const { getState } = require("./states");

const stuffs_state = getState('stuffs');
class Tracker {
    constructor() {
        // reset handle
        // load from stuffs state in or out
    }
    /**
     * save state of sensors, app connection
     * give led controls
     * 
     * 
     */

    onTick() {
        // read sensor
        // calculate, update state
        // set led
    }

    setStuffsFull() {
        // save current sensor val as full
    }

    setStuffsEmpty() {
        // save current sensor val as empty
    }   
}