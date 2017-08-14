var express = require('express');
var app     = express();
var path = require('path');
var fs = require('fs');

app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));

app.get("/", function(req, res){

    var mimeType = "text/html";
    res.writeHead(200, {'Content-Type':mimeType});

    var fileStream = fs.createReadStream('index.html');
    fileStream.pipe(res);
});

var server = app.listen(3000, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Freeboard running at http://%s:%s', host, port);

});