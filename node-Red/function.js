const isFloat = function (num) {
    return ((num.toString().split('.').length) <= 2 &&
        num.toString().match(/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/)) ?
        (!isNaN(Number.parseFloat(num))) : false;
}

const isInt = function (num) {
    return ((num.toString().split('.').length) == 1 &&
        num.toString().match(/^[\-]?\d+$/)) ?
        (!isNaN(Number.parseInt(num))) : false;
}

const print_payload = function (payload) {
    let obj1 = payload[0]
    let obj2 = payload[1]
    console.log("id: " + obj2.id)
    console.log("timestamp: " + obj1.timestamp)
    console.log("temperature: " + obj1.temperature)
    console.log("voltage: " + obj1.voltage)
    console.log("current: " + obj1.current)
    console.log("pf: " + obj1.pf)
    console.log("rain: " + obj1.rain)
}

const parseDate = function (date_str) {
    let date = date_str.split(' ')[0]
    let day = date.split('-')[0]
    let month = date.split('-')[1]
    let year = date.split('-')[2]

    let time = date_str.split(' ')[1]
    let hour = time.split(':')[0]
    let min = time.split(':')[1]
    let sec = time.split(':')[2]

    return new Date(year, month, day, hour, min, sec);
}

const payload_validation = function (payload) {
    const MIN_TEMP = 0
    const MAX_TEMP = 40

    let is_temperature_valid = isFloat(payload.temperature)
        && payload.temperature <= MAX_TEMP && payload.temperature >= MIN_TEMP;

    const MIN_VOLTAGE = 0;
    const MAX_VOLTAGE = 250

    let is_voltage_valid = isFloat(payload.voltage) && payload.voltage <= MAX_VOLTAGE
        && payload.voltage > MIN_VOLTAGE;

    const MIN_RAIN = 0
    const MAX_RAIN = 4095

    let is_rainvalue_valid = isInt(payload.rain) && payload.rain >= MIN_RAIN
        && payload.rain <= MAX_RAIN

    const MIN_AMP = 0;
    const MAX_AMP = 3;

    let is_current_valid = isFloat(payload.current) && payload.current >= MIN_AMP
        && payload.current <= MAX_AMP;

    return is_rainvalue_valid && is_temperature_valid && is_voltage_valid && is_current_valid;
}

const input_payload = msg.payload;
const id = msg.topic.split("/")[2];
const data = input_payload.split("/")[3].split(",")
let output_payload = [{
    "timestamp": parseDate(data[0]),
    "temperature": parseFloat(data[1]),
    "voltage": parseFloat(data[2]),
    "current": parseFloat(data[3]),
    "pf": parseFloat(data[4]),
    "rain": parseInt(data[5]),
}, { "id": id }]

const success = payload_validation(output_payload[0])
if (success) {
    print_payload(output_payload)
    return {
        payload: output_payload

    }
} else {
    console.log("not validated")
}
