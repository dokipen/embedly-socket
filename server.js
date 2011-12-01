var opts = require('optimist')
           .usage('Web Socket proxy for the Embedly API')
           .options({
             'help': {
               'describe': 'Display this message',
               'alias': 'h'
             }
           });

var argv = opts.argv;

if (argv.help) {
  opts.showHelp(console.log);
  process.exit(0);
}