var express = require('express');
var app  = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var InitAzureIoTHubWebSocketsServer = require('./azureIoTHubWebSocketsServer.js');

app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/plugins/thirdparty', express.static(__dirname + '/plugins/thirdparty'));
app.use('/plugins/freeboard', express.static(__dirname + '/plugins/freeboard'));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get("/", function(req, res){
    var mimeType = "text/html";
    res.writeHead(200, {'Content-Type':mimeType});
    var fileStream = fs.createReadStream('index.html');
    fileStream.pipe(res);
});

InitAzureIoTHubWebSocketsServer(app);

// --------------------------

// var server = app.listen(3000, function() {

//     var host = server.address().address;
//     var port = server.address().port;

//     console.log('Freeboard running at http://%s:%s', host, port);

// });