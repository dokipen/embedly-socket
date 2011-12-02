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
             },
             'key': {
               'describe': 'Embedly key',
               'alias': 'k',
               'default': process.env.EMBEDLY_KEY
             },
             'email': {
               'describe': 'Contact email address for User-Agent string.',
               'default': process.env.WEBMASTER_EMAIL
             },
             'timeout': {
               'describe': 'Timeout in ms on requests.',
               'default': process.env.EMBEDLY_TIMEOUT || 10000
             }
           });

var argv = opts.argv;

if (argv.help) {
  opts.showHelp(console.log);
  process.exit(0);
} else if (!argv.email) {
  console.error('Please specify your contact address via --email or the WEBMASTER_EMAIL env variable.')
  opts.showHelp(console.error);
  process.exit(1);
}

var express = require('express');
var app = express.createServer(express.logger());
var io = require('socket.io').listen(app);
var EmbedlyApi = require('embedly').Api
var embedly = new EmbedlyApi({
  user_agent: 'embedly-socket/0.0.0 (+'+argv.email+')',
  key: argv.key
})

app.listen(argv.port);

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/htdocs/index.html');
});
app.get('/favicon.ico', function(req, res) {
  res.sendfile(__dirname + '/htdocs/images/favicon.ico');
});

io.sockets.on('connection', function (socket) {
  'oembed preview objectify'.split(' ').forEach(function create_endpoint(endpoint) {
    socket.on(endpoint, function (data) {
      var call = embedly[endpoint](data)
      console.log(call)
      call.on('timeout', function timeout() {
          socket.emit('timeout', [endpoint, data])
        })
        .on('complete', function(objs) {
          socket.emit('response', [endpoint, data, objs])
        })
        .on('error', function(e) {
          socket.emit('error', [endpoint, data, e])
        })
        .start();
    });
  });
  console.log("** yo ho ho with connections")
});

