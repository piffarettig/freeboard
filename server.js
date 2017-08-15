var express = require('express');
var app  = express();
var path = require('path');
var fs = require('fs');


app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/plugins/thirdparty', express.static(__dirname + '/plugins/thirdparty'));
app.use('/plugins/freeboard', express.static(__dirname + '/plugins/freeboard'));

app.get("/", function(req, res){

    var mimeType = "text/html";
    res.writeHead(200, {'Content-Type':mimeType});

    var fileStream = fs.createReadStream('index.html');
    fileStream.pipe(res);
});

// WebSockets server logic. --------------
const http = require('http');
const WebSocket = require('ws');
const moment = require('moment');
const iotHubClient = require('./IoTHub/iot-hub.js');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Function to broadcast to everyone when new data arrives
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        console.log('sending data ' + data);
        client.send(data);
      } catch (e) {
        console.error(e);
      }
    }
  });
};

process.env['Azure.IoT.IoTHub.ConnectionString'] = "HostName=demo-iot-gbt-hub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=O7GVEuz6UDNQ32A499PJSS8tP8uONXnNa3/ZXnOFoJo=";
process.env['Azure.IoT.IoTHub.ConsumerGroup'] = "piffa-group";

var iotHubReader = new iotHubClient(process.env['Azure.IoT.IoTHub.ConnectionString'], process.env['Azure.IoT.IoTHub.ConsumerGroup']);
iotHubReader.startReadMessage(function (obj, date) {
  try {
    console.log(date);
    date = date || Date.now()
    wss.broadcast(JSON.stringify(Object.assign(obj, { time: moment.utc(date).format('YYYY:MM:DD[T]hh:mm:ss') })));
  } catch (err) {
    console.log(obj);
    console.error(err);
  }
});

var port = normalizePort(process.env.PORT || '3000');
server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// --------------------------

// var server = app.listen(3000, function() {

//     var host = server.address().address;
//     var port = server.address().port;

//     console.log('Freeboard running at http://%s:%s', host, port);

// });