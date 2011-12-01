#!/usr/bin/env node
var opts = require('optimist')
           .usage('Web Socket proxy for the Embedly API')
           .options({
             'help': {
               'describe': 'Display this message',
               'alias': 'h'
             },
             'port': {
               'describe': 'Port to listen on',
               'alias': 'p',
               'default': process.env.PORT || 80
             }
           });

var argv = opts.argv;

if (argv.help) {
  opts.showHelp(console.log);
  process.exit(0);
}

var express = require('express');
var app = express.createServer(express.logger());
var io = require('socket.io').listen(app);

app.listen(argv.port);

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/htdocs/index.html');
});
app.get('/favicon.ico', function(req, res) {
  res.sendfile(__dirname + '/htdocs/images/favicon.ico');
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
  
