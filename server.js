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

var io = require('socket.io').listen(argv.port);

io.socket.on('connection', function(socket) {
  socket.emit('news', {hello: 'world'});
  socket.on('my other event', function(data) {
    console.log(data);
  });
});
  