var express = require('express'),
    http = require('http'),
    app = express(),
    opts = require(__dirname + '/config/opts.js');


app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
  res.send('index.html');
});

// Start the server
http.createServer(app).listen(opts.port, function () {
    console.log("Express server listening on port %d in %s mode",
        opts.port, app.settings.env);
});