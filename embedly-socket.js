#!/usr/bin/env node

var VERSION='0.0.3'

var Hash = require('hashish');
var EmbedlyApi = require('embedly').Api;
var socketio = require('socket.io');

function socket(opts) {
  // opts.key, opts.email, opts.timeout, opts.server
  if (!(opts.key && opts.email && opts.server)) {
    throw 'key, email and server options must be set';
  }

  var embedly = new EmbedlyApi({
    key: opts.key,
    useragent: 'embedly-socket/'+VERSION+' (+'+opts.email+')',
    timeout: opts.timeout
  });

  socketio.listen(opts.server).sockets.on(
    'connection', function (socket) {
      'oembed preview objectify'.split(' ').forEach(
        function create_endpoint(endpoint) {
          socket.on(endpoint, function (data) {
            embedly[endpoint](data)
              .on('timeout', function timeout() {
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
        }
      )
    }
  );
}

exports.socket = socket;
exports.version = VERSION;
