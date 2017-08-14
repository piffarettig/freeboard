//Usage:
// npm start -- hps://dweet.io:443/dweet/for/ your_thing_name

var Client = require('node-rest-client').Client;
 
var client = new Client();

var urlBase;
var thingName;
var TIME_INTERVAL_IN_MS = 5000;
 
var args = process.argv.slice(2);
var argsAreCorrect = validateArgs(args);

if(argsAreCorrect) {
    urlBase = args[0];
    thingName = args[1];
    console.log(urlBase);
    console.log(thingName);
    setInterval(sendData, TIME_INTERVAL_IN_MS);
} else {
    console.log("You must pass Dweet.io URL and your Thing name");
}

function sendData() {

    var temperature = getRandomBetweenInterval(-8,35);
    var humidity = getRandomBetweenInterval(0,100);    

    var dataToSend = {
        temperature,
        humidity
    }
    var args = {
        data: dataToSend,
        headers: { "Content-Type": "application/json" }
    };
    
    client.post(urlBase+thingName, args, function (data, response) {
        console.log(data);
    });
}

function getRandomBetweenInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function validateArgs(args) {
    return args != null && args.length >= 2;
}