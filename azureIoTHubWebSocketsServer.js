// WebSockets server logic.
// This creates a WebSockets Server, so the Browser (Client), can see the messages from IoT Hub.
// The WebSockets server is hosted on port 3000, and is using the express server that is configured on server.js
// After creating the WebSockets server, it uses a pub/sub mechanism to broadcast messages to clients when a new one arrives to our IoTHub.
// We connect to our IotHub via the iotHubClient object inside iot-hub.js.

const http = require('http');
const WebSocket = require('ws');
const moment = require('moment');
const iotHubClient = require('./IoTHub/iot-hub.js');

var AzureIoTHubWebSocketsServer = function(app) {

    app.post('/StartAzureIotHubWebSocketsServer', function(req, res) {
        console.log(req.body);
        var connectionString = req.body.connectionString;
        var consumerGroup = req.body.consumerGroup;
        pollFromIoTHub(connectionString,consumerGroup,res);
    });

    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });

    // Function to broadcast to every client when new data arrives
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

    var port = normalizePort(process.env.PORT || '3000');
    server.listen(port, function listening() {
        console.log('Listening on %d', server.address().port);
    });

    /**
     * Normalize a port into a number, string, or false.
    **/
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

    function pollFromIoTHub(connectionString,consumerGroup,res) {
        
        //connectionString = "HostName=demo-iot-gbt-hub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=O7GVEuz6UDNQ32A499PJSS8tP8uONXnNa3/ZXnOFoJo=";
        consumerGroup = "piffa-group";
        var iotHubReader = new iotHubClient(connectionString, consumerGroup);
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
        res.end('It worked!');
    }

} 

module.exports = AzureIoTHubWebSocketsServer;
